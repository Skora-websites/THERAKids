import React, { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import { Sparkle, LeafDoodle, SunDoodle, UnderlineFlourish } from '../components/doodles/Doodles';
import { initScrollReveals, createFloatLoop } from '../lib/motion';
import { usePageSeo } from '../hooks/usePageSeo';
import API_URL from '../config';
import { FALLBACK_DATA } from '../data/fallbackData';
import './About.css';

// paragraphs / content are JSON columns; mysql2 may deliver strings or arrays
const parseJson = (raw, fallback) => {
  if (raw == null || raw === '') return fallback;
  if (typeof raw !== 'string') return raw;
  try {
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
};

/* "Our Mission & Philosophy" is a STATIC section per the client brief — fixed
   copy, not admin-managed page content. */
const MISSION = {
  heading: 'Our Mission & Philosophy',
  paragraphs: [
    'At THERAKids Foundation, we believe every child deserves the chance to bloom. Our mission is to help children aged 0-18 reach their fullest potential through early intervention, structured therapy and true family partnership.',
    'We work as one multidisciplinary team — therapists, special educators and psychologists — so every child\'s plan is built around the whole child, not a single diagnosis.',
  ],
  values: [
    { title: 'Family First', text: 'Parents are partners in every step of the therapy journey.' },
    { title: 'Evidence-Based Care', text: 'Structured, measurable programs backed by research.' },
    { title: 'Warm & Playful', text: 'Children learn best when they feel safe and happy.' },
  ],
};

/* Founder bios come from the admin panel (founders table) but are displayed
   condensed per the client brief: title line + first two paragraphs + closing
   line. The full text stays editable in the admin dashboard. */
const MAX_BIO_PARAGRAPHS = 2;

const About = () => {
  usePageSeo('/about');
  const founderRef = useRef(null);
  const [founders, setFounders] = useState(FALLBACK_DATA.founders);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const foundersRes = await fetch(`${API_URL}/api/founders`);
        if (cancelled) return;
        if (foundersRes.ok) {
          const data = await foundersRes.json();
          if (Array.isArray(data) && data.length > 0) setFounders(data);
        }
      } catch {
        // API unreachable - static fallback bios keep the section populated
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* GSAP scroll reveals + gentle floating doodles in the founder section.
     Re-runs once loading flips so late-mounted DB content gets its triggers. */
  useEffect(() => {
    if (loading) return undefined;
    const cleanupReveals = initScrollReveals(document.querySelector('.about-page'));
    const cleanupFloat = createFloatLoop(founderRef.current, '[data-float]');
    return () => {
      cleanupReveals?.();
      cleanupFloat?.();
    };
  }, [loading]);

  const [sandeep, akanksha] = founders;
  const mission = MISSION;
  const sandeepParagraphs = parseJson(sandeep?.paragraphs, []).slice(0, MAX_BIO_PARAGRAPHS);
  const akankshaParagraphs = parseJson(akanksha?.paragraphs, []).slice(0, MAX_BIO_PARAGRAPHS);

  return (
    <div className="about-page">
      <PageHero
        bg="bg-pastel-lilac"
        eyebrow="Our Story"
        title="A place where children blossom."
        subtitle="THERAKids Foundation is a multidisciplinary team dedicated to helping children aged 0-18 reach their fullest potential through early intervention, structured therapy, and true family partnership."
        image="/images/hero-about.jpg"
        imageAlt="Child playing and learning in a bright pediatric therapy room at TheraKids Noida child development center"
        imagePosition="0% 100%"
        notePosition="bottom-right"
        scriptNote={
          <>
            <span>Family first</span>
            <Heart className="script-heart" size={16} fill="currentColor" />
          </>
        }
      />

      <section className="about-philosophy section-padding">
        <div className="container grid grid-cols-2 philosophy-grid">
          <div className="philosophy-visual" data-reveal>
            <div className="image-blob-mask">
              <img src="/images/about-philosophy.jpg" alt="Child practicing fine motor skills at a therapy table with a TheraKids special educator in Noida" className="philosophy-image" loading="lazy" />
            </div>
            <Sparkle className="philosophy-doodle" data-float />
          </div>
          <div className="philosophy-content" data-reveal>
            <h2 className="headline-xl text-navy">{mission.heading}</h2>
            <UnderlineFlourish className="heading-flourish" />
            {mission.paragraphs.map((paragraph, i) => (
              <p className="body-lg text-navy-light" key={i}>{paragraph}</p>
            ))}
            <ul className="values-list">
              {mission.values.map((item) => (
                <li key={item.title}>
                  <div className="value-icon">✓</div>
                  <div>
                    <h4 className="label-lg text-navy">{item.title}</h4>
                    <p className="body-sm text-navy-light">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            {loading && <p className="body-lg text-navy-light">Loading…</p>}
          </div>
        </div>

        <div className="container mt-12 z-10 relative">
          <InlineCTA />
        </div>
      </section>

      {/* Meet the Founder, white top wave blends it out of the philosophy section;
          extra bottom padding keeps content clear of the 150px bottom wave.
          Bios come from the founders table (is_active = 1, display_order). */}
      <section className="founder-section bg-pastel-peach relative overflow-hidden" ref={founderRef}>
        <LeafDoodle className="founder-doodle founder-doodle-leaf" data-float />
        <SunDoodle className="founder-doodle founder-doodle-sun" data-float />
        <div className="container founder-flex-container relative z-10">
          <div className="founder-content" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Our Founder</p>
            {!loading && !sandeep && <p className="body-lg text-navy-light">Founder details coming soon.</p>}
            {sandeep && (
              <>
                <h2 className="headline-xl text-navy mb-2">{sandeep.name}</h2>
                {sandeep.title_line && (
                  <p className="body-lg text-navy font-semibold mb-6">{sandeep.title_line}</p>
                )}
                {sandeepParagraphs.map((paragraph, i) => (
                  <p className="body-lg text-navy-light mb-4" key={i}>{paragraph}</p>
                ))}
                {sandeep.closing_line && (
                  <p className="body-lg text-navy mb-6 font-semibold">{sandeep.closing_line}</p>
                )}
              </>
            )}
          </div>
          <div className="founder-visual" data-reveal>
            <div className="founder-image-wrapper">
              {sandeep && (
                <img
                  src={sandeep.profile_image}
                  alt={`${sandeep.name}, ${sandeep.role} - founder of TheraKids pediatric therapy center, Noida`}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>

        {/* Cloud Divider from White to Peach */}
        <div className="cloud-divider cloud-top fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
        </svg>
        </div>

        {/* Cloud Divider from Peach to White */}
        <div className="cloud-divider cloud-bottom fill-surface-lowest">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
        </svg>
        </div>
      </section>

      {/* Meet the Co-Founder, mirrors the founder band with the image on the left.
          White background: it sits between the founder band's white-fading cloud and the
          global CTA's white top cloud, so any color here would read as a stray stripe. */}
      <section className="founder-section co-founder-section bg-white relative overflow-hidden">
        <div className="container founder-flex-container relative z-10">
          <div className="founder-visual" data-reveal>
            <div className="founder-image-wrapper">
              {akanksha && (
                <img
                  src={akanksha.profile_image}
                  alt={`${akanksha.name}, ${akanksha.role} - co-founder of TheraKids child development center, Noida`}
                  loading="lazy"
                />
              )}
            </div>
          </div>
          <div className="founder-content" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Our Co-Founder</p>
            {!loading && !akanksha && <p className="body-lg text-navy-light">Co-founder details coming soon.</p>}
            {akanksha && (
              <>
                <h2 className="headline-xl text-navy mb-2">{akanksha.name}</h2>
                {akanksha.title_line && (
                  <p className="body-lg text-navy font-semibold mb-2">{akanksha.title_line}</p>
                )}
                {akanksha.subtitle_line && (
                  <p className="body-lg text-navy-light mb-6">{akanksha.subtitle_line}</p>
                )}
                {akankshaParagraphs.map((paragraph, i) => (
                  <p className="body-lg text-navy-light mb-4" key={i}>{paragraph}</p>
                ))}
                {akanksha.closing_line && (
                  <p className="body-lg text-navy mb-6 font-semibold">{akanksha.closing_line}</p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
