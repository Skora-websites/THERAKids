import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import TiltCard from '../components/TiltCard';
import { initScrollReveals } from '../lib/motion';
import './Blogs.css';

const fallbackBlogs = [
  {
    id: 1,
    title: 'Understanding Sensory Processing Disorder',
    slug: 'understanding-sensory-processing',
    excerpt: 'Learn about the signs of SPD and how occupational therapy can provide strategies for self-regulation.',
    featured_image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=1200&q=80',
    category: 'Occupational Therapy',
    published_at: '2026-08-10'
  },
  {
    id: 2,
    title: 'Speech Milestones for Toddlers',
    slug: 'speech-milestones-toddlers',
    excerpt: 'A quick guide for parents on what to expect as your toddler develops their communication skills.',
    featured_image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
    category: 'Speech Therapy',
    published_at: '2026-08-22'
  }
];

const Blogs = () => {
  const [blogs, setBlogs] = useState(fallbackBlogs);
  const pageRef = useRef(null);

  /* GSAP scroll reveals for the blog grid */
  useEffect(() => {
    const cleanupReveals = initScrollReveals(pageRef.current);
    return () => cleanupReveals?.();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs`);
        if (response.ok) {
          const data = await response.json();
          if (data.length) setBlogs(data);
        }
      } catch {
        // API unreachable — fallback stays in place
      }
    };
    load();
  }, []);

  return (
    <div className="blogs-page" ref={pageRef}>
      <PageHero
        bg="bg-pastel-lilac"
        blob={5}
        eyebrow="Resources & Insights"
        title="Grow together, learn together."
        subtitle="Guidance and strategies from our developmental experts."
        image="/images/hero-blogs.jpg"
        imageAlt="Parent reading with a child"
        imagePosition="41% 0%"
        notePosition="bottom-left"
        scriptNote="Tips & stories"
      />

      <div className="container py-12 z-10 relative bg-white" style={{ maxWidth: '100%' }}>
        <div className="container max-w-5xl mx-auto">
          <InlineCTA />
        </div>
      </div>

      <section className="standard-blogs-section section-padding pt-4">
        <div className="blogs-grid" data-reveal-group>
          {blogs.slice(0, 2).map((blog) => (
            <div
              key={blog.id}
            >
              <TiltCard className="h-full">
                <Link to={`/blogs/${blog.slug}`} className="card blog-card h-full">
                  <div className="blog-card-image">
                    <img src={blog.featured_image} alt={blog.title} />
                  </div>
                  <div className="blog-card-content">
                    <span className="badge badge-sensory">{blog.category}</span>
                    <h3 className="headline-sm">{blog.title}</h3>
                    <p className="body-sm">{blog.excerpt}</p>
                    <span className="label-sm date-label">{new Date(blog.published_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              </TiltCard>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
