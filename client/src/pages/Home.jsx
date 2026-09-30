import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Activity, Brain, Puzzle, Users, Sparkles, MessageCircle, Ear, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import TiltCard from '../components/TiltCard';
import StructuredData from '../components/StructuredData';
import LeadPopup from '../components/LeadPopup';
import {
  HeartDoodle,
  PetalDuo,
  SproutDoodle,
} from '../components/doodles/Doodles';
import { createHeroTimeline, createFloatLoop, initScrollReveals, createParallax } from '../lib/motion';
import API_URL from '../config';
import { usePageSeo } from '../hooks/usePageSeo';
import { useAppContext } from '../context/AppContext';
import { FALLBACK_DATA } from '../data/fallbackData';
import './Home.css';

const trustBadges = [
  { id: 1, label: 'Compassionate Care', icon: <Heart size={20} fill="currentColor" /> },
  { id: 2, label: 'Expert Therapists', icon: <Users size={20} /> },
  { id: 3, label: 'Better, Brighter Futures', icon: <SproutDoodle className="badge-doodle" /> }
];

/* "Intervention Programs We Offer" is a STATIC section per the client brief —
   these eight programs are fixed marketing copy, not admin-managed DB rows. */
const STATIC_SERVICES = [
  { name: 'Occupational Therapy', short_description: 'Building everyday skills — from writing and dressing to play and self-care.' },
  { name: 'Speech Therapy', short_description: 'Helping children find their voice, from first words to confident conversation.' },
  { name: 'Physical Therapy', short_description: 'Strength, balance and coordination for confident movement.' },
  { name: 'Behaviour Modification', short_description: 'Positive, evidence-based strategies for everyday challenges.' },
  { name: 'Special Education', short_description: 'Individualised learning plans that keep every child on track.' },
  { name: 'Sensory Integration', short_description: 'Helping children process the world comfortably and calmly.' },
  { name: 'Social Group Therapy', short_description: 'Guided peer groups that build friendships and social confidence.' },
  { name: 'Early Intervention', short_description: 'The sooner we start, the brighter the tomorrow — support for ages 0-3.' },
];

/* "Our Process" is a STATIC section per the client brief — the four steps of
   the therapy journey, with the site's own process photos. */
const STATIC_PROCESS_STEPS = [
  {
    step: 1,
    title: 'Book a Consultation',
    tone: 'peach',
    image: '/images/process/contact.jpg',
    description: 'Tell us about your child — we listen first, and suggest the right next step.',
  },
  {
    step: 2,
    title: 'Assessment & Screening',
    tone: 'lilac',
    image: '/images/process/assessment.jpg',
    description: 'A gentle, play-based evaluation maps your child\'s strengths and needs.',
  },
  {
    step: 3,
    title: 'Personalized Therapy Plan',
    tone: 'peach',
    image: '/images/process/plan.jpg',
    description: 'A multidisciplinary plan built around your child and your family.',
  },
  {
    step: 4,
    title: 'Therapy & Progress',
    tone: 'lilac',
    image: '/images/process/intervention.jpg',
    description: 'Regular sessions with tracked milestones — celebrate every win together.',
  },
];

/* Marquee: whole sets rendered per half-track so the -50% keyframe always lands
   on an identical frame. Two sets per half ≈ 2300px of content, wider than any
   common viewport, so the loop never shows an empty gap. */
const MARQUEE_SET_COPIES = 2;

// Icons cycled onto service cards (API rows don't carry icons)
const serviceIcons = [Activity, Brain, MessageCircle, Sparkles, Users, Ear, Heart, Puzzle];
const decorateService = (service, index) => {
  if (service.icon) return service;
  const Icon = serviceIcons[index % serviceIcons.length];
  const tone = index % 2 === 0 ? 'text-pastel-peach' : 'text-pastel-lilac';
  return { ...service, icon: <Icon className={`pastel-icon ${tone}`} size={32} /> };
};

