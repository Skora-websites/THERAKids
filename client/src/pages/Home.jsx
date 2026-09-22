import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Activity, Brain, Puzzle, Users, Sparkles, MessageCircle, Ear, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import TiltCard from '../components/TiltCard';
import StructuredData from '../components/StructuredData';
import {
  HeartDoodle,
  PetalDuo,
  SproutDoodle,
} from '../components/doodles/Doodles';
import { createHeroTimeline, createFloatLoop, initScrollReveals, createParallax } from '../lib/motion';
import API_URL from '../config';
import { useAppContext } from '../context/AppContext';
import './Home.css';

const trustBadges = [
  { id: 1, label: 'Compassionate Care', icon: <Heart size={20} fill="currentColor" /> },
  { id: 2, label: 'Expert Therapists', icon: <Users size={20} /> },
  { id: 3, label: 'Better, Brighter Futures', icon: <SproutDoodle className="badge-doodle" /> }
];

const fallbackServices = [
  { id: 1, name: 'Comprehensive Assessment', short_description: 'To identify speech and communication needs.' },
  { id: 2, name: 'Autism Assessment Clinic', short_description: 'Multidisciplinary autism assessment clinic.' },
  { id: 3, name: 'Language Development', short_description: 'Support receptive and expressive language skills.' },
  { id: 4, name: 'Literacy Support', short_description: 'Evidence-based program to support reading.' },
  { id: 5, name: 'Social Communication', short_description: 'Working with children to gain confidence in social situations.' },
  { id: 6, name: 'Speech Sound Disorders', short_description: 'Helping children improve their articulation.' },
  { id: 7, name: 'Animal Assisted Therapy', short_description: 'Work with our golden retriever on social goals.' },
  { id: 8, name: 'Brick-by-BrickAr', short_description: 'Lego based social emotional program.' }
];

const founders = [
  { id: 1, name: 'Dr. Sandeep Rana', role: 'Founder', profile_image: '/images/dr_sandeep_rana.jpg' },
  { id: 2, name: 'Dr. Ananya Sharma', role: 'Co-Founder', profile_image: '/images/dr_ananya_sharma.jpg' }
];

const fallbackTestimonials = [
  { id: 1, name: 'Priya M.', designation: 'Parent of a 6-year-old', testimonial: 'The team at THERAkids has been wonderful with our son. His communication has grown so much since we started, and he genuinely looks forward to every session.' },
  { id: 2, name: 'Arun K.', designation: 'Parent of an 8-year-old', testimonial: 'We finally feel heard. The therapists took the time to understand our daughter and built a plan that works for her — and for our whole family.' },
  { id: 3, name: 'Sneha R.', designation: 'Parent of a 4-year-old', testimonial: 'From the first assessment to every milestone since, the care and professionalism here have been exceptional. Our child is more confident every day.' }
];

