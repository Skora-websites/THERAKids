import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InlineCTA from '../components/InlineCTA';
import './Blogs.css';

const fallbackBlogs = [
  {
    id: 1,
    title: 'Understanding Sensory Processing Disorder',
    slug: 'understanding-sensory-processing',
    excerpt: 'Learn about the signs of SPD and how occupational therapy can provide strategies for self-regulation.',
    featured_image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=600&q=80',
    category: 'Occupational Therapy',
    published_at: '2026-08-10'
  },
  {
    id: 2,
    title: 'Speech Milestones for Toddlers',
    slug: 'speech-milestones-toddlers',
    excerpt: 'A quick guide for parents on what to expect as your toddler develops their communication skills.',
    featured_image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
    category: 'Speech Therapy',
    published_at: '2026-08-22'
  }
];

const Blogs = () => {
  const [blogs] = useState(fallbackBlogs);

  return (
    <div className="blogs-page">
      <section className="blogs-header bg-pastel-lilac relative overflow-hidden" style={{ height: '450px', display: 'flex', alignItems: 'flex-start', width: '100%', paddingTop: 'calc(4rem + 104px)' }}>
        <div className="container center-text z-10 relative">
          <h1 className="headline-2xl">Resources & Insights</h1>
          <p className="body-lg blogs-subtitle">Guidance and strategies from our developmental experts.</p>
        </div>
        
        {/* Cloud Divider to White */}
        <div className="cloud-divider cloud-bottom fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      <div className="container py-12 z-10 relative bg-white" style={{ maxWidth: '100%' }}>
        <div className="container max-w-5xl mx-auto">
          <InlineCTA />
        </div>
      </div>

      <section className="standard-blogs-section section-padding pt-4">
        <div className="container grid grid-cols-3 blogs-grid">
          {blogs.map(blog => (
            <Link to={`/blogs/${blog.slug}`} key={blog.id} className="card blog-card">
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
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
