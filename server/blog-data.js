// Single source of truth for ALL blog posts (2 published posts):
//   - seed-blogs.js              → upserts these into the live database
//   - scripts/sync-seed-blogs.js → regenerates the BLOGS section of seed.sql
// so fresh database installs get the same 2 posts as the live DB.
// Edit content here, then re-run both to keep everything in sync.

const IMG = (n) => `/images/gallery/${n}`;

const BLOGS = [
  // ---------- The 2 fallback posts previously only in seed.sql ----------
  {
    title: 'Understanding Sensory Processing Disorder',
    slug: 'understanding-sensory-processing',
    excerpt: 'Learn about the signs of SPD and how occupational therapy can provide strategies for self-regulation.',
    category: 'Occupational Therapy',
    author: 'Dr. Priya Sharma',
    featured_image: '/images/blogs/sensory-processing.jpg',
    published_at: '2026-08-10 09:00:00',
    content: `<p>Some children experience the world through their senses more intensely than others. Sounds feel louder, textures feel harsher, and busy environments can quickly become overwhelming. When these reactions start to interfere with daily life (dressing, eating, playing, or learning), it may be a sign of Sensory Processing Disorder (SPD).</p>

<h3>Common signs to watch for</h3>
<ul>
<li>Covering ears at everyday noises or reacting strongly to touch</li>
<li>Avoiding certain foods because of texture or temperature</li>
<li>Constant movement such as spinning, crashing, or fidgeting, or avoiding movement altogether</li>
<li>Meltdowns in busy places like supermarkets or playgrounds</li>
</ul>

<h3>How occupational therapy helps</h3>
<p>Our occupational therapists use play-based sensory integration to help children gradually build tolerance and regulation. Therapy looks like fun, with swings, climbing, and tactile games, but each activity is chosen to target specific sensory systems and teach the nervous system to respond more comfortably.</p>
<p>With consistent support, children learn strategies to self-regulate, and parents learn how to set up sensory-friendly routines at home. Early support makes a remarkable difference.</p>`
  },
  {
    title: 'Speech Milestones for Toddlers',
    slug: 'speech-milestones-toddlers',
    excerpt: 'A quick guide for parents on what to expect as your toddler develops their communication skills.',
    category: 'Speech Therapy',
    author: 'Dr. Rahul Verma',
    featured_image: '/images/blogs/speech-milestones.jpg',
    published_at: '2026-08-22 09:00:00',
    content: `<p>Every child develops at their own pace, but language follows a fairly predictable path. Knowing the typical milestones helps you celebrate progress and spot early when a little extra support could help.</p>

<h3>12 to 18 months</h3>
<p>First words appear, usually naming people and favourite objects. Your toddler understands simple requests like "come here" and points to show interest.</p>

<h3>18 to 24 months</h3>
<p>Vocabulary grows quickly, often to 50 or more words, and two-word combinations begin: "more juice", "daddy go".</p>

<h3>2 to 3 years</h3>
<p>Sentences of three or more words, question words like "what" and "where", and speech that is mostly understood by familiar adults.</p>

<h3>When to seek an assessment</h3>
<ul>
<li>No words by 16 months</li>
<li>No two-word phrases by age 2</li>
<li>Loss of words or skills at any age</li>
<li>You simply feel something is different, so trust your instincts</li>
</ul>

<p>Early intervention is the single biggest factor in speech outcomes. If you are unsure, a developmental screening takes less than an hour and gives you a clear picture of where your child stands.</p>`
  },

];

module.exports = { BLOGS };
