// One-off, idempotent content migration: makes the three hardcoded service detail
// pages + FAQs + contact settings admin-editable.
//
// Run from the server dir:  node scripts/migrate-content.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'thera_kids',
  waitForConnections: true,
  connectionLimit: 5
});

/* ---------------------------------- data ---------------------------------- */

// Real contact details (previously hardcoded in Footer.jsx / Contact.jsx)
const SETTINGS = {
  phone: '+91 98993 38813 / +91 93135 13313',
  email: 'therakids.dc@gmail.com',
  address1: 'G-10, Block G, Sector 22, Noida - 201301',
  address2: '173, Itehara, Near NX-One Society, Gr. Noida West - 201306',
  hours_week: 'Mon-Fri: 8:00 AM - 6:00 PM',
  hours_sat: 'Saturday: 9:00 AM - 2:00 PM',
  hours_sun: 'Sunday: Closed'
};

const FAQS = {
  home: [
    ['What is Occupational Therapy and how does it help children?',
     'Occupational therapy helps children develop the motor, sensory, and cognitive skills needed for everyday activities. Our therapists work with children to improve fine motor skills, sensory processing, and visual motor skills needed for dressing, writing, and playing. We track every child\'s improvement and tailor our approach to their unique potential.'],
    ['At what age should my child start therapy?',
     'Most pediatric therapies start from the age of 3 years. However, some therapies like speech therapy can start even earlier. Early intervention is key — the sooner we can assess and begin working with your child, the better the outcomes. We recommend consulting with our specialists if you notice any developmental delays.'],
    ['What does Speech Therapy involve?',
     'Speech therapy supports children in developing strong communication skills. It addresses articulation, receptive and expressive language, social pragmatic skills, and helps children express their thoughts and articulate words. Our speech-language pathologists also work on non-verbal communication and body language skills.'],
    ['When does my child need Physical Therapy?',
     'If your child has difficulty performing basic movements because of an injury or illness, they may need physical therapy. Delay in learning motor skills is not always considered a problem with movement, but our physiotherapists can help assess whether your child would benefit from physical therapy to improve mobility, balance, and strength.'],
    ['How do I know which therapy is right for my child?',
     'Every child is unique. We begin with a comprehensive assessment to understand your child\'s specific needs, strengths, and areas for growth. Based on this evaluation, our multidisciplinary team creates an individualized plan that may include one or more therapy types. Contact us to schedule an initial consultation.']
  ],
  'speech-therapy': [
    ['What does speech therapy do?',
     'Speech therapy is a medical process that helps you overcome your language disorder with the help of a speech-language therapist. It addresses articulation, fluency, receptive and expressive language skills.'],
    ['What are some speech therapy techniques?',
     'There are many types of speech therapy techniques including Speech Obtrusive technique, Articulation therapy, and Oral-Motor/Feeding and Swallowing technique. The type depends on the specific disorder.'],
    ['How do I know if my child needs speech therapy?',
     'A normal child starts babbling at the age of 2-3. If your child doesn\'t react to your sound, or finds it difficult to speak words in flow, they may need speech therapy. Kids with Down syndrome also often need therapy.'],
    ['Does speech delay mean autism?',
     'No, speech delay is not specific to autism. Many factors can cause speech issues including global developmental delay, physical disability, stroke, and many more conditions.'],
    ['At what age should you worry about a child not talking?',
     'If your child won\'t start babbling at the age of 2-3, doesn\'t react to your actions, or is unable to speak, then your child may need speech therapy intervention.'],
    ['How long does speech therapy usually last?',
     'There is no specific time period for recovery. Several factors affect duration including age, critical medical condition, type of speech disorder, and method of treatment.']
  ],
  'occupational-therapy': [
    ['What is Occupational Therapy for children?',
     'Occupational therapy is a science-based study that helps people with disabilities overcome their issues. It helps children with various disabilities perform daily tasks like self-feeding, bathing, crawling, etc. Pediatric therapists work with a professional degree to help children develop essential life skills.'],
    ['What does a Pediatric Occupational Therapist do?',
     'A pediatric occupational therapist studies a person\'s mind and how a child with a disability analyzes things and reacts to them. They use different techniques to help children overcome their issues and develop fine motor, sensory processing, and gross motor skills.'],
    ['How do I know if my child needs OT?',
     'If your child has difficulty with self-feeding, bathing, crawling, connecting in social activities, poor eye-hand coordination, inability to perform age-appropriate activities, poor handwriting, or sensory processing issues, you should consult an occupational therapist.'],
    ['Is Occupational Therapy effective for Autism?',
     'Yes, Occupational Therapy helps improve functional independence in daily life by preventing or minimizing sensory, cognitive, or physical problems. It is a goal-oriented, highly structured, and customized program that can be very effective for children with autism.'],
    ['How long does Occupational Therapy take?',
     'The duration varies depending on the child\'s specific needs, the severity of the condition, and how the child responds to therapy. Our therapists track every child\'s improvement and adjust the program accordingly to ensure optimal progress.']
  ],
  'physical-therapy': [
    ['What is Pediatric Physical Therapy?',
     'Pediatric physical therapy is a specialized form of therapy that helps children improve their physical abilities, including movement, strength, balance, and coordination. Our therapists work with children to help them reach their maximum physical potential.'],
    ['When does my child need Physical Therapy?',
     'If your child has difficulty performing basic movements because of an injury or illness, they may need physical therapy. Delay in learning motor skills is not always considered a problem with movement, but our physiotherapists can assess whether your child would benefit.'],
    ['What conditions does Physical Therapy treat?',
     'Physical therapy can help with cerebral palsy, muscular dystrophy, spina bifida, orthopaedic disorders, walking disorders, genetic conditions, injury rehabilitation, and developmental delays.'],
    ['How does Physical Therapy help children?',
     'Physical therapy helps children by providing proper management to overcome critical physical conditions. Our therapists bring children to activities like stretching, running, jumping, and use technologies to treat various conditions.'],
    ['What techniques are used in Pediatric Physical Therapy?',
     'We use a variety of techniques including therapeutic exercises, stretching, balance training, gait training, functional mobility training, and advanced technologies for conditions related to genetics, orthopaedic disorders, and walking disorders.']
  ]
};

