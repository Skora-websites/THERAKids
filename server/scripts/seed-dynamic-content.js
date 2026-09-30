// One-off seed: moves the last hardcoded page content into the database.
// - process_steps      ← Home.jsx fallbackProcess (Our Process section)
// - conditions_data    ← Conditions.jsx inline conditions array
// - founders           ← Home founders grid + About founder/co-founder bios
// - page_content       ← About.jsx mission paragraphs + values list
// - faqs(page=assessments) ← Services.jsx hardcoded "Comprehensive Assessments" cards
// Idempotent: clears and re-seeds these rows. Run: node scripts/seed-dynamic-content.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const PROCESS_STEPS = [
  { step: '1', title: 'Contact us', description: 'to make a referral.', image: '/images/process/contact.jpg', tone: 'peach' },
  { step: '2', title: 'Assessment', description: 'Provision of a customized, comprehensive assessment.', image: '/images/process/assessment.jpg', tone: 'lilac' },
  { step: '3', title: 'Personalized Plan', description: 'Customized care plans to support individual needs.', image: '/images/process/plan.jpg', tone: 'peach' },
  { step: '4', title: 'Intervention', description: 'Flexible therapy plans including clinic and school based.', image: '/images/process/intervention.jpg', tone: 'lilac' }
];

const CONDITIONS = [
  { name: 'Autism Spectrum Disorder', short_name: 'Autism', description: 'A neurodevelopmental condition affecting communication, social interaction, and behavior. We focus on enhancing social skills, sensory processing, and promoting independence.', focus_areas: ['Social Skills', 'Sensory Regulation', 'Communication'], image: '/images/conditions/autism.jpg' },
  { name: 'ADHD', short_name: 'ADHD', description: 'Attention-Deficit/Hyperactivity Disorder involves differences in attention, focus, and impulse control. Our therapies help build executive functioning, emotional regulation, and academic success.', focus_areas: ['Executive Functioning', 'Impulse Control', 'Attention Span'], image: '/images/conditions/adhd.jpg' },
  { name: 'Down Syndrome', short_name: 'Down Syndrome', description: 'A genetic condition causing developmental and physical differences. We provide early intervention focusing on motor milestones, speech development, and cognitive skills.', focus_areas: ['Motor Milestones', 'Speech Development', 'Cognitive Skills'], image: '/images/conditions/down-syndrome.jpg' },
  { name: 'Cerebral Palsy', short_name: 'Cerebral Palsy', description: 'A group of disorders affecting movement and muscle tone. Our therapies focus on maximizing mobility, functional independence, and overall quality of life.', focus_areas: ['Mobility', 'Muscle Tone', 'Functional Independence'], image: '/images/conditions/cerebral-palsy.jpg' },
  { name: 'Global Developmental Delay (GDD)', short_name: 'GDD', description: 'When a child is significantly delayed in multiple developmental areas (motor, speech, cognitive). We provide comprehensive, multidisciplinary intervention to bridge the gaps.', focus_areas: ['Multidisciplinary Care', 'Milestone Tracking', 'Early Intervention'], image: '/images/conditions/gdd.jpg' },
  { name: 'Learning Disability', short_name: 'LD', description: 'Challenges affecting how the brain receives, processes, or responds to information (e.g., Dyslexia). We offer specialized educational support to build academic confidence.', focus_areas: ['Reading & Writing', 'Academic Confidence', 'Special Education'], image: '/images/conditions/learning-disability.jpg' },
  { name: 'Speech & Language Delay', short_name: 'Speech Delay', description: 'When a child’s language development is slower than typical milestones. Our speech pathologists work to improve articulation, comprehension, and expressive communication.', focus_areas: ['Articulation', 'Comprehension', 'Expressive Language'], image: '/images/conditions/speech-delay.jpg' },
  { name: 'High Risk Infants', short_name: 'High Risk Infants', description: 'Infants born prematurely or with medical complications requiring early developmental monitoring and preventative therapy to ensure optimal growth trajectories.', focus_areas: ['Early Monitoring', 'Preventative Therapy', 'Infant Care'], image: '/images/conditions/high-risk-infants.jpg' },
  { name: 'Intellectual Disability', short_name: 'ID', description: 'Characterized by significant limitations in intellectual functioning and adaptive behavior. We focus on teaching functional life skills and enhancing independence.', focus_areas: ['Life Skills', 'Independence', 'Adaptive Behavior'], image: '/images/conditions/intellectual-disability.jpg' },
  { name: 'Developmental Coordination Disorder', short_name: 'DCD', description: 'Also known as dyspraxia, affecting physical coordination. We help improve motor planning, balance, and execution of daily physical tasks.', focus_areas: ['Motor Planning', 'Balance', 'Physical Coordination'], image: '/images/conditions/dcd.jpg' },
  { name: 'Social Communication Disorder', short_name: 'SCD', description: 'Difficulties with the use of verbal and nonverbal language for social purposes. We facilitate social groups to practice pragmatic language and peer interactions.', focus_areas: ['Pragmatic Language', 'Peer Interaction', 'Group Sessions'], image: '/images/conditions/social-communication.jpg' },
  { name: 'Hemiparesis', short_name: 'Hemiparesis', description: 'Weakness or partial paralysis on one side of the body. Our PT and OT programs focus on strengthening, bilateral coordination, and functional mobility.', focus_areas: ['Strengthening', 'Bilateral Coordination', 'Functional Mobility'], image: '/images/conditions/hemiparesis.jpg' }
];

