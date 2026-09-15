require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5005; // 5000 is reserved by Windows on some machines
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false })); // allow images to load
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image uploads (admin only)
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'thera_kids',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==========================================
// PUBLIC API ROUTES
// ==========================================

app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    const settings = rows.reduce((acc, curr) => {
      acc[curr.setting_key] = curr.setting_value;
      return acc;
    }, {});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM doctors WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE status = "published" ORDER BY published_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ? AND status = "published"', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ message: 'Blog not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { parent_name, child_name, child_age, phone, email, service_id, preferred_date, preferred_time, additional_info } = req.body;
  try {
    await pool.query(
      'INSERT INTO appointments (parent_name, child_name, child_age, phone, email, service_id, preferred_date, preferred_time, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [parent_name, child_name, child_age, phone, email, service_id || null, preferred_date, preferred_time, additional_info]
    );
    res.status(201).json({ message: 'Appointment created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ADMIN API ROUTES
// ==========================================

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// A sample protected route
app.get('/api/admin/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

// ==========================================
// ADMIN CRUD API (token-protected)
// ==========================================

// Whitelisted editable columns per resource (guards against SQL injection
// of column names; values are always parameterized)
const RESOURCES = {
  doctors: {
    table: 'doctors',
    fields: ['name', 'designation', 'specialisation', 'profile_image', 'short_bio', 'full_bio', 'qualifications', 'display_order', 'is_active'],
    orderBy: 'display_order ASC, id ASC'
  },
  services: {
    table: 'services',
    fields: ['name', 'slug', 'short_description', 'full_description', 'image', 'benefits', 'display_order', 'is_active'],
    orderBy: 'display_order ASC, id ASC'
  },
  gallery: {
    table: 'gallery',
    fields: ['image_path', 'caption', 'category', 'display_order', 'is_active'],
    orderBy: 'display_order ASC, id ASC'
  },
  blogs: {
    table: 'blogs',
    fields: ['title', 'slug', 'excerpt', 'content', 'featured_image', 'author', 'category', 'seo_title', 'meta_description', 'canonical_url', 'status', 'published_at'],
    orderBy: 'published_at DESC, id DESC'
  },
  testimonials: {
    table: 'testimonials',
    fields: ['name', 'testimonial', 'image', 'designation', 'display_order', 'is_active'],
    orderBy: 'display_order ASC, id ASC'
  },
  appointments: {
    table: 'appointments',
    fields: ['status'], // created via public form; admin can only update status / delete
    orderBy: 'created_at DESC',
    noCreate: true
  }
};

// Stats for dashboard overview
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM doctors) AS doctors,
        (SELECT COUNT(*) FROM services) AS services,
        (SELECT COUNT(*) FROM blogs WHERE status = 'published') AS blogs,
        (SELECT COUNT(*) FROM appointments) AS appointments,
        (SELECT COUNT(*) FROM appointments WHERE status = 'New') AS newAppointments
    `);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings: read as {key: value} map
app.get('/api/admin/settings', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    res.json(rows.reduce((acc, r) => ({ ...acc, [r.setting_key]: r.setting_value }), {}));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings: upsert one or more {key: value}
app.put('/api/admin/settings', authenticateToken, async (req, res) => {
  try {
    const entries = Object.entries(req.body || {});
    if (entries.length === 0) return res.status(400).json({ error: 'No settings provided' });
    for (const [key, value] of entries) {
      await pool.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
        [String(key), value == null ? '' : String(value)]
      );
    }
    res.json({ message: 'Settings saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload an image -> { url: "/uploads/<file>" }
app.post('/api/admin/upload', authenticateToken, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file provided (field name: "image")' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

// Change admin password
app.put('/api/admin/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }
  try {
    const [rows] = await pool.query('SELECT password_hash FROM admins WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Admin not found' });
    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Current password is incorrect' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Columns that may hold /uploads/ paths, per resource
const IMAGE_FIELDS = {
  doctors: ['profile_image'],
  services: ['image'],
  gallery: ['image_path'],
  blogs: ['featured_image'],
  testimonials: ['image']
};

// Strictly-shaped upload paths only (no traversal, no external URLs)
const UPLOAD_PATH_RE = /^\/uploads\/[A-Za-z0-9._-]+$/;

// Collect /uploads/ paths stored in a row's image columns
const collectUploadPaths = (resource, row) => {
  const fields = IMAGE_FIELDS[resource] || [];
  return (fields.map(f => row ? row[f] : null))
    .filter(v => typeof v === 'string' && UPLOAD_PATH_RE.test(v));
};

// Count rows across all image columns that reference the given path
const countUploadReferences = async (filePath) => {
  let total = 0;
  for (const [resource, fields] of Object.entries(IMAGE_FIELDS)) {
    const table = RESOURCES[resource].table;
    for (const col of fields) {
      const [rows] = await pool.query(`SELECT COUNT(*) AS c FROM ${table} WHERE ${col} = ?`, [filePath]);
      total += rows[0].c;
    }
  }
  return total;
};

// Remove upload files that no database row references anymore.
// Never throws: cleanup failures must not break the API response.
const cleanupUploads = async (paths) => {
  for (const p of paths) {
    try {
      if (!UPLOAD_PATH_RE.test(p)) continue;
      const filename = path.basename(p);
      const absolute = path.join(uploadsDir, filename);
      if (!fs.existsSync(absolute)) continue;
      const refs = await countUploadReferences(`/uploads/${filename}`);
      if (refs === 0) {
        fs.unlinkSync(absolute);
        console.log(`Removed orphaned upload: ${filename}`);
      }
    } catch (err) {
      console.error('Upload cleanup failed for', p, '-', err.message);
    }
  }
};

// List (includes inactive/draft records, unlike the public endpoints)
app.get('/api/admin/:resource', authenticateToken, async (req, res) => {
  const cfg = RESOURCES[req.params.resource];
  if (!cfg) return res.status(404).json({ error: 'Unknown resource' });
  try {
    const [rows] = await pool.query(`SELECT * FROM ${cfg.table} ORDER BY ${cfg.orderBy}`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create
app.post('/api/admin/:resource', authenticateToken, async (req, res) => {
  const cfg = RESOURCES[req.params.resource];
  if (!cfg) return res.status(404).json({ error: 'Unknown resource' });
  if (cfg.noCreate) return res.status(405).json({ error: 'Create not allowed for this resource' });
  const cols = cfg.fields.filter(f => req.body[f] !== undefined);
  if (cols.length === 0) return res.status(400).json({ error: 'No valid fields provided' });
  try {
    const [result] = await pool.query(
      `INSERT INTO ${cfg.table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
      cols.map(c => req.body[c])
    );
    res.status(201).json({ id: result.insertId, message: 'Created' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update
app.put('/api/admin/:resource/:id', authenticateToken, async (req, res) => {
  const cfg = RESOURCES[req.params.resource];
  if (!cfg) return res.status(404).json({ error: 'Unknown resource' });
  const cols = cfg.fields.filter(f => req.body[f] !== undefined);
  if (cols.length === 0) return res.status(400).json({ error: 'No valid fields provided' });
  try {
    const [oldRows] = await pool.query(`SELECT * FROM ${cfg.table} WHERE id = ?`, [req.params.id]);
    await pool.query(
      `UPDATE ${cfg.table} SET ${cols.map(c => `${c} = ?`).join(', ')} WHERE id = ?`,
      [...cols.map(c => req.body[c]), req.params.id]
    );
    // If an image field was replaced, its old file may now be orphaned
    const replacedPaths = (IMAGE_FIELDS[req.params.resource] || [])
      .filter(col => cols.includes(col) && oldRows[0] && typeof oldRows[0][col] === 'string' && UPLOAD_PATH_RE.test(oldRows[0][col]) && oldRows[0][col] !== req.body[col])
      .map(col => oldRows[0][col]);
    await cleanupUploads(replacedPaths);
    res.json({ message: 'Updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete
app.delete('/api/admin/:resource/:id', authenticateToken, async (req, res) => {
  const cfg = RESOURCES[req.params.resource];
  if (!cfg) return res.status(404).json({ error: 'Unknown resource' });
  try {
    const [rows] = await pool.query(`SELECT * FROM ${cfg.table} WHERE id = ?`, [req.params.id]);
    await pool.query(`DELETE FROM ${cfg.table} WHERE id = ?`, [req.params.id]);
    // Uploaded files referenced only by the deleted row are now orphans
    await cleanupUploads(collectUploadPaths(req.params.resource, rows[0]));
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
