import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_URL from '../config';
import { initScrollReveals } from '../lib/motion';
import { setSeo, resetSeo, makeExcerpt } from '../lib/seo';
import { FALLBACK_DATA } from '../data/fallbackData';
import './Blogs.css';

const BlogPost = () => {
  const { slug } = useParams();
  // Try the static fallback first so a frontend-only deploy renders instantly;
  // the API fetch replaces/refreshes it (or marks notfound) once it answers.
  const fallbackBlog = FALLBACK_DATA.blogs.find((b) => b.slug === slug) || null;
  const [blog, setBlog] = useState(fallbackBlog);
  const [status, setStatus] = useState(fallbackBlog ? 'ok' : 'loading');
  const pageRef = useRef(null);

  /* Per-post SEO: <title> is the meta title verbatim (no site suffix), falling
     back to the blog title when the field is empty; keywords are omitted entirely
     when empty; description falls back to a 160-char plain-text excerpt. Values are
     written as text (see lib/seo.js) so a script-looking payload stays inert. */
  useEffect(() => {
    if (status !== 'ok' || !blog) return undefined;
    const metaTitle = (blog.meta_title || '').trim();
    const keywords = (blog.meta_keywords || '').trim();
    const metaDescription = (blog.meta_description || '').trim();
    setSeo({
      title: metaTitle || blog.title || '',
      keywords, // empty → tag omitted
      description: metaDescription || makeExcerpt(blog.content, 160),
      // Per-article Open Graph / canonical overrides
      type: 'article',
      image: blog.featured_image || '',
      canonical: (blog.canonical_url || '').trim()
    });
    return () => resetSeo();
  }, [blog, status]);

  /* GSAP scroll reveal for the article body - waits for the article to mount */
  useEffect(() => {
    if (status !== 'ok') return undefined;
    const cleanupReveals = initScrollReveals(pageRef.current);
    return () => cleanupReveals?.();
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus('loading');
      try {
        const response = await fetch(`${API_URL}/api/blogs/${slug}`);
        if (response.ok) {
          if (!cancelled) {
            setBlog(await response.json());
            setStatus('ok');
          }
        } else if (!cancelled && fallbackBlog) {
          // Admin unpublished it, but the static fallback still has the copy
          setStatus('ok');
        } else if (!cancelled) {
          setStatus('notfound');
        }
      } catch {
        // API unreachable - keep showing the static fallback copy
        if (!cancelled && !fallbackBlog) setStatus('error');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === 'loading') {
    return <div className="container" style={{padding: '6rem 0', textAlign: 'center'}}>Loading...</div>;
  }

  if (status !== 'ok' || !blog) {
    return (
      <div className="container" style={{padding: '8rem 0 6rem', textAlign: 'center'}}>
        <h1 className="headline-xl">{status === 'notfound' ? 'Post not found' : 'Something went wrong'}</h1>
        <p className="body-lg" style={{marginBottom: '2rem'}}>
          {status === 'notfound'
            ? 'This article does not exist or is not published yet.'
            : 'We could not reach the server. Please try again in a moment.'}
        </p>
        <Link to="/blogs" className="btn btn-primary">Back to all blogs</Link>
      </div>
    );
  }

  return (
    <div className="blog-post-page" ref={pageRef}>
      <div className="container" style={{paddingTop: 'calc(2rem + 104px)'}}>
        <Link to="/blogs" className="label-md" style={{color: 'var(--color-primary)'}}>&larr; Back to all blogs</Link>
      </div>
      
      <article className="blog-post-content container" style={{maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 6rem'}}>
        <span className="badge badge-sensory" style={{marginBottom: '1rem'}}>{blog.category}</span>
        <h1 className="headline-2xl" style={{marginBottom: '1rem'}}>{blog.title}</h1>
        <div style={{color: 'var(--color-outline)', marginBottom: '2rem'}} className="label-sm">
          {blog.author && <span>By {blog.author} &middot; </span>}
          Published on {new Date(blog.published_at).toLocaleDateString()}
        </div>
        
        <div className="blog-post-hero-image" style={{borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '3rem'}} data-reveal>
          <img src={blog.featured_image} alt={`${blog.title} - pediatric therapy insights from TheraKids Noida`} style={{width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover'}} />
        </div>
        
        <div className="blog-body body-lg" data-reveal dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </article>
    </div>
  );
};

export default BlogPost;
