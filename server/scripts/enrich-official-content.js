/**
 * Content enrichment for the 12 official services.
 *
 * - Rewrites full_description with richer, research-informed copy (multi-paragraph;
 *   the detail page renders each blank-line-separated paragraph as its own <p>).
 * - Expands the benefits list on every service.
 * - Seeds 3 parent-facing FAQs per service (page_key = service slug) for the
 *   accordion on each detail page. Re-running replaces the seeded rows.
 * - Regenerates client/src/data/fallbackServices.js from the same content so a
 *   static deploy (no backend) shows exactly the same information.
 *
 * Safe to re-run: all writes are idempotent upserts/replace-by-page_key.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

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

const SHORTS = {
  'occupational-therapy': 'Building fine motor, sensory, and daily-living skills for independence.',
  'physiotherapy-paeds': 'Strength, balance, and movement, helping kids explore the world with confidence.',
  'special-education': 'Tailored educational support for literacy, numeracy, and school readiness.',
  'speech-therapy': 'Developing strong communication, articulation, and language skills.',
  'social-group-training': 'Structured group sessions building peer interaction and play skills.',
  'early-intervention': 'Targeted support in the earliest years, when progress matters most.',
  'psychological-assessment': 'Comprehensive cognitive, developmental, and behavioural evaluations.',
  'reviews': 'Regular follow-up reviews to track progress and refine each plan.',
  'counseling': 'Gentle guidance and emotional support for children and parents.',
  'parent-training': 'Equipping parents with practical strategies for everyday progress.',
  'behaviour-modification': 'Supporting emotional regulation and positive coping strategies.',
  'brain-gym-therapy': 'Movement-based exercises that prime the brain for learning.'
};

const CONTENT = {
  'occupational-therapy': {
    description: [
      "Occupational therapy helps children develop the skills they need for the everyday \"occupations\" of childhood: playing, dressing, eating, writing, and taking part in school life. When these skills don't come easily, a child's confidence and independence can suffer even when nothing is medically wrong. Our occupational therapists look at the whole child: how they move, how they process sensation, and how they manage attention and emotions during daily tasks.",
      "A large part of our work is sensory integration. Some children find everyday sensations such as the hum of a fan, the texture of clothing, or the noise of a busy classroom overwhelming, while others barely register input that should grab their attention. Using play-based, goal-directed activities such as swinging, climbing, deep-pressure play, and fine motor games, we help the nervous system respond to sensory input more comfortably. Research shows this approach improves social skills, adaptive behaviour, and both gross and fine motor development.",
      "Sessions are joyful by design. Children experience them as play, but every activity is chosen to build a specific skill. Over time families see steadier emotional regulation, better pencil grip and handwriting, more willingness to try new foods and clothing, and growing independence in dressing, feeding, and self-care.",
      "Parents are partners throughout: we share simple home strategies, review progress together, and adjust the plan as your child grows. If everyday activities feel harder for your child than they should, an occupational therapy assessment is a gentle, play-based first step."
    ],
    benefits: ['Fine motor skill development', 'Sensory regulation strategies', 'Self-care independence (dressing, feeding)', 'Hand-eye coordination', 'Handwriting and school readiness', 'Emotional regulation through play'],
    faqs: [
      { q: 'What does a paediatric occupational therapist actually help with?', a: 'Occupational therapists help children master the "occupations" of childhood: playing, dressing, feeding themselves, writing, and participating in school. We work on fine motor skills, sensory processing, self-care routines, attention, and emotional regulation, always through play-based activities the child experiences as fun rather than work.' },
      { q: 'What are common signs my child could benefit from OT?', a: 'Frequent meltdowns during dressing or haircuts, avoiding certain textures or foods, unusual clumsiness, difficulty holding a pencil, trouble sitting for circle time, or seeking constant movement (spinning, crashing) can all be signs. If everyday activities feel consistently harder for your child than for peers, an assessment will give you clear answers.' },
      { q: 'How long before we see progress?', a: 'Every child is different, but many families notice early wins such as calmer mornings and easier mealtimes within the first weeks. Deeper skills like handwriting or sensory regulation typically build over months of consistent sessions. We review goals with you regularly so you always know where your child stands.' }
    ]
  },
  'physiotherapy-paeds': {
    description: [
      "Paediatric physiotherapy helps children move well. Our physiotherapists support children who are late to sit, crawl, stand, or walk, and children whose movement is affected by orthopaedic conditions, genetic syndromes, neurological differences, or injury. The goal is always the same: strength, balance, and confidence in motion so your child can keep up with the world they want to explore.",
      "Sessions are built around targeted, playful exercise: stretching tight muscles, strengthening weak ones, practising balance and coordination, and rehearsing the specific movements your child needs next, whether that's rolling, walking, running, or climbing stairs. We also guide families on positioning, carrying, and play positions that support healthy movement at home.",
      "Because children learn through play, therapy looks like games, obstacle courses, and obstacle-rich movement play rather than clinical drills. Progress is measured against clear gross-motor milestones so you can see exactly how far your child has come.",
      "Early support matters. Movement skills build on each other, and delays in one area often ripple into others. If you've noticed your child moving differently from peers, a physiotherapy assessment can tell you whether a little structured help is needed."
    ],
    benefits: ['Gross motor milestones (sitting, crawling, walking)', 'Muscle strengthening and stretching', 'Balance and coordination', 'Support for orthopaedic and genetic conditions', 'Walking, running, and stair-climbing skills', 'Posture, positioning, and home play guidance'],
    faqs: [
      { q: 'My baby is not walking yet. Should I be worried?', a: 'Children walk anywhere between 9 and 18 months, and some healthy children walk later still. What matters more is the overall pattern: is your child sitting, crawling, pulling to stand, and progressing month to month? If milestones feel stuck or uneven, a physiotherapy assessment will tell you whether your child simply follows their own timeline or would benefit from early support.' },
      { q: 'What happens in a physiotherapy session?', a: 'Sessions look like purposeful play: obstacle courses, ball games, climbing, and stretching woven into games your child enjoys. Underneath the play, the therapist is targeting specific muscles and movement patterns: strengthening, improving balance, and rehearsing the next milestone your child is working toward.' },
      { q: 'Can physiotherapy help children with conditions like cerebral palsy or hypotonia?', a: 'Yes. Physiotherapy is a core part of care for many neurological and genetic conditions. While it does not change the underlying condition, regular, targeted exercise improves strength, flexibility, mobility, and independence, and it helps prevent secondary problems like contractures as your child grows.' }
    ]
  },
  'special-education': {
    description: [
      "Special education at THERAKids bridges the gap between what a child knows and what school expects. Our special educators work with children who learn differently, whether because of learning disabilities like dyslexia, ADHD, autism, intellectual disability, or simply gaps that widened somewhere along the way. The framework is the Individualized Education Plan (IEP): specific, measurable goals built around your child's current level, taught in small groups with individual attention.",
      "Remedial teaching is multi-sensory and structured. Reading is taught through letter-sound work that engages sight, sound, and touch; mathematics moves from concrete objects to pictures to symbols; and writing is built up in manageable steps. Nothing is rushed, and nothing is skipped. Each skill is consolidated before the next is layered on.",
      "Beyond academics, we build the learning behaviours school demands: sitting attention, task initiation, following instructions, and organisation. We coordinate with your child's school where helpful, so classroom accommodations and home practice pull in the same direction.",
      "The aim is not to replace school but to make school workable: closing gaps, restoring confidence, and giving your child the experience of succeeding as a learner."
    ],
    benefits: ['Individualized Education Plans (IEP) with measurable goals', 'Remedial literacy and numeracy (dyslexia-friendly methods)', 'Multi-sensory, small-group teaching', 'Learning behaviours: attention, instruction-following, organisation', 'School coordination and accommodations guidance', 'Confidence restored through measurable success'],
    faqs: [
      { q: 'What is the difference between special education and tuition?', a: 'Tuition re-teaches school content. Special education changes how content is taught by breaking skills into smaller steps, using multi-sensory methods, and targeting the underlying processing differences (phonological awareness, working memory, attention) that made classroom learning hard in the first place. Progress is tracked against an individualized plan, not a syllabus pace.' },
      { q: 'Will my child be labelled or fall further behind in school?', a: 'No, quite the opposite. Special education support is private and specific to your child\'s goals. Most children we see are bright learners whose reading, writing, or maths simply developed along a different route; targeted teaching closes the gap and school performance typically improves because the foundation is finally solid.' },
      { q: 'How are goals set and measured?', a: 'Every child starts with an assessment of current literacy, numeracy, and learning skills. From that we build an IEP with specific, measurable goals (for example, decoding a target set of letter-sound combinations, or regrouping in subtraction), and we review progress with you regularly, adjusting the plan as your child masters each step.' }
    ]
  },
  'speech-therapy': {
    description: [
      "Speech and language therapy helps children communicate: to understand what is said to them, to express their own thoughts, and to connect with the people around them. Our speech-language pathologists work with children across the whole range: first words that are late to arrive, speech that is hard to understand, stammering, language delays, social-communication difficulties, and children who communicate without words and need an alternative (AAC) system.",
      "Therapy targets the building blocks in the right order: articulation (making specific speech sounds), receptive language (understanding words and instructions), expressive language (combining words into sentences and stories), pragmatics (using language socially through turn-taking, eye contact, and conversation), and fluency. We also support oral-motor skills and feeding, including children who find chewing or swallowing difficult.",
      "Sessions are play-based and follow your child's interests, because children communicate most when they are engaged. For toddlers, sessions often double as parent coaching: you'll learn to narrate your day, follow your child's lead, expand on what they say, and build back-and-forth interaction into everyday routines. These are the strategies research shows drive language growth.",
      "Progress is measured against communication milestones, and goals are shared with you every step of the way. If you have noticed your child's speech or understanding lagging, an assessment is worthwhile. There is no downside to asking, and early support works best."
    ],
    benefits: ['Articulation and clear pronunciation', 'Receptive and expressive language', 'Social communication (pragmatics)', 'Stuttering and fluency support', 'Oral-motor and feeding therapy', 'AAC support for non-verbal communicators'],
    faqs: [
      { q: 'At what age can speech therapy start?', a: 'Any age, even before first words. Late talkers, toddlers with few gestures, and preschoolers whose speech is hard to understand all benefit from early assessment. For babies and toddlers, therapy is largely parent coaching built around play and daily routines, so there is no "too young" for an evaluation.' },
      { q: 'My child understands everything but barely speaks. Is that normal?', a: 'A gap between understanding and speaking is common, and it matters less whether it is a "late bloom" or a genuine delay than what you do about it. A speech-language assessment will map exactly where the gap is and give you a clear, play-based plan, typically with strategies you use at home between sessions.' },
      { q: 'What is the difference between speech and language?', a: 'Speech is the motor act of producing sounds and words clearly; language is the system underneath it: understanding words, building sentences, and using them socially. A child can have unclear speech with strong language, strong language with poor social use, or delays in both. The assessment identifies which building blocks need support and targets therapy accordingly.' }
    ]
  },
  'social-group-training': {
    description: [
      "Some skills only develop in company: taking turns, reading a friend's expression, joining a game, handling losing, keeping a conversation going. Our social group training gives children a structured, therapist-guided setting to practise exactly these skills with peers, with support close at hand and success made likely.",
      "Groups are small and matched by age and needs, so every child is stretched but not overwhelmed. Sessions blend structured activities (turn-taking games, cooperative building tasks, role-plays, conversation circles) with supported free play, where children rehearse skills in genuinely social moments and therapists coach in real time.",
      "Children typically work on entering play already in progress, sharing and waiting, understanding unwritten social rules, managing frustration, and building the confidence that turns a child who watches into the kid who joins in. Feedback to parents after every session keeps the same language and strategies alive at home and at school.",
      "Social confidence is school confidence. Children who can navigate friendships arrive in the classroom calmer, more willing to raise a hand, and ready to learn."
    ],
    benefits: ['Turn-taking, sharing, and waiting', 'Joining and sustaining play with peers', 'Conversation skills: starting, listening, staying on topic', 'Reading social cues and unwritten rules', 'Frustration tolerance and flexible thinking', 'Friendships built in a supported setting'],
    faqs: [
      { q: 'Is my child a good fit for a group, or do they need individual therapy first?', a: 'It depends on your child\'s current level. Some children benefit from a short period of individual work to build foundational skills before joining a group; others thrive in the group setting from day one because it gives real, motivating practice that individual sessions cannot. We assess each child first and recommend the setting where they will succeed.' },
      { q: 'What happens in a typical group session?', a: 'Sessions mix structured activities such as turn-taking games, cooperative projects, and role-plays with supported free play. Therapists coach in the moment: prompting a child to join a game, narrating social cues, celebrating successful interactions. Every session ends with a short parent update so you know what was practised and how to reinforce it.' },
      { q: 'How are groups organized?', a: 'Groups are small (typically three to five children) and matched by age and communication level so the social demands are fair. Group composition is reviewed regularly. As children grow skills, they graduate to more demanding groups, which keeps the challenge just right.' }
    ]
  },
  'early-intervention': {
    description: [
      "The earliest years are when the brain is most changeable, which is why early intervention has outsized power. Research is unambiguous: children who receive structured developmental support early, in the infant and toddler years, achieve better outcomes in cognitive, language, and motor development, and often need fewer services later. Acting early can genuinely change a child's developmental path.",
      "Our early intervention program serves infants and toddlers whose development shows warning signs: late milestones, low muscle tone, little response to name, limited babbling or pointing, feeding difficulties, or a diagnosed condition. Development is supported across all domains at once, from motor and communication skills to cognition, social-emotional growth, and self-help skills, through play-based sessions that look, to the child, like delightful one-to-one play.",
      "Parents are coached from day one, because at this age the therapy that matters most happens between sessions: in the highchair, on the floor, in the bath. You'll learn to embed tiny, targeted practice moments into routines you already do, multiplying the effect of every clinic hour.",
      "If something in your gut says your baby or toddler is developing differently, trust it and ask. An early developmental assessment either reassures you or starts support at the moment it can do the most good, and either answer is a good one."
    ],
    benefits: ['Early detection of developmental delays', 'Play-based support across all developmental domains', 'Parent coaching embedded in daily routines', 'Stronger long-term cognitive, language, and motor outcomes', 'Smoother transition to preschool and school', 'Fewer services needed later in childhood'],
    faqs: [
      { q: 'What ages does early intervention cover?', a: 'Roughly birth to three years, the period of maximum brain plasticity, with play-based support continuing into the preschool years where helpful. Warning signs at this age include late sitting, crawling, or walking; limited babbling or pointing; not responding to name; and feeding difficulties.' },
      { q: 'Can a baby really "have therapy"?', a: 'Therapy for infants and toddlers looks like warm, playful one-to-one interaction with floor play, songs, and movement games, but every element targets a specific developmental skill. Just as importantly, parents are coached to weave tiny practice moments into daily routines, so the "therapy hours" multiply far beyond the clinic.' },
      { q: 'Should I wait and see if my child catches up?', a: 'Waiting rarely helps and sometimes costs valuable time. A developmental assessment is gentle and play-based, and it has only two possible outcomes: reassurance that your child is on track, or support started exactly when it can do the most good. CDC guidance is consistent on this: if you are concerned, act early.' }
    ]
  },
  'psychological-assessment': {
    description: [
      "A psychological assessment answers the question every parent carries: what is really going on with my child? It is a structured, standardized look at how your child thinks, learns, remembers, communicates, and manages emotions. It goes far deeper than a screening checklist or a classroom observation, and the most reliable foundation for the right support.",
      "Assessments combine child testing with parent and teacher input. Depending on the question, we evaluate cognitive ability (IQ), developmental level, academic skills, attention and executive functioning, language, social-emotional functioning, and behaviour. For young children, testing is play-based, using toys, pictures, puzzles, and conversation, so the experience stays comfortable and the results stay valid.",
      "You receive a clear written report: your child's profile of strengths and weaknesses, what it means, and specific recommendations for therapy, school accommodations, and home. A feedback session walks you through the findings in plain language, and the report is yours to share with schools and doctors.",
      "An assessment does not change who your child is. It changes how accurately the world understands them, and that understanding is what makes the right therapy, the right classroom support, and the right expectations possible."
    ],
    benefits: ['Cognitive (IQ) and developmental profiling', 'Academic and learning-need identification', 'Attention and executive-functioning evaluation', 'Behavioural and social-emotional assessment', 'Play-based testing comfortable for young children', 'Written report with clear recommendations'],
    faqs: [
      { q: 'What actually happens during a psychological assessment?', a: 'Your child completes a series of standardized activities such as puzzles, questions, drawings, and tasks, tailored to their age; for young children these look like games. We also gather history and questionnaires from parents and teachers. Everything is compared against same-age norms, producing a profile of strengths and weaknesses rather than a single verdict.' },
      { q: 'Will my child be stressed or "fail" the assessment?', a: 'No. Assessments are designed to be comfortable and failure-free. Tasks start easy and adapt to your child. Children cannot pass or fail; the goal is a picture of how they think and learn. Breaks are built in, and young children are tested through play.' },
      { q: 'What do we get at the end?', a: 'A written report with your child\'s scores and profile, what the findings mean, and concrete recommendations: which therapies will help, what accommodations the school should make, and how to support at home. A feedback session explains everything in plain language and answers your questions before you decide next steps.' }
    ]
  },
  'reviews': {
    description: [
      "Therapy is a journey, and journeys need signposts. Our review sessions are periodic checkpoints where we re-assess your child's progress against their goals, celebrate what has improved, and adjust the plan for the stage your child is entering now, not the stage they were at when therapy began.",
      "A review typically re-administers relevant standardized measures, gathers your observations and your child's school feedback, and compares current performance with baseline. Where progress is strong, goals are stepped up; where it has stalled, the plan is changed: different strategies, different intensity, sometimes a different mix of services.",
      "Reviews protect families from two common failure modes: therapy that quietly continues past the point where it is working, and therapy that keeps doing the same thing despite evidence it is not. Measured, honest checkpoints prevent both.",
      "You leave every review with a clear picture: where your child started, where they are now, what comes next, and why. Children love review weeks too, because these are the sessions where their progress is made visible and celebrated."
    ],
    benefits: ['Objective re-measurement against baseline', 'Goals stepped up or adjusted as your child grows', 'Early detection of stalled progress', 'Coordination across all therapies your child receives', 'Family progress reports in plain language', 'Celebration of milestones that motivates kids'],
    faqs: [
      { q: 'How often are reviews done?', a: 'Typically every three to six months, depending on the intensity of therapy and your child\'s needs. Reviews are also triggered whenever you or a therapist feels the current plan is no longer the right fit. They are a tool, not a formality.' },
      { q: 'What is actually measured in a review?', a: 'The same standardized measures used at baseline, re-administered to chart change; goal-by-goal progress from your child\'s therapy plans; and structured input from you and your child\'s school. The result is a before-and-now comparison you can see, not just an impression.' },
      { q: 'Can therapy be reduced or stopped after a review?', a: 'Yes, and a good review sometimes recommends exactly that. When goals are met and skills have generalized to home and school, we reduce intensity gradually or step down to periodic check-ins, making sure the gains hold before full discharge.' }
    ]
  },
  'counseling': {
    description: [
      "Behind almost every child in therapy is a family working hard: managing appointments, advocating at school, and absorbing worries they rarely say out loud. Our counselling service gives both children and parents a safe, confidential space to be heard, and practical support for the emotional side of developmental challenges.",
      "For children, counselling uses talk and play to help them name feelings, express worries, and build coping skills for anxiety, frustration, school stress, or big life changes. For parents, it offers exactly what research and experience say helps most: a place to process, strategies for difficult days, and the reassurance that struggling with the journey does not mean failing at it.",
      "Counselling complements, and never replaces, your child's other therapies. When a child's anxiety or self-esteem is getting in the way of therapy progress, addressing it directly often unlocks the rest. For parents, better emotional reserves mean calmer homes and more effective use of every other strategy you are learning.",
      "There is no threshold of severity required to ask for support. If your family is carrying more than it used to, talking to a counsellor is a sign of strength, and usually a relief."
    ],
    benefits: ['Emotional support for children (talk and play-based)', 'Safe space for parents to process and plan', 'Coping strategies for anxiety and frustration', 'Confidence building for child and family', 'Guidance through school and life transitions', 'Stronger parent-child communication'],
    faqs: [
      { q: 'Is counselling for my child, for me, or both?', a: 'Both, and often together. Children get a space to express feelings through talk and play; parents get support and strategies for the realities of raising a child with developmental needs. Joint sessions can strengthen communication between parent and child, with the mix tailored to your family.' },
      { q: 'What does counselling for a young child look like?', a: 'Young children rarely express feelings through long conversations. They use play, drawings, and stories. The counsellor uses these to help the child name and manage emotions, practise coping skills, and work through worries. Parents receive regular feedback and simple ways to reinforce the same language at home.' },
      { q: 'We are not in crisis. Is counselling still appropriate?', a: 'Absolutely. Most of the families we see are not in crisis; they are carrying a sustained, ordinary-extraordinary load of therapies, school meetings, sibling needs, and worries about the future. Counselling at this stage is maintenance and prevention: better reserves now mean fewer crises later.' }
    ]
  },
  'parent-training': {
    description: [
      "Parents are a child's first and most influential teachers, and the one constant across every therapy your child will ever have. Our parent-training program turns that constant into an advantage: structured, evidence-based coaching that equips you to support your child's goals at home, so progress made in the clinic holds and grows in real life.",
      "Training covers the practical core: understanding your child's specific needs, using reinforcement and clear instructions effectively, building routines that teach, handling difficult transitions, and embedding skill practice into meals, baths, car rides, and bedtimes. Skills are taught the way children learn them, through showing, practising, and feedback, so you leave each session confident, not overwhelmed.",
      "The research is clear that children progress faster and generalize skills more broadly when parents are active, trained participants in the therapy plan. Home consistency is what turns a skill practised in a therapy room into a skill used at the dinner table and in the classroom.",
      "Parent training pairs naturally with every other THERAKids service, including speech, occupational therapy, behaviour modification, and early intervention, and it stands on its own for families waiting to begin therapy or wanting to strengthen what they already do."
    ],
    benefits: ['Evidence-based coaching tailored to your child', 'Reinforcement, instruction, and routine-building skills', 'Strategies for transitions and difficult moments', 'Skill practice embedded in daily routines', 'Faster, more durable therapy gains at home', 'Confidence and consistency for caregivers'],
    faqs: [
      { q: 'What is the difference between parent training and counselling?', a: 'Counselling supports how you feel; parent training builds what you do. Training is skills-focused and structured. You learn specific techniques (reinforcement, instruction-giving, routine design) and practise them with feedback. Many families do both, and each makes the other more effective.' },
      { q: 'Do both parents need to attend?', a: 'Whoever is consistently present in the child\'s daily routines benefits most. Often that means both parents, and sometimes grandparents or regular caregivers too. Consistency across caregivers is one of the biggest predictors of skills sticking at home, so we encourage every key adult to learn the same strategies.' },
      { q: 'I already read a lot about my child\'s condition. Why formal training?', a: 'Reading builds understanding; training builds fluency. Knowing a strategy in theory is different from delivering it smoothly on a difficult Tuesday evening. Sessions include live practice with your child\'s actual challenges, plus feedback and refinement, which is why trained parents see stronger results than informed-but-unsupported ones.' }
    ]
  },
  'behaviour-modification': {
    description: [
      "Challenging behaviour is communication. Tantrums, refusals, aggression, or withdrawal usually signal a skill gap or an unmet need, not a child being difficult. Behaviour modification works at the root: understanding what triggers and maintains a behaviour, then teaching the child better ways to get the same need met.",
      "Our approach is evidence-based and positive. Rather than punishing behaviour, we build skills: emotional regulation, tolerance for transitions and waiting, flexible thinking, and communication strong enough to replace the behaviour with words. Sessions are structured around clear, individualized behaviour plans agreed with parents, keeping strategies consistent at home and at the centre, so the child experiences one predictable world.",
      "Common targets include meltdowns during transitions, difficulty with changes in routine, anxiety-driven avoidance, aggression or self-injury in moments of overwhelm, and attention-seeking behaviours that disrupt learning. Every plan defines what success looks like in measurable terms, and progress data is reviewed regularly.",
      "The outcome families care about is calmer days. A child who can regulate, wait, and cope is a child who can learn, play, and be part of the family's ordinary happiness."
    ],
    benefits: ['Individualized, measurable behaviour plans', 'Emotional regulation and coping skills', 'Smoother transitions and routine tolerance', 'Reduced anxiety-driven avoidance', 'Positive reinforcement instead of punishment', 'Consistent strategies across home and centre'],
    faqs: [
      { q: 'Isn\'t behaviour therapy just rewarding kids for good behaviour?', a: 'Rewards are one tool, but the heart of the work is teaching missing skills. A tantrum often exists because the child lacks the words or regulation to say what they need. Once the underlying skill, whether communication, waiting, or tolerating "no", is built, the challenging behaviour fades because it is no longer needed.' },
      { q: 'How long until we see fewer meltdowns?', a: 'Early wins often come within weeks as consistency improves. Parents and therapists responding the same way removes the confusion that fuels many behaviours. Deeper change, where the child independently uses new coping skills, typically builds over months. Every plan is measured, so you will see the trend in data, not just feel it.' },
      { q: 'Will my child feel punished or singled out?', a: 'No. The approach is positive and skill-building. Children experience structured, predictable sessions with lots of success and clear, kind boundaries. The goal is a child who feels capable, not corrected; most children enjoy the sessions.' }
    ]
  },
  'brain-gym-therapy': {
    description: [
      "Brain Gym is a set of 26 playful, purposeful movements that prepare the brain and body for learning. Built around the idea that movement organizes the mind, the exercises, cross-lateral patterns like crawling and marching along with midline-crossing activities and coordination games, help both hemispheres of the brain communicate and prime attention, memory, and readiness to learn.",
      "Sessions are short, joyful movement sequences woven into a child's day rather than a workout to endure. Children cross the body's midline, practise coordinated patterns, and play movement games that build body awareness, balance, and rhythm: the physical foundations that reading, writing, and sustained attention rest on.",
      "Brain Gym works best as a complement, not a replacement: it sharpens the learning readiness that makes speech therapy, occupational therapy, and special education land better. Many children use a brief Brain Gym sequence as a warm-up before homework or therapy, a routine that becomes a reliable 'switch on' cue for focus.",
      "For children who struggle to sit still, get overwhelmed easily, or lose focus quickly, movement-based preparation is often the missing on-ramp to every other intervention."
    ],
    benefits: ['Focus and sustained attention', 'Memory and learning readiness', 'Bilateral coordination (crossing the midline)', 'Balance and body awareness', 'A repeatable "readiness routine" for schoolwork', 'Complements and amplifies other therapies'],
    faqs: [
      { q: 'What exactly is Brain Gym?', a: 'A structured program of 26 simple movements, including cross-crawls, lazy eights, and coordination patterns, that prepare the brain for learning. It is movement-based, playful, and short: sequences take minutes, not hours, and children experience them as games.' },
      { q: 'Is there evidence that it works?', a: 'Research on movement-based interventions broadly supports what we see clinically: coordinated, rhythmic movement improves attention, bilateral coordination, and readiness to learn. We position Brain Gym honestly, as a complementary tool that amplifies our core therapies, particularly for children whose focus and coordination are barriers to progress.' },
      { q: 'Can we use Brain Gym at home?', a: 'Yes, that is part of its power. Sequences are simple enough for parents to lead, and many families build a two-minute "warm-up" before homework or therapy sessions. Children quickly adopt it as their own focus routine, which builds independence.' }
    ]
  }
};

const SLUGS = Object.keys(CONTENT);
const OFFICIAL_ORDER = ['occupational-therapy', 'physiotherapy-paeds', 'special-education', 'speech-therapy', 'social-group-training', 'early-intervention', 'psychological-assessment', 'reviews', 'counseling', 'parent-training', 'behaviour-modification', 'brain-gym-therapy'];

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'thera_kids',
    connectionLimit: 5
  });

  // 1. Enrich services: full_description (joined with blank lines) + benefits
  for (const slug of OFFICIAL_ORDER) {
    const c = CONTENT[slug];
    const desc = c.description.join('\n\n');
    const benefits = JSON.stringify(c.benefits);
    await pool.query(
      'UPDATE services SET full_description = ?, short_description = ?, benefits = ? WHERE slug = ?',
      [desc, SHORTS[slug], benefits, slug]
    );
    console.log(`content updated: ${slug}`);

    // 2. Replace seeded FAQs for this service page
    await pool.query('DELETE FROM faqs WHERE page_key = ?', [slug]);
    let i = 0;
    for (const f of c.faqs) {
      i += 1;
      await pool.query(
        'INSERT INTO faqs (page_key, question, answer, display_order, is_active) VALUES (?, ?, ?, ?, 1)',
        [slug, f.q, f.a, i]
      );
    }
    console.log(`  faqs seeded: ${slug} (${c.faqs.length})`);
  }

  const [faqCount] = await pool.query('SELECT COUNT(*) AS n FROM faqs WHERE is_active = 1');
  console.log(`\nTotal active FAQs: ${faqCount[0].n} (expected ${SLUGS.length * 3})`);
  await pool.end();

  // 3. Regenerate the client fallback module from the same content
  const js = `// Static fallback data for the Services listing and the /services/:slug detail
// pages. Mirrors the clinic's OFFICIAL 12-service list and the DB content -
// REGENERATED by server/scripts/enrich-official-content.js; edit that script,
// not this file. Used whenever the API is unreachable (e.g. a static deploy).
const fallbackServices = ${JSON.stringify(OFFICIAL_ORDER.map((slug, idx) => ({
    id: idx + 1,
    slug,
    name: { 'physiotherapy-paeds': 'Physiotherapy (Paeds)' }[slug] || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
    short_description: SHORTS[slug],
    full_description: CONTENT[slug].description.join('\n\n'),
    benefits: JSON.stringify(CONTENT[slug].benefits),
    image: IMAGES[slug]
  })), null, 2)};

export default fallbackServices;
`;
  const outPath = path.join(__dirname, '..', '..', 'client', 'src', 'data', 'fallbackServices.js');
  fs.writeFileSync(outPath, js, 'utf8');
  console.log(`\nRegenerated ${path.relative(process.cwd(), outPath)}`);
})().catch((e) => {
  console.error('ENRICH FAILED:', e.message);
  process.exit(1);
});
