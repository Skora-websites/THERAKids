// Idempotent: per-route SEO for the pages that don't own a resource. Safe to re-run.
//   node scripts/migrate-seo.js
//
// 1. services gains meta_title / meta_keywords / meta_description / canonical_url
//    so every service page carries its own tags (edited in the Services panel).
//    blogs already have theirs — see migrate-blog-seo.js.
// 2. Creates page_seo, one row per remaining public route (the admin "SEO" tab).
// 3. Seeds those rows with INSERT IGNORE, so an admin's saved meta is never
//    overwritten by a later run.
//
// Additive only: no column is dropped, renamed or altered.
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

const CREATE_PAGE_SEO = `
  CREATE TABLE IF NOT EXISTS page_seo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(150) UNIQUE NOT NULL,
    label VARCHAR(150),
    meta_title VARCHAR(255) NULL DEFAULT NULL,
    meta_keywords VARCHAR(500) NULL DEFAULT NULL,
    meta_description TEXT,
    canonical_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;

// name, definition (appended at the end of the services table)
const SERVICE_COLUMNS = [
  ['meta_title', 'VARCHAR(255) NULL DEFAULT NULL AFTER is_active'],
  ['meta_keywords', 'VARCHAR(500) NULL DEFAULT NULL AFTER meta_title'],
  ['meta_description', 'TEXT AFTER meta_keywords'],
  ['canonical_url', 'VARCHAR(255) AFTER meta_description']
];

// Public routes with no resource of their own. `/blogs/:slug` and `/services/:slug`
// are deliberately absent: their SEO is edited in the Blogs / Services panels.
const PAGES = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/services', 'Services listing'],
  ['/conditions', 'Conditions'],
  ['/gallery', 'Gallery'],
  ['/blogs', 'Blogs listing'],
  ['/contact', 'Contact']
];

const columnExists = async (table, column) => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
    [table, column]
  );
  return rows[0].c > 0;
};

const run = async () => {
  console.log('services:');
  for (const [name, definition] of SERVICE_COLUMNS) {
    if (await columnExists('services', name)) {
      console.log(`  = ${name} already exists`);
      continue;
    }
    await pool.query(`ALTER TABLE services ADD COLUMN \`${name}\` ${definition}`);
    console.log(`  + ${name} added`);
  }

  await pool.query(CREATE_PAGE_SEO);
  console.log('\npage_seo table ready');

  console.log('page rows:');
  for (const [pageKey, label] of PAGES) {
    const [result] = await pool.query('INSERT IGNORE INTO page_seo (page_key, label) VALUES (?, ?)', [
      pageKey,
      label
    ]);
    console.log(result.affectedRows ? `  + ${pageKey}` : `  = ${pageKey} already present`);
  }

  console.log('\nSEO migration complete.');
  await pool.end();
};

run().catch(async (err) => {
  console.error('Migration failed:', err.message);
  try { await pool.end(); } catch { /* ignore */ }
  process.exit(1);
});
