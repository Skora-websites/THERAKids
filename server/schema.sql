CREATE DATABASE IF NOT EXISTS thera_kids;
USE thera_kids;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  specialisation VARCHAR(255),
  profile_image VARCHAR(255),
  short_bio TEXT,
  full_bio TEXT,
  qualifications TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  hero_title VARCHAR(255),
  short_description TEXT,
  full_description TEXT,
  image VARCHAR(255),
  icon_svg TEXT,
  benefits JSON,
  page_sections JSON,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  -- Per-service SEO, edited in the Services panel (not the SEO tab)
  meta_title VARCHAR(255) NULL DEFAULT NULL,
  meta_keywords VARCHAR(500) NULL DEFAULT NULL,
  meta_description TEXT,
  canonical_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  category VARCHAR(255),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  featured_image VARCHAR(255),
  author VARCHAR(255),
  category VARCHAR(255),
  seo_title VARCHAR(255),
  meta_title VARCHAR(255) NULL DEFAULT NULL,
  meta_keywords VARCHAR(500) NULL DEFAULT NULL,
  meta_description TEXT,
  canonical_url VARCHAR(255),
  status ENUM('draft', 'published') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Per-route SEO for every public page that has no resource of its own: the
-- admin "SEO" tab. Blog posts and services carry their own meta columns.
CREATE TABLE IF NOT EXISTS page_seo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_key VARCHAR(150) UNIQUE NOT NULL, -- public route path, e.g. '/about'
  label VARCHAR(150),                    -- friendly name in the admin list
  meta_title VARCHAR(255) NULL DEFAULT NULL,
  meta_keywords VARCHAR(500) NULL DEFAULT NULL,
  meta_description TEXT,
  canonical_url VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL, -- 'home' or a service slug
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_faqs_page (page_key)
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  testimonial TEXT NOT NULL,
  image VARCHAR(255),
  designation VARCHAR(255),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_name VARCHAR(255) NOT NULL,
  child_name VARCHAR(255) NOT NULL,
  child_age VARCHAR(50) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  service_id INT,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(100) NOT NULL,
  additional_info TEXT,
  status ENUM('New', 'Contacted', 'Completed', 'Cancelled') DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Seed initial admin (password: admin123)
-- Hash generated from bcrypt.hashSync('admin123', 10)
INSERT IGNORE INTO admins (username, password_hash) VALUES ('admin', '$2b$10$KzDv2GDsDgnkliJdercDNOTrWviU4tOrHnAjxdmi16vTIYXQMMPE2');

-- Seed settings
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES 
('phone', '+91 98993 38813 / +91 93135 13313'),
('email', 'therakids.dc@gmail.com'),
('address1', 'G-10, Block G, Sector 22, Noida - 201301'),
('address2', '173, Itehara, Near NX-One Society, Gr. Noida West - 201306'),
('hours_week', 'Mon-Fri: 8:00 AM - 6:00 PM'),
('hours_sat', 'Saturday: 9:00 AM - 2:00 PM'),
('hours_sun', 'Sunday: Closed'),
('whatsapp', '7384448624');
