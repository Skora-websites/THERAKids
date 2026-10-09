/* Researched keyword sets (Sep 2026) — from the live search landscape for
 * pediatric therapy in Noida / Greater Noida West / Delhi NCR: competitors rank
 * with "for kids/children" phrasing, "best/near me" modifiers, the Greater
 * Noida West geo term (a Google related-search for the brand itself), and
 * condition-level queries (speech delay, autism, ADHD, sensory processing).
 *
 * Used as fallbacks when the admin SEO row / DB meta fields are empty — admin
 * values always win when present. */

/* Site-wide default (index.html baseline); the highest-intent local terms. */
export const SITE_KEYWORDS = [
  'occupational therapy noida',
  'speech therapy for kids noida',
  'pediatric therapy noida',
  'child development center noida',
  'autism therapy for kids noida',
  'adhd treatment for children delhi ncr',
  'speech delay therapy noida',
  'early intervention for toddlers noida',
  'special education noida',
  'best child therapist near me',
  'therapy center greater noida west',
  'therakids',
].join(', ');

/* Condition-level queries parents actually type (Conditions We Treat page). */
export const CONDITION_KEYWORDS = [
  'autism therapy for kids noida',
  'adhd treatment for children noida',
  'sensory processing disorder therapy',
  'speech delay in toddlers',
  'developmental delay treatment noida',
  'cerebral palsy therapy for kids',
  'down syndrome support noida',
  'learning disability help delhi ncr',
  'signs of autism in toddlers',
].join(', ');

/* Blog listing — informational intent (guides, milestones, activities). */
export const BLOG_KEYWORDS = [
  'child development blog india',
  'speech delay signs in toddlers',
  'occupational therapy activities at home',
  'sensory processing tips for parents',
  'speech milestones for toddlers',
  'therapy milestones kids',
  'parenting tips child development',
].join(', ');

/* Per-service fallbacks keyed by slug — applied when the service row in the DB
 * has no meta_keywords of its own. */
export const SERVICE_KEYWORDS = {
  'occupational-therapy':
    'occupational therapy for kids noida, pediatric occupational therapist noida, ot for children delhi ncr, sensory integration therapy noida, fine motor skills therapy kids',
  'speech-therapy':
    'speech therapy for kids noida, speech therapist for children noida, speech delay treatment noida, stuttering therapy for kids delhi ncr, language development therapy',
  'physiotherapy-paeds':
    'pediatric physiotherapy noida, physiotherapy for children noida, kids physical therapy delhi ncr, gross motor delay therapy toddlers',
  counseling:
    'child counseling noida, child psychologist for kids noida, behavioral counseling for children delhi ncr, emotional regulation therapy kids',
  'early-intervention':
    'early intervention noida, developmental delay therapy for toddlers, early intervention program delhi ncr, toddler milestones therapy',
  'special-education':
    'special education for kids noida, learning disability support noida, remedial teaching for children, special educator delhi ncr',
  'behaviour-modification':
    'behavior therapy for children noida, child behavior modification therapy, adhd behavior therapy delhi ncr, tantrum and aggression therapy kids',
  'psychological-assessment':
    'child psychological assessment noida, autism assessment for kids noida, developmental assessment delhi ncr, iq assessment for children',
  'social-group-training':
    'social skills training for kids noida, social group therapy for children, play therapy groups delhi ncr, peer interaction therapy kids',
  'parent-training':
    'parent training programs noida, parenting support for child development, parent coaching therapy delhi ncr',
  'brain-gym-therapy':
    'brain gym therapy noida, brain gym exercises for kids, cognitive development activities children, brain gym delhi ncr',
  reviews:
    'therakids reviews, therapy center reviews noida, parent testimonials therakids',
};

/* Fallback for any service slug without a curated set above. */
export const genericServiceKeywords = (name) =>
  [`${name} for kids noida`, `${name} therapy noida`, `${name} for children delhi ncr`, 'pediatric therapy noida'].join(', ');

/* Generic fallback for blog posts without DB keywords. */
export const BLOG_POST_KEYWORDS_FALLBACK =
  'child development guide, therapy for kids india, pediatric therapy noida, parenting support delhi ncr';

/* Per-service meta title + description fallbacks (researched, ≤60/≤160 chars).
 * Used when the service row has no meta_title/meta_description of its own; DB
 * values win. Mirrors the seed UPDATE in server/scripts/seed-service-meta.js. */
export const SERVICE_META = {
  'occupational-therapy': {
    title: 'Occupational Therapy for Kids in Noida | TheraKids',
    description:
      'Evidence-based occupational therapy for children in Noida — sensory integration, fine motor skills, and daily living skills by certified pediatric OTs.',
  },
  'speech-therapy': {
    title: 'Speech Therapy for Kids in Noida | TheraKids',
    description:
      'Speech therapy for kids in Noida by certified SLPs — speech delay, stuttering, articulation and language development support for toddlers and children.',
  },
  'physiotherapy-paeds': {
    title: 'Pediatric Physiotherapy in Noida | TheraKids',
    description:
      'Pediatric physiotherapy in Noida for gross motor delays, cerebral palsy, torticollis and injury rehab — gentle, play-based physical therapy for kids.',
  },
  counseling: {
    title: 'Child Counseling & Psychology in Noida | TheraKids',
    description:
      'Child counseling in Noida for anxiety, emotional regulation and behavioral concerns — compassionate child psychologists your family can trust.',
  },
  'early-intervention': {
    title: 'Early Intervention for Toddlers in Noida | TheraKids',
    description:
      'Early intervention for toddlers in Noida — developmental delay therapy that builds milestones in the critical first years. Book a screening today.',
  },
  'special-education': {
    title: 'Special Education for Kids in Noida | TheraKids',
    description:
      'Special education support in Noida for learning disabilities, ADHD and school readiness — individualized remedial plans by trained special educators.',
  },
  'behaviour-modification': {
    title: 'Behavior Therapy for Children in Noida | TheraKids',
    description:
      'Behavior therapy for children in Noida — ADHD, tantrums, aggression and social behavior support using evidence-based behavior modification.',
  },
  'psychological-assessment': {
    title: 'Child Psychological Assessment in Noida | TheraKids',
    description:
      'Comprehensive child psychological assessments in Noida — autism, ADHD, developmental and IQ testing with clear, parent-friendly reports.',
  },
  'social-group-training': {
    title: 'Social Skills Training for Kids in Noida | TheraKids',
    description:
      'Social skills group training for kids in Noida — structured play-based groups that build communication, sharing and friendship skills.',
  },
  'parent-training': {
    title: 'Parent Training & Support Programs in Noida | TheraKids',
    description:
      "Parent training programs in Noida — practical coaching to support your child's therapy goals at home, from toddlers to school-age children.",
  },
  'brain-gym-therapy': {
    title: 'Brain Gym Therapy for Kids in Noida | TheraKids',
    description:
      'Brain Gym therapy for kids in Noida — movement-based exercises that support focus, learning readiness and cognitive development.',
  },
  reviews: {
    title: 'TheraKids Reviews | Parent Testimonials Noida',
    description:
      'Read what parents say about TheraKids Noida — real testimonials from families whose children found their path with our therapy programs.',
  },
};
