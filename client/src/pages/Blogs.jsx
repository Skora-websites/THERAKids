import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import TiltCard from '../components/TiltCard';
import { initScrollReveals } from '../lib/motion';
import fallbackBlogs from '../data/fallbackBlogs';
import './Blogs.css';

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
