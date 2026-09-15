import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_URL from '../config';
import './Blogs.css';

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

  if (status !== 'ok') {
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
        <span className="badge badge-sensory" style={{marginBottom: '1rem'}}>{blog.category}</span>
        <h1 className="headline-2xl" style={{marginBottom: '1rem'}}>{blog.title}</h1>
        <div style={{color: 'var(--color-outline)', marginBottom: '2rem'}} className="label-sm">
          {blog.author && <span>By {blog.author} &middot; </span>}
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
