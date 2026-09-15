import { motion } from 'framer-motion';
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
 */
const PageHero = ({ eyebrow, title, accent, titleAfter, subtitle, image, imageAlt = '', imagePosition, imageZoom = 1, bg = 'bg-pastel-lilac', blob = 1, scriptNote, notePosition = 'top-right', children }) => (
  <section className={`page-hero ${bg} relative overflow-hidden`} style={{ paddingTop: 'calc(4rem + 104px)', paddingBottom: '6rem' }}>
    <div className="container page-hero-grid z-10 relative">
      <motion.div
        className="page-hero-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {eyebrow && <p className="page-hero-eyebrow label-md">{eyebrow}</p>}
        <h1 className="headline-2xl page-hero-title text-navy">
          {title}
          {accent && (
            <span className="accent-host">
              {accent}
              <svg className="hero-accent" viewBox="0 0 46 40" fill="none" stroke="#F6B73C" strokeWidth="5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 34 L14 20" />
                <path d="M21 30 L25 8" />
                <path d="M33 33 L43 20" />
              </svg>
            </span>
          )}
          {titleAfter && <> {titleAfter}</>}
        </h1>
        {subtitle && <p className="body-lg page-hero-subtitle text-navy-light">{subtitle}</p>}
        {children}
      </motion.div>
      <motion.div
        className="page-hero-visual relative"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      >
        <div className={`page-hero-img-window blob-mask-${blob}`}>
        {imageZoom < 1 && (
          <img src={image} alt="" aria-hidden="true" className="page-hero-img page-hero-img-backdrop" />
        )}
        <img
          src={image}
          alt={imageAlt}
          className="page-hero-img"
          style={{
            objectPosition: imagePosition || '50% 50%',
            ...(imageZoom < 1
              ? { objectFit: 'contain' }
              : imageZoom > 1
                ? { transform: `scale(${Math.min(2, imageZoom)})`, transformOrigin: imagePosition || '50% 50%' }
                : {})
          }}
        />
        </div>
        {scriptNote && (
          <div className={`hero-script-note note-${notePosition}`} aria-hidden="true">
            {scriptNote}
          </div>
        )}
      </motion.div>
    </div>

    {/* Cloud Divider to White */}
    <div className="cloud-divider cloud-bottom fill-white">
      <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
        <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
      </svg>
    </div>
  </section>
);

export default PageHero;
