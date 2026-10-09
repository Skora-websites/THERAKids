/* One-shot: seeds the `centers` setting (JSON array of
 * { name, address, map_url }) from the current official two centres, so the
 * dynamic centres editor in Site Settings starts prefilled. INSERT IGNORE —
 * never overwrites an existing value (admin edits win).
 *
 * Run: node server/scripts/seed-centers.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

const CENTERS = [
  {
    name: 'Noida',
    address: 'G-10, Block G, Sector 22, Noida - 201301',
    map_url:
      'https://www.google.com/maps/search/?api=1&query=THERAKids%20Foundation%2C%20G-10%2C%20Block%20G%2C%20Sector%2022%2C%20Noida%2C%20Uttar%20Pradesh%20201301',
  },
  {
    name: 'Gr. Noida West',
    address: '173, Itehara, Near NX-One Society, Greater Noida West - 201306',
    map_url:
      'https://www.google.com/maps/search/?api=1&query=THERAKids%20Foundation%2C%20173%20Itehara%2C%20Near%20NX-One%20Society%2C%20Greater%20Noida%20West%2C%20Uttar%20Pradesh%20201306',
  },
];

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'thera_kids',
  });

  const [result] = await pool.query(
    'INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)',
    ['centers', JSON.stringify(CENTERS)]
  );

  if (result.affectedRows > 0) {
    console.log('Seeded `centers` setting with', CENTERS.length, 'centres.');
  } else {
    console.log('`centers` setting already exists — left untouched.');
  }
  await pool.end();
})().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