// Rich intro copy (was hardcoded in the three detail pages), split into paragraphs by \n\n
const FULL_DESCRIPTIONS = {
  'speech-therapy': `Speech therapy is a medical process that helps improve your communication skills and language disorders. A speech therapy specialist is known as a speech therapist or language pathologist.

It includes several programs that include language-mediated activities, articulation remedies, and others, depending on the type of disorder. Speaking is an essential part of human nature — through speaking, we describe our deepest emotions to others.

Our speech-language pathologists are keen on helping kids who have speaking problems. With this therapy, kids learn to speak difficult words, express new thoughts and ideas, and develop very good conversation skills.`,
  'occupational-therapy': `Any nation's future lies with its children. If they have any problems that are hard to manage on their own, either physical or mental, their family plays a crucial role while coping with these issues.

Professional Occupational Therapy (OT) helps a person with various disabilities that make them unable to perform daily tasks like self-feeding, bathing, crawling, etc. OT is a science-based study that includes studying a person's mind and how a person with a disability analyzes things and reacts to them.

This process enables children to develop their confidence in various activities. They learn to communicate, be creative, walk properly, and act nicely in a crunch situation. Occupational therapy can bring an impressive change in a child's personality.`,
  'physical-therapy': `Physical therapy is known as proper management given to a person to overcome a critical physical condition. We work hard on every child in making them a good personality who can work and act independently in any situation.

Our paediatric physical therapists have been doing great work in this area. They bring children to proper activities like stretching, running, jumping, and more. They give good concentration in making a kid go free from all the muscular pain and increase their ease of movement.

Physical therapists also take the help of technologies to treat certain conditions related to genetics, orthopaedic disorders, and walking disorders.`
};

