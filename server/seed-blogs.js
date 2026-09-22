// Upserts all blog posts from blog-data.js (single source of truth) into the live database.
// Idempotent: ON DUPLICATE KEY UPDATE by slug, safe to run repeatedly.
// Fresh installs get the same posts via seed.sql (regenerate with: node scripts/sync-seed-blogs.js)
require('dotenv').config();
const mysql = require('mysql2/promise');
const { BLOGS } = require('./blog-data');

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'thera_kids',
    waitForConnections: true,
    connectionLimit: 5
  });

  try {
    let inserted = 0;
    for (const b of BLOGS) {
      const seoTitle = `${b.title} | TheraKids`;
      const [result] = await pool.query(
        `INSERT INTO blogs (title, slug, excerpt, content, featured_image, author, category, seo_title, meta_description, status, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           excerpt = VALUES(excerpt),
           content = VALUES(content),
           featured_image = VALUES(featured_image),
           author = VALUES(author),
           category = VALUES(category),
           seo_title = VALUES(seo_title),
           meta_description = VALUES(meta_description),
           status = 'published',
           published_at = VALUES(published_at)`,
        [b.title, b.slug, b.excerpt, b.content.trim(), b.featured_image, b.author, b.category, seoTitle, b.excerpt, b.published_at]
      );
      inserted += result.affectedRows;
      console.log(`${result.affectedRows === 1 ? 'inserted' : 'updated'}: ${b.slug}`);
    }
    const [rows] = await pool.query("SELECT COUNT(*) AS n FROM blogs WHERE status='published'");
    console.log(`\nDone. ${inserted} row(s) affected. Total published blogs: ${rows[0].n}`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
