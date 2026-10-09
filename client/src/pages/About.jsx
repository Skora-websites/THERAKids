import React, { useEffect, useRef, useState } from 'react';
import { Activity, Baby, ChevronLeft, ChevronRight, Heart, Layers, Users } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import Newsletter from '../components/Newsletter';
import PageHero from '../components/PageHero';
import { Sparkle, LeafDoodle, SunDoodle, UnderlineFlourish } from '../components/doodles/Doodles';
import { initScrollReveals, createFloatLoop, prefersReducedMotion } from '../lib/motion';
import { usePageSeo } from '../hooks/usePageSeo';
import { useAppContext } from '../context/AppContext';
import API_URL from '../config';
import { FALLBACK_DATA, FALLBACK_GALLERY } from '../data/fallbackData';
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

/* Auto-advance pace for the gallery panel (ms per photo). */
const GALLERY_INTERVAL = 4500;

/* Impact tags shown side by side under the Mission section (client brief).
   `display` is what SSR/reduced-motion shows; the count-up animates from 0
   once the row scrolls into view. */
const IMPACT_STATS = [
  { value: 2000, display: '2,000+', label: 'Children Supported', icon: Baby, tint: 'peach' },
  { value: 48, display: '48+', label: 'Team Members', icon: Users, tint: 'lilac' },
  { value: 6, display: '6+', label: 'Specialized Disciplines', icon: Layers, tint: 'mint' },
  { value: 20000, display: '20,000+', label: 'Sessions & Interventions', icon: Activity, tint: 'amber' },
];

/* "Our Team" disciplines (client brief) — static marketing copy: the
   multidisciplinary roles that make up the THERAKids team. */
const TEAM = [
  {
    title: 'Occupational Therapists',
    count: '10+ Professionals',
    qualification: 'BOT / MOT and specialized pediatric therapy certifications',
    expertise: ['Sensory Integration', 'Fine Motor Skills', 'Developmental Delays', 'Autism Support', 'Activities of Daily Living'],
    role: "Supporting children's independence, participation and developmental skills through individualized occupational therapy.",
  },
  {
    title: 'Pediatric Physiotherapists',
    count: '8+ Professionals',
    qualification: 'BPT / MPT with pediatric physiotherapy training',
    expertise: ['Gross Motor Development', 'Cerebral Palsy', 'Developmental Delays', 'Balance & Coordination', 'Pediatric Rehabilitation'],
    role: 'Building strength, mobility, balance and functional movement through child-centered physiotherapy.',
  },
  {
    title: 'Special Educators',
    count: '14+ Professionals',
    qualification: 'B.Ed / M.Ed Special Education and relevant specialized certifications',
    expertise: ['Learning Difficulties', 'ADHD', 'School Readiness', 'Academic Skills', 'Life Skills', 'Individualized Education'],
    role: 'Helping children develop academic, functional and learning skills through individualized educational support.',
  },
  {
    title: 'Speech & Language Therapists',
    count: '4+ Professionals',
    qualification: 'BASLP / MASLP with relevant pediatric certifications',
    expertise: ['Speech & Language Development', 'Articulation', 'Fluency', 'AAC', 'Feeding & Oral Motor Skills'],
    role: 'Supporting communication, speech, language and related feeding skills across different developmental stages.',
  },
  {
    title: 'Psychologists',
    count: '3+ Professionals',
    qualification: 'M.A./M.Phil./Ph.D. in Psychology with relevant professional training',
    expertise: ['Child Psychology', 'Developmental Assessment', 'Behaviour', 'Emotional Well-being', 'Parent & Family Support'],
    role: "Supporting children's emotional, behavioural and developmental needs while working closely with families.",
  },
  {
    title: 'Coordinators & Support Team',
    count: '3+ Coordinators • 6+ Support Staff',
    qualification: 'Relevant professional qualifications and training',
    expertise: ['Program Coordination', 'Family Support', 'Client Relations', 'Administration', 'Therapy Coordination'],
    role: 'Ensuring smooth communication, coordination and a comfortable experience for children and families.',
  },
];

