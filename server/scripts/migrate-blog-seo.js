// Idempotent: adds the per-blog SEO columns. Safe to re-run.
//   node scripts/migrate-blog-seo.js
// blogs.meta_description already existed (TEXT) — verified below, never dropped.
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'thera_kids',
  waitForConnections: true,
  connectionLimit: 5
});

const COLUMNS = [
  // name, definition (appended after the existing seo_title column)
  ['meta_title', 'VARCHAR(255) NULL DEFAULT NULL AFTER seo_title'],
  ['meta_keywords', 'VARCHAR(500) NULL DEFAULT NULL AFTER meta_title'],
  // pre-existing column — the check below proves it exists
  ['meta_description', null]
];

const run = async () => {
  for (const [name, definition] of COLUMNS) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
      ['blogs', name]
    );
    if (rows[0].c > 0) {
      console.log(`  = ${name} already exists`);
      continue;
    }
    if (!definition) throw new Error(`Column ${name} is missing and has no definition`);
    await pool.query(`ALTER TABLE blogs ADD COLUMN \`${name}\` ${definition}`);
    console.log(`  + ${name} added`);
  }
  console.log('Blog SEO migration complete.');
  await pool.end();
};

run().catch(async (err) => {
  console.error('Migration failed:', err.message);
  try { await pool.end(); } catch { /* ignore */ }
  process.exit(1);
});
