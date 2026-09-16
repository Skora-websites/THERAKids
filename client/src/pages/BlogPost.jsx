import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_URL from '../config';
import './Blogs.css';

// Must match the slugs in the fallback blog list in Blogs.jsx — when the API
// is unreachable, these articles render instead of a "Post not found" screen.
const fallbackPosts = {
  'understanding-sensory-processing': {
    id: 1,
    title: 'Understanding Sensory Processing Disorder',
    category: 'Occupational Therapy',
    author: 'THERAkids Team',
    published_at: '2026-08-10',
    featured_image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Sensory Processing Disorder (SPD) affects how the brain interprets signals coming from the senses. For some children, everyday sensations — the hum of a fan, the texture of a sweater, the noise of a crowded classroom — can feel overwhelming or barely register at all. Recognizing the signs early can make a meaningful difference in a child's comfort, confidence, and development.</p>
      <h2>What does sensory processing mean?</h2>
      <p>Every moment, the brain receives information from sights, sounds, touch, movement, and body position. Sensory processing is how the brain organizes that input into a usable picture of the world. When this system works smoothly, a child can focus, play, and learn. When it doesn't, ordinary environments can become confusing or distressing.</p>
      <h2>Common signs to look for</h2>
      <p>Every child is different, but some patterns appear often. A child may cover their ears at normal volumes, avoid certain textures or foods, seem clumsy or unaware of bumps and falls, seek constant movement such as spinning or crashing, or have meltdowns in busy environments that recover quickly once the environment calms.</p>
      <h2>How occupational therapy helps</h2>
      <p>Occupational therapists use play-based, goal-directed activities to help a child's nervous system respond to sensory input more comfortably. Sessions might include swinging, climbing, deep-pressure play, or fine motor games — each chosen to build regulation gradually and joyfully.</p>
      <h2>What parents can do at home</h2>
      <p>Simple routines help: predictable daily rhythms, sensory breaks before demanding activities, heavy-work play like carrying or pushing, and narrating what your child feels so they build awareness of their own sensations. Small accommodations — a quiet corner, sunglasses, seamless socks — can transform a difficult day.</p>
      <h2>When to seek an assessment</h2>
      <p>If sensory challenges interfere with daily life, learning, or family routines, a structured assessment is a good next step. A comprehensive evaluation identifies your child's unique sensory profile and becomes the foundation for a personalized therapy plan.</p>
    `
  },
  'speech-milestones-toddlers': {
    id: 2,
    title: 'Speech Milestones for Toddlers',
    category: 'Speech Therapy',
    author: 'THERAkids Team',
    published_at: '2026-08-22',
    featured_image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Every child develops at their own pace, but language follows a recognizable path. Knowing the general milestones helps you celebrate progress and notice early when a little extra support might help.</p>
      <h2>By 12 months</h2>
      <p>Most toddlers respond to their name, understand simple requests like "come here," babble with varied sounds, and use gestures such as pointing, waving, or reaching to communicate.</p>
      <h2>By 18 months</h2>
      <p>Vocabulary grows to several words beyond names for family members. Toddlers begin following simple directions and often point to show you something interesting — an important social-communication step.</p>
      <h2>By 2 years</h2>
      <p>Word combinations appear: "more milk," "daddy go." Children this age typically understand around 200–300 words, follow two-step instructions, and ask simple questions like "what's that?"</p>
      <h2>By 3 years</h2>
      <p>Speech becomes intelligible to unfamiliar listeners most of the time. Children hold short conversations, use pronouns and plurals, and ask "who," "what," and "where" questions constantly.</p>
      <h2>Gentle ways to support language at home</h2>
      <p>Narrate your day out loud, follow your child's lead in play, expand on what they say ("car!" becomes "yes, the blue car is going fast!"), read together daily, and offer choices so words have purpose. Screens talk at children — people talk with them, so prioritize back-and-forth interaction.</p>
      <h2>When to reach out</h2>
      <p>If your toddler uses few gestures by 12 months, has no words by 16 months, or loses skills at any age, an early speech-language assessment is worthwhile. Early support works best, and an evaluation simply gives you information — there is no downside to asking.</p>
    `
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const load = async () => {
      setStatus('loading');
      try {
        const response = await fetch(`${API_URL}/api/blogs/${slug}`);
        if (response.ok) {
          setBlog(await response.json());
          setStatus('ok');
        } else {
          setStatus('notfound');
        }
      } catch {
        setStatus('error');
      }
    };
    load();
  }, [slug]);

  if (status === 'loading') {
    return <div className="container" style={{padding: '6rem 0', textAlign: 'center'}}>Loading...</div>;
  }

  // API unreachable (error) or unknown slug (notfound): fall back to the
  // static article if one exists, otherwise show the not-found screen.
  const effectiveBlog = blog || fallbackPosts[slug];

  if (!effectiveBlog) {
    return (
      <div className="container" style={{padding: '8rem 0 6rem', textAlign: 'center'}}>
        <h1 className="headline-xl">Post not found</h1>
        <p className="body-lg" style={{marginBottom: '2rem'}}>
          {status === 'error'
            ? 'We could not reach the server. Please try again in a moment.'
            : 'This article does not exist or is not published yet.'}
        </p>
        <Link to="/blogs" className="btn btn-primary">Back to all blogs</Link>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <div className="container" style={{paddingTop: 'calc(2rem + 104px)'}}>
        <Link to="/blogs" className="label-md" style={{color: 'var(--color-primary)'}}>&larr; Back to all blogs</Link>
      </div>
      
      <article className="blog-post-content container" style={{maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 6rem'}}>
        <span className="badge badge-sensory" style={{marginBottom: '1rem'}}>{effectiveBlog.category}</span>
        <h1 className="headline-2xl" style={{marginBottom: '1rem'}}>{effectiveBlog.title}</h1>
        <div style={{color: 'var(--color-outline)', marginBottom: '2rem'}} className="label-sm">
          {effectiveBlog.author && <span>By {effectiveBlog.author} &middot; </span>}
          Published on {new Date(effectiveBlog.published_at).toLocaleDateString()}
        </div>
        
        <div className="blog-post-hero-image" style={{borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '3rem'}}>
          <img src={effectiveBlog.featured_image} alt={effectiveBlog.title} style={{width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover'}} />
        </div>
        
        <div className="blog-body body-lg" dangerouslySetInnerHTML={{ __html: effectiveBlog.content }}></div>
      </article>
    </div>
  );
};

export default BlogPost;
