import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './Blogs.css';

const BlogPost = () => {
  const { slug } = useParams();
  
  // In a real app we fetch by slug from backend
  // Mocking for now based on the slug
  const blog = {
    id: 1,
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    slug: slug,
    content: `<p>This is a detailed mock article about ${slug.replace(/-/g, ' ')}. It covers various strategies, insights, and developmental milestones.</p><p>We believe in a neurodiversity-affirming approach, providing sensory-friendly techniques to support every child's unique needs.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=1200&q=80',
    category: 'Therapy Insights',
    published_at: '2026-08-10',
    seo_title: 'Therapy Insights | TheraKids',
    meta_description: 'Read the latest insights from our developmental experts.'
  };

  if (!blog) return <div className="container" style={{padding: '6rem 0', textAlign: 'center'}}>Loading...</div>;

  return (
    <div className="blog-post-page">
      <div className="container" style={{paddingTop: 'calc(2rem + 104px)'}}>
        <Link to="/blogs" className="label-md" style={{color: 'var(--color-primary)'}}>&larr; Back to all blogs</Link>
      </div>
      
      <article className="blog-post-content container" style={{maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 6rem'}}>
        <span className="badge badge-sensory" style={{marginBottom: '1rem'}}>{blog.category}</span>
        <h1 className="headline-2xl" style={{marginBottom: '1rem'}}>{blog.title}</h1>
        <div style={{color: 'var(--color-outline)', marginBottom: '2rem'}} className="label-sm">
          Published on {new Date(blog.published_at).toLocaleDateString()}
        </div>
        
        <div className="blog-post-hero-image" style={{borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '3rem'}}>
          <img src={blog.featured_image} alt={blog.title} style={{width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover'}} />
        </div>
        
        <div className="blog-body body-lg" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </article>
    </div>
  );
};

export default BlogPost;
