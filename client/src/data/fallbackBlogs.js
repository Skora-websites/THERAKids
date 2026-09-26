// Shared fallback blog data - rendered when the API is unreachable (e.g. static
// Vercel deploy before the backend is hosted). Slugs must have full article
// content in BlogPost.jsx's fallbackPosts map so the detail pages work too.
const fallbackBlogs = [
  {
    id: 1,
    title: 'Understanding Sensory Processing Disorder',
    slug: 'understanding-sensory-processing',
    excerpt: 'Learn about the signs of SPD and how occupational therapy can provide strategies for self-regulation.',
    featured_image: '/images/blogs/sensory-processing.jpg',
    image: '/images/blogs/sensory-processing.jpg',
    category: 'Occupational Therapy',
    published_at: '2026-08-10'
  },
  {
    id: 2,
    title: 'Speech Milestones for Toddlers',
    slug: 'speech-milestones-toddlers',
    excerpt: 'A quick guide for parents on what to expect as your toddler develops their communication skills.',
    featured_image: '/images/blogs/speech-milestones.jpg',
    image: '/images/blogs/speech-milestones.jpg',
    category: 'Speech Therapy',
    published_at: '2026-08-22'
  }
];

export default fallbackBlogs;
