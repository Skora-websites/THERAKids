import React, { useEffect, useRef } from 'react';
import { HeartDoodle, Sparkle, CurvedLine, DecorativeBlob } from './doodles/Doodles';
import { createHeroTimeline } from '../lib/motion';
import './PageHero.css';

/**
 * Shared interior-page hero.
 * - bg: background color utility class (e.g. "bg-pastel-lilac", "bg-pastel-peach")
 * - accent/titleAfter: optional word to highlight with sparkle strokes (title = text before it)
 * - imagePosition: object-position for the crop, tuned per image (default "50% 50%")
 * - imageZoom: >1 zooms in (scale, pivoting on imagePosition); <1 zooms out to fit the whole
 *   image inside the mask; 1 = default cover crop. Clamped to 0.6–2.
 * - blob: which organic blob mask shapes the photo (1-5, different silhouettes)
 * - notePosition: where the script note sits over the image ("top-right" | "bottom-right")
 * - scriptNote: optional React node rendered in the handwriting font near the image
 * - breadcrumb: optional React node rendered at the top of the colored section, so
 *   breadcrumbs sit on the hero background instead of a white band above it
 *
 * Entrance runs as a GSAP timeline (eyebrow → title → subtitle → children → visual → doodles).
 */
const PageHero = ({
  eyebrow,
  title,
  accent,
  titleAfter,
  subtitle,
  image,
  imageAlt = '',
  imagePosition,
  imageZoom = 1,
  bg = 'bg-pastel-lilac',
  blob = 1,
  scriptNote,
  notePosition = 'top-right',
  breadcrumb,
  children,
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cleanup = createHeroTimeline(sectionRef.current);
    return cleanup;
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`page-hero ${bg} relative overflow-hidden`}
      style={{ paddingTop: 'calc(2.5rem + 104px)', paddingBottom: '6rem' }}
    >
      {/* Theme-aware background doodles */}
      <div className="page-hero-doodles" data-hero="doodles" aria-hidden="true">
        <DecorativeBlob className="page-hero-doodle page-hero-blob-1" color="var(--color-pastel-peach)" />
        <DecorativeBlob className="page-hero-doodle page-hero-blob-2" color="var(--color-pastel-lilac)" />
        <Sparkle className="page-hero-doodle page-hero-sparkle-1" />
        <HeartDoodle className="page-hero-doodle page-hero-heart" />
        <CurvedLine className="page-hero-doodle page-hero-curve" />
      </div>

      {/* Breadcrumb lives inside the colored section, under the fixed header */}
      {breadcrumb && (
        <div className="container page-hero-breadcrumb relative z-10">
          {breadcrumb}
        </div>
      )}

      <div className="container page-hero-grid z-10 relative">
        <div className="page-hero-content">
          {eyebrow && (
            <p className="page-hero-eyebrow label-md" data-hero="eyebrow">
              {eyebrow}
            </p>
          )}
          <h1 className="headline-2xl page-hero-title text-navy" data-hero="title">
            {title}
            {accent && (
              <span className="accent-host">
                {accent}
                <svg
                  className="hero-accent"
                  viewBox="0 0 46 40"
                  fill="none"
                  stroke="var(--color-doodle-amber)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 34 L14 20" />
                  <path d="M21 30 L25 8" />
                  <path d="M33 33 L43 20" />
                </svg>
              </span>
            )}
            {titleAfter && <> {titleAfter}</>}
          </h1>
          {subtitle && (
            <p className="body-lg page-hero-subtitle text-navy-light" data-hero="text">
              {subtitle}
            </p>
          )}
          <div data-hero="actions">{children}</div>
        </div>
        <div className="page-hero-visual relative" data-hero="visual">
          {/* Peach-pink under-blob tucked under the photo's edge, as on the home hero */}
          <div className="page-hero-sweep" aria-hidden="true" />
          <div className={`page-hero-img-window blob-mask-${blob}`}>
            {imageZoom < 1 && (
              <img src={image} alt="" aria-hidden="true" className="page-hero-img page-hero-img-backdrop" />
            )}
            <img
              src={image}
              alt={imageAlt}
              className="page-hero-img page-hero-img-parallax"
              style={{
                objectPosition: imagePosition || '50% 50%',
                ...(imageZoom < 1
                  ? { objectFit: 'contain' }
                  : imageZoom > 1
                    ? { transform: `scale(${Math.min(2, imageZoom)})`, transformOrigin: imagePosition || '50% 50%' }
                    : {}),
              }}
            />
          </div>
          {scriptNote && (
            <div className={`hero-script-note note-${notePosition}`} aria-hidden="true">
              {scriptNote}
            </div>
          )}
        </div>
      </div>

      {/* Cloud Divider to White */}
      <div className="cloud-divider cloud-bottom fill-white">
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
};

export default PageHero;
