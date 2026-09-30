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

-- Messages from the public Contact page form (separate from appointment
-- requests; admins triage them via the "Messages" panel).
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('New', 'In Progress', 'Resolved') DEFAULT 'New',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dynamic "Academics" content for the Programs page. Modules carry their
-- own resources (videos embed in-page, PDFs/images render in a viewer modal,
-- external links open from the viewer). Benefits and the YouTube video
-- groups are separate flat lists, ordered by display_order.
CREATE TABLE IF NOT EXISTS program_modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration VARCHAR(100),
  topics JSON, -- JSON array of strings, e.g. ["Topic A","Topic B"]
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS program_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  resource_type ENUM('video', 'document', 'link', 'worksheet') DEFAULT 'link',
  url VARCHAR(500),
  description VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_program_resources_module (module_id)
);

CREATE TABLE IF NOT EXISTS program_benefits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  benefit VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS program_videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(150) NOT NULL, -- e.g. "Live Sessions & Webinars"
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  length_label VARCHAR(50),
  views_label VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Seed: the certification curriculum as launched (edit in the admin panel).
INSERT IGNORE INTO program_modules (id, title, duration, topics, display_order) VALUES
(1, 'Foundations of Child Development', '4 weeks', '["Typical vs Atypical Development","Developmental Milestones","Assessment Principles"]', 1),
(2, 'Therapeutic Approaches', '6 weeks', '["OT Basics","Speech Therapy Fundamentals","Behavioral Interventions"]', 2),
(3, 'Assessment & Documentation', '4 weeks', '["Standardized Assessments","Progress Monitoring","Report Writing"]', 3),
(4, 'Family-Centered Practice', '3 weeks', '["Parent Counseling","Home Programs","Cultural Sensitivity"]', 4),
(5, 'Hands-on Practicum', '8 weeks', '["Supervised Clinical Experience","Case Studies","Professional Ethics"]', 5);

INSERT IGNORE INTO program_resources (id, module_id, title, resource_type, url, description, display_order) VALUES
(1, 1, 'Milestone Charts Library', 'document', NULL, 'Printable milestone reference charts', 1),
(2, 1, 'Observation Checklists', 'worksheet', NULL, 'Structured observation worksheets', 2),
(3, 1, 'Case Walkthrough: Reading Development Red Flags', 'video', NULL, 'Recorded case discussion', 3),
(4, 2, 'Intro to Sensory Integration', 'video', NULL, 'Recorded introductory session', 1),
(5, 2, 'Speech Stimulation Activities Handbook', 'document', NULL, 'Activity handbook for home practice', 2),
(6, 2, 'Behavior Intervention Plan Templates', 'worksheet', NULL, 'Editable BIP templates', 3),
(7, 3, 'Assessment Tools Library', 'link', NULL, 'Curated assessment tool references', 1),
(8, 3, 'Progress Tracking Sheets', 'worksheet', NULL, 'Weekly progress tracking formats', 2),
(9, 3, 'Sample Reports & Scoring Rubrics', 'document', NULL, 'Annotated sample reports', 3),
(10, 4, 'Parent Counseling Scripts', 'worksheet', NULL, 'Session conversation guides', 1),
(11, 4, 'Home Program Builder', 'worksheet', NULL, 'Template for weekly home programs', 2),
(12, 4, 'Case Walkthrough: Building Trust with Families', 'video', NULL, 'Recorded case discussion', 3),
(13, 5, 'Practicum Handbook', 'document', NULL, 'Practicum rules, expectations and log sheets', 1),
(14, 5, 'Case Study Archive', 'document', NULL, 'De-identified case write-ups', 2),
(15, 5, 'Ethics & Consent Checklist', 'worksheet', NULL, 'Pre-session compliance checklist', 3);

INSERT IGNORE INTO program_benefits (id, benefit, display_order) VALUES
(1, 'Industry-recognized certification', 1),
(2, 'Hands-on experience with real cases', 2),
(3, 'Mentorship from experienced therapists', 3),
(4, 'Job placement assistance', 4),
(5, 'Continuing education credits', 5),
(6, 'Access to professional network', 6);

INSERT IGNORE INTO program_videos (id, group_name, title, url, length_label, views_label, display_order) VALUES
(1, 'Live Sessions & Webinars', 'Understanding Autism Spectrum Disorders', NULL, '45 min', '2.3K views', 1),
(2, 'Live Sessions & Webinars', 'Sensory Integration in Daily Life', NULL, '38 min', '1.8K views', 2),
(3, 'Live Sessions & Webinars', 'Parent Q&A: Speech Development', NULL, '52 min', '3.1K views', 3),
(4, 'Therapy Demonstration Videos', 'Occupational Therapy Session Demo', NULL, '25 min', '4.2K views', 1),
(5, 'Therapy Demonstration Videos', 'Speech Therapy Activities at Home', NULL, '18 min', '5.6K views', 2),
(6, 'Therapy Demonstration Videos', 'ABA Techniques for Beginners', NULL, '32 min', '2.9K views', 3),
(7, 'Awareness Campaigns', 'World Autism Awareness Day 2024', NULL, '15 min', '8.7K views', 1),
(8, 'Awareness Campaigns', 'Breaking Myths About Special Needs', NULL, '22 min', '6.4K views', 2),
(9, 'Expert Talks with Dr. Akanksha Rana', 'Early Intervention: Why It Matters', NULL, '28 min', '3.8K views', 1),
(10, 'Expert Talks with Dr. Akanksha Rana', 'Sensory Processing Explained', NULL, '35 min', '4.1K views', 2);

-- Applications submitted from the public Programs page (job openings,
-- internships, certification); admins triage them via the
-- "Job Applications" panel.
CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  position VARCHAR(255) NOT NULL,
  experience VARCHAR(255),
  cover_note TEXT,
  resume_path VARCHAR(255),
  status ENUM('New', 'Contacted', 'Rejected', 'Hired') DEFAULT 'New',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
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
  page_key VARCHAR(100) NOT NULL DEFAULT 'home', -- home page only (kept for future needs)
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

-- Home page "Our Process" steps (admin "Process Steps" panel)
CREATE TABLE IF NOT EXISTS process_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  step VARCHAR(10),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  tone ENUM('peach', 'lilac') DEFAULT 'peach',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- "Conditions We Treat" page (admin "Conditions" panel)
CREATE TABLE IF NOT EXISTS conditions_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(100),
  description TEXT,
  focus_areas JSON,
  image VARCHAR(255),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Founder / co-founder bios (About page + Home founders grid)
CREATE TABLE IF NOT EXISTS founders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  title_line VARCHAR(255),
  subtitle_line VARCHAR(255),
  profile_image VARCHAR(255),
  paragraphs JSON,
  closing_line TEXT,
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
('phone', '+91 93135 13313 / +91 98993 38813'),
('email', 'info@therakids.com'),
('address1', 'G-10, Block G, Sector 22, Noida - 201301'),
('address2', '173, Itehara, Near NX-One Society, Gr. Noida West - 201306'),
('hours_week', 'Mon-Fri: 8:00 AM - 6:00 PM'),
('hours_sat', 'Saturday: 9:00 AM - 2:00 PM'),
('hours_sun', 'Sunday: Closed'),
('whatsapp', '919899338813'),
-- Home page hero-video section (admin "Site Settings")
('home_video_url', '/videos/hero-video.mp4'),
('home_video_title', 'Step Inside THERAKids'),
('home_video_description', 'A two-minute look at our centers, our therapists, and the joyful progress children make here every day.');
