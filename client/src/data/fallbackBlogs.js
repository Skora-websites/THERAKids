// Shared fallback blog data — rendered when the API is unreachable (e.g. static
// Vercel deploy before the backend is hosted). Slugs must have full article
// content in BlogPost.jsx's fallbackPosts map so the detail pages work too.
const fallbackBlogs = [
  {
    id: 1,
    title: 'Understanding Sensory Processing Disorder',
    slug: 'understanding-sensory-processing',
    excerpt: 'Learn about the signs of SPD and how occupational therapy can provide strategies for self-regulation.',
    featured_image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=1200&q=80',
    category: 'Occupational Therapy',
    published_at: '2026-08-10'
  },
  {
    id: 2,
    title: 'Speech Milestones for Toddlers',
    slug: 'speech-milestones-toddlers',
    excerpt: 'A quick guide for parents on what to expect as your toddler develops their communication skills.',
    featured_image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
    category: 'Speech Therapy',
    published_at: '2026-08-22'
  }
];

export default fallbackBlogs;
