// Enriches the six later-added service detail pages with full-length content:
//   - multi-paragraph full_description (they were 1-2 sentence stubs)
//   - 6 key benefits each (they had 4)
//   - page_sections content bands (cards + lists) rendered by ServiceDetail.jsx
//   - per-page FAQs (these pages had none)
//
// Idempotent / non-destructive:
//   - a services row is only rewritten while it is still "thin" (description under
//     400 chars or missing page_sections), so admin edits made later are never clobbered
//   - FAQs are inserted only when the page has none yet
//
// Run from the server dir:  node scripts/enrich-service-pages.js
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

const signs = (title, text, items) => ({ title, text, bullet: '\u2713', items });
const causes = (title, text, items) => ({ title, text, bullet: '\u2022', items });

const CONTENT = {
  'special-education': {
    description:
      'Every child learns differently, and a classroom that works for one child may not work for another. Our special education program gives children with learning and developmental needs the individualized attention they need to make consistent academic progress.\n\n' +
      'Our special educators begin with a detailed profile of your child\u2019s current abilities \u2014 reading, writing, calculation, attention and memory \u2014 and build a remedial plan around it. Small group sizes, structured lessons and multisensory teaching methods keep children engaged while closing the gaps that hold them back.\n\n' +
      'Progress is tracked continuously and shared with parents through regular reviews, so you always know exactly where your child stands, what is working, and what comes next.',
    benefits: [
      'Individualized education plans',
      'Literacy and numeracy remediation',
      'Cognitive skill building',
      'School readiness programs',
      'Small group learning',
      'Homework and study skills'
    ],
    sections: [
      {
        kind: 'cards',
        bg: 'bg-pastel-mint',
        eyebrow: 'Learning Support',
        title: 'What We Work On',
        subtitle: 'Core skills our special educators build through structured, individualized lessons.',
        items: [
          {
            title: 'Reading & Language',
            text: 'Phonics, comprehension and fluency exercises matched to your child\u2019s exact level turn reading from a struggle into a confident, enjoyable skill.'
          },
          {
            title: 'Writing & Motor Skills',
            text: 'From letter formation to handwriting stamina, we build the fine motor control and planning that written schoolwork demands.'
          },
          {
            title: 'Math & Logical Thinking',
            text: 'Number sense, sequencing and problem solving taught with concrete, hands-on material before moving to abstract calculations.'
          }
        ]
      },
      {
        kind: 'lists',
        blocks: [
          signs(
            'Our Approach',
            'A structured, data-driven plan built around your child.',
            [
              'Detailed baseline assessment before teaching begins',
              'Individualized goals broken into small, achievable steps',
              'Multisensory and play-based teaching methods',
              'Ongoing progress data reviewed with parents'
            ]
          ),
          causes(
            'What to Expect',
            'What a typical term with our special education team looks like.',
            [
              'Small groups with high adult support',
              'Regular goal reviews and plan updates',
              'Coordination with your child\u2019s school when needed',
              'Guidance for parents to reinforce learning at home'
            ]
          )
        ]
      }
    ]
  },

  'aba-therapy': {
    description:
      'Applied Behavior Analysis (ABA) is one of the most extensively researched approaches for children with autism and related developmental needs. It breaks down complex skills \u2014 communication, self-care, social interaction \u2014 into small, teachable steps and uses positive reinforcement to make learning rewarding.\n\n' +
      'Our BCBAs and trained behaviour therapists design an individualized ABA plan after a detailed assessment of your child\u2019s strengths, challenges and motivations. Every target skill is taught systematically, measured objectively and adjusted based on real data \u2014 never guesswork.\n\n' +
      'Sessions combine one-to-one teaching with practice in natural environments, so skills learned at the centre transfer to home, school and community. Parents are trained as active partners, because progress accelerates when strategies continue through the whole week.',
    benefits: [
      'Individualized ABA program based on functional assessment',
      'Positive reinforcement-based teaching',
      'Data-driven progress tracking',
      'Communication and language building',
      'Reduction of challenging behaviours',
      'Parent training for carry-over at home'
    ],
    sections: [
      {
        kind: 'cards',
        bg: 'bg-pastel-peach',
        eyebrow: 'Applied Behavior Analysis',
        title: 'How ABA Helps',
        subtitle: 'Skill-building domains addressed through structured, measurable ABA teaching.',
        items: [
          {
            title: 'Communication & Language',
            text: 'Requesting, labeling, answering questions and building conversations so your child can express needs instead of frustration.'
          },
          {
            title: 'Daily Living Skills',
            text: 'Toileting, dressing, eating and morning routines taught step by step until they become independent habits.'
          },
          {
            title: 'Social & Play Skills',
            text: 'Joint attention, turn-taking and cooperative play with peers, practised in structured and natural settings.'
          }
        ]
      },
      {
        kind: 'lists',
        blocks: [
          signs('Our ABA Process', 'How a program moves from assessment to independence.', [
            'Functional behaviour assessment before goal setting',
            'One-to-one sessions with trained behaviour therapists',
            'Continuous data collection and weekly review',
            'Parent training and a home generalization plan'
          ]),
          causes(
            'Signs Your Child May Benefit',
            'Common reasons families reach out to our ABA team.',
            [
              'Limited or delayed speech',
              'Repetitive behaviours or strong resistance to change',
              'Difficulty with transitions and routines',
              'Challenges with toilet training or self-care'
            ]
          )
        ]
      }
    ]
  },

  'social-group-training': {
    description:
      'Navigating friendships, group activities and classroom dynamics does not come naturally to every child. Our Social Group Training program places children in small, guided peer groups where social skills are taught explicitly and then practised with real classmates, not just discussed.\n\n' +
      'Each group is formed around age and compatibility, and sessions follow a predictable structure: a warm-up circle, guided play or cooperative games, and a problem-solving discussion that reviews what worked. Therapists coach in the moment \u2014 prompting, modelling and reinforcing \u2014 so children experience success with peers rather than just hearing instructions.\n\n' +
      'Over time, children carry these skills into classrooms, birthday parties and family gatherings, gaining the confidence that comes from being understood by other children.',
    benefits: [
      'Peer interaction and joint attention',
      'Turn-taking, sharing and waiting',
      'Conversation and social problem-solving',
      'Building and maintaining friendships',
      'Play skills with same-age peers',
      'Confidence in school and community settings'
    ],
    sections: [
      {
        kind: 'cards',
        bg: 'bg-pastel-lilac',
        eyebrow: 'Group Sessions',
        title: 'Inside a Session',
        subtitle: 'A predictable structure that makes practicing social skills feel natural.',
        items: [
          {
            title: 'Warm-Up Circle',
            text: 'Greeting, naming feelings and reviewing the day\u2019s social goal so every child starts engaged and ready.'
          },
          {
            title: 'Guided Play',
            text: 'Cooperative games and shared projects where therapists coach turn-taking, joining in and reading cues in real time.'
          },
          {
            title: 'Problem-Solving Huddle',
            text: 'A short closing discussion where children reflect on what went well and plan how to use the skill again next week.'
          }
        ]
      },
      {
        kind: 'lists',
        blocks: [
          signs('What Children Learn', 'Social skills practised with real peers every week.', [
            'Starting, joining and leaving conversations',
            'Reading facial expressions and tone of voice',
            'Sharing, waiting and following group rules',
            'Handling disagreement without upset'
          ]),
          causes('How We Run Groups', 'Structure and safety come first.', [
            'Small groups matched by age and compatibility',
            'Trained therapists facilitating every session',
            'Consistent weekly schedule and routines',
            'Parent notes after each block of sessions'
          ])
        ]
      }
    ]
  },

  'behaviour-modification': {
    description:
      'Challenging behaviour is communication \u2014 it usually signals that a child lacks a skill, a routine or a way to express a need. Our behaviour modification program looks underneath the behaviour first, then teaches better alternatives rather than simply suppressing the old ones.\n\n' +
      'We begin with a functional behaviour assessment to understand what triggers the behaviour and what purpose it serves. From there, therapists build a personalized plan that combines reinforcement of desired behaviours, teaching of replacement skills, environmental adjustments and clear, consistent routines.\n\n' +
      'Because behaviour change only sticks when it is consistent everywhere, parents and teachers receive practical strategies to use at home and school, with regular review sessions to track progress and adjust the plan.',
    benefits: [
      'Emotional regulation techniques',
      'Managing transitions and routines',
      'Reducing anxiety',
      'Building positive social interactions',
      'Customized behaviour plans',
      'Positive reinforcement strategies'
    ],
    sections: [
      {
        kind: 'cards',
        bg: 'bg-pastel-mint',
        eyebrow: 'Behaviour Support',
        title: 'Common Challenges We Support',
        subtitle: 'Frequent reasons families come to our behaviour team.',
        items: [
          {
            title: 'Tantrums & Meltdowns',
            text: 'Understanding triggers and teaching calm-down strategies so intense moments become shorter and less frequent.'
          },
          {
            title: 'Transition Difficulties',
            text: 'Moving between activities, places or routines without distress, using preparation and predictable sequencing.'
          },
          {
            title: 'Anxiety-Driven Behaviour',
            text: 'Gradual exposure, coping tools and reassurance routines that help children face everyday situations with confidence.'
          }
        ]
      },
      {
        kind: 'lists',
        blocks: [
          signs('Our Approach', 'Assessment first, then a plan built on evidence.', [
            'Functional behaviour assessment before goal setting',
            'Teaching replacement skills, not just stopping behaviour',
            'Positive reinforcement for desired behaviour',
            'Consistent strategies shared with home and school'
          ]),
          causes('What Changes At Home', 'Practical outcomes families report most often.', [
            'Smoother mornings, mealtimes and bedtimes',
            'Fewer and shorter meltdowns',
            'Clearer expectations the child understands',
            'More confidence handling frustration'
          ])
        ]
      }
    ]
  },

  'parents-child-counselling': {
    description:
      'A child does not grow in isolation \u2014 the parent-child relationship shapes confidence, emotional security and behaviour every day. Our parent and child counselling sessions bring caregivers and children together with a therapist to strengthen that relationship and break patterns that leave everyone frustrated.\n\n' +
      'Sessions blend guided conversation with structured activities: we observe how parent and child communicate, coach positive discipline and boundary-setting techniques in the moment, and give children a safe space to express feelings they struggle to share at home.\n\n' +
      'Between sessions, parents practise simple, concrete strategies \u2014 routine-building, active listening, calm correction \u2014 and review what worked. The goal is a home where rules feel fair, communication flows both ways, and both parent and child feel understood.',
    benefits: [
      'Stronger parent-child attachment',
      'Positive discipline strategies',
      'Reduced family stress',
      'Consistent routines and boundaries',
      'Parental confidence and self-care',
      'Improved communication at home'
    ],
    sections: [
      {
        kind: 'cards',
        bg: 'bg-pastel-peach',
        eyebrow: 'Family Counselling',
        title: 'What We Work On Together',
        subtitle: 'Common themes addressed in parent and child sessions.',
        items: [
          {
            title: 'Communication Patterns',
            text: 'Replacing lectures and shouting with clear requests, active listening and language both sides actually hear.'
          },
          {
            title: 'Boundaries & Routines',
            text: 'Setting age-appropriate limits that hold kindly, and building predictable routines that reduce daily conflict.'
          },
          {
            title: 'Emotions on Both Sides',
            text: 'Helping children name and manage big feelings while giving parents tools to stay calm under pressure.'
          }
        ]
      },
      {
        kind: 'lists',
        blocks: [
          signs('How Sessions Work', 'Practical, collaborative, and paced for real family life.', [
            'Joint parent-child sessions with a counsellor',
            'Observation of everyday interactions',
            'Concrete techniques practised in the room',
            'Short between-session practice goals'
          ]),
          signs('What Parents Take Home', 'Tools that keep working long after the session.', [
            'A consistent routine plan for the week',
            'Scripts for difficult moments',
            'Ways to praise effectively',
            'Strategies for your own stress'
          ])
        ]
      }
    ]
  },

  'pre-vocational-training': {
    description:
      'As children with developmental needs approach adolescence, independence stops being a distant hope and becomes an everyday necessity. Our pre-vocational training program builds the practical life skills, work habits and community confidence older children and teenagers need to move toward adult life with purpose.\n\n' +
      'Participants learn through doing: task analysis breaks real jobs and chores into manageable steps, repetitive practice builds fluency, and graduated reinforcement fades support as competence grows. Alongside work skills, the program covers time management, money handling, personal safety and travel orientation.\n\n' +
      'We track each participant against individual goals and involve families throughout, so gains made at the centre carry into the home and community. The end result is a young person who can follow instructions, complete meaningful tasks and take their place in everyday settings with dignity.',
    benefits: [
      'Life skills development',
      'Task completion and organization',
      'Time management',
      'Independence building',
      'Workplace readiness',
      'Community participation skills'
    ],
    sections: [
      {
        kind: 'cards',
        bg: 'bg-pastel-lilac',
        eyebrow: 'Adolescent Skills',
        title: 'Skills We Build',
        subtitle: 'Foundations for independence at home, at work and in the community.',
        items: [
          {
            title: 'Daily Living Skills',
            text: 'Cooking basics, cleaning, laundry and personal care taught step by step until they become independent routines.'
          },
          {
            title: 'Work Behaviours',
            text: 'Following instructions, staying on task, asking for help, completing a job and accepting feedback gracefully.'
          },
          {
            title: 'Community Access',
            text: 'Money handling, travel orientation and safety awareness for navigating shops, transport and public spaces.'
          }
        ]
      },
      {
        kind: 'lists',
        blocks: [
          signs('Program Pathway', 'A structured route from supported practice to independence.', [
            'Individual skills assessment at entry',
            'Task-analyzed goals with clear criteria',
            'Gradual fading of prompts and support',
            'Regular family reviews and goal updates'
          ]),
          causes('Who It Is For', 'Older children and adolescents who are ready for more.', [
            'Teens preparing for work or vocational training',
            'Children mastering self-care and household tasks',
            'Learners who need structured community practice',
            'Families building everyday independence'
          ])
        ]
      }
    ]
  }
};