const FOUNDERS = [
  {
    name: 'Sandeep Rana',
    role: 'Founder & Chairman',
    title_line: 'Founder & Chairman, THERAKids Foundation',
    profile_image: '/images/sandeep_rana.jpg',
    paragraphs: [
      'With over 20 years of experience in healthcare management and child development, Sandeep Rana brings visionary leadership, strategic insight, and a deep sense of purpose to THERAKids Foundation.',
      'For Sandeep, THERAKids is more than a child development centre—it is a vision built on compassion, purpose, and the belief that every child deserves the opportunity to thrive.',
      'What began in 2019 from a small space with a powerful dream has grown into two state-of-the-art child development centres in Noida and Greater Noida West, supported by a dedicated team of 40+ professionals across multiple disciplines of pediatric care.',
      'Under his leadership, THERAKids has evolved into a trusted name in child development, with a strong commitment to accessible, ethical, and quality therapeutic care. His vision is to create an environment where children receive the right support, families feel empowered, and professionals are encouraged to grow and make a meaningful difference.',
      'Beyond leading the organization, Sandeep is passionate about mentoring therapists and educators and contributing to the growth of pediatric care. He believes that true leadership is not only about building an organization, but about building people, creating impact, and transforming lives.'
    ],
    closing_line: 'At the heart of his journey are three guiding principles: Compassion. Purpose. Karma.'
  },
  {
    name: 'Dr. Akanksha Rana',
    role: 'Co-Founder & Consultant',
    title_line: 'Co-Founder & Consultant, THERAKids Foundation',
    subtitle_line: 'Senior Pediatric Occupational Therapist',
    profile_image: '/images/akanksha_rana.jpg',
    paragraphs: [
      'With over 16 years of experience in pediatric occupational therapy and child development, Dr. Akanksha Rana is a distinguished clinician and a driving force behind the clinical vision of THERAKids Foundation.',
      'As Co-founder and Consultant, she plays a pivotal role in shaping THERAKids’ clinical standards, therapeutic philosophy, and commitment to child-centred care. Her expertise spans sensory integration, developmental delays, autism spectrum disorders, and pediatric rehabilitation, combining evidence-based practice with compassionate, individualized care.',
      'Over the years, her clinical expertise and unwavering commitment have helped thousands of children progress toward their developmental potential while empowering families with greater understanding, confidence, and hope.',
      'At THERAKids, Dr. Akanksha provides clinical leadership to a multidisciplinary team, fostering a culture of clinical excellence, innovation, continuous learning, and compassionate care.',
      'Her vision is to ensure that every child is understood beyond a diagnosis, supported according to their unique needs, and given every opportunity to reach their fullest potential.'
    ],
    closing_line: 'For Dr. Akanksha, therapy is not simply about achieving milestones—it is about unlocking potential, building confidence, and creating meaningful possibilities for every child.'
  }
];