/* The values that unite the team (shown in the image / client brief). */
const TEAM_VALUES = [
  { title: 'Evidence-Based Practice', text: 'All interventions grounded in scientific research', tone: 'lilac' },
  { title: 'Collaborative Care', text: 'Multidisciplinary teamwork for comprehensive support', tone: 'peach' },
  { title: 'Family-Centered', text: 'Families as partners in the therapy process', tone: 'mint' },
  { title: 'Continuous Learning', text: 'Ongoing professional development and training', tone: 'amber' },
];

/* Official YouTube channel (settings.social_youtube overrides when set). */
const YOUTUBE_FALLBACK = 'https://www.youtube.com/@therakids_noida';

/* Cloud wave used between the alternating pastel bands (same SVG as the
 * rest of the site; fill comes from the modifier class). */
const Wave = ({ pos, fill }) => (
  <div className={`cloud-divider cloud-${pos} ${fill}`}>
    <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
      <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
    </svg>
  </div>
);

const About = () => {
  usePageSeo('/about');
  const { settings } = useAppContext();
  const founderRef = useRef(null);
  const statsRef = useRef(null);
  const [founders, setFounders] = useState(FALLBACK_DATA.founders);
  const [loading, setLoading] = useState(false);
  /* Gallery carousel — same admin-managed gallery table the old /gallery page
     used (static fallback covers an unreachable API). */
  const [galleryImages, setGalleryImages] = useState(FALLBACK_GALLERY);
  const [galleryCategory, setGalleryCategory] = useState('All');
  const [galleryIndex, setGalleryIndex] = useState(0);
  /* Thumbnail strip state — the strip slides WITH the panel so the photo on
     the panel always sits in the middle of the queue. `stripSnap` decides
     whether that slide transitions or repositions instantly; it is set in the
     same event that changes the index, so the value is already correct for
     the render that moves the track (sequential steps animate; category
     changes and wrap-around jumps snap). */
  const thumbsRef = useRef(null);
  const [thumbsMetrics, setThumbsMetrics] = useState({ viewport: 0, item: 0 });
  const [stripSnap, setStripSnap] = useState(true);

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

  /* Photos come from the gallery table; the static list keeps the section
     populated while the API is unreachable. */
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/gallery`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) setGalleryImages(data);
      })
      .catch(() => {
        // API unreachable - static fallback gallery keeps the carousel populated
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Impact stats count-up: runs once when the row scrolls into view.
     Reduced-motion users keep the final numbers SSR already rendered. */
  useEffect(() => {
    const el = statsRef.current;
    if (!el || prefersReducedMotion()) return undefined;
    const nums = [...el.querySelectorAll('[data-count-to]')];
    if (!nums.length || typeof IntersectionObserver === 'undefined') return undefined;
    const format = (n) => n.toLocaleString('en-US');
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / 1400);
          const eased = 1 - (1 - p) ** 3;
          nums.forEach((n) => {
            n.textContent = format(Math.round(Number(n.dataset.countTo) * eased)) + (n.dataset.suffix || '');
          });
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
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

  /* -------------------------- Gallery carousel -------------------------- */
  const galleryCategories = ['All', ...new Set(galleryImages.map((img) => img.category).filter(Boolean))];
  const galleryPhotos =
    galleryCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === galleryCategory);
  // Clamp so a late-arriving (possibly shorter) API list can't strand the index.
  const activeIndex = Math.min(galleryIndex, Math.max(0, galleryPhotos.length - 1));
  const activePhoto = galleryPhotos[activeIndex];

  const showPhoto = (index) => {
    setStripSnap(!(Math.abs(index - activeIndex) === 1));
    setGalleryIndex(index);
  };

  const changeGalleryCategory = (cat) => {
    setGalleryCategory(cat);
    setStripSnap(true);
    setGalleryIndex(0);
  };

  /* The panel plays through the queue by itself (circular); reduced-motion
     users get a static panel they step through with the arrows / thumbnails.
     Re-armed on every index change, so a manual pick restarts the timer too. */
  useEffect(() => {
    if (galleryPhotos.length < 2 || prefersReducedMotion()) return undefined;
    const next = (activeIndex + 1) % galleryPhotos.length;
    const timer = window.setInterval(() => {
      setStripSnap(!(Math.abs(next - activeIndex) === 1));
      setGalleryIndex(next);
    }, GALLERY_INTERVAL);
    return () => window.clearInterval(timer);
  }, [galleryPhotos.length, activeIndex]);

  /* Thumbnail strip — NOT a marquee: it slides along with the panel so the
     photo on the panel always sits in the middle of the queue. Three copies of
     the list render so there is always content either side of the centred
     (middle) copy; single-step moves animate, wrap-around / category jumps
     reposition instantly (circular queue: after the last photo, the first). */

  // Measure the strip (container width + one thumbnail's pitch) so the
  // centring maths survives responsive widths; re-measures on resize.
  useEffect(() => {
    const el = thumbsRef.current;
    if (!el) return undefined;
    const measure = () => {
      const first = el.querySelector('.gallery-thumb');
      setThumbsMetrics({
        viewport: el.clientWidth,
        item: first ? first.getBoundingClientRect().width : 0,
      });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [galleryPhotos.length]);

  // Middle copy of the three, active item centred in the strip's viewport.
  const stripX = thumbsMetrics.item
    ? thumbsMetrics.viewport / 2 - (galleryPhotos.length + activeIndex + 0.5) * thumbsMetrics.item
    : 0;

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

        {/* Impact tags — four stats side by side, below the mission + CTA */}
        <div className="container about-stats" ref={statsRef} data-reveal-group>
          {IMPACT_STATS.map((s) => (
            <div className="stat-card" key={s.label} data-reveal>
              <span className={`stat-icon stat-icon-${s.tint}`} aria-hidden="true">
                <s.icon size={20} />
              </span>
              <span className="stat-value" data-count-to={s.value} data-suffix="+">
                {s.display}
              </span>
              <span className="stat-label label-sm">{s.label}</span>
            </div>
          ))}
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

      {/* Our Team — multidisciplinary disciplines, sitting right above the
          values row ("What Unites Our Team"). Static per the client brief. */}
      <section className="about-team section-padding">
        <div className="container">
          <div className="section-header center mb-4" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">Our Team</p>
            <h2 className="headline-lg text-navy">Our Multidisciplinary Team</h2>
            <UnderlineFlourish className="heading-flourish" />
            <p className="body-lg text-navy-light">
              At THERAKids, children benefit from a collaborative team of professionals across therapy, education, psychology and family support. Our multidisciplinary approach allows us to look at the whole child and create coordinated, individualized care plans.
            </p>
          </div>

          <div className="team-grid" data-reveal-group>
            {TEAM.map((member) => (
              <article className="team-card" key={member.title} data-reveal>
                <div className="team-card-head">
                  <h3 className="headline-sm text-navy">{member.title}</h3>
                  <span className="team-count">{member.count}</span>
                </div>

                <div className="team-block">
                  <p className="label-sm team-block-label">Qualification</p>
                  <p className="body-sm text-navy-light">{member.qualification}</p>
                </div>

                <div className="team-block">
                  <p className="label-sm team-block-label">Expertise</p>
                  <ul className="team-expertise">
                    {member.expertise.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <div className="team-block">
                  <p className="label-sm team-block-label">Role</p>
                  <p className="body-sm text-navy-light">{member.role}</p>
                </div>
              </article>
            ))}
          </div>

          {/* What Unites Our Team — the values row from the brief */}
          <div className="team-unites" data-reveal>
            <h3 className="headline-sm text-navy text-center">What Unites Our Team</h3>
            <p className="body-md text-navy-light text-center team-unites-sub">
              The values and principles that guide our collaborative approach
            </p>
            <div className="team-values-grid" data-reveal-group>
              {TEAM_VALUES.map((value) => (
                <div className={`team-value-card team-value-${value.tone}`} key={value.title} data-reveal>
                  <span className="team-value-dot" aria-hidden="true" />
                  <h4 className="label-lg text-navy">{value.title}</h4>
                  <p className="body-sm text-navy-light">{value.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter band — purple (lilac) wave between the founders and the
          gallery, carrying the site's "Stay Updated" signup (client brief). */}
      <section className="about-newsletter bg-pastel-lilac relative overflow-hidden" aria-label="Newsletter signup">
        <Wave pos="top" fill="fill-white" />
        <div className="container about-newsletter-inner z-10 relative" data-reveal>
          <Newsletter />
        </div>
        <Wave pos="bottom" fill="fill-white" />
      </section>

      {/* Gallery carousel — replaces the old /gallery page. A framed panel
          plays through the queue on its own (circular: last → first); the
          thumbnail strip below is synced to the panel, keeping the photo on
          show in the middle of the queue. */}
      <section className="about-gallery section-padding" id="gallery">
        <div className="container">
          <div className="section-header center mb-8" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Inside THERAKids</p>
            <h2 className="headline-lg text-navy">Moments that matter.</h2>
            <UnderlineFlourish className="heading-flourish" />
            <p className="body-lg text-navy-light">
              Take a peek inside our nurturing environment.
            </p>
          </div>

          {/* Visit us on YouTube — links out to the official channel */}
          <div className="about-youtube-cta" data-reveal>
            <a
              className="btn btn-primary about-youtube-btn"
              href={settings.social_youtube || YOUTUBE_FALLBACK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
              </svg>
              Visit us on YouTube
            </a>
          </div>

          {galleryCategories.length > 1 && (
            <div className="gallery-filters" data-reveal>
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-btn ${galleryCategory === cat ? 'active' : ''}`}
                  onClick={() => changeGalleryCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {galleryPhotos.length === 0 ? (
            <p className="body-md text-navy-light text-center gallery-empty">
              Photos are being updated. Please check back soon.
            </p>
          ) : (
            <div className="gallery-carousel" data-reveal>
              {/* Framed panel — one photo per frame, sliding horizontally;
                  the queue is circular (after the last photo, the first). */}
              <div className="gallery-frame">
                <div className="gallery-stage">
                  <div
                    className="gallery-stage-track"
                    style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
                  >
                    {galleryPhotos.map((img, i) => (
                      <figure className="gallery-stage-slide" key={img.id ?? img.image_path} aria-hidden={i !== activeIndex}>
                        <img
                          src={img.image_path}
                          alt={`${img.caption} - TheraKids pediatric therapy center Noida`}
                          loading={i === activeIndex ? 'eager' : 'lazy'}
                        />
                      </figure>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="gallery-stage-arrow gallery-stage-prev"
                    onClick={() => showPhoto((activeIndex - 1 + galleryPhotos.length) % galleryPhotos.length)}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    className="gallery-stage-arrow gallery-stage-next"
                    onClick={() => showPhoto((activeIndex + 1) % galleryPhotos.length)}
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                {/* Caption bar — photo title + position in the queue */}
                <div className="gallery-stage-bar">
                  <span className="gallery-stage-caption label-lg">{activePhoto?.caption || ''}</span>
                  <span className="gallery-stage-count label-sm">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(galleryPhotos.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Thumbnail queue — no autoplay; slides WITH the panel so the
                  active photo stays in the middle. Three copies of the list
                  render (circular); step moves animate, wrap-around snaps. */}
              <div className="gallery-thumbs" aria-label="Gallery queue" ref={thumbsRef}>
                <div
                  className="gallery-thumbs-track"
                  style={{
                    transform: `translate3d(${stripX}px, 0, 0)`,
                    transition: stripSnap ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {[...galleryPhotos, ...galleryPhotos, ...galleryPhotos].map((img, i) => {
                    const isActive = img.image_path === activePhoto?.image_path;
                    return (
                      <button
                        type="button"
                        key={`${img.id ?? img.image_path}-${i}`}
                        className={`gallery-thumb ${isActive ? 'active' : ''}`}
                        onClick={() => showPhoto(galleryPhotos.indexOf(img))}
                        aria-label={`Show ${img.caption}`}
                        aria-pressed={isActive}
                      >
                        <img src={img.image_path} alt="" loading="lazy" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
