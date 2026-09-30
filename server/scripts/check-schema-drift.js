// Schema drift checker: parses server/schema.sql CREATE TABLE blocks and compares
// against the live database. Reports (and with --fix, adds) any column that
// exists in schema.sql but not in the DB. Run from the server dir:
//   node scripts/check-schema-drift.js          (report only)
//   node scripts/check-schema-drift.js --fix    (add missing columns)
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');

// Extract the type fragment for a column line so we can ALTER TABLE ADD COLUMN
const typeOf = (line) => {
  const t = line.trim().replace(/^`?[a-z_]+`?\s+/i, '').replace(/,.*/, '').trim();
  return t;
};

const expected = {};
for (const m of schemaSql.matchAll(/CREATE TABLE IF NOT EXISTS (\w+) \(([\s\S]*?)\n\);/g)) {
  const table = m[1];
  const cols = {};
  for (const rawLine of m[2].split('\n')) {
    const line = rawLine.trim();
    const cm = line.match(/^`?([a-z_]+)`?\s+(VARCHAR|TEXT|INT|TINYINT\(1\)|TINYINT|BOOLEAN|ENUM\([^)]*\)|DATE|TIMESTAMP|JSON|LONGTEXT|FLOAT|DOUBLE)/i);
    if (!cm) continue;
    cols[cm[1]] = typeOf(line);
  }
  if (Object.keys(cols).length) expected[table] = cols;
}

const run = async () => {
  const fix = process.argv.includes('--fix');
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'thera_kids',
    waitForConnections: true,
    connectionLimit: 3
  });

  const [tables] = await pool.query('SHOW TABLES');
  const missing = [];
  for (const t of tables) {
    const name = Object.values(t)[0];
    if (!expected[name]) continue;
    const [cols] = await pool.query(`SHOW COLUMNS FROM \`${name}\``);
    const actual = new Set(cols.map((c) => c.Field));
    for (const [col, def] of Object.entries(expected[name])) {
      if (!actual.has(col)) missing.push({ table: name, col, def });
    }
  }

  if (!missing.length) {
    console.log('Schema OK - no missing columns.');
  } else {
    console.log(`Missing ${missing.length} column(s):`);
    for (const { table, col, def } of missing) {
      console.log(`  ${table}.${col}  (${def})`);
      if (fix) {
        // NULLable text defaults so existing rows stay untouched
        const alterDef = /^(TEXT|JSON|LONGTEXT)/i.test(def) ? def : def;
        await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${alterDef} NULL`);
        console.log(`    -> added`);
      }
    }
    if (!fix) console.log('\nRun with --fix to add them.');
  }
  await pool.end();
};

run().catch((err) => {
  console.error('Drift check failed:', err.message);
  process.exit(1);
});