const FAQS = {
  'special-education': [
    ['How do I know if my child needs special education support?',
      'If your child is significantly behind peers in reading, writing, focus or daily schoolwork despite regular schooling, an assessment can clarify why. Our educators evaluate current abilities, identify specific learning gaps and recommend whether remedial teaching or a fuller support plan is appropriate.'],
    ['Is the teaching plan customized for my child?',
      'Yes. Every child begins with a baseline assessment and goals are written from those results, not from a fixed curriculum. Plans are reviewed regularly and adjusted as your child progresses.'],
    ['Do you coordinate with my child\u2019s school?',
      'With your permission, we share strategies and progress notes with your child\u2019s teacher so support stays consistent between school and our centre. Consistency across both settings is one of the biggest factors in lasting improvement.'],
    ['What age group do you work with?',
      'We work with children from pre-school through adolescence. Early remedial support is especially effective, but our team also helps older students who have accumulated learning gaps over the years.']
  ],
  'aba-therapy': [
    ['What is ABA therapy?',
      'Applied Behavior Analysis is an evidence-based approach that breaks skills into small steps, teaches them systematically and uses positive reinforcement. It is widely used for children with autism and focuses on measurable, meaningful improvements in communication, daily living and social skills.'],
    ['How many hours of ABA does my child need?',
      'Intensity varies with your child\u2019s goals and assessment. Some children benefit from a few focused hours per week, others from an intensive daily schedule. Your BCBA will recommend a plan and review it regularly based on data.'],
    ['Does ABA work?',
      'ABA is one of the most researched interventions in developmental care, with decades of evidence supporting its outcomes when implemented with fidelity. Progress is individual \u2014 we set measurable goals and adjust constantly so gains are real and tracked.'],
    ['How involved do parents need to be?',
      'Very involved. We train parents in the same strategies used in sessions so skills generalize to home. Weekly guidance and practice between sessions are a core part of the program, not an optional extra.']
  ],
  'social-group-training': [
    ['How are groups formed?',
      'Groups are matched by age, developmental level and compatibility so every child can participate meaningfully. Groups stay small to ensure each child gets attention from the facilitating therapists.'],
    ['My child is very shy \u2014 will this overwhelm them?',
      'Sessions are structured to feel safe: predictable routines, gentle prompting and no forced participation. Children are coached to join in at their own pace, and confidence typically grows within the first few weeks.'],
    ['What ages is this program for?',
      'We run groups for school-age children and pre-teens. Placement depends on social goals and peer compatibility rather than age alone, and we will tell you honestly if another service fits your child better.'],
    ['How long before we see progress?',
      'Most parents notice increased comfort with peers within a few weeks, while deeper skills like conversation and friendship-building develop over a term or more. We share progress notes after each block of sessions.']
  ],
  'behaviour-modification': [
    ['What is behaviour modification?',
      'It is a structured approach that first understands why a behaviour happens, then teaches a better alternative and reinforces it positively. The goal is lasting skill-building, not short-term suppression of symptoms.'],
    ['Will you just punish unwanted behaviour?',
      'No. We focus on positive reinforcement and teaching replacement skills. Punishment-based methods are not part of our program; we change the conditions that maintain the behaviour and reward the skills we want to see.'],
    ['How long does the program take?',
      'It depends on the behaviour and the child. Some goals show progress in weeks; deeper patterns take several months. We review data regularly so you always know whether the plan is working.'],
    ['Can you work with my child\u2019s school too?',
      'Yes, with your consent we share strategies with teachers so expectations and responses stay consistent across settings \u2014 one of the strongest predictors of behaviour change.']
  ],
  'parents-child-counselling': [
    ['What happens in a parent and child session?',
      'A counsellor observes how you and your child communicate, guides structured activities that surface difficulties safely, and coaches new techniques in the moment. Sessions end with concrete practice goals for the week.'],
    ['Is this only for parents of children with a diagnosis?',
      'No. Any family experiencing communication breakdowns, frequent conflict or big transitions can benefit. We work with a wide range of concerns, from toddler boundaries to teenage independence.'],
    ['Do both parents need to attend?',
      'Both caregivers are welcome and consistency helps, but sessions work with whoever is primary in the child\u2019s routine. What matters is that the strategies are applied consistently at home.'],
    ['How many sessions will we need?',
      'Many families see meaningful change within 6\u201310 sessions. After an initial review we will recommend a plan, and you decide the pace from there.']
  ],
  'pre-vocational-training': [
    ['What is pre-vocational training?',
      'It is structured skill-building for older children and adolescents that develops practical life skills, work habits and community independence in preparation for adulthood, employment or further vocational training.'],
    ['What skills does the program cover?',
      'Daily living tasks, task completion and organization, time management, money handling, travel safety, and workplace behaviours such as following instructions and accepting feedback.'],
    ['At what age should my child start?',
      'Typically in the early teens, though we assess readiness rather than strict ages. Starting early gives more time to generalize skills before adulthood transitions arrive.'],
    ['How do you measure progress?',
      'Each participant has individual goals with clear criteria, tracked session by session. Families receive regular reviews showing exactly which skills have been mastered and what is next.']
  ]
};

