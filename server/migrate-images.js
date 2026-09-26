// One-off migration: point services.image and gallery rows at the real
// downloaded photos in client/public/images/ instead of Unsplash URLs.
// Gallery rows use the curated set in src/data/galleryImages.json (the 110-photo
// drop de-duplicated, captioned, and grouped into categories incl. both centres).
// Reads the same .env the server uses, so no credentials are duplicated here.
require('dotenv').config();
const mysql = require('mysql2/promise');
const curatedGallery = require('../client/src/data/galleryImages.json');

const SERVICE_IMAGES = {
  'occupational-therapy': '/images/services/occupational-therapy.jpg',
  'physiotherapy-paeds': '/images/services/physiotherapy-paeds.jpg',
  'special-education': '/images/services/special-education.jpg',
  'speech-therapy': '/images/services/speech-therapy.jpg',
  'social-group-training': '/images/services/social-group-training.jpg',
  'early-intervention': '/images/services/early-intervention.jpg',
  'psychological-assessment': '/images/services/psychological-assessment.jpg',
  'reviews': '/images/services/reviews.jpg',
  'counseling': '/images/services/counseling.jpg',
  'parent-training': '/images/services/parent-training.jpg',
  'behaviour-modification': '/images/services/behaviour-modification.jpg',
  'brain-gym-therapy': '/images/services/brain-gym-therapy.jpg'
};

// [file, caption, category] triples from the curated set, in display order
const GALLERY_ROWS = curatedGallery;

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

    // 2) Gallery: replace stock/old rows with the curated real centre photos.
    // Old rows are everything remote OR pointing at the replaced webp copies.
    const [removed] = await pool.query(
      "DELETE FROM gallery WHERE image_path LIKE 'https://%' OR image_path LIKE '/images/gallery/%copy.webp'"
    );
    console.log(`gallery rows removed (stock/old webp): ${removed.affectedRows}`);

    // Idempotent upsert by image_path: refresh captions/categories/order of the
    // curated rows, then add any that are missing. Admin-added rows survive.
    let updated = 0;
    for (const [i, [file, caption, category]] of GALLERY_ROWS.entries()) {
      const imagePath = `/images/gallery/therakids/${file}`;
      const [result] = await pool.query(
        'UPDATE gallery SET caption = ?, category = ?, display_order = ?, is_active = 1 WHERE image_path = ?',
        [caption, category, i + 1, imagePath]
      );
      updated += result.affectedRows;
    }
    const [known] = await pool.query('SELECT image_path FROM gallery');
    const knownPaths = new Set(known.map((r) => r.image_path));
    const toInsert = GALLERY_ROWS
      .map(([file, caption, category], i) => [`/images/gallery/therakids/${file}`, caption, category, i + 1, 1])
      .filter(([imagePath]) => !knownPaths.has(imagePath));
    if (toInsert.length) {
      const [result] = await pool.query(
        'INSERT INTO gallery (image_path, caption, category, display_order, is_active) VALUES ?',
        [toInsert]
      );
      console.log(`gallery rows inserted: ${result.affectedRows}`);
    }
    console.log(`gallery rows updated: ${updated}, inserted: ${toInsert.length}`);

    // 3) Blogs: point featured images at the local topic photos
    const BLOG_IMAGES = {
      'understanding-sensory-processing': '/images/blogs/sensory-processing.jpg',
      'speech-milestones-toddlers': '/images/blogs/speech-milestones.jpg'
    };
    let blogRows = 0;
    for (const [slug, imagePath] of Object.entries(BLOG_IMAGES)) {
      const [result] = await pool.query('UPDATE blogs SET featured_image = ? WHERE slug = ?', [imagePath, slug]);
      blogRows += result.affectedRows;
    }
    console.log(`blogs.featured_image updated: ${blogRows} row(s)`);

    // Summary
    const [svc] = await pool.query("SELECT COUNT(*) AS n FROM services WHERE image LIKE '/images/%'");
    const [gal] = await pool.query("SELECT COUNT(*) AS n FROM gallery WHERE image_path LIKE '/images/gallery/%'");
    const [rem] = await pool.query("SELECT COUNT(*) AS n FROM blogs WHERE featured_image LIKE 'http%' OR featured_image LIKE '/images/gallery/%copy.webp'");
    console.log(`\nDone. services on local images: ${svc[0].n}, gallery local rows: ${gal[0].n}, blogs on stock/remote images: ${rem[0].n}`);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
