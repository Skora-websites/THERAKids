-- Sample content for THERAKids
-- Safe to re-run: deletes and re-inserts only these seeded rows.

USE thera_kids;

-- ==========================================
-- SERVICES (12, the clinic's official brochure list)
-- ==========================================

DELETE FROM services WHERE slug IN
  ('occupational-therapy','physiotherapy-paeds','special-education','speech-therapy',
   'social-group-training','early-intervention','psychological-assessment','reviews',
   'counseling','parent-training','behaviour-modification','brain-gym-therapy',
   'physical-therapy','aba-therapy','parents-child-counselling','pre-vocational-training');

INSERT INTO services (name, slug, short_description, full_description, image, benefits, display_order, is_active) VALUES
('Occupational Therapy', 'occupational-therapy',
 'Building fine motor, sensory, and daily-living skills for independence.',
 'Occupational therapy helps children develop the fine motor, sensory processing, and visual motor skills needed for everyday activities like dressing, writing, and playing. Our occupational therapists keep records of every child''s improvement and tailor each session to the child''s unique potential.',
 '/images/services/occupational-therapy.jpg',
 '["Fine motor skill development","Sensory regulation strategies","Self-care independence (dressing, feeding)","Hand-eye coordination"]', 1, 1),

('Physiotherapy (Paeds)', 'physiotherapy-paeds',
 'Strength, balance, and movement, helping kids explore the world with confidence.',
 'Our paediatric physiotherapists help children overcome physical challenges through stretching, running, jumping, and targeted exercise, improving strength, balance, coordination, and ease of movement, including support for conditions related to genetics, orthopaedic disorders, and walking disorders.',
 '/images/services/physiotherapy-paeds.jpg',
 '["Mobility improvement","Muscle strengthening","Balance and coordination","Walking and running support","Orthopaedic rehabilitation"]', 2, 1),

('Special Education', 'special-education',
 'Tailored educational support for literacy, numeracy, and school readiness.',
 'Our remedial intervention helps children learn to read, write, and do calculations in a specialized environment with small group sizes, keeping every child''s studies on track with strict attention to their progress.',
 '/images/services/special-education.jpg',
 '["Individualized Education Plans","Literacy and numeracy support","Cognitive skill building","School readiness"]', 3, 1),

('Speech Therapy', 'speech-therapy',
 'Developing strong communication, articulation, and language skills.',
 'Our speech-language pathologists support children in developing strong communication skills: articulation, receptive and expressive language, social pragmatic skills, and even feeding and swallowing support, so children can express themselves and connect with society confidently.',
 '/images/services/speech-therapy.jpg',
 '["Articulation and pronunciation","Receptive and expressive language","Social communication (pragmatics)","Stuttering and fluency support"]', 4, 1),

('Social Group Training', 'social-group-training',
 'Structured group sessions building peer interaction and play skills.',
 'Structured group sessions that help children prepare for academic and social settings, focusing on peer interaction, turn-taking, and play skills. Children learn to interact with others, develop friendships, and build social confidence for school and community settings.',
 '/images/services/social-group-training.jpg',
 '["Peer interaction","Turn-taking and sharing","Group participation","Building friendships"]', 5, 1),

('Early Intervention', 'early-intervention',
 'Targeted support in the earliest years, when progress matters most.',
 'Early intervention identifies and supports developmental delays as early as possible. The sooner we can assess and begin working with a child, the better the outcomes. Our team builds play-based, individualized programs for infants and toddlers across all developmental domains.',
 '/images/services/early-intervention.jpg',
 '["Early detection of delays","Play-based developmental support","Parent coaching from day one","Stronger long-term outcomes"]', 6, 1),

('Psychological Assessment', 'psychological-assessment',
 'Comprehensive cognitive, developmental, and behavioural evaluations.',
 'Standardized psychological assessments help identify a child''s cognitive profile, developmental level, learning needs, and behavioural concerns. The results become the foundation for an accurate diagnosis and a personalized therapy plan.',
 '/images/services/psychological-assessment.jpg',
 '["Cognitive and developmental profiling","Learning-need identification","Behavioural evaluation","Foundation for therapy planning"]', 7, 1),

('Reviews', 'reviews',
 'Regular follow-up reviews to track progress and refine each plan.',
 'Therapy is a journey, and progress deserves measurement. Our periodic review sessions re-assess each child''s goals, celebrate milestones, and adjust the therapy plan so it always matches the child''s current needs.',
 '/images/services/reviews.jpg',
 '["Goal tracking and milestones","Plan refinement over time","Objective progress measures","Family progress reports"]', 8, 1),

('Counseling', 'counseling',
 'Gentle guidance and emotional support for children and parents.',
 'Counselling gives children and parents a safe space to express difficulties and build confidence. We provide dedicated counselling sessions for families to navigate the challenges of raising a child with developmental needs.',
 '/images/services/counseling.jpg',
 '["Emotional support and guidance","Confidence building","Parent education and support","Coping strategies for caregivers"]', 9, 1),

('Parent Training', 'parent-training',
 'Equipping parents with practical strategies for everyday progress.',
 'Parents are a child''s first and most important teachers. Our parent-training sessions share practical, evidence-based strategies for supporting therapy goals at home, turning daily routines into opportunities for progress.',
 '/images/services/parent-training.jpg',
 '["Practical home strategies","Routine-based learning","Consistency across settings","Caregiver empowerment"]', 10, 1),

('Behaviour Modification', 'behaviour-modification',
 'Supporting emotional regulation and positive coping strategies.',
 'We utilize evidence-based approaches to support children with emotional regulation, transitions, and developing positive coping mechanisms. Our therapists work to understand the root causes of behavioural challenges and develop customized intervention plans.',
 '/images/services/behaviour-modification.jpg',
 '["Emotional regulation techniques","Managing transitions and routines","Reducing anxiety","Positive reinforcement strategies"]', 11, 1),

('Brain Gym Therapy', 'brain-gym-therapy',
 'Movement-based exercises that prime the brain for learning.',
 'Brain Gym uses playful, purposeful movement to improve focus, memory, coordination, and learning readiness. These gentle exercises help children organize their nervous systems and engage more fully in therapy and schoolwork.',
 '/images/services/brain-gym-therapy.jpg',
 '["Focus and attention","Memory and coordination","Learning readiness","Nervous-system organization"]', 12, 1);

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
('/images/gallery/therakids/noida-centre-01.jpg', 'THERAkids Noida centre', 'Noida Centre', 1, 1),
('/images/gallery/therakids/noida-centre-02.jpg', 'Jungle-themed sensory room', 'Noida Centre', 2, 1),
('/images/gallery/therakids/noida-centre-03.jpg', 'Ball pit and sensory mats', 'Noida Centre', 3, 1),
('/images/gallery/therakids/noida-centre-04.jpg', 'Sensory integration room', 'Noida Centre', 4, 1),
('/images/gallery/therakids/noida-centre-06.jpg', 'Family waiting lounge', 'Noida Centre', 5, 1),
('/images/gallery/therakids/noida-centre-08.jpg', 'Group activity space', 'Noida Centre', 6, 1),
('/images/gallery/therakids/noida-centre-09.jpg', 'Front desk, Noida', 'Noida Centre', 7, 1),
('/images/gallery/therakids/gnw-centre-01.jpg', 'Reception, Greater Noida West', 'Greater Noida Centre', 8, 1),
('/images/gallery/therakids/gnw-centre-03.jpg', 'Jungle-themed ball pool', 'Greater Noida Centre', 9, 1),
('/images/gallery/therakids/gnw-centre-04.jpg', 'Soft-play floor', 'Greater Noida Centre', 10, 1),
('/images/gallery/therakids/gnw-centre-05.jpg', 'Parent seating nook', 'Greater Noida Centre', 11, 1),
('/images/gallery/therakids/gnw-centre-06.jpg', 'Sensory steps and murals', 'Greater Noida Centre', 12, 1),
('/images/gallery/therakids/gnw-centre-07.jpg', 'Therapy swing corner', 'Greater Noida Centre', 13, 1),
('/images/gallery/therakids/gnw-centre-08.jpg', 'Play gym at Greater Noida West', 'Greater Noida Centre', 14, 1),
('/images/gallery/therakids/happy-moments-01.jpg', 'The THERAkids family', 'Our Team', 15, 1),
('/images/gallery/therakids/happy-moments-02.jpg', 'Team day out', 'Our Team', 16, 1),
('/images/gallery/therakids/happy-moments-04.jpg', 'Raising awareness, together', 'Our Team', 17, 1),
('/images/gallery/therakids/happy-moments-07.jpg', 'Behind the scenes', 'Our Team', 18, 1),
('/images/gallery/therakids/happy-moments-10.jpg', 'Team THERAkids', 'Our Team', 19, 1),
('/images/gallery/therakids/happy-moments-11.jpg', 'Celebrating together', 'Our Team', 20, 1),
('/images/gallery/therakids/happy-moments-14.jpg', 'All smiles', 'Our Team', 21, 1),
('/images/gallery/therakids/workshop-01.jpg', 'Workshop highlights', 'Workshops & Trainings', 22, 1),
('/images/gallery/therakids/workshop-02.jpg', 'Expert-led sessions', 'Workshops & Trainings', 23, 1),
('/images/gallery/therakids/workshop-03.jpg', 'Parents learning together', 'Workshops & Trainings', 24, 1),
('/images/gallery/therakids/workshop-05.jpg', 'Our workshop team', 'Workshops & Trainings', 25, 1),
('/images/gallery/therakids/christmas-01.jpg', 'Christmas at THERAkids', 'Festivals & Celebrations', 26, 1),
('/images/gallery/therakids/christmas-04.jpg', 'Santa pays a visit', 'Festivals & Celebrations', 27, 1),
('/images/gallery/therakids/christmas-08.jpg', 'Cutting the Christmas cake', 'Festivals & Celebrations', 28, 1),
('/images/gallery/therakids/christmas-09.jpg', 'Festive selfies', 'Festivals & Celebrations', 29, 1),
('/images/gallery/therakids/holi-02.jpg', 'Holi celebrations', 'Festivals & Celebrations', 30, 1),
('/images/gallery/therakids/holi-04.jpg', 'Colours of Holi', 'Festivals & Celebrations', 31, 1),
('/images/gallery/therakids/holi-05.jpg', 'Holi with the team', 'Festivals & Celebrations', 32, 1),
('/images/gallery/therakids/diwali-01.jpg', 'Diwali at the centre', 'Festivals & Celebrations', 33, 1),
('/images/gallery/therakids/diwali-02.jpg', 'Handmade rangoli', 'Festivals & Celebrations', 34, 1),
('/images/gallery/therakids/birthday-01.jpg', 'Birthday celebrations', 'Festivals & Celebrations', 35, 1),
('/images/gallery/therakids/birthday-08.jpg', 'Birthday fun', 'Festivals & Celebrations', 36, 1),
('/images/gallery/therakids/birthday-15.jpg', 'Cake and celebrations', 'Festivals & Celebrations', 37, 1),
('/images/gallery/therakids/autism-day-01.jpg', 'Autism Awareness Day', 'Festivals & Celebrations', 38, 1),
('/images/gallery/therakids/autism-day-06.jpg', 'Awareness events', 'Festivals & Celebrations', 39, 1),
('/images/gallery/therakids/autism-day-11.jpg', 'Community day', 'Festivals & Celebrations', 40, 1),
('/images/gallery/therakids/autism-day-16.jpg', 'Awareness day with families', 'Festivals & Celebrations', 41, 1),
('/images/gallery/therakids/founders-day-01.jpg', 'Founders Day', 'Festivals & Celebrations', 42, 1),
('/images/gallery/therakids/founders-day-08.jpg', 'Founders Day celebrations', 'Festivals & Celebrations', 43, 1),
('/images/gallery/therakids/founders-day-14.jpg', 'Honouring our roots', 'Festivals & Celebrations', 44, 1);

-- ==========================================
-- BLOGS (7 published posts, auto-generated from blog-data.js)
-- Regenerate with: node scripts/sync-seed-blogs.js
-- ==========================================

-- >>> BLOGS:AUTO-GENERATED (from blog-data.js), do not edit by hand >>>
DELETE FROM blogs WHERE slug IN (
  'understanding-sensory-processing',
  'speech-milestones-toddlers');

INSERT INTO blogs (title, slug, excerpt, content, featured_image, author, category, seo_title, status, published_at) VALUES
('Understanding Sensory Processing Disorder',
 'understanding-sensory-processing',
 'Learn about the signs of SPD and how occupational therapy can provide strategies for self-regulation.',
 '<p>Some children experience the world through their senses more intensely than others. Sounds feel louder, textures feel harsher, and busy environments can quickly become overwhelming. When these reactions start to interfere with daily life (dressing, eating, playing, or learning), it may be a sign of Sensory Processing Disorder (SPD).</p>

<h3>Common signs to watch for</h3>
<ul>
<li>Covering ears at everyday noises or reacting strongly to touch</li>
<li>Avoiding certain foods because of texture or temperature</li>
<li>Constant movement such as spinning, crashing, or fidgeting, or avoiding movement altogether</li>
<li>Meltdowns in busy places like supermarkets or playgrounds</li>
</ul>

<h3>How occupational therapy helps</h3>
<p>Our occupational therapists use play-based sensory integration to help children gradually build tolerance and regulation. Therapy looks like fun, with swings, climbing, and tactile games, but each activity is chosen to target specific sensory systems and teach the nervous system to respond more comfortably.</p>
<p>With consistent support, children learn strategies to self-regulate, and parents learn how to set up sensory-friendly routines at home. Early support makes a remarkable difference.</p>',
 '/images/services/occupational-therapy.jpg',
 'Dr. Priya Sharma',
 'Occupational Therapy',
 'Understanding Sensory Processing Disorder | TheraKids',
 'published',
 '2026-08-10 09:00:00'),

('Speech Milestones for Toddlers',
 'speech-milestones-toddlers',
 'A quick guide for parents on what to expect as your toddler develops their communication skills.',
 '<p>Every child develops at their own pace, but language follows a fairly predictable path. Knowing the typical milestones helps you celebrate progress and spot early when a little extra support could help.</p>

<h3>12 to 18 months</h3>
<p>First words appear, usually naming people and favourite objects. Your toddler understands simple requests like "come here" and points to show interest.</p>

<h3>18 to 24 months</h3>
<p>Vocabulary grows quickly, often to 50 or more words, and two-word combinations begin: "more juice", "daddy go".</p>

<h3>2 to 3 years</h3>
<p>Sentences of three or more words, question words like "what" and "where", and speech that is mostly understood by familiar adults.</p>

<h3>When to seek an assessment</h3>
<ul>
<li>No words by 16 months</li>
<li>No two-word phrases by age 2</li>
<li>Loss of words or skills at any age</li>
<li>You simply feel something is different, so trust your instincts</li>
</ul>

<p>Early intervention is the single biggest factor in speech outcomes. If you are unsure, a developmental screening takes less than an hour and gives you a clear picture of where your child stands.</p>',
 '/images/services/speech-therapy.jpg',
 'Dr. Rahul Verma',
 'Speech Therapy',
 'Speech Milestones for Toddlers | TheraKids',
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
 'We were initially worried about therapy feeling clinical. THERAKids is the opposite; our daughter runs to the door for her sessions. The parent counselling sessions helped us support her at home too.',
 'Parents, Greater Noida', 3, 1),

('Fatima Sheikh',
 'Dr. Rahul transformed my son''s speech. From ten words to full conversations in a year. The progress reports every month kept us involved in every step of his journey.',
 'Parent, Indirapuram', 4, 1);

-- ==========================================
-- SEO (admin "SEO" tab), one row per public route that has no resource of its
-- own. Blog posts and service pages edit their meta in the Blogs / Services
-- panels. Meta values start empty: the site keeps its built-in defaults until an
-- admin fills a field in.
-- ==========================================

INSERT IGNORE INTO page_seo (page_key, label) VALUES
('/', 'Home'),
('/about', 'About'),
('/services', 'Services listing'),
('/conditions', 'Conditions'),
('/gallery', 'Gallery'),
('/blogs', 'Blogs listing'),
('/contact', 'Contact');
