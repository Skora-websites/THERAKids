import React, { useState } from 'react';
import InlineCTA from '../components/InlineCTA';
import './Gallery.css';

const fallbackImages = [
  { id: 1, image_path: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=500&q=80', category: 'Therapy', caption: 'Sensory Room' },
  { id: 2, image_path: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=500&q=80', category: 'Activities', caption: 'Play Time' },
  { id: 3, image_path: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=500&q=80', category: 'Our Centre', caption: 'Waiting Area' },
  { id: 4, image_path: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=500&q=80', category: 'Therapy', caption: 'Physical Therapy' }
];

const Gallery = () => {
  const [images] = useState(fallbackImages);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  const categories = ['All', ...new Set(images.map(img => img.category))];
  
  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="gallery-page">
      <section className="gallery-header bg-pastel-peach relative overflow-hidden" style={{ height: '450px', display: 'flex', alignItems: 'flex-start', width: '100%', paddingTop: 'calc(4rem + 104px)' }}>
        <div className="container center-text z-10 relative">
          <h1 className="headline-2xl">Our Gallery</h1>
          <p className="body-lg gallery-subtitle">Take a peek inside our nurturing environment.</p>
          
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
