import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import API_URL from '../config';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import { initScrollReveals } from '../lib/motion';
import { usePageSeo } from '../hooks/usePageSeo';
import { FALLBACK_GALLERY } from '../data/fallbackData';
import './Gallery.css';

// Photos shown per page (fills a 4-col desktop row × 3 rows)
const PER_PAGE = 12;

// Photos come exclusively from the gallery table (admin-managed); no static list.
const Gallery = () => {
  usePageSeo('/gallery');
  const [images, setImages] = useState(FALLBACK_GALLERY);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [lightboxImg, setLightboxImg] = useState(null);
  const pageRef = useRef(null);
  const gridRef = useRef(null);

  /* GSAP scroll reveals for the gallery grid - waits for the DB rows so the
     triggers are registered on the real grid children */
  useEffect(() => {
    if (loading) return undefined;
    const cleanupReveals = initScrollReveals(pageRef.current);
    return () => cleanupReveals?.();
  }, [loading]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          if (!cancelled && Array.isArray(data) && data.length > 0) setImages(data);
        }
      } catch {
        // API unreachable - static fallback gallery keeps the grid populated
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = ['All', ...new Set(images.map(img => img.category).filter(Boolean))];

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter(img => img.category === activeCategory);

  const pageCount = Math.ceil(filteredImages.length / PER_PAGE);
  const safePage = Math.min(page, Math.max(1, pageCount));
  const pagedImages = filteredImages.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const changeCategory = (cat) => {
    setActiveCategory(cat);
    setPage(1); // every filter starts on its first page
  };

  const changePage = (p) => {
    if (p < 1 || p > pageCount || p === safePage) return;
    setPage(p);
    // Bring the fresh grid into view (header stays put, lightbox-style jump)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* Numbered page window: 1 … (p-1, p, p+1) … last — compact for many pages,
     no ellipsis noise for few. */
  const pageNumbers = () => {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const windowPages = [1];
    if (safePage > 3) windowPages.push('…');
    for (let p = Math.max(2, safePage - 1); p <= Math.min(pageCount - 1, safePage + 1); p += 1) {
      windowPages.push(p);
    }
    if (safePage < pageCount - 2) windowPages.push('…');
    windowPages.push(pageCount);
    return windowPages;
  };

  return (
    <div className="gallery-page" ref={pageRef}>
      <PageHero
        bg="bg-pastel-peach"
        blob={4}
        eyebrow="Inside THERAKids"
        title="Moments that matter."
        subtitle="Take a peek inside our nurturing environment."
        image="/images/hero-gallery.jpg"
        imageAlt="Children learning and playing together at TheraKids child development center in Noida"
        imagePosition="0% 100%"
        notePosition="bottom-right"
        scriptNote="Smiles daily"
      />

      <div className="container py-12 z-10 relative bg-white" style={{ maxWidth: '100%' }}>
        <div className="container max-w-5xl mx-auto">
          <InlineCTA />
        </div>
        {categories.length > 1 && (
          <div className="gallery-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => changeCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="gallery-grid-section section-padding pt-4" ref={gridRef}>
        <div className="container">
          {loading ? (
            <div className="body-md text-navy-light text-center" style={{ padding: '2rem 0' }}>Loading gallery…</div>
          ) : filteredImages.length === 0 ? (
            <div className="body-md text-navy-light text-center" style={{ padding: '2rem 0' }}>
              Photos are being updated. Please check back soon.
            </div>
          ) : (
            <>
              <div className="gallery-grid" data-reveal-group>
                {pagedImages.map((img) => (
                  <div
                    key={img.id}
                    className="gallery-item"
                    onClick={() => setLightboxImg(img)}
                  >
                    <img src={img.image_path} alt={`${img.caption} - TheraKids pediatric therapy center Noida`} loading="lazy" />
                    <div className="gallery-overlay">
                      <span className="label-lg">{img.caption}</span>
                    </div>
                  </div>
                ))}
              </div>

              {pageCount > 1 && (
                <nav className="gallery-pagination" aria-label="Gallery pages">
                  <button
                    type="button"
                    className="page-arrow"
                    disabled={safePage === 1}
                    onClick={() => changePage(safePage - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {pageNumbers().map((p, i) =>
                    p === '…' ? (
                      <span key={`gap-${i}`} className="page-gap">…</span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        className={`page-num ${p === safePage ? 'active' : ''}`}
                        onClick={() => changePage(p)}
                        aria-current={p === safePage ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    className="page-arrow"
                    disabled={safePage === pageCount}
                    onClick={() => changePage(safePage + 1)}
                    aria-label="Next page"
                  >
                    <ChevronRight size={15} />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <button className="lightbox-close">&times;</button>
          <img src={lightboxImg.image_path} alt={`${lightboxImg.caption} - TheraKids pediatric therapy center Noida`} onClick={(e) => e.stopPropagation()} />
          <p className="lightbox-caption headline-sm">{lightboxImg.caption}</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
