-- Sample content for THERAKids
-- Safe to re-run: deletes and re-inserts only these seeded rows.

USE thera_kids;

-- ==========================================
-- SERVICES (8, matching the Services page)
-- ==========================================

DELETE FROM services WHERE slug IN
  ('occupational-therapy','speech-therapy','special-education','aba-therapy',
   'social-group-training','behaviour-modification','parents-child-counselling','pre-vocational-training');

INSERT INTO services (name, slug, short_description, full_description, image, benefits, display_order, is_active) VALUES
('Occupational Therapy', 'occupational-therapy',
 'Building fine motor, sensory, and daily-living skills for independence.',
 'Occupational therapy helps children develop the fine motor, sensory processing, and visual motor skills needed for everyday activities like dressing, writing, and playing.',
 '/images/gallery/d1copy.webp',
 '["Fine motor skill development","Sensory regulation strategies","Self-care independence (dressing, feeding)","Hand-eye coordination"]', 1, 1),

('Speech Therapy', 'speech-therapy',
 'Developing strong communication, articulation, and language skills.',
 'Our speech-language pathologists support children in developing strong communication skills, addressing articulation, receptive/expressive language, and social pragmatic skills.',
 '/images/gallery/d2copy.webp',
 '["Articulation and pronunciation","Receptive and expressive language","Social communication (pragmatics)","Stuttering and fluency support"]', 2, 1),

('Special Education', 'special-education',
 'Tailored educational support for literacy, numeracy, and school readiness.',
 'Tailored educational support for children facing learning challenges, focusing on literacy, numeracy, and overall academic readiness.',
 '/images/gallery/d8copy.webp',
 '["Individualized Education Plans","Literacy and numeracy support","Cognitive skill building","School readiness"]', 3, 1),

('ABA Therapy', 'aba-therapy',
 'Evidence-based behavioural therapy for skill acquisition and focus.',
 'Applied Behavior Analysis (ABA) therapy focuses on improving specific behaviors, such as social skills, communication, reading, and academics as well as adaptive learning skills.',
 '/images/gallery/d3copy.webp',
 '["Positive reinforcement","Skill acquisition","Reducing challenging behaviors","Improving attention and focus"]', 4, 1),

('Social Group Training', 'social-group-training',
 'Structured group sessions building peer interaction and play skills.',
 'Structured group sessions that help children prepare for academic and social settings, focusing on peer interaction and play skills.',
 '/images/gallery/d4copy.webp',
 '["Peer interaction","Turn-taking and sharing","Group participation","Building friendships"]', 5, 1),

('Behaviour Modification', 'behaviour-modification',
 'Supporting emotional regulation and positive coping strategies.',
 'We utilize evidence-based approaches to support children with emotional regulation, transitions, and developing positive coping mechanisms.',
 '/images/gallery/4copy.webp',
 '["Emotional regulation techniques","Managing transitions and routines","Reducing anxiety","Building positive social interactions"]', 6, 1),

('Parents and Child Counselling', 'parents-child-counselling',
 'Guidance and counselling for the whole family''s journey.',
 'Therapy is a collaborative journey. We provide dedicated counseling sessions for parents to navigate the challenges of raising a child with developmental needs.',
 '/images/gallery/3copy.webp',
 '["Parent education and support","Family dynamics guidance","Coping strategies for caregivers","Individualized Family Service Plans (IFSP)"]', 7, 1),

('Pre-Vocational Training', 'pre-vocational-training',
 'Practical life skills and independence for older children.',
 'Programs designed to help older children and adolescents develop practical life skills, independence, and readiness for future vocational opportunities.',
 '/images/gallery/7copy.webp',
 '["Life skills development","Task completion and organization","Time management","Independence building"]', 8, 1);

-- ==========================================
-- DOCTORS (4, matching the About page specialists)
-- ==========================================

DELETE FROM doctors WHERE name IN
  ('Dr. Priya Sharma','Dr. Rahul Verma','Dr. Neha Kapoor','Dr. Vikram Singh');