(async () => {
  let servicesUpdated = 0;
  let faqsAdded = 0;

  for (const [slug, data] of Object.entries(CONTENT)) {
    const [rows] = await pool.query(
      'SELECT full_description, page_sections FROM services WHERE slug = ?',
      [slug]
    );
    if (!rows.length) {
      console.log(`skip ${slug}: not found in services`);
      continue;
    }

    const thin =
      (rows[0].full_description || '').length < 400 || !rows[0].page_sections;
    if (thin) {
      await pool.query(
        'UPDATE services SET full_description = ?, benefits = ?, page_sections = ? WHERE slug = ?',
        [data.description, JSON.stringify(data.benefits), JSON.stringify(data.sections), slug]
      );
      servicesUpdated += 1;
      console.log(`updated ${slug}`);
    } else {
      console.log(`kept ${slug} (already enriched)`);
    }

    const [faqRows] = await pool.query(
      'SELECT COUNT(*) AS n FROM faqs WHERE page_key = ?',
      [slug]
    );
    if (Number(faqRows[0].n) === 0) {
      const faqs = FAQS[slug] || [];
      for (let i = 0; i < faqs.length; i += 1) {
        await pool.query(
          'INSERT INTO faqs (page_key, question, answer, display_order) VALUES (?, ?, ?, ?)',
          [slug, faqs[i][0], faqs[i][1], i + 1]
        );
      }
      faqsAdded += faqs.length;
      console.log(`added ${faqs.length} FAQs for ${slug}`);
    }
  }

  await pool.end();
  console.log(`\nDone: ${servicesUpdated} services updated, ${faqsAdded} FAQs added.`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
