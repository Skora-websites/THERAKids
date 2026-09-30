// Static placeholder data for the Programs page (/programs).
// Shaped to mirror future DB rows so the admin panel can take over later;
// all content is dummy for now.

/* ------------------------------------------------------------------ */
/* Certification program                                               */
/* ------------------------------------------------------------------ */

export const CERTIFICATION = {
  name: 'Academic Certification in Child Therapy',
  duration: '6 months',
  format: 'Hybrid (Online + Hands-on)',
  intro:
    'A structured, mentor-led path from child-development theory to supervised clinical practice — designed for aspiring child therapists.',
  benefits: [
    'Industry-recognized certification',
    'Hands-on experience with real cases',
    'Mentorship from experienced therapists',
    'Job placement assistance',
    'Continuing education credits',
    'Access to professional network',
  ],
  // Each module carries its own resources — they expand inline under the
  // module card (user decision: no separate filterable resource list).
  modules: [
    {
      title: 'Foundations of Child Development',
      duration: '4 weeks',
      topics: ['Typical vs Atypical Development', 'Developmental Milestones', 'Assessment Principles'],
      resources: [
        { title: 'Milestone Charts Library', type: 'PDF Guides' },
        { title: 'Observation Checklists', type: 'Worksheet' },
        { title: 'Case Walkthrough: Reading Development Red Flags', type: 'Video' },
      ],
    },
    {
      title: 'Therapeutic Approaches',
      duration: '6 weeks',
      topics: ['OT Basics', 'Speech Therapy Fundamentals', 'Behavioral Interventions'],
      resources: [
        { title: 'Intro to Sensory Integration', type: 'Video' },
        { title: 'Speech Stimulation Activities Handbook', type: 'PDF Guide' },
        { title: 'Behavior Intervention Plan Templates', type: 'Templates' },
      ],
    },
    {
      title: 'Assessment & Documentation',
      duration: '4 weeks',
      topics: ['Standardized Assessments', 'Progress Monitoring', 'Report Writing'],
      resources: [
        { title: 'Assessment Tools Library', type: 'Tool Library' },
        { title: 'Progress Tracking Sheets', type: 'Templates' },
        { title: 'Sample Reports & Scoring Rubrics', type: 'Worksheet' },
      ],
    },
    {
      title: 'Family-Centered Practice',
      duration: '3 weeks',
      topics: ['Parent Counseling', 'Home Programs', 'Cultural Sensitivity'],
      resources: [
        { title: 'Parent Counseling Scripts', type: 'Worksheet' },
        { title: 'Home Program Builder', type: 'Templates' },
        { title: 'Case Walkthrough: Building Trust with Families', type: 'Video' },
      ],
    },
    {
      title: 'Hands-on Practicum',
      duration: '8 weeks',
      topics: ['Supervised Clinical Experience', 'Case Studies', 'Professional Ethics'],
      resources: [
        { title: 'Practicum Handbook', type: 'PDF Guide' },
        { title: 'Case Study Archive', type: 'Worksheet' },
        { title: 'Ethics & Consent Checklist', type: 'Worksheet' },
      ],
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
/* Workshops                                                           */
/* ------------------------------------------------------------------ */

export const WORKSHOPS = [
  {
    title: 'Sensory Integration Workshop',
    duration: '2 days',
    audience: 'Therapists & Educators',
    description: 'Comprehensive training on sensory processing and integration techniques.',
  },
  {
    title: 'Parent Training Series',
    duration: '4 weeks',
    audience: 'Parents & Caregivers',
    description: 'Practical strategies for supporting child development at home.',
  },
  {
    title: 'ABA Fundamentals',
    duration: '3 days',
    audience: 'Professionals',
    description: 'Introduction to Applied Behavior Analysis principles and practices.',
  },
  {
    title: 'Communication Strategies',
    duration: '1 day',
    audience: 'Parents & Teachers',
    description: 'Effective communication techniques for children with special needs.',
  },
  {
    title: 'Assessment & Documentation',
    duration: '2 days',
    audience: 'Therapists',
    description: 'Best practices in assessment tools and progress documentation.',
  },
  {
    title: 'Inclusive Education',
    duration: '1 day',
    audience: 'Educators',
    description: 'Creating inclusive classroom environments for all learners.',
  },
];

/* ------------------------------------------------------------------ */
/* Resources hub (integrated from the reference /resources page)       */
/* ------------------------------------------------------------------ */

export const VIDEO_GROUPS = [
  {
    group: 'Live Sessions & Webinars',
    icon: 'radio',
    videos: [
      { title: 'Understanding Autism Spectrum Disorders', length: '45 min', views: '2.3K' },
      { title: 'Sensory Integration in Daily Life', length: '38 min', views: '1.8K' },
      { title: 'Parent Q&A: Speech Development', length: '52 min', views: '3.1K' },
    ],
  },
  {
    group: 'Therapy Demonstration Videos',
    icon: 'play',
    videos: [
      { title: 'Occupational Therapy Session Demo', length: '25 min', views: '4.2K' },
      { title: 'Speech Therapy Activities at Home', length: '18 min', views: '5.6K' },
      { title: 'ABA Techniques for Beginners', length: '32 min', views: '2.9K' },
    ],
  },
  {
    group: 'Awareness Campaigns',
    icon: 'megaphone',
    videos: [
      { title: 'World Autism Awareness Day 2024', length: '15 min', views: '8.7K' },
      { title: 'Breaking Myths About Special Needs', length: '22 min', views: '6.4K' },
    ],
  },
  {
    group: 'Expert Talks with Dr. Akanksha Rana',
    icon: 'mic',
    videos: [
      { title: 'Early Intervention: Why It Matters', length: '28 min', views: '3.8K' },
      { title: 'Sensory Processing Explained', length: '35 min', views: '4.1K' },
    ],
  },
];

export const EXPERT_ARTICLES = [
  {
    title: 'Understanding Dyscalculia',
    author: 'Dr. Akanksha Rana',
    date: 'March 15, 2024',
    readTime: '8 min read',
    tag: 'Learning Disabilities',
    excerpt:
      'Why some children struggle with numbers despite normal intelligence — and the classroom accommodations that genuinely help.',
  },
  {
    title: 'Developing Handwriting Skills in Children with Special Needs',
    author: 'Ms. Priya Sharma',
    date: 'March 2, 2024',
    readTime: '6 min read',
    tag: 'Occupational Therapy',
    excerpt:
      'Fine-motor warm-ups, pencil grips and graded paper choices that turn handwriting practice from a battle into progress.',
  },
  {
    title: "Speech Therapy at Home: A Parent's Guide",
    author: 'Ms. Anjali Gupta',
    date: 'February 18, 2024',
    readTime: '10 min read',
    tag: 'Speech Therapy',
    excerpt:
      'Everyday routines — mealtime, bath time, play — hold the richest language opportunities. Here is how to use them.',
  },
  {
    title: 'Identifying Learning Disabilities: Early Warning Signs',
    author: 'Ms. Sunita Agarwal',
    date: 'February 5, 2024',
    readTime: '7 min read',
    tag: 'Special Education',
    excerpt:
      'The subtle signals — in preschool and early primary years — that deserve a closer look before frustration takes root.',
  },
  {
    title: 'Sensory Diet: Creating the Right Environment',
    author: 'Dr. Akanksha Rana',
    date: 'January 22, 2024',
    readTime: '9 min read',
    tag: 'Sensory Integration',
    excerpt:
      'A personalised schedule of sensory input that helps children stay regulated through school, play and sleep.',
  },
  {
    title: 'Building Social Skills in Children with Autism',
    author: 'Ms. Deepika Rao',
    date: 'January 10, 2024',
    readTime: '11 min read',
    tag: 'ABA Therapy',
    excerpt:
      'From turn-taking games to structured peer groups — a stage-wise approach to teaching connection.',
  },
];

export const CASE_STORIES = [
  {
    title: "Aarav's Journey: From Non-Verbal to Confident Communicator",
    family: 'Sharma Family',
    condition: 'Autism Spectrum Disorder',
    outcome: 'Significant improvement in communication and social skills',
    duration: '12 min',
    type: 'Video Testimonial',
  },
  {
    title: "Mehak's Progress: Overcoming Learning Challenges",
    family: 'Verma Family',
    condition: 'Learning Disability',
    outcome: 'Academic success and improved self-confidence',
    duration: '8 min',
    type: 'Read Story',
  },
  {
    title: "Rohan's Transformation: Managing ADHD Successfully",
    family: 'Gupta Family',
    condition: 'ADHD',
    outcome: 'Better focus, improved behavior, and academic progress',
    duration: '10 min',
    type: 'Video Testimonial',
  },
  {
    title: "Kiara's Milestones: Finding Her Words",
    family: 'Nair Family',
    condition: 'Speech Delay',
    outcome: 'Age-appropriate speech and fearless storytelling',
    duration: '9 min',
    type: 'Read Story',
  },
];

/* ------------------------------------------------------------------ */
/* Careers — job openings (DUMMY data until admin panel arrives)       */
/* ------------------------------------------------------------------ */

export const JOB_OPENINGS = [
  {
    id: 1,
    title: 'Senior Occupational Therapist',
    department: 'Therapy',
    location: 'Noida',
    type: 'Full-time',
    experience: '5+ years',
    description:
      'Lead a varied pediatric OT caseload — sensory integration, fine-motor and self-care programs — while mentoring juniors.',
    requirements: [
      'BOT with recognized certification',
      '5+ years pediatric experience',
      'Sensory integration training preferred',
    ],
  },
  {
    id: 2,
    title: 'Speech Language Pathologist',
    department: 'Therapy',
    location: 'Greater Noida West',
    type: 'Full-time',
    experience: '3+ years',
    description:
      'Design and deliver speech-language intervention for children with delays, autism and apraxia, in clinic and via parent coaching.',
    requirements: [
      'MASLP / BASLP qualification',
      '3+ years pediatric practice',
      'Experience with AAC a plus',
    ],
  },
  {
    id: 3,
    title: 'Special Education Teacher',
    department: 'Education',
    location: 'Both Centers',
    type: 'Full-time',
    experience: '2+ years',
    description:
      'Build individualized education plans and work closely with therapists so every child’s school skills keep pace with therapy goals.',
    requirements: [
      'B.Ed (Special Education)',
      '2+ years with diverse learners',
      'Familiarity with IEP frameworks',
    ],
  },
  {
    id: 4,
    title: 'ABA Therapist',
    department: 'Therapy',
    location: 'Noida',
    type: 'Full-time',
    experience: '2+ years',
    description:
      'Implement 1:1 ABA programs — skill acquisition and behavior-reduction plans — under BCBA-supervised case direction.',
    requirements: [
      'Psychology / ABA background',
      '2+ years working with autistic children',
      'Data-driven and patient approach',
    ],
  },
  {
    id: 5,
    title: 'Clinical Psychologist',
    department: 'Assessment',
    location: 'Both Centers',
    type: 'Part-time',
    experience: '5+ years',
    description:
      'Conduct developmental and psycho-educational assessments, score and interpret standardized tools, and guide families through findings.',
    requirements: [
      'M.Phil / MA Clinical Psychology',
      '5+ years child assessment experience',
      'Strong report-writing skills',
    ],
  },
  {
    id: 6,
    title: 'Program Coordinator',
    department: 'Operations',
    location: 'Noida',
    type: 'Full-time',
    experience: '3+ years',
    description:
      'Keep the clinic humming — scheduling, parent communication, vendor and event coordination across both centers.',
    requirements: [
      'Any graduation; admin experience valued',
      '3+ years coordination role',
      'Warm, organized communicator',
    ],
  },
];

export const JOB_FORM_POSITIONS = JOB_OPENINGS.map((j) => j.title).concat([
  'Internship',
  'Certification Program',
  'Other',
]);