INSERT INTO doctors (name, designation, specialisation, profile_image, short_bio, qualifications, display_order, is_active) VALUES
('Dr. Priya Sharma', 'Lead Occupational Therapist', 'Pediatric Occupational Therapy',
 '/images/dr_priya.jpg',
 'Leads our occupational therapy team with over a decade of experience helping children master daily-living and sensory skills.',
 'BOT (Occupational Therapy), Certified in Sensory Integration (SI)', 1, 1),

('Dr. Rahul Verma', 'Speech Pathologist', 'Speech-Language Pathology',
 '/images/dr_rahul.jpg',
 'Specializes in articulation, receptive and expressive language, and social communication for children aged 0-18.',
 'MASLP (Speech-Language Pathology), Certified in Hanen Program', 2, 1),

('Dr. Neha Kapoor', 'Child Psychologist', 'Clinical Child Psychology',
 '/images/dr_neha.jpg',
 'Conducts developmental and psychological assessments and supports families through behavioural challenges.',
 'M.Phil Clinical Psychology, RCI Registered', 3, 1),

('Dr. Vikram Singh', 'Occupational Therapist', 'Neuro-Developmental Therapy',
 '/images/dr_vikram.jpg',
 'Focuses on motor development, postural control, and pre-vocational skill building for older children.',
 'BOT (Occupational Therapy), NDT Certified', 4, 1);

-- ==========================================
-- GALLERY (19 real centre photos, matching the Gallery page fallbacks)
-- ==========================================

DELETE FROM gallery WHERE image_path LIKE 'https://images.unsplash.com/%'
   OR image_path LIKE '/images/gallery/%';

INSERT INTO gallery (image_path, caption, category, display_order, is_active) VALUES
('/images/gallery/d1copy.webp', 'Occupational Therapy Session', 'Therapy', 1, 1),
('/images/gallery/d2copy.webp', 'Speech Therapy', 'Therapy', 2, 1),
('/images/gallery/d3copy.webp', 'Group Activity', 'Activities', 3, 1),
('/images/gallery/d4copy.webp', 'Play & Learning', 'Activities', 4, 1),
('/images/gallery/d5copy.webp', 'Therapy Centre', 'Our Centre', 5, 1),
('/images/gallery/d6copy.webp', 'Physical Therapy', 'Therapy', 6, 1),
('/images/gallery/d7copy.webp', 'Creative Activities', 'Activities', 7, 1),
('/images/gallery/d8copy.webp', 'Centre Environment', 'Our Centre', 8, 1),
('/images/gallery/10.1copy.webp', 'Sensory Integration', 'Therapy', 9, 1),
('/images/gallery/1copy.webp', 'Child Development', 'Activities', 10, 1),
('/images/gallery/2copy.webp', 'Interactive Session', 'Activities', 11, 1),
('/images/gallery/9.1copy.webp', 'Motor Skills Training', 'Therapy', 12, 1),
('/images/gallery/11copy.webp', 'Our Facility', 'Our Centre', 13, 1),
('/images/gallery/8copy.webp', 'Learning Through Play', 'Activities', 14, 1),
('/images/gallery/3copy.webp', 'Counselling Session', 'Therapy', 15, 1),
('/images/gallery/4copy.webp', 'Social Skills Group', 'Activities', 16, 1),
('/images/gallery/5copy.webp', 'Therapy Room', 'Our Centre', 17, 1),
('/images/gallery/6copy.webp', 'Fun Learning', 'Activities', 18, 1),
('/images/gallery/7copy.webp', 'Individual Therapy', 'Therapy', 19, 1);

-- ==========================================
-- BLOGS (7 published posts — auto-generated from blog-data.js)
-- Regenerate with: node scripts/sync-seed-blogs.js
-- ==========================================

-- >>> BLOGS:AUTO-GENERATED (from blog-data.js) — do not edit by hand >>>
DELETE FROM blogs WHERE slug IN (
  'understanding-sensory-processing',
  'speech-milestones-toddlers');