const HERO_TITLES = {
  'speech-therapy': 'Helping children find their voice.',
  'occupational-therapy': 'Building independence through meaningful activities.',
  'physical-therapy': 'Empowering movement and mobility.',
  'special-education': 'Learning built around your child.',
  'aba-therapy': 'Evidence-based steps toward real progress.',
  'social-group-training': 'Confidence that grows with every session.',
  'behaviour-modification': 'Positive behaviour, nurtured with care.',
  'parents-child-counselling': 'Support for the whole family\u2019s journey.',
  'pre-vocational-training': 'Skills that open doors to the future.'
};

// Extra bands for the detail pages (kind: cards | lists | tags | prose).
// Rendered by ServiceDetail.jsx — replaces the hardcoded page sections.
const PAGE_SECTIONS = {
  'speech-therapy': [
    {
      kind: 'cards', bg: 'bg-pastel-lilac',
      eyebrow: 'Types of Disorders',
      title: 'Speech & Language Disorders We Treat',
      subtitle: 'Children face varieties of problems while speaking. Our speech therapists have great experience working with many kids and addressing these conditions.',
      items: [
        { title: 'Articulation Disorder', text: 'A child with verbalism disorder cannot pronounce certain alphabets or words — they may say "tith" instead of "teeth." Children add, swap, or distort some words, requiring speech therapy intervention.' },
        { title: 'Fluency Disorder', text: 'This disorder affects the flow and rhythm of communication. It includes stuttering (difficulty pronouncing words with interruptions or blocks) and cluttering (speaking very fast, making it hard to understand).' },
        { title: 'Receptive Disorder', text: 'The most common symptom is the inability to understand what others are saying or processing it late in the brain. Hearing loss, stroke, or injury can lead to this disorder.' },
        { title: 'Expressive Disorder', text: 'An issue where a child becomes unable to form correct sentences — making grammatical errors or incorrect verb use. This disorder is caused by unhealthy development, critical medical conditions, Down syndrome, etc.' },
        { title: 'Apraxia', text: 'A common speech disease where you understand what others say, but when you try to reply, you find it difficult to form the correct sentence.' },
        { title: 'Aphasia', text: 'A person with this disorder is unable to speak a word and finds it difficult to understand what others are saying. Without proper speech therapy, this disorder can cause reading and writing disabilities.' }
      ]
    },
    {
      kind: 'cards',
      eyebrow: 'Our Approach',
      title: 'Therapy Types & Activities',
      items: [
        { icon: '🗣️', title: 'Articulation Therapy', text: 'Specialists use a play method tailored to the age of the child. A therapist helps children make certain sounds and guides them to pronounce sounds using the tongue.' },
        { icon: '📚', title: 'Speech Obtrusive Therapy', text: 'Pathologists treat children using books, objects, and by talking and playing with them. This method improves grammar, language ascent, and vocabulary enhancement through reiteration methods.' },
        { icon: '🍽️', title: 'Oral-Motor/Feeding Therapy', text: 'Different exercises including facial massage, neck exercise, and muscle exercise. It helps children to be orally active while drinking, eating, or swallowing.' }
      ]
    },
    {
      kind: 'prose', bg: 'bg-pastel-peach',
      eyebrow: 'Why TheraKids?',
      title: 'Best Speech Therapy Service in Noida',
      html: '<p class="body-lg text-navy-light text-center mb-6">Therakids Noida is the best speech therapy service provider for kids in Noida. With affordable charges and fees depending on the duration of therapy a child needs, we highly recommend providing your child a safe place with high professional pathologists.</p><p class="body-lg text-navy-light text-center mb-8">We prove it possible for your child to become normal and help them communicate with good fluency. Send your kid to our facility — we guarantee that they will be in good hands.</p>'
    }
  ],
  'occupational-therapy': [
    {
      kind: 'cards', bg: 'bg-pastel-peach',
      eyebrow: 'Key Benefits',
      title: 'Primary Skills We Develop',
      subtitle: 'Our therapists assist children in developing many essential skills that help improve self-esteem and overcome challenges. Development of these skills at an appropriate age is necessary.',
      items: [
        { title: 'Fine Motor Skills', text: 'With age, a child can do certain joyful activities with the help of small hand muscles — shaking a hand, reacting to certain words, trying to babble, scrawl, hold a pencil, etc. This therapy helps your child develop these skills at an age-appropriate period.' },
        { title: 'Sensory Processing Skills', text: 'If your child doesn\'t react to smell, sound, touch, or sometimes overreact to it, it\'s a sign of sensory issues. This therapy helps your child know how to react while touching something, smelling, or on sound.' },
        { title: 'Gross Motor Skills', text: 'This skill consists of the usage of major muscle groups in performing tasks. Our pediatric therapists help your child develop this skill in a playing method like running fast, climbing stairs, catching and throwing, etc.' },
        { title: 'Self-Care Independence', text: 'We help children develop the ability to perform daily activities like eating, drinking, doing mathematics calculations, playing games, comfort their friends, draw pictures, and several other skills independently.' }
      ]
    },
    {
      kind: 'lists',
      title: 'Signs Your Child Needs OT',
      blocks: [
        {
          title: 'Signs Your Child Needs OT',
          text: 'If you find any of these symptoms in your child, then you need to consult with an occupational therapist:',
          bullet: '✓',
          items: [
            'Difficulty with self-feeding, bathing, or crawling',
            'Challenges connecting in social activities or engagements',
            'Poor eye-hand movement and coordination',
            'Unable to perform age-appropriate activities like walking, running, writing',
            'Poor handwriting',
            'Sensory processing disorder — inability to feel touch, taste, smell, or sound',
            'Difficulty in gross motor activities such as climbing stairs, running fast, picking and throwing'
          ]
        },
        {
          title: 'Common Causes',
          text: 'Multiple reasons can cause this disorder to occur by birth or after an incident:',
          bullet: '•',
          items: [
            'Abnormalities of the sensory system',
            'Birth harm or birth flaws',
            'Accidents',
            'Mental health or physical disability',
            'Issues with learning',
            'Traumatic injuries',
            'Rheumatoid arthritis in youngsters',
            'Behavioural problems',
            'Chronic conditions such as multiple sclerosis, cerebral palsy'
          ]
        }
      ]
    }
  ],
  'physical-therapy': [
    {
      kind: 'cards', bg: 'bg-pastel-mint',
      eyebrow: 'Key Benefits',
      title: 'Advantages of Physical Therapy',
      subtitle: 'Physical therapy provides comprehensive support for children with physical challenges, helping them achieve greater independence and confidence.',
      items: [
        { title: 'Pain Relief Through Exercise', text: 'By doing good exercise, children can get relief from muscular pain. Our therapists design exercise programs that are fun and engaging while effectively reducing discomfort.' },
        { title: 'Balance & Coordination', text: 'This therapy helps kids to balance themselves correctly and avoid falling. Children develop better body awareness and coordination through targeted activities.' },
        { title: 'Mobility Development', text: 'This therapy helps kids to develop normal mobility so that they don\'t have any trouble in walking, moving, or standing. We work on building strength and flexibility.' },
        { title: 'Functional Independence', text: 'Sometimes physical therapy can also help an individual to such great measures that they don\'t have to go for surgery. We focus on maximizing independence in daily activities.' }
      ]
    },
    {
      kind: 'tags',
      title: 'Conditions We Treat',
      text: 'Our physical therapy programs address a wide range of conditions affecting children\'s movement, strength, and mobility. We provide specialized intervention for:',
      items: ['Cerebral Palsy', 'Muscular Dystrophy', 'Spina Bifida', 'Orthopaedic Disorders', 'Walking Disorders', 'Genetic Conditions', 'Injury Rehabilitation', 'Developmental Delays']
    }
  ]
};

