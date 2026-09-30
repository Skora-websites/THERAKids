// One-off, idempotent settings update: switches the official email to
// info@therakidsnoida.com (client request). Run once after deploying:
//
//   node scripts/update-contact-email.js
//
// Only the 'email' key is touched - admins can still edit everything else in
// the dashboard's Site Settings tab.
require('dotenv').config();
const mysql = require('mysql2/promise');

const NEW_EMAIL = 'info@therakids.com';

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'thera_kids',
    waitForConnections: true,
    connectionLimit: 5
  });

  try {
    const [existing] = await pool.query(
      'SELECT setting_value FROM site_settings WHERE setting_key = ?',
      ['email']
    );
    const current = existing.length ? existing[0].setting_value : '(not set)';
    if (current === NEW_EMAIL) {
      console.log(`email is already ${NEW_EMAIL} - nothing to do`);
      return;
    }
    console.log(`email: ${current} -> ${NEW_EMAIL}`);
    await pool.query(
      'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ' +
        'ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
      ['email', NEW_EMAIL]
    );
    console.log('done - the footer/contact pages pick it up on next load');
  } finally {
    await pool.end();
  }
})().catch((err) => {
  console.error('migration failed:', err.message);
  process.exit(1);
});
