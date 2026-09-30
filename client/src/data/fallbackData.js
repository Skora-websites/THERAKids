export const FALLBACK_GALLERY = [
 {
  "id": 116,
  "image_path": "/images/gallery/therakids/noida-centre-01.jpg",
  "caption": "THERAkids Noida centre",
  "category": "Noida Centre"
 },
 {
  "id": 117,
  "image_path": "/images/gallery/therakids/noida-centre-02.jpg",
  "caption": "Jungle-themed sensory room",
  "category": "Noida Centre"
 },
 {
  "id": 118,
  "image_path": "/images/gallery/therakids/noida-centre-03.jpg",
  "caption": "Ball pit and sensory mats",
  "category": "Noida Centre"
 },
 {
  "id": 119,
  "image_path": "/images/gallery/therakids/noida-centre-04.jpg",
  "caption": "Sensory integration room",
  "category": "Noida Centre"
 },
 {
  "id": 120,
  "image_path": "/images/gallery/therakids/noida-centre-06.jpg",
  "caption": "Family waiting lounge",
  "category": "Noida Centre"
 },
 {
  "id": 121,
  "image_path": "/images/gallery/therakids/noida-centre-08.jpg",
  "caption": "Group activity space",
  "category": "Noida Centre"
 },
 {
  "id": 123,
  "image_path": "/images/gallery/therakids/gnw-centre-01.jpg",
  "caption": "Reception, Greater Noida West",
  "category": "Greater Noida Centre"
 },
 {
  "id": 124,
  "image_path": "/images/gallery/therakids/gnw-centre-03.jpg",
  "caption": "Jungle-themed ball pool",
  "category": "Greater Noida Centre"
 },
 {
  "id": 125,
  "image_path": "/images/gallery/therakids/gnw-centre-04.jpg",
  "caption": "Soft-play floor",
  "category": "Greater Noida Centre"
 },
 {
  "id": 128,
  "image_path": "/images/gallery/therakids/happy-moments-01.jpg",
  "caption": "Our multidisciplinary team",
  "category": "Our Team"
 },
 {
  "id": 132,
  "image_path": "/images/gallery/therakids/happy-moments-04.jpg",
  "caption": "Parent workshop in session",
  "category": "Workshops & Trainings"
 },
 {
  "id": 138,
  "image_path": "/images/gallery/therakids/happy-moments-07.jpg",
  "caption": "Festival celebrations with families",
  "category": "Festivals & Celebrations"
 }
];

/* Static fallback data — used when the API is unreachable (offline preview,
   static frontend-only deploys on Vercel). Mirrors the seeded DB rows; admin
   edits take precedence whenever /api responds. Generated from the live DB. */

