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
  short_description TEXT,
  full_description TEXT,
  image VARCHAR(255),
  icon_svg TEXT,
  benefits JSON,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
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
  meta_description TEXT,
  canonical_url VARCHAR(255),
  status ENUM('draft', 'published') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
INSERT IGNORE INTO admins (username, password_hash) VALUES ('admin', '$2b$10$O01iVnUSI7q3L7C2K5aJueJ8.r131yTzGjLqCg1hQ1qHj9E.N1h.C');

-- Seed settings
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES 
('phone', '123-456-7890'),
('email', 'info@therakids.com'),
('address', '123 Therapy Lane, Wellness City'),
('whatsapp', '7384448624');
