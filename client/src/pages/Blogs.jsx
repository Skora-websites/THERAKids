import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import Pagination from '../components/Pagination';
import TiltCard from '../components/TiltCard';
import { initScrollReveals } from '../lib/motion';
import { usePageSeo } from '../hooks/usePageSeo';
import fallbackBlogs from '../data/fallbackBlogs';
import './Blogs.css';

const BLOGS_PER_PAGE = 6;

// Default meta for the listing page (spec: "sensible defaults")
const LISTING_KEYWORDS = 'THERAKids blog, pediatric therapy, occupational therapy, speech therapy, child development, parenting tips';
const LISTING_DESCRIPTION = 'Practical articles for parents on child development, therapy milestones, sensory play, communication and family support from the THERAKids team.';

const Blogs = () => {
  const [blogs, setBlogs] = useState(fallbackBlogs);
  const [page, setPage] = useState(1);
  const pageRef = useRef(null);
  const gridTopRef = useRef(null);

  /* Listing meta: the admin "SEO" tab row for /blogs, falling back to the built-in
     defaults. Individual posts carry their own meta (see BlogPost). */
  usePageSeo('/blogs', { keywords: LISTING_KEYWORDS, description: LISTING_DESCRIPTION });

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
        // API unreachable - fallback stays in place
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
        <div ref={gridTopRef} />
        <div className="blogs-grid" data-reveal-group>
          {blogs.slice((page - 1) * BLOGS_PER_PAGE, page * BLOGS_PER_PAGE).map((blog) => (
            <div
              key={blog.id}
            >
              <TiltCard className="h-full">
                <Link to={`/blogs/${blog.slug}`} className="card blog-card h-full">
                  <div className="blog-card-image">
                    <img src={blog.featured_image} alt={blog.title} loading="lazy" />
                  </div>
                  <div className="blog-card-content">
                    <span className="badge badge-sensory">{blog.category}</span>
                    <h3 className="headline-sm">{blog.title}</h3>
                    <p className="body-sm">{blog.excerpt}</p>
                    <span className="label-sm date-label">
                      {new Date(blog.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </div>
          ))}
        </div>
        <Pagination
          page={page}
          total={blogs.length}
          perPage={BLOGS_PER_PAGE}
          onChange={(next) => {
            setPage(next);
            gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      </section>
    </div>
  );
};

export default Blogs;