// Home page FAQ accordion (was hardcoded in Home.jsx before the DB cutover)
const HOME_FAQS = [
  {
    question: 'What is Occupational Therapy and how does it help children?',
    answer: 'Occupational therapy helps children develop the motor, sensory, and cognitive skills needed for everyday activities. Our therapists work with children to improve fine motor skills, sensory processing, and visual motor skills needed for dressing, writing, and playing. We track every child\'s improvement and tailor our approach to their unique potential.'
  },
  {
    question: 'At what age should my child start therapy?',
    answer: 'Most pediatric therapies start from the age of 3 years. However, some therapies like speech therapy can start even earlier. Early intervention is key: the sooner we can assess and begin working with your child, the better the outcomes. We recommend consulting with our specialists if you notice any developmental delays.'
  },
  {
    question: 'What does Speech Therapy involve?',
    answer: 'Speech therapy supports children in developing strong communication skills. It addresses articulation, receptive and expressive language, social pragmatic skills, and helps children express their thoughts and articulate words. Our speech-language pathologists also work on non-verbal communication and body language skills.'
  },
  {
    question: 'When does my child need Physiotherapy?',
    answer: 'If your child has difficulty performing basic movements because of an injury or illness, they may need physiotherapy. Delay in learning motor skills is not always considered a problem with movement, but our physiotherapists can help assess whether your child would benefit from therapy to improve mobility, balance, and strength.'
  },
  {
    question: 'How do I know which therapy is right for my child?',
    answer: 'Every child is unique. We begin with a comprehensive assessment to understand your child\'s specific needs, strengths, and areas for growth. Based on this evaluation, our multidisciplinary team creates an individualized plan that may include one or more therapy types. Contact us to schedule an initial consultation.'
  }
];

const ASSESSMENT_FAQS = [
  {
    question: 'Psychological Assessments',
    answer: JSON.stringify([
      'Developmental Assessments (DQ)',
      'IQ Assessment (MISIC) & EQ Assessment',
      'Learning Disability (LD) Assessment',
      'VSMCs & Gesell Scale'
    ])
  },
  {
    question: 'Psychological Assessments — bullet list',
    answer: JSON.stringify([
      'Developmental Assessments (DQ)',
      'IQ Assessment (MISIC) & EQ Assessment',
      'Learning Disability (LD) Assessment',
      'VSMCs & Gesell Scale'
    ])
  },
  {
    question: 'OT & PT Assessments',
    answer: 'Paired heading row; its bullets live in the next row.'
  },
  {
    question: 'OT & PT Assessments — bullet list',
    answer: JSON.stringify([
      'Sensory Profile & Motor Assessment',
      'Manual Muscle Testing (MMT) & Goniometry',
      'Infant Neurological International Battery (INFANIB)',
      'Miller Assessment for Preschoolers (MAP) & Berg Balance Scale'
    ])
  }
];

