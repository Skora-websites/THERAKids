import React, { useEffect, useState } from 'react';
import API_URL from '../config';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import './Gallery.css';

const fallbackImages = [
  { id: 1, image_path: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=500&q=80', category: 'Therapy', caption: 'Sensory Room' },
  { id: 2, image_path: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=500&q=80', category: 'Activities', caption: 'Play Time' },
  { id: 3, image_path: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=500&q=80', category: 'Our Centre', caption: 'Waiting Area' },
  { id: 4, image_path: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=500&q=80', category: 'Therapy', caption: 'Physical Therapy' }
];

const Gallery = () => {
  const [images, setImages] = useState(fallbackImages);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          if (data.length) setImages(data);
        }
      } catch {
        // API unreachable — fallback stays in place
      }
    };
    load();
  }, []);

  const categories = ['All', ...new Set(images.map(img => img.category))];
  
  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="gallery-page">
      <PageHero
        bg="bg-pastel-peach"
        blob={4}
        eyebrow="Inside THERAKids"
        title="Moments that matter."
        subtitle="Take a peek inside our nurturing environment."
        image="/images/hero-gallery.jpg"
        imageAlt="Children learning together through play"
        imagePosition="0% 100%"
        notePosition="bottom-right"
        scriptNote="Smiles daily"
      >
        <div className="gallery-filters">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </PageHero>

      <div className="container py-12 z-10 relative bg-white" style={{ maxWidth: '100%' }}>
        <div className="container max-w-5xl mx-auto">
          <InlineCTA />
        </div>
      </div>

      <section className="gallery-grid-section section-padding pt-4">
        <div className="container">
          <div className="gallery-grid">
            {filteredImages.map((img) => (
              <div 
                key={img.id} 
                className="gallery-item"
                onClick={() => setLightboxImg(img)}
              >
                <img src={img.image_path} alt={img.caption} loading="lazy" />
                <div className="gallery-overlay">
                  <span className="label-lg">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <button className="lightbox-close">&times;</button>
          <img src={lightboxImg.image_path} alt={lightboxImg.caption} onClick={(e) => e.stopPropagation()} />
          <p className="lightbox-caption headline-sm">{lightboxImg.caption}</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
