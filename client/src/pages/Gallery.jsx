import React, { useEffect, useRef, useState } from 'react';
import API_URL from '../config';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import { initScrollReveals } from '../lib/motion';
import { usePageSeo } from '../hooks/usePageSeo';
import curatedGallery from '../data/galleryImages.json';
import './Gallery.css';

/* The real centre photos (client/public/images/gallery/therakids/), hand-picked
   from the 110-photo drop with near-duplicates removed. [file, caption, category] */
const fallbackImages = curatedGallery.map(([file, caption, category], i) => ({
  id: `curated-${i}`,
  image_path: `/images/gallery/therakids/${file}`,
  caption,
  category
}));

/* Old stock/webp gallery rows (d1copy.webp, 3copy.webp, ...) that the curated
   photo set replaces wherever they still linger in the DB. */
const LEGACY_IMAGE_RE = /\/images\/gallery\/[A-Za-z0-9.]+copy\.webp$/;
const isLegacyImage = (p) => typeof p === 'string' && LEGACY_IMAGE_RE.test(p);

const Gallery = () => {
  usePageSeo('/gallery');
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
            // Curated centre photos first; then any admin-added DB rows that are
            // neither the replaced stock webp files nor duplicates of the curated set.
            const curatedPaths = new Set(fallbackImages.map((img) => img.image_path));
            const dbExtras = data.filter(
              (img) =>
                !isLegacyImage(img.image_path) &&
                !curatedPaths.has(img.image_path) &&
                typeof img.image_path === 'string' &&
                img.image_path.startsWith('/images/')
            );
            setImages([...fallbackImages, ...dbExtras]);
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