const Home = () => {
  // Admin "SEO" tab row for "/" - empty fields keep the static index.html tags
  usePageSeo('/');
  // Initial state = static fallback (frontend-only deploys / offline); the API
  // response replaces it whenever it answers.
  const [testimonials, setTestimonials] = useState(FALLBACK_DATA.testimonials);
  const [features] = useState(trustBadges);
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState(FALLBACK_DATA.faqs);
  const [blogs, setBlogs] = useState(FALLBACK_DATA.blogs.slice(0, 2).map((b) => ({
    ...b,
    image: b.featured_image || b.image || null,
    excerpt: b.excerpt || b.short_description || ''
  })));
  const [founders, setFounders] = useState(FALLBACK_DATA.founders);
  // Loading gate for the remaining DB sections (testimonials/founders/blogs).
  const [loading, setLoading] = useState(true);
  // Free-screening lead popup: opens ~10s after the home page loads, on EVERY
  // visit/reload (never permanently suppressed) - client requirement.
  const [leadPopupOpen, setLeadPopupOpen] = useState(false);

  const { setIsModalOpen, settings } = useAppContext();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [testimonialsRes, blogsRes, foundersRes, faqsRes] = await Promise.all([
          fetch(`${API_URL}/api/testimonials`),
          fetch(`${API_URL}/api/blogs`),
          fetch(`${API_URL}/api/founders`),
          fetch(`${API_URL}/api/faqs?page=home`)
        ]);
        if (cancelled) return;
        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json();
          if (Array.isArray(data) && data.length > 0) setTestimonials(data);
        }
        if (faqsRes.ok) {
          const data = await faqsRes.json();
          if (Array.isArray(data) && data.length > 0) setFaqs(data);
        }
        if (blogsRes.ok) {
          const data = await blogsRes.json();
          if (Array.isArray(data)) {
            // Normalize: DB rows may use featured_image or image; cards expect `image`.
            // The home blog grid is 2 columns - keep only 2 cards so no orphan third row.
            setBlogs(data.slice(0, 2).map((b) => ({
              ...b,
              image: b.featured_image || b.image || null,
              excerpt: b.excerpt || b.short_description || ''
            })));
          }
        }
        if (foundersRes.ok) {
          const data = await foundersRes.json();
          if (Array.isArray(data) && data.length > 0) setFounders(data);
        }
      } catch {
        // API unreachable - static fallback data keeps every section populated
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* GSAP: hero entrance, floating doodles, scroll reveals, gentle photo parallax */
  useEffect(() => {
    const heroTl = createHeroTimeline(heroRef.current);
    const cleanupFloat = createFloatLoop(heroRef.current, '[data-float]');
    const cleanupReveals = initScrollReveals(pageRef.current);
    const cleanupParallax = createParallax(heroRef.current, '[data-parallax]', 30);

    return () => {
      heroTl?.();
      cleanupFloat?.();
      cleanupReveals?.();
      cleanupParallax?.();
    };
  }, []);

  /* Lead popup: fires ~7 seconds after the home page opens. The timer starts
     on mount (i.e. every open/reload of Home) and is cleaned up if the user
     navigates away before it fires. */
  useEffect(() => {
    const timer = setTimeout(() => setLeadPopupOpen(true), 7_000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page" ref={pageRef}>
      <StructuredData type="organization" />
      <StructuredData type="faq" data={faqs} />
      {/* Hero Section (Peach) */}
      <section className="bg-pastel-peach home-hero relative overflow-hidden" style={{ paddingTop: 'calc(2.5rem + 104px)' }} ref={heroRef}>
        <div className="container home-hero-grid z-10 relative">
          <div className="home-hero-content">
            <p className="home-hero-script" data-hero="eyebrow">
              Small Steps. Brighter Tomorrows.
              <PetalDuo className="eyebrow-petals" />
            </p>
            <h1 className="headline-2xl home-hero-title text-navy" data-hero="title">
              Every Child
              <br />
              Deserves a
              <br />
              <span className="home-hero-highlight">Brighter</span>{' '}
              Tomorrow
              <HeartDoodle className="title-end-heart" strokeWidth={2.25} />
            </h1>
            <p className="body-lg home-hero-subtitle text-navy-light" data-hero="text">
              We provide specialized, compassionate, and evidence-based therapy and support to help children overcome challenges and reach their unique potential.
            </p>
            <div className="home-hero-actions" data-hero="actions">
              <button className="btn btn-primary home-hero-book" onClick={() => setIsModalOpen(true)}>
                Book an Appointment <ArrowRight size={18} />
              </button>
              <button className="btn btn-lilac" onClick={() => {
                navigate('/about');
                window.scrollTo(0, 0);
              }}>Learn More</button>
            </div>
            <div className="home-hero-badges" data-hero="badges">
              {features.map((badge) => (
                <div className="hero-badge-item" key={badge.id}>
                  <span className={`hero-badge-icon ${badge.id === 1 ? 'bg-pastel-peach' : badge.id === 2 ? 'bg-pastel-lilac' : 'bg-pastel-mint'}`}>{badge.icon}</span>
                  <span className="hero-badge-label body-sm">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>          <div className="home-hero-visual relative" data-hero="visual">
            {/* Deep-peach sweep + organic blob-masked photo window, per the reference */}
            <div className="hero-sweep" aria-hidden="true" />
            <div className="hero-photo-window">
              <img src="/images/home%20hero%20img.png" alt="Pediatric occupational therapist helping a toddler stack colorful blocks during a therapy session at TheraKids Noida child development center" className="home-hero-img" data-parallax />
            </div>
            {/* Coral petals upper-left + small coral dot on the photo's left rim */}
            <PetalDuo className="doodle petal-top" data-float />
            <span className="hero-dot" aria-hidden="true" />
            {/* Lavender script blob, top-right of the photo */}
            <div className="hero-script-blob" aria-hidden="true" data-float>
              <span>Kinder</span>
              <span>Stronger</span>
              <span>Brighter</span>
              <span>Together</span>
              <HeartDoodle className="script-blob-heart" color="currentColor" strokeWidth={2.5} />
            </div>
            {/* Coral heart outline above the note card */}
            <HeartDoodle className="doodle note-float-heart" data-float />
            {/* White note card, bottom-right of the photo */}
            <div className="hero-note-card" data-float>
              <SproutDoodle className="note-card-leaf" />
              <p>A brighter tomorrow begins with the right support.</p>
            </div>
          </div>
        </div>

        {/* Trusted-by line under the hero grid */}
        <div className="container hero-trusted relative z-10" data-hero="badges">
          <span className="trusted-dash" aria-hidden="true" />
          Trusted by families. Supported by experts.
        </div>

        {/* Cloud Divider to White */}
        <div className="cloud-divider cloud-bottom fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Services/Offers Section (White) */}
      <section className="bg-white section-padding relative overflow-hidden">
        <div className="container z-10 relative">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">How we can work together</p>
            <h2 className="headline-xl text-navy">Intervention Programs We Offer</h2>
          </div>
          {loading ? (
            <div className="body-md text-navy-light text-center" style={{ padding: '2rem 0' }}>Loading services…</div>
          ) : (
            <div className="grid grid-cols-4 gap-6 services-grid-expanded" data-reveal-group>
              {/* Show 8 programs so the 4-col grid forms two complete rows. Static section:
                  content is hardcoded here, not fetched from the services API. */}
              {STATIC_SERVICES.map((service, index) => {
                const decorated = decorateService(service, index);
                return (
                  <div key={decorated.name}>
                    <TiltCard maxTilt={8}>
                      <div className="card pastel-card service-gradient-card">
                        <div className="pastel-icon-wrapper mb-4 mx-auto">
                          {decorated.icon}
                        </div>
                        <h3 className="headline-sm text-navy mb-2 text-center">{decorated.name}</h3>
                        <p className="body-sm text-navy-light text-center">{decorated.short_description}</p>
                      </div>
                    </TiltCard>
                  </div>
                );
              })}
            </div>
          )}

          {/* Inline CTA Section */}
          <div className="mt-12" data-reveal>
            <InlineCTA />
          </div>
        </div>

        {/* Cloud Divider to Lilac */}
        <div className="cloud-divider cloud-bottom fill-pastel-lilac">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Process Section (Lilac) — STATIC per the client brief: four fixed steps,
          not admin-managed. Images are the site's own process photos. */}
      <section className="bg-pastel-lilac section-padding relative overflow-hidden">
        <div className="container z-10 relative">
          <div className="section-header center mb-16" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">How it works</p>
            <h2 className="headline-xl text-navy">Our Process</h2>
          </div>

          <div className="grid grid-cols-4 gap-8 process-grid" data-reveal-group>
            {STATIC_PROCESS_STEPS.map((step) => (
              <div key={step.title}>
                <TiltCard maxTilt={7}>
                  <div className="process-step text-center">
                    <div className="process-img-wrapper mb-6 relative mx-auto">
                      {/* Arch clip window: nothing (photo, shine) can render outside the arch */}
                      <div className="process-arch-window">
                        <img
                        src={step.image}
                        alt={`TheraKids pediatric therapy process step ${step.step}: ${step.title} in Noida`}
                        className="process-arch-img w-full object-cover"
                        loading="lazy"
                      />
                      </div>
                      <div className={`process-badge bg-pastel-${step.tone}`}>
                        {step.step}
                      </div>
                    </div>
                    <h3 className="headline-sm text-navy mb-2">{step.title}</h3>
                    <p className="body-sm text-navy-light">{step.description}</p>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
          <div className="text-center mt-12" data-reveal>
            <button className="btn btn-primary px-8 shadow-sm" onClick={() => {
              navigate('/contact');
              window.scrollTo(0, 0);
            }}>Contact Us</button>
          </div>
        </div>

        {/* Cloud Divider to White */}
        <div className="cloud-divider cloud-bottom fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Meet Our Founders (White) - portraits come from the founders table.
          The section (and its reveal animations) renders only once the API data
          has loaded, so GSAP never registers triggers on placeholder children. */}
      {founders.length > 0 && (
        <section className="bg-white section-padding relative overflow-hidden">
          {/* Single-wave seams: the lilac Process band's bottom wave already
              carves this section's top edge, so only the bottom seam needs a
              wave here (peach, into Testimonials). */}
          <div className="cloud-divider cloud-bottom fill-pastel-peach">
            <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
              <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
            </svg>
          </div>
          <div className="container grid grid-cols-2 gap-12 items-center z-10 relative">
            <div data-reveal>
              <h2 className="headline-xl text-navy mb-6">Meet Our Founders</h2>
              <p className="body-lg text-navy-light mb-4">
                At THERAkids, we are dedicated to empowering children aged 0-18 to reach their full potential through our specialized multidisciplinary approach to pediatric care and development.
              </p>
              <p className="body-lg text-navy-light mb-8">
                Meet the founders whose vision and dedication continue to guide our team of passionate professionals in providing personalized, holistic therapies for every child.
              </p>
              <button className="btn btn-outline border-navy text-navy" onClick={() => {
                navigate('/about');
                window.scrollTo(0, 0);
              }}>Learn more</button>
            </div>

            <div className="founders-img-grid" data-reveal-group>
              {founders.map((founder) => (
                <figure key={founder.id} className="founder-polaroid">
                  <div className="polaroid-frame">
                    <img
                      src={founder.profile_image}
                      alt={`Therapy center co-founder ${founder.name} - ${founder.role} at TheraKids pediatric therapy center Noida`}
                      className="founder-polaroid-img"
                      loading="lazy"
                    />
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials (Peach), rendered only when the API returns rows */}
      {testimonials.length > 0 && (
        <section className="bg-pastel-peach section-padding relative overflow-hidden">
          {/* Single-wave seams: the white Founders band's bottom wave already
              carves this section's top edge (peach), and the white Hero Video
              band below contributes its own white top wave. */}
          <div className="container z-10 relative">
            <div className="section-header center mb-12" data-reveal>
              <p className="label-md text-navy uppercase tracking-widest">Happy families</p>
              <h2 className="headline-xl text-navy">What Parents Say</h2>
            </div>
          </div>
          {/* Full-bleed marquee: one "set" is shorter than most screens, so the list is
              rendered COPIES times and the animation translates exactly half the track.
              Two full sets per half guarantee the row never runs dry on any viewport. */}
          <div className="testimonial-marquee" data-reveal>
            <div
              className="testimonial-marquee-track"
              style={{ '--marquee-cards': testimonials.length * MARQUEE_SET_COPIES }}
            >
              {Array.from({ length: MARQUEE_SET_COPIES * 2 }).flatMap((_, set) =>
                testimonials.map((testimonial, i) => (
                <div
                  className="testimonial-slide"
                  key={`${set}-${testimonial.id}-${i}`}
                  aria-hidden={set > 0 ? 'true' : undefined}
                >
                  <article className="pastel-card testimonial-card">
                    <Quote className="testimonial-quote-mark" size={34} fill="currentColor" />
                    <p className="body-md text-navy-light testimonial-text">&ldquo;{testimonial.testimonial}&rdquo;</p>
                    <div className="testimonial-author">
                      <h4 className="label-lg text-navy">{testimonial.name}</h4>
                      {testimonial.designation && (
                        <p className="body-sm testimonial-role">{testimonial.designation}</p>
                      )}
                    </div>
                  </article>
                </div>
                ))
              )}
            </div>
          </div>
          <div className="cloud-divider cloud-bottom fill-white">
            <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
              <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
            </svg>
          </div>
        </section>
      )}

      {/* Hero Video Section (White) — split layout: copy left, video right.
          Placed AFTER Testimonials so the band rhythm stays a strict
          peach→white→lilac→white alternation down to the peach CTA.
          Title/description/video come from site_settings so the client can
          swap them in the admin panel. */}
      <section className="bg-white section-padding relative overflow-hidden">
        {/* Testimonials' white bottom wave carves the peach→white seam above;
            the lilac cloud below feeds the white→lilac seam into FAQ. */}
        <div className="container video-split z-10 relative">
          <div className="video-copy" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">Inside THERAKids</p>
            <h2 className="headline-xl text-navy mb-4">{settings.home_video_title || 'Step Inside THERAKids'}</h2>
            <p className="body-lg text-navy-light video-sub">
              {settings.home_video_description ||
                'A two-minute look at our centers, our therapists, and the joyful progress children make here every day.'}
            </p>
          </div>
          <div className="video-frame-wrapper" data-reveal>
            <video
              className="home-hero-video"
              src={settings.home_video_url || '/videos/hero-video.mp4'}
              poster="/images/hero_doctor_kid.jpg"
              controls
              preload="metadata"
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Lilac cloud below carves the white→lilac seam into the FAQ band. */}
        <div className="cloud-divider cloud-bottom fill-pastel-lilac">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* FAQ Section (Lilac) - home-page FAQs only (faqs table, page_key='home') */}
      {faqs.length > 0 && (
        <section className="bg-pastel-lilac section-padding relative overflow-hidden">
          {/* Single-wave seams: the Video band's lilac bottom wave already
              carves this section's top edge, so only the bottom seam needs a
              wave here (white, into Blog). */}
          <div className="container z-10 relative">
            <div className="section-header center mb-12" data-reveal>
              <p className="label-md text-navy uppercase tracking-widest">Got Questions?</p>
              <h2 className="headline-xl text-navy">Frequently Asked Questions</h2>
            </div>
            <div className="faq-list" data-reveal-group>
              {faqs.map((faq) => (
                <div key={faq.id} className={`faq-item ${openFaq === faq.id ? 'open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  >
                    <span className="faq-question-text headline-sm text-navy">{faq.question}</span>
                    <span className="faq-toggle">
                      {openFaq === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p className="body-md text-navy-light">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* White cloud below carves the lilac→white seam into Blog. */}
          <div className="cloud-divider cloud-bottom fill-white">
            <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
              <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
            </svg>
          </div>
        </section>
      )}

      {/* Blog Preview Section (White) - posts come from the blogs table */}
      {blogs.length > 0 && (
        <section className="bg-white section-padding relative overflow-hidden">
          {/* Single-wave seams: the FAQ band's white bottom wave already
              carves this section's top edge, so only the bottom seam needs a
              wave here (peach, into the CTA band). */}
          <div className="container z-10 relative">
            <div className="section-header center mb-12" data-reveal>
              <p className="label-md text-navy uppercase tracking-widest">Latest Insights</p>
              <h2 className="headline-xl text-navy">From Our Blog</h2>
            </div>
            <div className="grid grid-cols-2 gap-6 blog-preview-grid" data-reveal-group>
              {blogs.map((blog) => (
                <div key={blog.id}>
                  <TiltCard maxTilt={6}>
                    {/* Same framed card treatment as the Blogs page (.card base:
                        white surface + brand border), full-bleed image on top. */}
                    <div className="card blog-preview-card">
                      {blog.image && (
                        <div className="blog-preview-image">
                          <img src={blog.image} alt={`${blog.title} - pediatric therapy blog by TheraKids Noida specialists`} loading="lazy" />
                        </div>
                      )}
                      <h3 className="headline-sm text-navy mb-2">{blog.title}</h3>
                      <p className="body-sm text-navy-light mb-4">{blog.excerpt || blog.short_description}</p>
                      <button
                        className="btn btn-outline border-navy text-navy"
                        onClick={() => {
                          navigate(`/blogs/${blog.slug}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        Read More
                      </button>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
            <div className="text-center mt-12" data-reveal>
              <button
                className="btn btn-primary px-8 shadow-sm"
                onClick={() => {
                  navigate('/blogs');
                  window.scrollTo(0, 0);
                }}
              >
                View All Blogs
              </button>
            </div>
          </div>
          {/* Single-wave seam into the CTA band: the site-wide CTASection's
              white top wave carves this edge (it renders outside .home-page,
              so its wave doesn't show up in the in-page seam audit). */}
        </section>
      )}
      <LeadPopup open={leadPopupOpen} onClose={() => setLeadPopupOpen(false)} />
    </div>
  );
};

export default Home;