export const FALLBACK_DATA = {
 "services": [
  {
   "id": 33,
   "slug": "occupational-therapy",
   "name": "Occupational Therapy",
   "hero_title": null,
   "short_description": "Building fine motor, sensory, and daily-living skills for independence.",
   "full_description": "Occupational therapy helps children develop the fine motor, sensory processing, and visual motor skills needed for everyday activities like dressing, writing, and playing. Our occupational therapists keep records of every child's improvement and tailor each session to the child's unique potential.",
   "image": "/images/services/occupational-therapy.jpg",
   "benefits": [
    "Fine motor skill development",
    "Sensory regulation strategies",
    "Self-care independence (dressing, feeding)",
    "Hand-eye coordination"
   ],
   "display_order": 1
  },
  {
   "id": 34,
   "slug": "physiotherapy-paeds",
   "name": "Physiotherapy (Paeds)",
   "hero_title": null,
   "short_description": "Strength, balance, and movement, helping kids explore the world with confidence.",
   "full_description": "Our paediatric physiotherapists help children overcome physical challenges through stretching, running, jumping, and targeted exercise, improving strength, balance, coordination, and ease of movement, including support for conditions related to genetics, orthopaedic disorders, and walking disorders.",
   "image": "/images/services/physiotherapy-paeds.jpg",
   "benefits": [
    "Mobility improvement",
    "Muscle strengthening",
    "Balance and coordination",
    "Walking and running support",
    "Orthopaedic rehabilitation"
   ],
   "display_order": 2
  },
  {
   "id": 35,
   "slug": "special-education",
   "name": "Special Education",
   "hero_title": null,
   "short_description": "Tailored educational support for literacy, numeracy, and school readiness.",
   "full_description": "Our remedial intervention helps children learn to read, write, and do calculations in a specialized environment with small group sizes, keeping every child's studies on track with strict attention to their progress.",
   "image": "/images/services/special-education.jpg",
   "benefits": [
    "Individualized Education Plans",
    "Literacy and numeracy support",
    "Cognitive skill building",
    "School readiness"
   ],
   "display_order": 3
  },
  {
   "id": 36,
   "slug": "speech-therapy",
   "name": "Speech Therapy",
   "hero_title": null,
   "short_description": "Developing strong communication, articulation, and language skills.",
   "full_description": "Our speech-language pathologists support children in developing strong communication skills: articulation, receptive and expressive language, social pragmatic skills, and even feeding and swallowing support, so children can express themselves and connect with society confidently.",
   "image": "/images/services/speech-therapy.jpg",
   "benefits": [
    "Articulation and pronunciation",
    "Receptive and expressive language",
    "Social communication (pragmatics)",
    "Stuttering and fluency support"
   ],
   "display_order": 4
  },
  {
   "id": 37,
   "slug": "social-group-training",
   "name": "Social Group Training",
   "hero_title": null,
   "short_description": "Structured group sessions building peer interaction and play skills.",
   "full_description": "Structured group sessions that help children prepare for academic and social settings, focusing on peer interaction, turn-taking, and play skills. Children learn to interact with others, develop friendships, and build social confidence for school and community settings.",
   "image": "/images/services/social-group-training.jpg",
   "benefits": [
    "Peer interaction",
    "Turn-taking and sharing",
    "Group participation",
    "Building friendships"
   ],
   "display_order": 5
  },
  {
   "id": 38,
   "slug": "early-intervention",
   "name": "Early Intervention",
   "hero_title": null,
   "short_description": "Targeted support in the earliest years, when progress matters most.",
   "full_description": "Early intervention identifies and supports developmental delays as early as possible. The sooner we can assess and begin working with a child, the better the outcomes. Our team builds play-based, individualized programs for infants and toddlers across all developmental domains.",
   "image": "/images/services/early-intervention.jpg",
   "benefits": [
    "Early detection of delays",
    "Play-based developmental support",
    "Parent coaching from day one",
    "Stronger long-term outcomes"
   ],
   "display_order": 6
  },
  {
   "id": 39,
   "slug": "psychological-assessment",
   "name": "Psychological Assessment",
   "hero_title": null,
   "short_description": "Comprehensive cognitive, developmental, and behavioural evaluations.",
   "full_description": "Standardized psychological assessments help identify a child's cognitive profile, developmental level, learning needs, and behavioural concerns. The results become the foundation for an accurate diagnosis and a personalized therapy plan.",
   "image": "/images/services/psychological-assessment.jpg",
   "benefits": [
    "Cognitive and developmental profiling",
    "Learning-need identification",
    "Behavioural evaluation",
    "Foundation for therapy planning"
   ],
   "display_order": 7
  },
  {
   "id": 40,
   "slug": "reviews",
   "name": "Reviews",
   "hero_title": null,
   "short_description": "Regular follow-up reviews to track progress and refine each plan.",
   "full_description": "Therapy is a journey, and progress deserves measurement. Our periodic review sessions re-assess each child's goals, celebrate milestones, and adjust the therapy plan so it always matches the child's current needs.",
   "image": "/images/services/reviews.jpg",
   "benefits": [
    "Goal tracking and milestones",
    "Plan refinement over time",
    "Objective progress measures",
    "Family progress reports"
   ],
   "display_order": 8
  },
  {
   "id": 41,
   "slug": "counseling",
   "name": "Counseling",
   "hero_title": "Counseling EDITED",
   "short_description": "Gentle guidance and emotional support for children and parents.",
   "full_description": "Counselling gives children and parents a safe space to express difficulties and build confidence. We provide dedicated counselling sessions for families to navigate the challenges of raising a child with developmental needs.",
   "image": "/images/services/counseling.jpg",
   "benefits": [
    "Emotional support and guidance",
    "Confidence building",
    "Parent education and support",
    "Coping strategies for caregivers"
   ],
   "display_order": 9
  },
  {
   "id": 42,
   "slug": "parent-training",
   "name": "Parent Training",
   "hero_title": null,
   "short_description": "Equipping parents with practical strategies for everyday progress.",
   "full_description": "Parents are a child's first and most important teachers. Our parent-training sessions share practical, evidence-based strategies for supporting therapy goals at home, turning daily routines into opportunities for progress.",
   "image": "/images/services/parent-training.jpg",
   "benefits": [
    "Practical home strategies",
    "Routine-based learning",
    "Consistency across settings",
    "Caregiver empowerment"
   ],
   "display_order": 10
  },
  {
   "id": 43,
   "slug": "behaviour-modification",
   "name": "Behaviour Modification",
   "hero_title": null,
   "short_description": "Supporting emotional regulation and positive coping strategies.",
   "full_description": "We utilize evidence-based approaches to support children with emotional regulation, transitions, and developing positive coping mechanisms. Our therapists work to understand the root causes of behavioural challenges and develop customized intervention plans.",
   "image": "/images/services/behaviour-modification.jpg",
   "benefits": [
    "Emotional regulation techniques",
    "Managing transitions and routines",
    "Reducing anxiety",
    "Positive reinforcement strategies"
   ],
   "display_order": 11
  },
  {
   "id": 44,
   "slug": "brain-gym-therapy",
   "name": "Brain Gym Therapy",
   "hero_title": "Counseling",
   "short_description": "Movement-based exercises that prime the brain for learning.",
   "full_description": "Brain Gym uses playful, purposeful movement to improve focus, memory, coordination, and learning readiness. These gentle exercises help children organize their nervous systems and engage more fully in therapy and schoolwork.",
   "image": "/images/services/brain-gym-therapy.jpg",
   "benefits": [
    "Focus and attention",
    "Memory and coordination",
    "Learning readiness",
    "Nervous-system organization"
   ],
   "display_order": 12
  }
 ],
 "blogs": [
  {
   "id": 26,
   "slug": "speech-milestones-toddlers",
   "title": "Speech Milestones for Toddlers",
   "excerpt": "A quick guide for parents on what to expect as your toddler develops their communication skills.",
   "featured_image": "/images/services/speech-therapy.jpg",
   "author": "Dr. Rahul Verma",
   "category": "Speech Therapy",
   "content": "<p>Every child develops at their own pace, but language follows a fairly predictable path. Knowing the typical milestones helps you celebrate progress and spot early when a little extra support could help.</p>\n\n<h3>12 to 18 months</h3>\n<p>First words appear, usually naming people and favourite objects. Your toddler understands simple requests like \"come here\" and points to show interest.</p>\n\n<h3>18 to 24 months</h3>\n<p>Vocabulary grows quickly, often to 50 or more words, and two-word combinations begin: \"more juice\", \"daddy go\".</p>\n\n<h3>2 to 3 years</h3>\n<p>Sentences of three or more words, question words like \"what\" and \"where\", and speech that is mostly understood by familiar adults.</p>\n\n<h3>When to seek an assessment</h3>\n<ul>\n<li>No words by 16 months</li>\n<li>No two-word phrases by age 2</li>\n<li>Loss of words or skills at any age</li>\n<li>You simply feel something is different, so trust your instincts</li>\n</ul>\n\n<p>Early intervention is the single biggest factor in speech outcomes. If you are unsure, a developmental screening takes less than an hour and gives you a clear picture of where your child stands.</p>",
   "published_at": "2026-08-22T03:30:00.000Z",
   "meta_title": null,
   "meta_description": null
  },
  {
   "id": 25,
   "slug": "understanding-sensory-processing",
   "title": "Understanding Sensory Processing Disorder",
   "excerpt": "Learn about the signs of SPD and how occupational therapy can provide strategies for self-regulation.",
   "featured_image": "/images/services/occupational-therapy.jpg",
   "author": "Dr. Priya Sharma",
   "category": "Occupational Therapy X",
   "content": "<p>Some children experience the world through their senses more intensely than others. Sounds feel louder, textures feel harsher, and busy environments can quickly become overwhelming. When these reactions start to interfere with daily life (dressing, eating, playing, or learning), it may be a sign of Sensory Processing Disorder (SPD).</p>\n\n<h3>Common signs to watch for</h3>\n<ul>\n<li>Covering ears at everyday noises or reacting strongly to touch</li>\n<li>Avoiding certain foods because of texture or temperature</li>\n<li>Constant movement such as spinning, crashing, or fidgeting, or avoiding movement altogether</li>\n<li>Meltdowns in busy places like supermarkets or playgrounds</li>\n</ul>\n\n<h3>How occupational therapy helps</h3>\n<p>Our occupational therapists use play-based sensory integration to help children gradually build tolerance and regulation. Therapy looks like fun, with swings, climbing, and tactile games, but each activity is chosen to target specific sensory systems and teach the nervous system to respond more comfortably.</p>\n<p>With consistent support, children learn strategies to self-regulate, and parents learn how to set up sensory-friendly routines at home. Early support makes a remarkable difference.</p>",
   "published_at": "2026-08-09T22:00:00.000Z",
   "meta_title": null,
   "meta_description": null
  },
  {
   "id": 5,
   "slug": "sign-that-child-needs-occupational-therapy",
   "title": "10 Signs to Identify that your Child Needs Occupational Therapy",
   "excerpt": "If you want to identify the signs that your child needs occupational therapy, read this blog as we mention 10 primary OT-related signs.",
   "featured_image": "/images/services/early-intervention.jpg",
   "author": "Om Prakash",
   "category": "Occupational Therapy",
   "content": "<p>Occupational therapy is a professional study that helps one to become familiar with the common issues they face while doing certain activities like self-feeding, peeing, communication, walking, mood swings, feeling excluded from society, etc. The need of occupational therapy for children is increasing constantly because parents find it difficult to resolve these issues without theoretical knowledge.</p>\n\n<h2>Why Would a Child Need Occupational Therapy?</h2>\n<p>A child needs occupational therapy in many situations if he/she finds difficulties while performing motor skills, gross motor skills, or sensory issues.</p>\n<ul>\n<li><strong>Fine motor skills</strong> – These are some activities that involve small muscle groups, like crawling, jumping, moving, etc.</li>\n<li><strong>Gross motor skills</strong> – This includes performing tasks with the help of large muscles, like walking, running, throwing, kicking, etc.</li>\n<li><strong>Sensory issues</strong> – At the age of 2-3, a child starts reacting to sounds and saying ma, ma. But if your toddler doesn't respond to sound and is unable to feel a certain fragrance or smell, then it is a symptom of sensory issues.</li>\n</ul>\n<p>'Does my child need occupational therapy?' is the most searched query on the Internet. Parents are not aware of the professional techniques a skilled therapist uses. They need professional therapists to overcome these problems in their children.</p>\n\n<h2>Who is an Occupational/Pediatric Therapist?</h2>\n<p>An occupational therapist is a person who helps your child to deal with various issues like sensory issues, problems in motor skills, inability to perform daily tasks. They qualify the national exam, complete their degree in therapy, and become a therapist with a certified license.</p>\n\n<h2>How long does a Child Need Occupational Therapy?</h2>\n<p>How long occupational therapy can go depends on many factors of a child. There is no clear answer to this question. Because if a child has some critical issues like autism spectrum disorder, they will take a long period to recover. Therapists will assist you in how to help your child in recovery with the help of certain techniques.</p>\n<p>Some toddlers are experts in learning techniques while others are slow at this. It also depends on the needs and requirements of a child. For better results, the therapist sets a bookmark, and according to it, they depict the period. Parents can also help their children to learn new things in playing methods. With clinical observation and standardized assessments, pediatric therapists evaluate a child's basic requirements and how they can overcome their issues. Therapists meet with parents, teachers, friends, and the persons close to the child to get aware of the child's surrounding environment.</p>\n\n<h2>10 Indications to Know the Need of Occupational Therapy for Children</h2>\n<p>If a child cannot do daily activities without taking anybody's help at home, school, while playing, etc., these all are symptoms that they need occupational therapy. Here are the ten most common signs:</p>\n<ol>\n<li><strong>Age-Appropriate Developmental Delay</strong> – With the age of 2-3, a child starts crawling, moving, jumping, etc. But some children are unable to perform these tasks. They find it difficult to connect their mind with physical movement. It means they need additional help from a therapist to overcome these difficulties.</li>\n<li><strong>Issues in Visual Processing</strong> – Visual processing is a process in which we behave according to what we see. If a child doesn't recognize letters, alphabets, etc., finding it difficult to give a gap between shapes, it is a symptom of visual processing disorder.</li>\n<li><strong>Refrain from Social Interaction</strong> – If a person cannot communicate properly, is uninterested in interacting with new people, or faces difficulty in adopting a new environment or in sharing things with family and peers, these are signs of being socially unstable.</li>\n<li><strong>Sensory Processing</strong> – A child with sensory processing issues overreacts to certain things, like frustration on noise, inability to calm themselves, instability, problems while coping, etc., or sometimes a child with this problem is under-responsive while doing certain activities.</li>\n<li><strong>Difficulties in Performing Fine Motor Tasks</strong> – When fine motor skills are affected, children cannot perform tasks like using scissors, holding a toy, solving a puzzle, poor handwriting, coloring, eating by themselves, and avoiding games that involve fine motor skills.</li>\n<li><strong>Feeling of Anxiety when Gross Motor Skills Require</strong> – A child with reduction in these skills cannot coordinate with hands, legs, arms, and body parts, and faces difficulties in age-appropriate activities. Symptoms are poor body balance, inability to coordinate with body parts, difficulty while walking in a straight line, etc.</li>\n<li><strong>Delay in Development of Oral Sensory</strong> – Oral sensory includes movement of lips, jaw, teeth, soft palate, and tongue. Delay in oral skills can be shown in many ways, like difficulty in chewing food, excessive drool, being choosy about certain foods, and issues in drinking with the cup at an age-appropriate time.</li>\n<li><strong>Learning Disability</strong> – The need of occupational therapy for children is essential if your child faces challenges like difficulty in learning new things, getting distracted easily, unable to solve age-appropriate issues, learning one thing at a time, and issues while performing tasks.</li>\n<li><strong>Emotionally Inexpressive</strong> – Sometimes, when a child doesn't express their emotions well, they become introverted. They do not express their feelings, unable to share their mood swings with family. And sometimes toddlers don't use emotive terms like happy, jealousy, or sad.</li>\n<li><strong>Unable to Perform Daily Life Activities</strong> – We all do a few tasks regularly, like bathing, dressing, eating, etc. Struggling with these activities is a serious concern that needs the surveillance of a skilled therapist. Inability to self-dress, combing hair, and needing adult help while eating or drinking are the problems that a child faces.</li>\n</ol>\n\n<h2>Best Occupational Therapy Center in Noida</h2>\n<p>TheraKids Noida is a professional therapy center for children that provides different therapies depending on the disorder a child is facing. The fee structure is affordable. Moreover, it offers the world's best facilities. They have professional pediatric therapists who assist you with the surrounding environment your child needs. Therapists use different techniques to make it easy for your child to overcome their issues. They inform you time by time about the benefits of therapy and child performance.</p>\n\n<h2>Final Verdict</h2>\n<p>In this write-up, we explained the need of occupational therapy for children. We also described the 10 top symptoms to identify if your child needs occupational therapy and how you can help them to overcome these disabilities. We explained the significant role therapists play in your child's life with the help of techniques.</p>",
   "published_at": "2022-07-21T03:30:00.000Z",
   "meta_title": null,
   "meta_description": null
  },
  {
   "id": 6,
   "slug": "occupational-therapy-center-in-noida",
   "title": "The Best Occupational Therapy Center in Noida",
   "excerpt": "If you have a query like how to find an occupational therapy center near me, we have the best occupational therapy center in Noida for kids.",
   "featured_image": "/images/gallery/therakids/noida-centre-01.jpg",
   "author": "Om Prakash",
   "category": "Occupational Therapy",
   "content": "<p>Occupational therapy (OT) is a healthcare profession that focuses on the therapeutic application of collaborative projects or activities to heal physical, mental, behavioral, and emotional disorders that impair a patient's ability to perform daily tasks. For example, picking up objects with tweezers could be one of the tasks used to develop fine motor skills. Jumping jacks or completing a barrier course are two exercises that can help improve gross motor skills. Therapists may work with someone who has difficulty using movement planning in a daily routine, e.g., when getting dressed.</p>\n\n<h2>What type of patient needs to visit an occupational therapy center?</h2>\n<ul>\n<li>Birth defects</li>\n<li>Sensory processing disorders</li>\n<li>An unexpected injury to the central nervous system or spinal cord.</li>\n<li>Learning difficulties</li>\n<li>A person who has a mental illness</li>\n<li>Individuals suffering from a bone injury</li>\n</ul>\n\n<h2>What Does an Occupational Therapist Actually Do?</h2>\n<p>The work of occupational therapists is to help patients manage the consequences of impaired performance caused by sickness, aging, and/or any tragic incident so that they can carry out daily tasks or activities, whether physical, psychological, social, or environmental.</p>\n\n<h2>Occupational Therapy Center Roles</h2>\n<p>An occupational therapist's role entails meeting with patients, explaining treatment plans, and initiating therapeutic procedures to improve patients' ability to perform basic functions that are essential for daily life. To improve patient outcomes, occupational therapists may collaborate with physical therapists to approach patient care with a combined treatment program.</p>\n\n<h2>Occupational Therapist Responsibilities</h2>\n<ul>\n<li>Managing therapy procedures and commanding patients with therapy activities and tasks that encourage rehabilitation of patient injuries and traumas.</li>\n<li>Using technical or computer applications to document and show patient medical information and reports.</li>\n<li>Organizing and keeping patients' medical and treatment records and documenting therapy sessions and procedures.</li>\n<li>Keeping therapy equipment such as walkers, lifts, mechanical chairs, pulleys, and other exercise equipment that is required for therapy sessions.</li>\n<li>Working in tandem with physical therapists and speech pathologists to create and implement successful treatment programs for patients.</li>\n</ul>\n\n<h2>What Exactly Is Occupational Therapy For Children?</h2>\n<p>An occupational therapy professional assesses the kid's condition to determine what kinds of issues the youngster has, such as sensory, gross, or motor abilities. Based on the inspection, a goal is set for the child, which regular intervention sessions can only achieve.</p>\n<ul>\n<li>A child with autism may require occupational therapy due to sensory problems like touch or sound responsiveness.</li>\n<li>OT also assists children with bad handwriting.</li>\n<li>OT is useful for toilet or self-feeding training of children also.</li>\n<li>Some children may have problems with motor skills, which affect their capability to control tiny objects.</li>\n<li>Occupational therapy specializes in bodily functioning and the capability to carry out fundamental responsibilities independently.</li>\n<li>It can help children with special requirements to participate in social situations independently and with self-belief.</li>\n</ul>\n<p>OT keeps track of the child's physical, psychological, social, and environmental needs. Therapy can significantly impact a child's life by re-establishing independence and self-confidence. Our occupational therapists deal with children of all ages who have a variety of issues, whether they be physical, mental, or emotional.</p>\n\n<h2>What exactly does an Occupational Therapist perform during the day?</h2>\n<p>Talk to clients patiently to aid them in providing the best quality of life possible within the constraints of their unique health problems and to assist them in living a high-yielding life. Specifics vary depending on age and stage of life. A child's routine chores may include playing; an adult's routine duties may include home care or work-related skills, and geriatrics' routine tasks may include progress toward independence in self-care. School-age students work on-site in the school system, and so on. What OTs do daily is determined by their age group, area of practice, and more.</p>\n\n<h2>Conclusion</h2>\n<p>We have supplied some vital facts about an occupational therapist's employment, functions, and obligations. If there is a question coming into your mind that should I visit the occupational therapy centers near me for treatment then the answer for that is definitely yes as there are so many benefits of occupational therapy.</p>\n\n<h2>Frequently asked question</h2>\n<p><strong>Are your occupational therapy centers near me?</strong><br/>Yes, we provide occupational therapy services in Noida. We hope that your doubt regarding the occupational therapy clinics near me is solved.</p>",
   "published_at": "2022-07-01T03:30:00.000Z",
   "meta_title": null,
   "meta_description": null
  },
  {
   "id": 4,
   "slug": "benefits-of-speech-therapy-for-kids",
   "title": "Speech Therapy for Kids: Benefits of Speech Therapy for Kids",
   "excerpt": "Speech therapy is used to identify and treat communication problems and speech disorders. Learn the benefits of speech therapy for kids.",
   "featured_image": "/images/services/speech-therapy.jpg",
   "author": "Om Prakash",
   "category": "Speech Therapy",
   "content": "<p>Speech therapy is used to identify and treat communication problems and speech disorders. It is performed by speech-language pathologists (SLPs), sometimes called speech therapists. Logopedic approaches are carried out to improve communication. Depending on the nature of the speech or language problem, this may be articulation therapy, language intervention exercises, or others. Speech therapy may be required for childhood or adolescent speech difficulties caused by injury or illness, such as a heart attack, stroke, or brain injury.</p>\n\n<h2>What is speech therapy?</h2>\n<p>Speech therapy is a type of intervention that aims to improve a child's voice and ability to interpret and express language, especially nonverbal cues. These services are provided by speech therapists, often known as \"speech and language therapists\" (SLPs). Speech therapy consists of two parts:</p>\n<ul>\n<li>Lip coordination to produce sounds that form words and phrases (to address articulation, fluency, and voice volume regulation)</li>\n<li>Language comprehension and expression (to address language use in written, pictorial, body, and sign forms, as well as in alternative communication systems such as social media, computers, and iPads). Furthermore, the function of SLPs in the treatment of swallowing difficulties has expanded to include those aspects of feeding.</li>\n</ul>\n\n<h2>When is speech therapy needed?</h2>\n<p>Speech therapy may be needed for speech disorders that develop in childhood or adult speech impairments caused by injury or disease, such as stroke or brain injury.</p>\n\n<h2>Why Do Some Children Require Speech-Language Therapy?</h2>\n<ul>\n<li>Hearing difficulties, mental (thinking, intellectual), or other developmental disabilities.</li>\n<li>Oral tendons that are weak</li>\n<li>The hoarseness persists.</li>\n<li>Cleft lip and palate.</li>\n<li>Autism.</li>\n<li>Motor planning issues and articulation issues.</li>\n</ul>\n\n<h2>What are the benefits of speech therapy for kids?</h2>\n<h3>Communication Aid</h3>\n<p>Provide opportunities for voiceless children to communicate through augmented and unaided communications (e.g., notebooks, low- and medium-tech communications devices, high-tech communications devices, or communications applications). Many people believe speech therapy is all about language, but it's so much more than that.</p>\n<h3>Help with Social Skills</h3>\n<p>Appropriate pragmatic/social skills are key to interacting with others in your community and your life. When you have limited or no language function, pragmatic language skills are often significantly delayed and impaired. Social skills can be specifically promoted with the help of video models, role plays, specific therapy apps, social stories, and various other strategies and tools. Using assisted communication with these strategies to improve these social skills is an important aspect of speech therapy.</p>\n<h3>Reading Help</h3>\n<p>Speech delays can cause problems with hearing, reading, and writing. Reading and reading skills can help significantly in communication. If you can spell, you can communicate freely.</p>\n<h3>Improving Alternative Communication Methods</h3>\n<p>Work on other communication strategies to facilitate communication, such as gestures, sign language, approximations, vocalizations, or other means of communication.</p>\n\n<h2>When to start speech therapy for a toddler</h2>\n<p>The optimal age for speech therapy for toddlers is when your child begins to fall behind or when you discover they aren't meeting milestones. However, it is never too soon or too late to begin counseling. Around 18 months of age, children who are not speaking at all are typically referred for speech and language assessments.</p>\n\n<h2>Types of Speech Therapy</h2>\n<h3>Speech Therapy related to Stuttering</h3>\n<p>Many parents don't know this, but stuttering is incredibly frustrating for children. Unable to control the involuntary repetition of words, sounds, and syllables, children feel powerless and sometimes blame themselves. The good news is that an SLP can do a lot to help your child. Initially, the SLP will ask you to describe your child's stuttering symptoms. Based on your description and their assessment, the SLP will then tell you whether speech therapy is necessary as soon as possible. It is because most children can fully recover from stuttering over time.</p>\n<h3>Speech therapy related to apraxia of speech</h3>\n<p>With apraxia of speech, children know what they want to say but have difficulty making the right sounds or saying the right syllables. Therefore, it is generally limited to certain syllables and sounds only. While children who stutter often outgrow it, apraxia of speech does not go away. Many parents make the mistake of believing this disorder is temporary because they've seen an adult recover from it. However, the truth is that apraxia in children is not the same as in adults. The only solution is speech therapy by a licensed SLP. An SLP begins by assessing your child's symptoms and the severity of their condition — usually with an \"oral motor assessment\" looking for muscle weakness in the jaw, lip, and tongue, followed by listening to your child's speech to see if the stresses and pauses are placed correctly.</p>\n<h3>Speech Therapy for Aphasia</h3>\n<p>Unlike the other disorders on this list, aphasia is caused solely by brain injury. So it's not a condition but rather a symptom of brain damage. It is common for children with aphasia to have difficulty speaking, as they have trouble finding the right words and end up saying strange or inappropriate things in conversation. Fortunately, aphasia in children is not permanent and improves over time. Most studies have shown that children with aphasia improve their language and communication skills as brain tissue repairs and new connections are formed.</p>\n<h3>Speech Therapy for Swallowing Difficulties</h3>\n<p>Because children with swallowing difficulties have difficulty maintaining good control of their mouth and tongue, their speech may come out differently than expected. In addition, swallowing difficulties are usually caused by nerve damage or head and neck problems, which can further complicate your speech problems. A speech therapist can help your child improve their speech skills by recommending swallowing exercises to strengthen the mouth, increase tongue range of motion, and improve chewing habits. All of this together helps your child swallow food and liquids more effectively, significantly improving their speech.</p>\n\n<h2>Conclusion</h2>\n<p>Poor communication abilities hamper many people's success. If your children are having difficulty with it, they must work on improving themselves so that they can articulate their opinions. If you seek a rehabilitation center, TheraKids Noida is the best choice. It offers world-class facilities for children's speech therapy. Our therapists are highly qualified professionals who give close attention to each child and help them gain confidence. Our first philosophy is to create an environment where people can gain confidence in dealing with their limitations.</p>",
   "published_at": "2022-06-28T03:30:00.000Z",
   "meta_title": null,
   "meta_description": null
  },
  {
   "id": 7,
   "slug": "speech-therapy-what-is-it-types-test-treatment",
   "title": "Speech Therapy – What is it, Types, Test & Treatment",
   "excerpt": "Communication is the most necessary part of human life. Without it, life becomes difficult. If the person can't speak properly, speech therapy helps.",
   "featured_image": "/images/services/special-education.jpg",
   "author": "Om Prakash",
   "category": "Speech Therapy",
   "content": "<p>Communication is the most necessary part of human life. Without it, life becomes difficult. If the person can't speak properly, it can create tremendous problems for them as well as their family. Speech therapy is the medical process that helps improve a person's communication and language disorders.</p>\n\n<h2>What is Speech Therapy?</h2>\n<p>Speech therapy is a medical process that helps you to improve your communication accent and language disorder. Speech treatment was first developed by Robert West, the father of voice therapy in the world. He also wrote an old text in speech therapy; The Rehabilitation of Speech.</p>\n<p>A speech therapy specialist is known as a speech therapist or language pathologist. It includes several programs that include language-mediated activities, articulation remedies, and others, depending on the type of disorder.</p>\n\n<h2>Why Does Your Child Need Speech And Language Therapy?</h2>\n<p>From childhood to being a senior citizen is a beautiful journey. In this journey, we do many things, but the essential part is the communication we conduct with people. So, imagine a person who is unable to speak or finds it difficult to pronounce a word. This scenario may create trauma in a person. Therefore, a newborn baby starts its journey by saying the first word — ma, ma. But if a child begins speaking after 3-4 years or maybe is unable to speak, facing issues like stammering, lisp, etc., it is not a common issue and can cause a tremendous problem with the running time in your child. Here are some of the speech-language disorders:</p>\n<ul>\n<li><strong>Articulation disorder</strong> – A child with this disorder cannot pronounce certain alphabets or words; they may say \"tith\" instead of \"teeth.\" Children add, swap or may distort some words.</li>\n<li><strong>Fluency disorder</strong> – This disorder affects the flow and rhythm of communication. It includes two sub-parts: stuttering and cluttering. A person with a cluttering problem speaks very fast, and you may be unable to understand their language.</li>\n<li><strong>Cognitive disorder</strong> – When a part of your brain gets damaged or injured, it can cause cognitive disorder. In this case, you cannot solve problems, and your mind will perform tasks leisurely.</li>\n<li><strong>Dysarthria</strong> – Muscles play an important role while you speak. If muscles get injured or become weak due to stroke, ALS, or MS, it can cause this dysarthria disorder.</li>\n<li><strong>Aphasia</strong> – A person with this disorder is unable to speak a word and finds it difficult to understand what others are saying. Without proper speech therapy, this disorder can cause reading and writing disabilities.</li>\n<li><strong>Expressive disorder</strong> – A child becomes unable to form correct sentences, like making grammatical errors or incorrect verb use. This disorder is caused by unhealthy development of a child, critical medical conditions, Down syndrome, etc.</li>\n<li><strong>Receptive disorder</strong> – The most common symptom is the inability to understand what others are saying or processing it late in the brain. Hearing loss, stroke, injury, etc., can lead to this disorder.</li>\n<li><strong>Apraxia</strong> – A most common speech disease in which you understand what others say. But, when you try to reply, you find it difficult to form the correct sentence.</li>\n</ul>\n\n<h2>Different Kinds of Therapies/Activities to Treat a Speech Disorder</h2>\n<ul>\n<li><strong>Articulation Therapy</strong> – In this therapy, specialists use a play method. The type of game depends on the age of the child. A therapist helps children make certain sounds and guides them to pronounce that sound using the tongue.</li>\n<li><strong>Speech Obtrusive Therapy</strong> – Pathologists treat children using books and objects and by talking and playing with them. This method is basically to improve grammar, language accent, and vocabulary enhancement. This speech therapy service also includes a reiteration method to improve language skills.</li>\n<li><strong>Oral-Motor/Feeding and Swallowing Therapy</strong> – This method refers to different exercises, including facial massage, neck exercise, and muscle exercise. It helps children to be orally active while drinking, eating, or swallowing.</li>\n</ul>\n\n<h2>How Long Does Pediatric Speech Therapy Usually Last?</h2>\n<p>There is no specific time period for your child's recovery. Because, along with having the required pathologist guidance, several factors affect the duration of recovery:</p>\n<ol>\n<li>Age is a crucial factor in recovery</li>\n<li>Critical medical condition</li>\n<li>Type of speech disorder</li>\n<li>Method of treatment</li>\n</ol>\n<p>Some disorders don't need special surveillance, while others increase over time if you don't conduct speech therapy for kids with the right pathologist's guidance.</p>\n\n<h2>Which is the Best Speech Therapy Service for Kids in Noida?</h2>\n<p>Therakids Noida is the best speech therapy service provider for kids in Noida. With affordable charges, and fees depending on the duration of therapy a child needs. We highly recommend you provide your child a safe place with high professional pathologists. It proves it possible for your child to become normal and help them communicate with good fluency.</p>\n\n<h2>Frequently Asked Questions</h2>\n<p><strong>Q1. What does speech therapy do?</strong><br/>Speech therapy is a medical process that helps you to overcome your language disorder with the help of a speech-language therapist.</p>\n<p><strong>Q2. What are some speech therapy techniques?</strong><br/>Speech Obtrusive technique, Articulation therapy, Oral-Motor/Feeding and Swallowing technique.</p>\n<p><strong>Q3. How do I know if my child needs speech therapy?</strong><br/>A normal child starts babbling at the age of 2-3. And, if your child doesn't react to your sound, or maybe finds it difficult to speak a word in flow, therapy can help.</p>\n<p><strong>Q4. Does speech delay mean autism?</strong><br/>No, speech delay is not specific to autism. Because many people face speaking issues, and the reason is global developmental delay, physical disability, stroke, and many more.</p>\n<p><strong>Q5. What age is best for speech therapy?</strong><br/>There is no age barrier for speech therapy. At every stage of your life, you can take this therapy.</p>",
   "published_at": "2022-05-18T03:30:00.000Z",
   "meta_title": null,
   "meta_description": null
  },
  {
   "id": 3,
   "slug": "difference-between-occupational-therapy-and-physiotherapy",
   "title": "Difference Between Occupational Therapy and Physiotherapy",
   "excerpt": "People always get confused on deciding whether they should go for occupational therapy or physiotherapy. Here are six key differences explained.",
   "featured_image": "/images/services/occupational-therapy.jpg",
   "author": "Om Prakash",
   "category": "Occupational Therapy",
   "content": "<p>People always get confused on deciding whether they should go for occupational therapy or physiotherapy. Although, the intention of both health care is to help people who are suffering from mental illnesses and mobility problems. The therapists first examine the medical history and behavior of patients, after that only they decide whether patients require occupational therapy or physiotherapy. When you consider these two therapies, you might feel like they are similar, but let us tell you that there are also many differences. Here, we will look at the difference between occupational therapy and physiotherapy.</p>\n\n<h2>1) Meaning</h2>\n<h3>What is Occupational Therapy?</h3>\n<p>Occupational therapy is a treatment related to fine motor skills. Fine motor skills are activities that help patients to make movements using the small muscles in their hands and wrists. Due to muscular problems, kids can't do their daily tasks. Such kids should go for occupational therapy as it opens up their jammed muscles.</p>\n<h3>What is Physiotherapy?</h3>\n<p>Physiotherapy treatment is provided to patients who have difficulties in mobility and stability. Physiotherapy exercises help to heal back pain, neck pain, jammed muscles, heart problems, and lack of mobility. This kind of problem can be caused by cerebrovascular accidents, injuries, illness, or disabilities. Overall it's a great health profession that changes the lives of disabled people by delivering them out of critical conditions.</p>\n\n<h2>2) Functions</h2>\n<p><strong>Occupational Therapy</strong> – In occupational therapy, therapists intend to make a patient capable enough to do his daily tasks by himself. They mainly focus on improving fine motor skills, which involves using the smaller muscle of the hands. The fine motor skills activities are beneficial for both kids and adults. With the help of these activities, a patient can develop many skills such as brushing teeth, writing, using scissors, typing, opening lunch boxes, drawing, and much more. Continuously doing the exercises can help to gain more accuracy in performing the daily tasks.</p>\n<p><strong>Physiotherapy</strong> – Physiotherapy is related to exercises that help to move the big muscles of the body. In physiotherapy, the therapists focus on improving gross motor skills. With the help of this technique, a paralyzed person can develop the skills like standing, walking, running, jumping, sitting upright at the table, etc. In this segment, some exercises also help people to adapt skills such as ball throwing, riding a bike, swimming, etc.</p>\n\n<h2>3) When Your Child Needs Occupational Therapy and Physiotherapy</h2>\n<p>Every child has a particular worldview while growing up. They enjoy their worldview and keep on developing new skills according to their ages. But this is not the case with every child. Some kids find difficulty connecting to others, showing confidence in the work, and making decisions. Occupational Therapy is mainly for such kids. Taking part in this program will help them to adapt skills that will help them be positive in their lives.</p>\n<p>If you have an active child and all of a sudden you begin to see the awkwardness in this behavior like problems in running, walking, standing, jumping, etc. then understand that he must be suffering from some kind of injury or disability in his body. Under such conditions, such patients need the guidance of physiotherapists before the problems get worse. Here, the professional therapists work as a team giving proper attention to patients.</p>\n\n<h2>4) Objectives of Occupational Therapy and Physiotherapy</h2>\n<p><strong>Occupational Therapy</strong></p>\n<ul>\n<li>Develops a self-dependent ability.</li>\n<li>Helps to gain more control over the mobility of hands.</li>\n<li>It trains to deal with many day-to-day tasks.</li>\n<li>Helps to improve the critical conditions of muscles.</li>\n<li>Building hand-eye coordination.</li>\n</ul>\n<p><strong>Physiotherapy</strong></p>\n<ul>\n<li>Relieve from pain.</li>\n<li>Improves the movement of the disabled part.</li>\n<li>Helps to learn to use a walker or cane.</li>\n<li>To access a vast range of mobility.</li>\n<li>Recover from a sports injury.</li>\n</ul>\n\n<h2>5) Roles of Therapists in Occupational Therapy and Physiotherapy</h2>\n<p>Occupational Therapists first understand the condition of patients. After that, they conclude what kind of therapeutic exercise would be beneficial for them. Continuously they keep their attention on the activities of patients. Moreover, they also make a report to see if the development is happening or not. If they don't see any result in the patient, they shift to some other methods.</p>\n<p>Physiotherapists' role is to help disabled people through exercises, movement, manual therapies, education, and advice. They attend people of all ages and work hard on the damaged parts of their bodies to make them functional. They also educate patients to perform certain types of exercises by themselves.</p>\n\n<h2>6) Types of Therapies in Occupational Therapy and Physiotherapy</h2>\n<p><strong>Occupational Therapy</strong></p>\n<ul>\n<li>Mental health therapy.</li>\n<li>OT for autism.</li>\n<li>Geriatric therapy.</li>\n<li>Therapy for eating and swallowing.</li>\n<li>Therapy to retain physical movement.</li>\n</ul>\n<p><strong>Physiotherapy</strong></p>\n<ul>\n<li>Range of motion exercises.</li>\n<li>Ultrasound therapy.</li>\n<li>Cryotherapy and Heat therapy.</li>\n<li>Application of hot and cold.</li>\n<li>Electric stimulation therapy.</li>\n</ul>\n\n<h2>Need Occupational Therapy for Your Children?</h2>\n<p>We are the organization that works together as a team to alter the uncommon state of disabled children. We have professionally trained staff who know how to deal with several kinds of disabilities. If you have a disabled child, we invite you to our campus as we always go to extreme measures to develop your child's skills so that he can also have a bright future. We provide counselling, speech therapy, remedial intervention and Occupational Therapy at our Noida center. We have different therapists for different services so that every child can get the proper care. We guarantee you that with our guidance, you will begin to see a progression in your child.</p>\n\n<h2>Conclusion</h2>\n<p>We have given some vital information on occupational therapy vs physiotherapy. We have described six important differences. Go through the whole blog and know for yourself. In the later part, we have described how greatly your child will be helped if you send him into our care.</p>",
   "published_at": "2022-04-12T03:30:00.000Z",
   "meta_title": null,
   "meta_description": null
  }
 ],
 "conditions": [
  {
   "id": 73,
   "name": "Autism Spectrum Disorder",
   "short_name": "Autism",
   "description": "A neurodevelopmental condition affecting communication, social interaction, and behavior. We focus on enhancing social skills, sensory processing, and promoting independence.",
   "focus_areas": [
    "Social Skills",
    "Sensory Regulation",
    "Communication"
   ],
   "image": "/images/conditions/autism.jpg",
   "display_order": 1
  },
  {
   "id": 74,
   "name": "ADHD",
   "short_name": "ADHD",
   "description": "Attention-Deficit/Hyperactivity Disorder involves differences in attention, focus, and impulse control. Our therapies help build executive functioning, emotional regulation, and academic success.",
   "focus_areas": [
    "Executive Functioning",
    "Impulse Control",
    "Attention Span"
   ],
   "image": "/images/conditions/adhd.jpg",
   "display_order": 2
  },
  {
   "id": 75,
   "name": "Down Syndrome",
   "short_name": "Down Syndrome",
   "description": "A genetic condition causing developmental and physical differences. We provide early intervention focusing on motor milestones, speech development, and cognitive skills.",
   "focus_areas": [
    "Motor Milestones",
    "Speech Development",
    "Cognitive Skills"
   ],
   "image": "/images/conditions/down-syndrome.jpg",
   "display_order": 3
  },
  {
   "id": 76,
   "name": "Cerebral Palsy",
   "short_name": "Cerebral Palsy",
   "description": "A group of disorders affecting movement and muscle tone. Our therapies focus on maximizing mobility, functional independence, and overall quality of life.",
   "focus_areas": [
    "Mobility",
    "Muscle Tone",
    "Functional Independence"
   ],
   "image": "/images/conditions/cerebral-palsy.jpg",
   "display_order": 4
  },
  {
   "id": 77,
   "name": "Global Developmental Delay (GDD)",
   "short_name": "GDD",
   "description": "When a child is significantly delayed in multiple developmental areas (motor, speech, cognitive). We provide comprehensive, multidisciplinary intervention to bridge the gaps.",
   "focus_areas": [
    "Multidisciplinary Care",
    "Milestone Tracking",
    "Early Intervention"
   ],
   "image": "/images/conditions/gdd.jpg",
   "display_order": 5
  },
  {
   "id": 78,
   "name": "Learning Disability",
   "short_name": "LD",
   "description": "Challenges affecting how the brain receives, processes, or responds to information (e.g., Dyslexia). We offer specialized educational support to build academic confidence.",
   "focus_areas": [
    "Reading & Writing",
    "Academic Confidence",
    "Special Education"
   ],
   "image": "/images/conditions/learning-disability.jpg",
   "display_order": 6
  },
  {
   "id": 79,
   "name": "Speech & Language Delay",
   "short_name": "Speech Delay",
   "description": "When a child's language development is slower than typical milestones. Our speech pathologists work to improve articulation, comprehension, and expressive communication.",
   "focus_areas": [
    "Articulation",
    "Comprehension",
    "Expressive Language"
   ],
   "image": "/images/conditions/speech-delay.jpg",
   "display_order": 7
  },
  {
   "id": 80,
   "name": "High Risk Infants",
   "short_name": "High Risk Infants",
   "description": "Infants born prematurely or with medical complications requiring early developmental monitoring and preventative therapy to ensure optimal growth trajectories.",
   "focus_areas": [
    "Early Monitoring",
    "Preventative Therapy",
    "Infant Care"
   ],
   "image": "/images/conditions/high-risk-infants.jpg",
   "display_order": 8
  },
  {
   "id": 81,
   "name": "Intellectual Disability",
   "short_name": "ID",
   "description": "Characterized by significant limitations in intellectual functioning and adaptive behavior. We focus on teaching functional life skills and enhancing independence.",
   "focus_areas": [
    "Life Skills",
    "Independence",
    "Adaptive Behavior"
   ],
   "image": "/images/conditions/intellectual-disability.jpg",
   "display_order": 9
  },
  {
   "id": 82,
   "name": "Developmental Coordination Disorder",
   "short_name": "DCD",
   "description": "Also known as dyspraxia, affecting physical coordination. We help improve motor planning, balance, and execution of daily physical tasks.",
   "focus_areas": [
    "Motor Planning",
    "Balance",
    "Physical Coordination"
   ],
   "image": "/images/conditions/dcd.jpg",
   "display_order": 10
  },
  {
   "id": 83,
   "name": "Social Communication Disorder",
   "short_name": "SCD",
   "description": "Difficulties with the use of verbal and nonverbal language for social purposes. We facilitate social groups to practice pragmatic language and peer interactions.",
   "focus_areas": [
    "Pragmatic Language",
    "Peer Interaction",
    "Group Sessions"
   ],
   "image": "/images/conditions/social-communication.jpg",
   "display_order": 11
  },
  {
   "id": 84,
   "name": "Hemiparesis",
   "short_name": "Hemiparesis-EDIT",
   "description": "Weakness or partial paralysis on one side of the body. Our PT and OT programs focus on strengthening, bilateral coordination, and functional mobility.",
   "focus_areas": [
    "Strengthening",
    "Bilateral Coordination",
    "Functional Mobility"
   ],
   "image": "/images/conditions/hemiparesis.jpg",
   "display_order": 12
  }
 ],
 "testimonials": [
  {
   "id": 15,
   "name": "Meera Gupta",
   "designation": "Parent, Noida EDITTEST",
   "testimonial": "When my son was diagnosed with autism at three, we felt lost. The team at THERAKids gave us a clear plan and, more importantly, hope. Eighteen months later he is speaking in sentences and thriving in a mainstream school.",
   "display_order": 1
  },
  {
   "id": 16,
   "name": "Rajesh Kumar",
   "designation": "Parent, Delhi",
   "testimonial": "The occupational therapists here are exceptional. My daughter went from being unable to hold a pencil to writing full pages. Every milestone was celebrated like a festival.",
   "display_order": 2
  },
  {
   "id": 17,
   "name": "Anjali & Rohan Mehta",
   "designation": "Parents, Greater Noida",
   "testimonial": "We were initially worried about therapy feeling clinical. THERAKids is the opposite; our daughter runs to the door for her sessions. The parent counselling sessions helped us support her at home too.",
   "display_order": 3
  },
  {
   "id": 18,
   "name": "Fatima Sheikh",
   "designation": "Parent, Indirapuram",
   "testimonial": "Dr. Rahul transformed my son's speech. From ten words to full conversations in a year. The progress reports every month kept us involved in every step of his journey.",
   "display_order": 4
  }
 ],
 "faqs": [
  {
   "id": 211,
   "question": "What is Occupational Therapy and how does it help children?",
   "answer": "Occupational therapy helps children develop the motor, sensory, and cognitive skills needed for everyday activities. Our therapists work with children to improve fine motor skills, sensory processing, and visual motor skills needed for dressing, writing, and playing. We track every child's improvement and tailor our approach to their unique potential."
  },
  {
   "id": 212,
   "question": "At what age should my child start therapy?",
   "answer": "Most pediatric therapies start from the age of 3 years. However, some therapies like speech therapy can start even earlier. Early intervention is key: the sooner we can assess and begin working with your child, the better the outcomes. We recommend consulting with our specialists if you notice any developmental delays."
  },
  {
   "id": 213,
   "question": "What does Speech Therapy involve?",
   "answer": "Speech therapy supports children in developing strong communication skills. It addresses articulation, receptive and expressive language, social pragmatic skills, and helps children express their thoughts and articulate words. Our speech-language pathologists also work on non-verbal communication and body language skills."
  },
  {
   "id": 214,
   "question": "When does my child need Physiotherapy?",
   "answer": "If your child has difficulty performing basic movements because of an injury or illness, they may need physiotherapy. Delay in learning motor skills is not always considered a problem with movement, but our physiotherapists can help assess whether your child would benefit from therapy to improve mobility, balance, and strength."
  },
  {
   "id": 215,
   "question": "How do I know which therapy is right for my child?",
   "answer": "Every child is unique. We begin with a comprehensive assessment to understand your child's specific needs, strengths, and areas for growth. Based on this evaluation, our multidisciplinary team creates an individualized plan that may include one or more therapy types. Contact us to schedule an initial consultation."
  }
 ],
 "founders": [
  {
   "id": 1,
   "name": "Sandeep Rana",
   "role": "Founder & Chairman",
   "title_line": "Founder & Chairman, THERAKids Foundation",
   "subtitle_line": null,
   "profile_image": "/images/sandeep_rana.jpg",
   "paragraphs": [
    "With over 20 years of experience in healthcare management and child development, Sandeep Rana brings visionary leadership, strategic insight, and a deep sense of purpose to THERAKids Foundation.",
    "For Sandeep, THERAKids is more than a child development centre— it is a vision built on compassion, purpose, and the belief that every child deserves the opportunity to thrive.",
    "What began in 2019 from a small space with a powerful dream has grown into two state-of-the-art child development centres in Noida and Greater Noida West, supported by a dedicated team of 40+ professionals across multiple disciplines of pediatric care.",
    "Under his leadership, THERAKids has evolved into a trusted name in child development, with a strong commitment to accessible, ethical, and quality therapeutic care. His vision is to create an environment where children receive the right support, families feel empowered, and professionals are encouraged to grow and make a meaningful difference.",
    "Beyond leading the organization, Sandeep is passionate about mentoring therapists and educators and contributing to the growth of pediatric care. He believes that true leadership is not only about building an organization, but about building people, creating impact, and transforming lives."
   ],
   "closing_line": "At the heart of his journey are three guiding principles: Compassion. Purpose. Karma.",
   "display_order": 1
  },
  {
   "id": 2,
   "name": "Dr. Akanksha Rana",
   "role": "Co-Founder & Consultant",
   "title_line": "Co-Founder & Consultant, THERAKids Foundation",
   "subtitle_line": "Senior Pediatric Occupational Therapist",
   "profile_image": "/images/akanksha_rana.jpg",
   "paragraphs": [
    "With over 16 years of experience in pediatric occupational therapy and child development, Dr. Akanksha Rana is a distinguished clinician and a driving force behind the clinical vision of THERAKids Foundation.",
    "As Co-founder and Consultant, she plays a pivotal role in shaping THERAKids’ clinical standards, therapeutic philosophy, and commitment to child-centred care. Her expertise spans sensory integration, developmental delays, autism spectrum disorders, and pediatric rehabilitation, combining evidence-based practice with compassionate, individualized care.",
    "Over the years, her clinical expertise and unwavering commitment have helped thousands of children progress toward their developmental potential while empowering families with greater understanding, confidence, and hope.",
    "At THERAKids, Dr. Akanksha provides clinical leadership to a multidisciplinary team, fostering a culture of clinical excellence, innovation, continuous learning, and compassionate care.",
    "Her vision is to ensure that every child is understood beyond a diagnosis, supported according to their unique needs, and given every opportunity to reach their fullest potential."
   ],
   "closing_line": "For Dr. Akanksha, therapy is not simply about achieving milestones— it is about unlocking potential, building confidence, and creating meaningful possibilities for every child.",
   "display_order": 2
  }
 ]
};
