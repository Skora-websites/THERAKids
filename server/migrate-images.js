// One-off migration: point services.image and gallery rows at the real
// downloaded photos in client/public/images/gallery/ instead of Unsplash URLs.
// Reads the same .env the server uses, so no credentials are duplicated here.
require('dotenv').config();
const mysql = require('mysql2/promise');

const SERVICE_IMAGES = {
  'occupational-therapy': '/images/gallery/d1copy.webp',
  'speech-therapy': '/images/gallery/d2copy.webp',
  'special-education': '/images/gallery/d8copy.webp',
  'aba-therapy': '/images/gallery/d3copy.webp',
  'social-group-training': '/images/gallery/d4copy.webp',
  'behaviour-modification': '/images/gallery/4copy.webp',
  'parents-child-counselling': '/images/gallery/3copy.webp',
  'pre-vocational-training': '/images/gallery/7copy.webp'
};

// Mirrors the Gallery.jsx fallback list (order = display order)
const GALLERY_ROWS = [
  ['d1copy.webp', 'Occupational Therapy Session', 'Therapy'],
  ['d2copy.webp', 'Speech Therapy', 'Therapy'],
  ['d3copy.webp', 'Group Activity', 'Activities'],
  ['d4copy.webp', 'Play & Learning', 'Activities'],
  ['d5copy.webp', 'Therapy Centre', 'Our Centre'],
  ['d6copy.webp', 'Physical Therapy', 'Therapy'],
  ['d7copy.webp', 'Creative Activities', 'Activities'],
  ['d8copy.webp', 'Centre Environment', 'Our Centre'],
  ['10.1copy.webp', 'Sensory Integration', 'Therapy'],
  ['1copy.webp', 'Child Development', 'Activities'],
  ['2copy.webp', 'Interactive Session', 'Activities'],
  ['9.1copy.webp', 'Motor Skills Training', 'Therapy'],
  ['11copy.webp', 'Our Facility', 'Our Centre'],
  ['8copy.webp', 'Learning Through Play', 'Activities'],
  ['3copy.webp', 'Counselling Session', 'Therapy'],
  ['4copy.webp', 'Social Skills Group', 'Activities'],
  ['5copy.webp', 'Therapy Room', 'Our Centre'],
  ['6copy.webp', 'Fun Learning', 'Activities'],
  ['7copy.webp', 'Individual Therapy', 'Therapy']
];

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
    // 1) Services: swap Unsplash images for local real photos
    let updatedServices = 0;
    for (const [slug, imagePath] of Object.entries(SERVICE_IMAGES)) {
      const [result] = await pool.query(
        'UPDATE services SET image = ? WHERE slug = ?',
        [imagePath, slug]
      );
      updatedServices += result.affectedRows;
    }
    console.log(`services.image updated: ${updatedServices} row(s)`);

    // Any service still pointing at Unsplash that we didn't map? Report it.
    const [staleServices] = await pool.query(
      "SELECT id, name, image FROM services WHERE image LIKE 'https://images.unsplash.com/%'"
    );
    if (staleServices.length) {
      console.log('NOTE — services still on Unsplash (no mapping):');
      staleServices.forEach((r) => console.log(`  #${r.id} ${r.name}: ${r.image}`));
    } else {
      console.log('No services left on Unsplash URLs.');
    }

    // 2) Gallery: replace remote/stock rows with the 19 real centre photos
    const [removed] = await pool.query(
      "DELETE FROM gallery WHERE image_path LIKE 'https://images.unsplash.com/%' OR image_path LIKE 'https://picsum.photos/%'"
    );
    console.log(`gallery rows removed (stock URLs): ${removed.affectedRows}`);

    const [existing] = await pool.query(
      "SELECT COUNT(*) AS n FROM gallery WHERE image_path LIKE '/images/gallery/%'"
    );
    if (existing[0].n === 0) {
      const values = GALLERY_ROWS.map(
        ([file, caption, category], i) => [`/images/gallery/${file}`, caption, category, i + 1, 1]
      );
      const [result] = await pool.query(
        'INSERT INTO gallery (image_path, caption, category, display_order, is_active) VALUES ?',
        [values]
      );
      console.log(`gallery rows inserted: ${result.affectedRows}`);
    } else {
      console.log(`gallery already has ${existing[0].n} local photo row(s) — skipping insert.`);
    }

    // Summary
    const [svc] = await pool.query("SELECT COUNT(*) AS n FROM services WHERE image LIKE '/images/%'");
    const [gal] = await pool.query("SELECT COUNT(*) AS n FROM gallery WHERE image_path LIKE '/images/gallery/%'");
    console.log(`\nDone. services on local images: ${svc[0].n}, gallery local rows: ${gal[0].n}`);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