INSERT INTO blogs (title, slug, excerpt, content, featured_image, author, category, seo_title, meta_description, status, published_at) VALUES
('Understanding Sensory Processing Disorder',
 'understanding-sensory-processing',
 'Learn about the signs of SPD and how occupational therapy can provide strategies for self-regulation.',
 '<p>Some children experience the world through their senses more intensely than others. Sounds feel louder, textures feel harsher, and busy environments can quickly become overwhelming. When these reactions start to interfere with daily life — dressing, eating, playing, or learning — it may be a sign of Sensory Processing Disorder (SPD).</p>

<h3>Common signs to watch for</h3>
<ul>
<li>Covering ears at everyday noises or reacting strongly to touch</li>
<li>Avoiding certain foods because of texture or temperature</li>
<li>Constant movement — spinning, crashing, or fidgeting — or avoiding movement altogether</li>
<li>Meltdowns in busy places like supermarkets or playgrounds</li>
</ul>

<h3>How occupational therapy helps</h3>
<p>Our occupational therapists use play-based sensory integration to help children gradually build tolerance and regulation. Therapy looks like fun — swings, climbing, tactile games — but each activity is chosen to target specific sensory systems and teach the nervous system to respond more comfortably.</p>
<p>With consistent support, children learn strategies to self-regulate, and parents learn how to set up sensory-friendly routines at home. Early support makes a remarkable difference.</p>',
 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=1200&q=80',
 'Dr. Priya Sharma',
 'Occupational Therapy',
 'Understanding Sensory Processing Disorder | TheraKids',
 'Learn about the signs of SPD and how occupational therapy can provide strategies for self-regulation.',
 'published',
 '2026-08-10 09:00:00'),

('Speech Milestones for Toddlers',
 'speech-milestones-toddlers',
 'A quick guide for parents on what to expect as your toddler develops their communication skills.',
 '<p>Every child develops at their own pace, but language follows a fairly predictable path. Knowing the typical milestones helps you celebrate progress — and spot early when a little extra support could help.</p>

<h3>12 to 18 months</h3>
<p>First words appear, usually naming people and favourite objects. Your toddler understands simple requests like "come here" and points to show interest.</p>

<h3>18 to 24 months</h3>
<p>Vocabulary grows quickly — often 50 or more words — and two-word combinations begin: "more juice", "daddy go".</p>

<h3>2 to 3 years</h3>
<p>Sentences of three or more words, question words like "what" and "where", and speech that is mostly understood by familiar adults.</p>

<h3>When to seek an assessment</h3>
<ul>
<li>No words by 16 months</li>
<li>No two-word phrases by age 2</li>
<li>Loss of words or skills at any age</li>
<li>You simply feel something is different — trust your instincts</li>
</ul>

<p>Early intervention is the single biggest factor in speech outcomes. If you are unsure, a developmental screening takes less than an hour and gives you a clear picture of where your child stands.</p>',
 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
 'Dr. Rahul Verma',
 'Speech Therapy',
 'Speech Milestones for Toddlers | TheraKids',
 'A quick guide for parents on what to expect as your toddler develops their communication skills.',
 'published',
 '2026-08-22 09:00:00');
-- <<< BLOGS:AUTO-GENERATED <<<

-- ==========================================
-- TESTIMONIALS (4 parent stories)
-- ==========================================

DELETE FROM testimonials WHERE name IN
  ('Meera Gupta','Rajesh Kumar','Anjali & Rohan Mehta','Fatima Sheikh');

INSERT INTO testimonials (name, testimonial, designation, display_order, is_active) VALUES
('Meera Gupta',
 'When my son was diagnosed with autism at three, we felt lost. The team at THERAKids gave us a clear plan and, more importantly, hope. Eighteen months later he is speaking in sentences and thriving in a mainstream school.',
 'Parent, Noida', 1, 1),

('Rajesh Kumar',
 'The occupational therapists here are exceptional. My daughter went from being unable to hold a pencil to writing full pages. Every milestone was celebrated like a festival.',
 'Parent, Delhi', 2, 1),

('Anjali & Rohan Mehta',
 'We were initially worried about therapy feeling clinical. THERAKids is the opposite — our daughter runs to the door for her sessions. The parent counselling sessions helped us support her at home too.',
 'Parents, Greater Noida', 3, 1),

('Fatima Sheikh',
 'Dr. Rahul transformed my son''s speech. From ten words to full conversations in a year. The progress reports every month kept us involved in every step of his journey.',
 'Parent, Indirapuram', 4, 1);
