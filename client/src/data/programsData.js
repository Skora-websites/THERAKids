// Static data for the Programs page (/programs) and the shared sections it
// feeds (testimonials on Services/Conditions). The certification syllabus and
// the parent testimonials are OFFICIAL content taken from the client's own
// documents; job openings stay placeholder data until the admin panel takes over.

/* ------------------------------------------------------------------ */
/* Certification program                                               */
/* ------------------------------------------------------------------ */

export const CERTIFICATION = {
  name: 'Academic Certification in Child Therapy',
  duration: '6 months',
  format: 'Offline (In-Person)',
  intro:
    'A structured, mentor-led path from child-development theory to supervised clinical practice — taught offline at our Noida centre. This page lists the official syllabus: five modules, week by week; schedules and fees are shared on request.',
  benefits: [
    'Industry-recognized certification',
    'Hands-on experience with real cases',
    'Mentorship from experienced therapists',
    'Job placement assistance',
    'Continuing education credits',
    'Access to professional network',
  ],
  // OFFICIAL syllabus (client course document) — titles, topics and durations
  // are published exactly as given. The website shows the syllabus only; there
  // are no downloadable module resources.
  modules: [
    {
      title: 'Foundations of Child Development',
      duration: '4 weeks',
      topics: ['Developmental Milestones & Domains', 'Typical vs. Atypical Development', 'Developmental Delays & Early Concerns'],
    },
    {
      title: 'Developmental Disorders & Therapeutic Approaches',
      duration: '5 weeks',
      topics: ['Autism, ADHD & Intellectual Disability', 'Learning & Developmental Difficulties', 'Behavioural Concerns & Therapeutic Approaches'],
    },
    {
      title: 'Assessment, Behaviour & Intervention Planning',
      duration: '4 weeks',
      topics: ['Developmental & Behavioural Assessment', 'Assessment Tools & Observation', 'Goal Setting & Intervention Planning', 'Documentation & Progress Tracking'],
    },
    {
      title: 'Parent Training & Family-Centred Practice',
      duration: '3 weeks',
      topics: ['Parent Counselling & Psychoeducation', 'Parent Training Strategies', 'Home-Based Behaviour Support', 'Generalization Across Settings'],
    },
    {
      title: 'Practical Training & Supervised Case Work',
      duration: '8 weeks',
      topics: ['Case Observation & Session Planning', 'Therapeutic & Behavioural Techniques', 'Case Discussion & Documentation', 'Supervised Hands-on Practice'],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Internship program                                                  */
/* ------------------------------------------------------------------ */

export const INTERNSHIP = {
  title: 'THERAKids Internship Program',
  duration: '3–6 months',
  intro:
    'Step into a working multidisciplinary clinic: observe, assist and grow under certified therapists across every domain we practice.',
  domains: [
    'Occupational Therapy',
    'Speech & Language Therapy',
    'ABA',
    'Special Education',
    'Psychology & Counseling',
    'Program Administration',
  ],
  benefits: [
    'Real-world clinical experience',
    'Direct supervision by certified professionals',
    'Exposure to multidisciplinary teamwork',
    'Professional skill development',
    'Networking opportunities',
    'Potential for full-time employment',
  ],
};

/* ------------------------------------------------------------------ */
/* Official parent testimonials (client "THERAKids — Parent & Child     */
/* Progress" document). Rendered by CaseStories on the Services &       */
/* Conditions pages.                                                     */
/* ------------------------------------------------------------------ */

export const PARENT_TESTIMONIALS = [
  {
    id: 'ishan',
    video: 'https://youtube.com/shorts/5FNy5lpwxtY?si=f9Z4fKmnysrAEQ9a',
    childName: 'Ishan',
    parentName: 'Seema',
    concern: 'ADHD & ASD',
    progress: 'Overall improvement',
  },
  {
    id: 'speech-ot',
    video: 'https://youtube.com/shorts/J5reXEXfoJY?si=vzwZmIqpyRJTITQE',
    childName: '', // not mentioned in the document
    parentName: '',
    concern: 'Speech & Communication Difficulties + Occupational Therapy Needs',
    progress: 'Improvement in OT skills and speech/communication abilities',
  },
  {
    id: 'response-commands',
    video: 'https://youtube.com/shorts/eUyFc-3ECVA?si=Z3H3Dr8s2WmssM8P',
    childName: '', // not mentioned in the document
    parentName: '',
    concern: 'Difficulty with response, following commands, and other developmental skills',
    progress: 'Significant improvement in name response and command following',
  },
];

/* "Parents review" links from the same document (open externally). */
export const PARENT_REVIEW_LINKS = [
  'https://share.google/P5Js4P6puAJpwlEo2',
  'https://share.google/menz1oDIvSdsppG7D',
];

/* ------------------------------------------------------------------ */
/* Careers — job openings (DUMMY data until admin panel arrives)       */
/* ------------------------------------------------------------------ */

export const JOB_OPENINGS = [
  {
    id: 1,
    title: 'Occupational Therapist',
    department: 'Therapy',
    location: 'Noida',
    type: 'Full-time',
    experience: '1+ year',
    description:
      'Lead a varied pediatric OT caseload — sensory integration, fine-motor and self-care programs — while mentoring juniors.',
    requirements: [
      'BOT with recognized certification',
      '1+ year pediatric experience',
      'Sensory integration training preferred',
    ],
  },
  {
    id: 2,
    title: 'Speech Language Pathologist',
    department: 'Therapy',
    location: 'Greater Noida West',
    type: 'Full-time',
    experience: '1+ year',
    description:
      'Design and deliver speech-language intervention for children with delays, autism and apraxia, in clinic and via parent coaching.',
    requirements: [
      'MASLP / BASLP qualification',
      '1+ year pediatric practice',
      'Experience with AAC a plus',
    ],
  },
  {
    id: 3,
    title: 'Special Educator',
    department: 'Education',
    location: 'Both Centers',
    type: 'Full-time',
    experience: '1+ year',
    description:
      'Build individualized education plans and work closely with therapists so every child’s school skills keep pace with therapy goals.',
    requirements: [
      'B.Ed (Special Education)',
      '1+ year with diverse learners',
      'Familiarity with IEP frameworks',
    ],
  },
  {
    id: 4,
    title: 'ABA Therapist',
    department: 'Therapy',
    location: 'Noida',
    type: 'Full-time',
    experience: '1+ year',
    description:
      'Implement 1:1 ABA programs — skill acquisition and behavior-reduction plans — under BCBA-supervised case direction.',
    requirements: [
      'Psychology / ABA background',
      '1+ year working with autistic children',
      'Data-driven and patient approach',
    ],
  },
  {
    id: 5,
    title: 'Clinical Psychologist',
    department: 'Assessment',
    location: 'Both Centers',
    type: 'Part-time',
    experience: '1+ year',
    description:
      'Conduct developmental and psycho-educational assessments, score and interpret standardized tools, and guide families through findings.',
    requirements: [
      'M.Phil / MA Clinical Psychology',
      '1+ year child assessment experience',
      'Strong report-writing skills',
    ],
  },
  {
    id: 6,
    title: 'Coordinator',
    department: 'Operations',
    location: 'Noida',
    type: 'Full-time',
    experience: '1+ year',
    description:
      'Keep the clinic humming — scheduling, parent communication, vendor and event coordination across both centers.',
    requirements: [
      'Any graduation; admin experience valued',
      '1+ year coordination role',
      'Warm, organized communicator',
    ],
  },
];

export const JOB_FORM_POSITIONS = JOB_OPENINGS.map((j) => j.title).concat([
  'Internship',
  'Certification Program',
  'Other',
]);