const fallbackProcess = [
  { id: 1, step: '1', title: 'Contact us', desc: 'to make a referral.', img: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=300&q=80', color: 'peach' },
  { id: 2, step: '2', title: 'Assessment', desc: 'Provision of a customized, comprehensive assessment.', img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=300&q=80', color: 'lilac' },
  { id: 3, step: '3', title: 'Personalized Plan', desc: 'Customized care plans to support individual needs.', img: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=300&q=80', color: 'peach' },
  { id: 4, step: '4', title: 'Intervention', desc: 'Flexible therapy plans including clinic and school based.', img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=300&q=80', color: 'lilac' }
];

const faqData = [
  {
    id: 1,
    question: 'What is Occupational Therapy and how does it help children?',
    answer: 'Occupational therapy helps children develop the motor, sensory, and cognitive skills needed for everyday activities. Our therapists work with children to improve fine motor skills, sensory processing, and visual motor skills needed for dressing, writing, and playing. We track every child\'s improvement and tailor our approach to their unique potential.'
  },
  {
    id: 2,
    question: 'At what age should my child start therapy?',
    answer: 'Most pediatric therapies start from the age of 3 years. However, some therapies like speech therapy can start even earlier. Early intervention is key — the sooner we can assess and begin working with your child, the better the outcomes. We recommend consulting with our specialists if you notice any developmental delays.'
  },
  {
    id: 3,
    question: 'What does Speech Therapy involve?',
    answer: 'Speech therapy supports children in developing strong communication skills. It addresses articulation, receptive and expressive language, social pragmatic skills, and helps children express their thoughts and articulate words. Our speech-language pathologists also work on non-verbal communication and body language skills.'
  },
  {
    id: 4,
    question: 'When does my child need Physical Therapy?',
    answer: 'If your child has difficulty performing basic movements because of an injury or illness, they may need physical therapy. Delay in learning motor skills is not always considered a problem with movement, but our physiotherapists can help assess whether your child would benefit from physical therapy to improve mobility, balance, and strength.'
  },
  {
    id: 5,
    question: 'How do I know which therapy is right for my child?',
    answer: 'Every child is unique. We begin with a comprehensive assessment to understand your child\'s specific needs, strengths, and areas for growth. Based on this evaluation, our multidisciplinary team creates an individualized plan that may include one or more therapy types. Contact us to schedule an initial consultation.'
  }
];

// Icons cycled onto service cards (API rows don't carry icons)
const serviceIcons = [Activity, Brain, MessageCircle, Sparkles, Users, Ear, Heart, Puzzle];
const decorateService = (service, index) => {
  if (service.icon) return service;
  const Icon = serviceIcons[index % serviceIcons.length];
  const tone = index % 2 === 0 ? 'text-pastel-peach' : 'text-pastel-lilac';
  return { ...service, icon: <Icon className={`pastel-icon ${tone}`} size={32} /> };
};

const Home = () => {
  const [services, setServices] = useState(fallbackServices);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [process] = useState(fallbackProcess);
  const [features] = useState(trustBadges);
  const [openFaq, setOpenFaq] = useState(null);
  const faqRef = useRef(null);
  const blogRef = useRef(null);
  const [blogs, setBlogs] = useState([]);

  const { setIsModalOpen } = useAppContext();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [servicesRes, testimonialsRes, blogsRes] = await Promise.all([
          fetch(`${API_URL}/api/services`),
          fetch(`${API_URL}/api/testimonials`),
          fetch(`${API_URL}/api/blogs`)
        ]);
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          // Benefits come back parsed (JSON column) from MySQL — normalize for decorateService
          if (data.length) {
            setServices(data.map((s) => ({
              ...s,
              short_description: s.short_description || '',
              benefits: typeof s.benefits === 'string' ? s.benefits : JSON.stringify(s.benefits || [])
            })));
          }
        }
        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json();
          if (data.length) setTestimonials(data);
        }
        if (blogsRes.ok) {
          const data = await blogsRes.json();
          if (data.length) {
            // Normalize: DB rows may use featured_image or image; cards expect `image`.
            setBlogs(data.slice(0, 3).map((b) => ({
              ...b,
              image: b.featured_image || b.image || null,
              excerpt: b.excerpt || b.short_description || ''
            })));
          }
        }
      } catch {
        // API unreachable — fallbacks stay in place; testimonials section stays hidden
      }
    };
    load();
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

  return (
    <div className="home-page" ref={pageRef}>
      <StructuredData type="organization" />
      <StructuredData type="faq" data={faqData} />
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
              <img src="/images/home%20hero%20img.png" alt="Therapist and toddler stacking colorful blocks together" className="home-hero-img" data-parallax />
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
        <div className="container hero-trusted" data-hero="badges">
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
          <div className="grid grid-cols-4 gap-6 services-grid-expanded" data-reveal-group>
            {services.map((service, index) => {
              const decorated = decorateService(service, index);
              return (
                <div key={decorated.id}>
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

      {/* Process Section (Lilac) */}
      <section className="bg-pastel-lilac section-padding relative overflow-hidden">
        <div className="container z-10 relative">
          <div className="section-header center mb-16" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">How it works</p>
            <h2 className="headline-xl text-navy">Our Process</h2>
          </div>

          <div className="grid grid-cols-4 gap-8 process-grid" data-reveal-group>
            {process.map((step) => (
              <div key={step.id}>
                <TiltCard maxTilt={7}>
                  <div className="process-step text-center">
                    <div className="process-img-wrapper mb-6 relative mx-auto">
                      <img src={step.img} alt={step.title} className="process-arch-img w-full object-cover" />
                      <div className={`process-badge bg-pastel-${step.color}`}>
                        {step.step}
                      </div>
                    </div>
                    <h3 className="headline-sm text-navy mb-2">{step.title}</h3>
                    <p className="body-sm text-navy-light">{step.desc}</p>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
          <div className="text-center mt-12" data-reveal>
            <button className="btn btn-primary px-8 shadow-sm" onClick={() => window.scrollTo(0, 0)}>Contact Us</button>
          </div>
        </div>

        {/* Cloud Divider to White */}
        <div className="cloud-divider cloud-bottom fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Meet Our Founders (White) */}
      <section className="bg-white section-padding relative overflow-hidden">
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

          <div className="flex gap-4 items-end" data-reveal-group>
            {founders.map((founder) => (
              <div key={founder.id} className="about-arch-img-wrapper">
                <img src={founder.profile_image} alt={`${founder.name} - ${founder.role}`} className="about-arch-img w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Peach) — rendered only when data is available */}
      {testimonials.length > 0 && (
        <section className="bg-pastel-peach section-padding relative overflow-hidden">
          {/* White clouds above and below: neighbors are the white Founders band and FAQ */}
          <div className="cloud-divider cloud-top fill-white">
            <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
              <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
            </svg>
          </div>
          <div className="container z-10 relative">
            <div className="section-header center mb-12" data-reveal>
              <p className="label-md text-navy uppercase tracking-widest">Happy families</p>
              <h2 className="headline-xl text-navy">What Parents Say</h2>
            </div>
            <div className="grid grid-cols-2 gap-6 testimonials-grid" data-reveal-group>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id}>
                  <TiltCard maxTilt={6}>
                    <div className="pastel-card testimonial-card">
                      <div className={`testimonial-quote-icon mb-4 ${testimonials.indexOf(testimonial) % 2 === 0 ? 'bg-white' : 'bg-pastel-lilac'}`}>
                        <Quote className="text-white" size={22} fill="currentColor" />
                      </div>
                      <p className="body-md text-navy-light mb-6">&ldquo;{testimonial.testimonial}&rdquo;</p>
                      <div className="testimonial-author">
                        <h4 className="label-lg text-navy">{testimonial.name}</h4>
                        {testimonial.designation && <p className="body-sm text-navy-light">{testimonial.designation}</p>}
                      </div>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
          <div className="cloud-divider cloud-bottom fill-white">
            <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
              <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
            </svg>
          </div>
        </section>
      )}

      {/* FAQ Section (White) */}
      <section className="bg-white section-padding relative overflow-hidden" ref={faqRef}>
        <div className="container z-10 relative">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">Got Questions?</p>
            <h2 className="headline-xl text-navy">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list" data-reveal-group>
            {faqData.map((faq) => (
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
      </section>

      {/* Blog Preview Section (Lilac) */}
      {blogs.length > 0 && (
        <section className="bg-pastel-lilac section-padding relative overflow-hidden" ref={blogRef}>
          <div className="cloud-divider cloud-top fill-white">
            <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
              <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
            </svg>
          </div>
          <div className="container z-10 relative">
            <div className="section-header center mb-12" data-reveal>
              <p className="label-md text-navy uppercase tracking-widest">Latest Insights</p>
              <h2 className="headline-xl text-navy">From Our Blog</h2>
            </div>
            <div className="grid grid-cols-2 gap-6 blog-preview-grid" data-reveal-group>
              {blogs.map((blog) => (
                <div key={blog.id}>
                  <TiltCard maxTilt={6}>
                    <div className="pastel-card blog-preview-card">
                      {blog.image && (
                        <div className="blog-preview-image">
                          <img src={blog.image} alt={blog.title} />
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
          <div className="cloud-divider cloud-bottom fill-white">
            <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
              <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
            </svg>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