/* -------------------------------- migration -------------------------------- */

const hasColumn = async (table, column) => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
    [table, column]
  );
  return rows[0].c > 0;
};

const run = async () => {
  // 1. faqs table
  await pool.query(`CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_faqs_page (page_key)
  )`);
  console.log('✓ faqs table ready');

  // 2. services columns (MySQL has no ADD COLUMN IF NOT EXISTS)
  if (!(await hasColumn('services', 'hero_title'))) {
    await pool.query('ALTER TABLE services ADD COLUMN hero_title VARCHAR(255) AFTER slug');
    console.log('✓ services.hero_title added');
  }
  if (!(await hasColumn('services', 'page_sections'))) {
    await pool.query('ALTER TABLE services ADD COLUMN page_sections JSON AFTER benefits');
    console.log('✓ services.page_sections added');
  }

  // 3. contact settings (real values; drop the placeholder `address` key)
  for (const [key, value] of Object.entries(SETTINGS)) {
    await pool.query(
      'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
      [key, value]
    );
  }
  await pool.query('DELETE FROM site_settings WHERE setting_key = ?', ['address']);
  console.log(`✓ ${Object.keys(SETTINGS).length} contact settings saved (placeholder "address" key removed)`);

  // 4. FAQs
  let faqCount = 0;
  for (const [page, rows] of Object.entries(FAQS)) {
    await pool.query('DELETE FROM faqs WHERE page_key = ?', [page]);
    for (let i = 0; i < rows.length; i++) {
      await pool.query(
        'INSERT INTO faqs (page_key, question, answer, display_order, is_active) VALUES (?, ?, ?, ?, 1)',
        [page, rows[i][0], rows[i][1], i + 1]
      );
      faqCount++;
    }
  }
  console.log(`✓ ${faqCount} FAQs seeded for ${Object.keys(FAQS).length} pages`);

  // 5. service copy: hero titles, rich intro text, extra page sections
  for (const [slug, heroTitle] of Object.entries(HERO_TITLES)) {
    await pool.query('UPDATE services SET hero_title = ? WHERE slug = ?', [heroTitle, slug]);
  }
  for (const [slug, text] of Object.entries(FULL_DESCRIPTIONS)) {
    await pool.query('UPDATE services SET full_description = ? WHERE slug = ?', [text, slug]);
  }
  for (const [slug, sections] of Object.entries(PAGE_SECTIONS)) {
    await pool.query('UPDATE services SET page_sections = ? WHERE slug = ?', [JSON.stringify(sections), slug]);
  }
  console.log(`✓ services updated: ${Object.keys(HERO_TITLES).length} hero titles, ${Object.keys(FULL_DESCRIPTIONS).length} intro rewrites, ${Object.keys(PAGE_SECTIONS).length} section sets`);

  // 6. Physical Therapy is linked from the footer/nav but was never seeded as a
  // services row (it only existed as a hardcoded page). Insert it and make room
  // for it in the display order.
  const [ptRows] = await pool.query('SELECT id FROM services WHERE slug = ?', ['physical-therapy']);
  if (ptRows.length === 0) {
    await pool.query(
      `INSERT INTO services
         (name, slug, hero_title, short_description, full_description, image, benefits, page_sections, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        'Physical Therapy',
        'physical-therapy',
        HERO_TITLES['physical-therapy'],
        'Empowering movement, balance, and coordination for greater independence.',
        FULL_DESCRIPTIONS['physical-therapy'],
        '/images/services/physiotherapy-paeds.jpg',
        JSON.stringify(['Mobility improvement', 'Muscle strengthening', 'Balance and coordination', 'Pain relief through exercise', 'Walking and running support', 'Orthopaedic rehabilitation']),
        JSON.stringify(PAGE_SECTIONS['physical-therapy']),
        4
      ]
    );
    await pool.query(
      'UPDATE services SET display_order = display_order + 1 WHERE display_order >= 4 AND slug <> ?',
      ['physical-therapy']
    );
    console.log('✓ physical-therapy service row inserted (display_order 4)');
  }

  await pool.end();
  console.log('\nMigration complete.');
};

run().catch(async (err) => {
  console.error('Migration failed:', err.message);
  try { await pool.end(); } catch { /* ignore */ }
  process.exit(1);
});
