/**
 * One-shot sync: makes the services table match the clinic's official list.
 *
 * Official 12 (from the THERAKids Foundation brochure):
 *   Occupational Therapy, Physiotherapy (Paeds), Special Education, Speech Therapy,
 *   Social Group Training, Early Intervention, Psychological Assessment, Reviews,
 *   Counseling, Parent Training, Behaviour Modification, Brain Gym Therapy
 *
 * Strategy (safe to re-run - every statement is idempotent):
 *   - Repurpose 3 existing rows (keeps their ids / display_order slots):
 *       ABA Therapy              -> Physiotherapy (Paeds)  [slug: physiotherapy-paeds]
 *       Parents&Child Counselling-> Counseling              [slug: counseling]
 *       Pre-Vocational Training  -> Early Intervention     [slug: early-intervention]
 *   - Update 2 existing rows in place:
 *       Occupational Therapy, Speech Therapy, Special Education, Social Group
 *       Training, Behaviour Modification (descriptions refreshed)
 *   - Insert the 6 missing services (upsert by slug):
 *       Psychological Assessment, Reviews, Parent Training, Brain Gym Therapy,
 *       Early Intervention (if no row was repurposed), Physiotherapy (Paeds)
 *   - Deactivate anything not on the official list (never delete - admin content
 *       and appointment history may reference those rows):
 *       aba-therapy, parents-child-counselling, pre-vocational-training, physical-therapy
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

// Official list, in brochure order
const OFFICIAL = [
  { key: 'occupational-therapy',     name: 'Occupational Therapy',      short: 'Building fine motor, sensory, and daily-living skills for independence.', full: 'Occupational therapy helps children develop the fine motor, sensory processing, and visual motor skills needed for everyday activities like dressing, writing, and playing. Our occupational therapists keep records of every child\'s improvement and tailor each session to the child\'s unique potential.' },
  { key: 'physiotherapy-paeds',      name: 'Physiotherapy (Paeds)',     short: 'Strength, balance, and movement, helping kids explore the world with confidence.', full: 'Our paediatric physiotherapists help children overcome physical challenges through stretching, running, jumping, and targeted exercise, improving strength, balance, coordination, and ease of movement, including support for conditions related to genetics, orthopaedic disorders, and walking disorders.' },
  { key: 'special-education',        name: 'Special Education',         short: 'Tailored educational support for literacy, numeracy, and school readiness.', full: 'Our remedial intervention helps children learn to read, write, and do calculations in a specialized environment with small group sizes, keeping every child\'s studies on track with strict attention to their progress.' },
  { key: 'speech-therapy',           name: 'Speech Therapy',            short: 'Developing strong communication, articulation, and language skills.', full: 'Our speech-language pathologists support children in developing strong communication skills: articulation, receptive and expressive language, social pragmatic skills, and even feeding and swallowing support, so children can express themselves and connect with society confidently.' },
  { key: 'social-group-training',    name: 'Social Group Training',     short: 'Structured group sessions building peer interaction and play skills.', full: 'Structured group sessions that help children prepare for academic and social settings, focusing on peer interaction, turn-taking, and play skills. Children learn to interact with others, develop friendships, and build social confidence for school and community settings.' },
  { key: 'early-intervention',       name: 'Early Intervention',        short: 'Targeted support in the earliest years, when progress matters most.', full: 'Early intervention identifies and supports developmental delays as early as possible. The sooner we can assess and begin working with a child, the better the outcomes. Our team builds play-based, individualized programs for infants and toddlers across all developmental domains.' },
  { key: 'psychological-assessment', name: 'Psychological Assessment',  short: 'Comprehensive cognitive, developmental, and behavioural evaluations.', full: 'Standardized psychological assessments help identify a child\'s cognitive profile, developmental level, learning needs, and behavioural concerns. The results become the foundation for an accurate diagnosis and a personalized therapy plan.' },
  { key: 'reviews',                  name: 'Reviews',                   short: 'Regular follow-up reviews to track progress and refine each plan.', full: 'Therapy is a journey, and progress deserves measurement. Our periodic review sessions re-assess each child\'s goals, celebrate milestones, and adjust the therapy plan so it always matches the child\'s current needs.' },
  { key: 'counseling',               name: 'Counseling',                short: 'Gentle guidance and emotional support for children and parents.', full: 'Counselling gives children and parents a safe space to express difficulties and build confidence. We provide dedicated counselling sessions for families to navigate the challenges of raising a child with developmental needs.' },
  { key: 'parent-training',          name: 'Parent Training',           short: 'Equipping parents with practical strategies for everyday progress.', full: 'Parents are a child\'s first and most important teachers. Our parent-training sessions share practical, evidence-based strategies for supporting therapy goals at home, turning daily routines into opportunities for progress.' },
  { key: 'behaviour-modification',   name: 'Behaviour Modification',    short: 'Supporting emotional regulation and positive coping strategies.', full: 'We utilize evidence-based approaches to support children with emotional regulation, transitions, and developing positive coping mechanisms. Our therapists work to understand the root causes of behavioural challenges and develop customized intervention plans.' },
  { key: 'brain-gym-therapy',        name: 'Brain Gym Therapy',         short: 'Movement-based exercises that prime the brain for learning.', full: 'Brain Gym uses playful, purposeful movement to improve focus, memory, coordination, and learning readiness. These gentle exercises help children organize their nervous systems and engage more fully in therapy and schoolwork.' }
];

const IMAGES = {
  'occupational-therapy': '/images/services/occupational-therapy.jpg',
  'physiotherapy-paeds': '/images/services/physiotherapy-paeds.jpg',
  'special-education': '/images/services/special-education.jpg',
  'speech-therapy': '/images/services/speech-therapy.jpg',
  'social-group-training': '/images/services/social-group-training.jpg',
  'early-intervention': '/images/services/early-intervention.jpg',
  'psychological-assessment': '/images/services/psychological-assessment.jpg',
  'reviews': '/images/services/reviews.jpg',
  'counseling': '/images/services/counseling.jpg',
  'parent-training': '/images/services/parent-training.jpg',
  'behaviour-modification': '/images/services/behaviour-modification.jpg',
  'brain-gym-therapy': '/images/services/brain-gym-therapy.jpg'
};

const BENEFITS = {
  'occupational-therapy': ['Fine motor skill development', 'Sensory regulation strategies', 'Self-care independence (dressing, feeding)', 'Hand-eye coordination'],
  'physiotherapy-paeds': ['Mobility improvement', 'Muscle strengthening', 'Balance and coordination', 'Walking and running support', 'Orthopaedic rehabilitation'],
  'special-education': ['Individualized Education Plans', 'Literacy and numeracy support', 'Cognitive skill building', 'School readiness'],
  'speech-therapy': ['Articulation and pronunciation', 'Receptive and expressive language', 'Social communication (pragmatics)', 'Stuttering and fluency support'],
  'social-group-training': ['Peer interaction', 'Turn-taking and sharing', 'Group participation', 'Building friendships'],
  'early-intervention': ['Early detection of delays', 'Play-based developmental support', 'Parent coaching from day one', 'Stronger long-term outcomes'],
  'psychological-assessment': ['Cognitive and developmental profiling', 'Learning-need identification', 'Behavioural evaluation', 'Foundation for therapy planning'],
  'reviews': ['Goal tracking and milestones', 'Plan refinement over time', 'Objective progress measures', 'Family progress reports'],
  'counseling': ['Emotional support and guidance', 'Confidence building', 'Parent education and support', 'Coping strategies for caregivers'],
  'parent-training': ['Practical home strategies', 'Routine-based learning', 'Consistency across settings', 'Caregiver empowerment'],
  'behaviour-modification': ['Emotional regulation techniques', 'Managing transitions and routines', 'Reducing anxiety', 'Positive reinforcement strategies'],
  'brain-gym-therapy': ['Focus and attention', 'Memory and coordination', 'Learning readiness', 'Nervous-system organization']
};

// Slug aliases: any legacy row whose slug matches here is renamed onto the official key
const RENAMES = {
  'physical-therapy': 'physiotherapy-paeds',
  'aba-therapy': 'physiotherapy-paeds',
  'parents-child-counselling': 'counseling',
  'pre-vocational-training': 'early-intervention'
};

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'thera_kids',
    connectionLimit: 5
  });

  // 0. Canonicalize legacy slugs so "renames" are pure UPDATEs (ids preserved)
  for (const [oldSlug, newSlug] of Object.entries(RENAMES)) {
    const [legacy] = await pool.query('SELECT id FROM services WHERE slug = ? LIMIT 1', [oldSlug]);
    const [target] = await pool.query('SELECT id FROM services WHERE slug = ? LIMIT 1', [newSlug]);
    if (legacy.length && !target.length) {
      await pool.query('UPDATE services SET slug = ? WHERE id = ?', [newSlug, legacy[0].id]);
      console.log(`renamed: ${oldSlug} -> ${newSlug} (id ${legacy[0].id})`);
    }
  }

  // 1. Upsert every official service, in brochure order
  let i = 0;
  for (const svc of OFFICIAL) {
    i += 1;
    const benefits = JSON.stringify(BENEFITS[svc.key] || []);
    const [existing] = await pool.query('SELECT id FROM services WHERE slug = ? LIMIT 1', [svc.key]);
    if (existing.length) {
      await pool.query(
        `UPDATE services SET name = ?, short_description = ?, full_description = ?, image = ?, benefits = ?, display_order = ?, is_active = 1 WHERE id = ?`,
        [svc.name, svc.short, svc.full, IMAGES[svc.key], benefits, i, existing[0].id]
      );
      console.log(`updated: ${svc.name} (id ${existing[0].id})`);
    } else {
      const [res] = await pool.query(
        `INSERT INTO services (name, slug, short_description, full_description, image, benefits, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [svc.name, svc.key, svc.short, svc.full, IMAGES[svc.key], benefits, i]
      );
      console.log(`inserted: ${svc.name} (id ${res.insertId})`);
    }
  }

  // 2. Deactivate anything not on the official list (never delete)
  const officialSlugs = OFFICIAL.map((s) => s.key);
  const [all] = await pool.query('SELECT id, slug FROM services');
  for (const row of all) {
    if (!officialSlugs.includes(row.slug)) {
      await pool.query('UPDATE services SET is_active = 0 WHERE id = ?', [row.id]);
      console.log(`deactivated (not on official list): ${row.slug} (id ${row.id})`);
    }
  }

  // 3. Report
  const [rows] = await pool.query('SELECT id, name, slug, display_order, is_active FROM services ORDER BY is_active DESC, display_order, id');
  console.table(rows);
  const [active] = await pool.query('SELECT COUNT(*) AS n FROM services WHERE is_active = 1');
  console.log(`\nActive services: ${active[0].n} (expected ${OFFICIAL.length})`);
  await pool.end();
  if (active[0].n !== OFFICIAL.length) {
    console.error('COUNT MISMATCH: investigate before deploying.');
    process.exit(1);
  }
})().catch((e) => {
  console.error('SYNC FAILED:', e.message);
  process.exit(1);
});