const PAGE_CONTENT = [
  {
    page_key: 'about',
    key: 'about_intro',
    content: {
      heading: 'Our Mission & Philosophy',
      paragraphs: [
        'THERAKids Foundation – Child Development Centre is a leading multidisciplinary organization dedicated to providing high-quality therapy services for children facing developmental, sensory, cognitive, and physical challenges.',
        'We are committed to creating an environment where every child receives specialized care tailored to their unique needs. With a strong emphasis on early intervention and a structured therapeutic approach, we work closely with children and their families to enhance their abilities, promote independence, and improve their overall quality of life.'
      ]
    }
  },
  {
    page_key: 'about',
    key: 'about_values',
    content: {
      items: [
        { title: 'Equipping for Independence', text: 'Our mission is to equip children with the necessary skills to develop independence, confidence, and convenience in their daily lives.' },
        { title: 'Nurturing Environment', text: 'We aim to create a safe, motivated, and encouraging space where children overcome challenges and celebrate every small milestone as a big achievement.' },
        { title: 'Empowering Families', text: 'Therapy is not just about intervention; it is about empowering children and their parents to navigate daily life with greater ease and success.' }
      ]
    }
  }
];

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
    await pool.query('DELETE FROM process_steps');
    await pool.query(
      'INSERT INTO process_steps (step, title, description, image, tone, display_order, is_active) VALUES ?',
      [PROCESS_STEPS.map((s, i) => [s.step, s.title, s.description, s.image, s.tone, i + 1, 1])]
    );

    await pool.query('DELETE FROM conditions_data');
    await pool.query(
      'INSERT INTO conditions_data (name, short_name, description, focus_areas, image, display_order, is_active) VALUES ?',
      [CONDITIONS.map((c, i) => [c.name, c.short_name, c.description, JSON.stringify(c.focus_areas), c.image, i + 1, 1])]
    );

    await pool.query('DELETE FROM founders');
    await pool.query(
      'INSERT INTO founders (name, role, title_line, subtitle_line, profile_image, paragraphs, closing_line, display_order, is_active) VALUES ?',
      [FOUNDERS.map((f, i) => [f.name, f.role, f.title_line, f.subtitle_line || null, f.profile_image, JSON.stringify(f.paragraphs), f.closing_line, i + 1, 1])]
    );

    // page_content backs the About mission/values (generic key/value JSON blocks).
    // Created here so the seed script is self-sufficient on a fresh database.
    await pool.query(`CREATE TABLE IF NOT EXISTS page_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      page_key VARCHAR(100) NOT NULL,
      \`key\` VARCHAR(100) NOT NULL,
      content JSON NOT NULL,
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      UNIQUE KEY uq_page_key (page_key, \`key\`)
    )`);
    await pool.query("DELETE FROM page_content WHERE page_key = 'about'");
    await pool.query(
      'INSERT INTO page_content (page_key, `key`, content, display_order, is_active) VALUES ?',
      [PAGE_CONTENT.map((p, i) => [p.page_key, p.key, JSON.stringify(p.content), i + 1, 1])]
    );

    // Home page FAQs (page_key='home' drives the Home accordion)
    await pool.query("DELETE FROM faqs WHERE page_key = 'home'");
    await pool.query(
      'INSERT INTO faqs (page_key, question, answer, display_order, is_active) VALUES ?',
      [HOME_FAQS.map((f, i) => ['home', f.question, f.answer, i + 1, 1])]
    );

    // Services page "Comprehensive Assessments" cards live in the faqs table under
    // page_key='assessments': rows alternate heading row (answer = JSON array of
    // bullets) → bullet-list row; the page pairs adjacent rows. Only the Services
    // page queries this key, so the rows never surface as public FAQs.
    await pool.query("DELETE FROM faqs WHERE page_key = 'assessments'");
    await pool.query(
      'INSERT INTO faqs (page_key, question, answer, display_order, is_active) VALUES ?',
      [ASSESSMENT_FAQS.map((f, i) => ['assessments', f.question, f.answer, i + 1, 1])]
    );

    const [[p], [c], [f], [pc]] = await Promise.all([
      pool.query('SELECT COUNT(*) AS n FROM process_steps'),
      pool.query('SELECT COUNT(*) AS n FROM conditions_data'),
      pool.query('SELECT COUNT(*) AS n FROM founders'),
      pool.query("SELECT COUNT(*) AS n FROM page_content WHERE page_key = 'about'")
    ]);
    console.log(`Seeded: ${p[0].n} process steps, ${c[0].n} conditions, ${f[0].n} founders, ${pc[0].n} about content blocks, ${ASSESSMENT_FAQS.length} assessment rows.`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
