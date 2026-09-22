import React, { useEffect, useRef, useState } from 'react';
import API_URL from '../config';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import { initScrollReveals } from '../lib/motion';
import './Gallery.css';

const fallbackImages = [
  { id: 1, image_path: '/images/gallery/d1copy.webp', category: 'Therapy', caption: 'Occupational Therapy Session' },
  { id: 2, image_path: '/images/gallery/d2copy.webp', category: 'Therapy', caption: 'Speech Therapy' },
  { id: 3, image_path: '/images/gallery/d3copy.webp', category: 'Activities', caption: 'Group Activity' },
  { id: 4, image_path: '/images/gallery/d4copy.webp', category: 'Activities', caption: 'Play & Learning' },
  { id: 5, image_path: '/images/gallery/d5copy.webp', category: 'Our Centre', caption: 'Therapy Centre' },
  { id: 6, image_path: '/images/gallery/d6copy.webp', category: 'Therapy', caption: 'Physical Therapy' },
  { id: 7, image_path: '/images/gallery/d7copy.webp', category: 'Activities', caption: 'Creative Activities' },
  { id: 8, image_path: '/images/gallery/d8copy.webp', category: 'Our Centre', caption: 'Centre Environment' },
  { id: 9, image_path: '/images/gallery/10.1copy.webp', category: 'Therapy', caption: 'Sensory Integration' },
  { id: 10, image_path: '/images/gallery/1copy.webp', category: 'Activities', caption: 'Child Development' },
  { id: 11, image_path: '/images/gallery/2copy.webp', category: 'Activities', caption: 'Interactive Session' },
  { id: 12, image_path: '/images/gallery/9.1copy.webp', category: 'Therapy', caption: 'Motor Skills Training' },
  { id: 13, image_path: '/images/gallery/11copy.webp', category: 'Our Centre', caption: 'Our Facility' },
  { id: 14, image_path: '/images/gallery/8copy.webp', category: 'Activities', caption: 'Learning Through Play' },
  { id: 15, image_path: '/images/gallery/3copy.webp', category: 'Therapy', caption: 'Counselling Session' },
  { id: 16, image_path: '/images/gallery/4copy.webp', category: 'Activities', caption: 'Social Skills Group' },
  { id: 17, image_path: '/images/gallery/5copy.webp', category: 'Our Centre', caption: 'Therapy Room' },
  { id: 18, image_path: '/images/gallery/6copy.webp', category: 'Activities', caption: 'Fun Learning' },
  { id: 19, image_path: '/images/gallery/7copy.webp', category: 'Therapy', caption: 'Individual Therapy' }
];

const Gallery = () => {
  const [images, setImages] = useState(fallbackImages);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);
  const pageRef = useRef(null);

  /* GSAP scroll reveals for the gallery grid */
  useEffect(() => {
    const cleanupReveals = initScrollReveals(pageRef.current);
    return () => cleanupReveals?.();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          if (data.length) {
            // Prefer the real centre photos: replace any stale remote/stock entries
            // (e.g. seeded Unsplash URLs) with the downloaded gallery webp images.
            const isLocal = (p) => typeof p === 'string' && p.startsWith('/images/gallery/');
            const hasLocal = data.some((img) => isLocal(img.image_path));
            if (hasLocal) {
              const localRows = data.filter((img) => isLocal(img.image_path));
              const seededRemote = data.filter((img) => !isLocal(img.image_path) && !localRows.some((l) => l.id === img.id));
              setImages([...localRows, ...seededRemote]);
            } else {
              // DB has only remote images — keep them but backfill with the real photos first
              setImages([...fallbackImages, ...data]);
            }
          }
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
    <div className="gallery-page" ref={pageRef}>
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
      />

      <div className="container py-12 z-10 relative bg-white" style={{ maxWidth: '100%' }}>
        <div className="container max-w-5xl mx-auto">
          <InlineCTA />
        </div>
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

      <section className="gallery-grid-section section-padding pt-4">
        <div className="container">
          <div className="gallery-grid" data-reveal-group>
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
