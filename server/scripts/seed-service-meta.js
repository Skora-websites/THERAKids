/* One-shot: fills meta_title / meta_keywords / meta_description for all 12
 * services from the researched keyword sets (client/src/lib/seoKeywords.js is
 * the source of truth for the keyword strings). Only updates rows where the
 * field is empty, so admin-edited values are never overwritten.
 *
 * Run: node server/scripts/seed-service-meta.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

const META = {
  'occupational-therapy': {
    title: 'Occupational Therapy for Kids in Noida | TheraKids',
    keywords:
      'occupational therapy for kids noida, pediatric occupational therapist noida, ot for children delhi ncr, sensory integration therapy noida, fine motor skills therapy kids',
    description:
      'Evidence-based occupational therapy for children in Noida — sensory integration, fine motor skills, and daily living skills by certified pediatric OTs.',
  },
  'speech-therapy': {
    title: 'Speech Therapy for Kids in Noida | TheraKids',
    keywords:
      'speech therapy for kids noida, speech therapist for children noida, speech delay treatment noida, stuttering therapy for kids delhi ncr, language development therapy',
    description:
      'Speech therapy for kids in Noida by certified SLPs — speech delay, stuttering, articulation and language development support for toddlers and children.',
  },
  'physiotherapy-paeds': {
    title: 'Pediatric Physiotherapy in Noida | TheraKids',
    keywords:
      'pediatric physiotherapy noida, physiotherapy for children noida, kids physical therapy delhi ncr, gross motor delay therapy toddlers',
    description:
      'Pediatric physiotherapy in Noida for gross motor delays, cerebral palsy, torticollis and injury rehab — gentle, play-based physical therapy for kids.',
  },
  counseling: {
    title: 'Child Counseling & Psychology in Noida | TheraKids',
    keywords:
      'child counseling noida, child psychologist for kids noida, behavioral counseling for children delhi ncr, emotional regulation therapy kids',
    description:
      'Child counseling in Noida for anxiety, emotional regulation and behavioral concerns — compassionate child psychologists your family can trust.',
  },
  'early-intervention': {
    title: 'Early Intervention for Toddlers in Noida | TheraKids',
    keywords:
      'early intervention noida, developmental delay therapy for toddlers, early intervention program delhi ncr, toddler milestones therapy',
    description:
      'Early intervention for toddlers in Noida — developmental delay therapy that builds milestones in the critical first years. Book a screening today.',
  },
  'special-education': {
    title: 'Special Education for Kids in Noida | TheraKids',
    keywords:
      'special education for kids noida, learning disability support noida, remedial teaching for children, special educator delhi ncr',
    description:
      'Special education support in Noida for learning disabilities, ADHD and school readiness — individualized remedial plans by trained special educators.',
  },
  'behaviour-modification': {
    title: 'Behavior Therapy for Children in Noida | TheraKids',
    keywords:
      'behavior therapy for children noida, child behavior modification therapy, adhd behavior therapy delhi ncr, tantrum and aggression therapy kids',
    description:
      'Behavior therapy for children in Noida — ADHD, tantrums, aggression and social behavior support using evidence-based behavior modification.',
  },
  'psychological-assessment': {
    title: 'Child Psychological Assessment in Noida | TheraKids',
    keywords:
      'child psychological assessment noida, autism assessment for kids noida, developmental assessment delhi ncr, iq assessment for children',
    description:
      'Comprehensive child psychological assessments in Noida — autism, ADHD, developmental and IQ testing with clear, parent-friendly reports.',
  },
  'social-group-training': {
    title: 'Social Skills Training for Kids in Noida | TheraKids',
    keywords:
      'social skills training for kids noida, social group therapy for children, play therapy groups delhi ncr, peer interaction therapy kids',
    description:
      'Social skills group training for kids in Noida — structured play-based groups that build communication, sharing and friendship skills.',
  },
  'parent-training': {
    title: 'Parent Training & Support Programs in Noida | TheraKids',
    keywords:
      'parent training programs noida, parenting support for child development, parent coaching therapy delhi ncr',
    description:
      "Parent training programs in Noida — practical coaching to support your child's therapy goals at home, from toddlers to school-age children.",
  },
  'brain-gym-therapy': {
    title: 'Brain Gym Therapy for Kids in Noida | TheraKids',
    keywords:
      'brain gym therapy noida, brain gym exercises for kids, cognitive development activities children, brain gym delhi ncr',
    description:
      'Brain Gym therapy for kids in Noida — movement-based exercises that support focus, learning readiness and cognitive development.',
  },
  reviews: {
    title: 'TheraKids Reviews | Parent Testimonials Noida',
    keywords: 'therakids reviews, therapy center reviews noida, parent testimonials therakids',
    description:
      'Read what parents say about TheraKids Noida — real testimonials from families whose children found their path with our therapy programs.',
  },
};

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'thera_kids',
  });

  let updated = 0;
  let skipped = 0;
  for (const [slug, meta] of Object.entries(META)) {
    const [result] = await pool.query(
      `UPDATE services
         SET meta_title = IF(meta_title IS NULL OR meta_title = '', ?, meta_title),
             meta_keywords = IF(meta_keywords IS NULL OR meta_keywords = '', ?, meta_keywords),
             meta_description = IF(meta_description IS NULL OR meta_description = '', ?, meta_description)
       WHERE slug = ?`,
      [meta.title, meta.keywords, meta.description, slug]
    );
    if (result.affectedRows > 0) updated += 1;
    else skipped += 1;
  }

  const [rows] = await pool.query(
    "SELECT slug, LEFT(meta_title, 45) AS meta_title FROM services WHERE meta_title IS NOT NULL AND meta_title != ''"
  );
  console.log(`Updated ${updated} services, skipped ${skipped} (slug not found).`);
  console.log(rows.map((r) => `  ${r.slug}: ${r.meta_title}`).join('\n'));
  await pool.end();
})().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
