// Regenerates the BLOGS section of seed.sql from blog-data.js (single source of truth),
// so a fresh database install (schema.sql + seed.sql) gets all 7 published posts.
//
// Usage:  node scripts/sync-seed-blogs.js
//
// The generated block is wrapped in AUTO-GENERATED markers. On first run it converts the
// old hand-written 2-post section (found between the "-- BLOGS" and "-- TESTIMONIALS"
// headers) into the marker-wrapped block; later runs just replace between the markers.

const fs = require('fs');
const path = require('path');
const { BLOGS } = require('../blog-data');

const SEED_PATH = path.join(__dirname, '..', 'seed.sql');
const START = '-- >>> BLOGS:AUTO-GENERATED (from blog-data.js), do not edit by hand >>>';
const END = '-- <<< BLOGS:AUTO-GENERATED <<<';

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "''");

function buildSection() {
  const slugs = BLOGS.map((b) => `  '${esc(b.slug)}'`).join(',\n');
  const rows = BLOGS.map((b) => {
    const seoTitle = `${b.title} | TheraKids`;
    return `(${[
      `'${esc(b.title)}'`,
      `'${esc(b.slug)}'`,
      `'${esc(b.excerpt)}'`,
      `'${esc(b.content.trim())}'`,
      `'${esc(b.featured_image)}'`,
      `'${esc(b.author)}'`,
      `'${esc(b.category)}'`,
      `'${esc(seoTitle)}'`,
      // Legacy posts carry no SEO meta (meta_description stays NULL) — the public
      // page falls back to a 160-char content excerpt (spec: legacy post scenario).
      `'published'`,
      `'${esc(b.published_at)}'`
    ].join(',\n ')})`;
  }).join(',\n\n');

  return `${START}
DELETE FROM blogs WHERE slug IN (
${slugs});

INSERT INTO blogs (title, slug, excerpt, content, featured_image, author, category, seo_title, status, published_at) VALUES
${rows};
${END}`;
}

const SECTION_HEADER_RE = /-- =+\n-- BLOGS[^\n]*\n-- =+\n/;
const NEXT_HEADER_RE = /-- =+\n-- TESTIMONIALS/;

function main() {
  let sql = fs.readFileSync(SEED_PATH, 'utf8');
  const section = buildSection();

  if (sql.includes(START) && sql.includes(END)) {
    // Fast path: markers already in place — swap the contents between them.
    const startIdx = sql.indexOf(START);
    const endIdx = sql.indexOf(END);
    if (endIdx < startIdx) throw new Error('Malformed markers in seed.sql');
    sql = sql.slice(0, startIdx) + section + sql.slice(endIdx + END.length);
    console.log('Replaced existing auto-generated BLOGS block.');
  } else {
    // First run: convert the old hand-written section into the marker-wrapped one.
    const headerMatch = sql.match(SECTION_HEADER_RE);
    const nextMatch = sql.match(NEXT_HEADER_RE);
    if (!headerMatch || !nextMatch) {
      throw new Error('Could not locate the BLOGS section boundaries in seed.sql');
    }
    const startIdx = headerMatch.index;
    const endIdx = nextMatch.index;
    const newHeader = '-- ==========================================\n-- BLOGS (7 published posts — auto-generated from blog-data.js)\n-- Regenerate with: node scripts/sync-seed-blogs.js\n-- ==========================================\n\n';
    sql = sql.slice(0, startIdx) + newHeader + section + '\n\n' + sql.slice(endIdx);
    console.log('Converted hand-written BLOGS section to auto-generated block.');
  }

  fs.writeFileSync(SEED_PATH, sql, 'utf8');
  console.log(`seed.sql now seeds ${BLOGS.length} blog posts:`);
  BLOGS.forEach((b) => console.log(`  - ${b.slug}`));
}

try {
  main();
} catch (err) {
  console.error('Sync failed:', err.message);
  process.exitCode = 1;
}
