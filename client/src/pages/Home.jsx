import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Activity, Brain, Puzzle, Users, Sparkles, MessageCircle, Ear, Quote } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import TiltCard from '../components/TiltCard';
import API_URL from '../config';
import { useAppContext } from '../context/AppContext';
import './Home.css';

const trustBadges = [
  { id: 1, label: 'Compassionate Care', icon: <Heart size={20} fill="currentColor" /> },
  { id: 2, label: 'Expert Therapists', icon: <Users size={20} /> },
  { id: 3, label: 'Better, Brighter Futures', icon: <Activity size={20} /> }
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

const fallbackDoctors = [
  { id: 1, name: 'Dr. Priya Sharma', specialisation: 'Lead Occupational Therapist', profile_image: '/images/dr_priya.jpg' },
  { id: 2, name: 'Dr. Rahul Verma', specialisation: 'Speech Pathologist', profile_image: '/images/dr_rahul.jpg' }
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
  const [doctors, setDoctors] = useState(fallbackDoctors);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [process] = useState(fallbackProcess);
  const [features] = useState(trustBadges);

  const { setIsModalOpen } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [servicesRes, doctorsRes, testimonialsRes] = await Promise.all([
          fetch(`${API_URL}/api/services`),
          fetch(`${API_URL}/api/doctors`),
          fetch(`${API_URL}/api/testimonials`)
        ]);
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          if (data.length) setServices(data);
        }
        if (doctorsRes.ok) {
          const data = await doctorsRes.json();
          if (data.length) setDoctors(data);
        }
        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json();
          if (data.length) setTestimonials(data);
        }
      } catch {
        // API unreachable — fallbacks stay in place; testimonials section stays hidden
      }
    };
    load();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section (Peach) */}
      <section className="bg-pastel-peach home-hero relative overflow-hidden" style={{ paddingTop: 'calc(2.5rem + 104px)' }}>
        <div className="container home-hero-grid z-10 relative">
          <motion.div
            className="home-hero-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="home-hero-script">
              Small Steps. Brighter Tomorrows.
              <svg className="script-sparkle" viewBox="0 0 30 30" fill="none" stroke="#F6B73C" strokeWidth="4" strokeLinecap="round" aria-hidden="true">
                <path d="M15 4 v7" /><path d="M6 9 l4 5" /><path d="M24 9 l-4 5" />
              </svg>
            </p>
            <h1 className="headline-2xl home-hero-title text-navy">
              Every Child Deserves a{' '}
              <span className="home-hero-highlight">Brighter</span>{' '}
              Tomorrow
              <svg className="title-end-sparkle" viewBox="0 0 34 30" fill="none" stroke="#B08AE8" strokeWidth="4" strokeLinecap="round" aria-hidden="true">
                <path d="M17 3 v9" /><path d="M5 8 l7 6" /><path d="M29 8 l-7 6" />
              </svg>
            </h1>
            <p className="body-lg home-hero-subtitle text-navy-light">
              We provide specialized, compassionate, and evidence-based therapy and support to help children overcome challenges and reach their unique potential.
            </p>
            <div className="home-hero-actions">
              <button className="btn btn-primary home-hero-book" onClick={() => setIsModalOpen(true)}>
                Book an Appointment <ArrowRight size={18} />
              </button>
              <button className="btn btn-lilac" onClick={() => {
                navigate('/about');
                window.scrollTo(0, 0);
              }}>Learn More</button>
            </div>
            <div className="home-hero-badges">
              {features.map((badge) => (
                <div className="hero-badge-item" key={badge.id}>
                  <span className={`hero-badge-icon ${badge.id === 1 ? 'bg-pastel-peach' : badge.id === 2 ? 'bg-pastel-lilac' : 'bg-pastel-mint'}`}>{badge.icon}</span>
                  <span className="hero-badge-label body-sm">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="home-hero-visual relative">
            <img src="/images/home%20hero%20img.png" alt="Therapist and toddler stacking colorful blocks together" className="home-hero-img" />
            {/* Doodle: rainbow with rays */}
            <svg className="doodle doodle-rainbow" viewBox="0 0 80 48" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <path d="M8 44 a32 32 0 0 1 64 0" stroke="#F6B73C" />
              <path d="M16 44 a24 24 0 0 1 48 0" stroke="#7FC8A9" />
              <path d="M24 44 a16 16 0 0 1 32 0" stroke="#E8899E" />
              <path d="M40 6 v-4 M14 16 l-3-3 M66 16 l3-3" stroke="#F6B73C" />
            </svg>
            {/* Doodle: heart with dashed trail */}
            <svg className="doodle doodle-heart" viewBox="0 0 60 70" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <path d="M30 52 C10 38 12 18 26 16 c6-1 8 4 8 4" stroke="#D9A0E8" strokeDasharray="5 6" />
              <path d="M42 26 c10-8 22 2 12 14 l-10 10 -10-10 C24 28 34 20 42 26 Z" stroke="#D9A0E8" />
            </svg>
            {/* Doodle: script note */}
            <div className="home-hero-note" aria-hidden="true">
              <span>A</span>
              <span className="note-line-2">Brighter</span>
              <span className="note-line-2">Braver</span>
              <span className="note-line-2">Happier</span>
              <span className="note-line-2">You</span>
              <svg className="note-heart" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M12 20 C4 14 2 7 7 4.5 c3-1.5 5 1.5 5 1.5 s2-3 5-1.5 c5 2.5 3 9.5 -5 15.5 Z" />
              </svg>
            </div>
          </div>
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
          <div className="section-header center mb-12">
            <p className="label-md text-navy uppercase tracking-widest">How we can work together</p>
            <h2 className="headline-xl text-navy">Intervention Programs We Offer</h2>
          </div>
          <div className="grid grid-cols-4 gap-6 services-grid-expanded">
            {services.map((service, index) => {
              const decorated = decorateService(service, index);
              return (
                <motion.div 
                  key={decorated.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <TiltCard maxTilt={8}>
                    <div className="card pastel-card">
                      <div className="pastel-icon-wrapper mb-4 mx-auto">
                        {decorated.icon}
                      </div>
                      <h3 className="headline-sm text-navy mb-2 text-center">{decorated.name}</h3>
                      <p className="body-sm text-navy-light text-center">{decorated.short_description}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
          
          {/* Inline CTA Section */}
          <div className="mt-12">
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
          <div className="section-header center mb-16">
            <p className="label-md text-navy uppercase tracking-widest">How it works</p>
            <h2 className="headline-xl text-navy">Our Process</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-8 process-grid">
            {process.map((step, index) => (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
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
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
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

      {/* Meet Our Specialists (White) */}
      <section className="bg-white section-padding relative overflow-hidden">
        <div className="container grid grid-cols-2 gap-12 items-center z-10 relative">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="headline-xl text-navy mb-6">Meet Our Specialists</h2>
            <p className="body-lg text-navy-light mb-4">
              At THERAkids, we are dedicated to empowering children aged 0-18 to reach their full potential through our specialized multidisciplinary approach to pediatric care and development.
            </p>
            <p className="body-lg text-navy-light mb-8">
              Meet our team of passionate and experienced professionals who are deeply committed to providing personalized, holistic therapies for every child.
            </p>
            <button className="btn btn-outline border-navy text-navy" onClick={() => {
              navigate('/about');
              window.scrollTo(0, 0);
            }}>Learn more</button>
          </motion.div>
          
          <div className="flex gap-4 items-end">
            {doctors.slice(0, 2).map((doctor, index) => (
              <motion.div 
                key={doctor.id} 
                className="about-arch-img-wrapper"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <img src={doctor.profile_image} alt={doctor.name} className="about-arch-img w-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
        
      </section>

      {/* Testimonials (Lilac) — rendered only when data is available */}
      {testimonials.length > 0 && (
        <section className="bg-pastel-lilac section-padding relative overflow-hidden">
          {/* Cloud Divider from White (Meet Our Specialists above) */}
          <div className="cloud-divider cloud-top fill-white">
            <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
              <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
            </svg>
          </div>
          <div className="container z-10 relative">
            <div className="section-header center mb-12">
              <p className="label-md text-navy uppercase tracking-widest">Happy families</p>
              <h2 className="headline-xl text-navy">What Parents Say</h2>
            </div>
            <div className="grid grid-cols-2 gap-6 testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <TiltCard maxTilt={6}>
                    <div className="pastel-card testimonial-card">
                      <div className={`testimonial-quote-icon mb-4 ${index % 2 === 0 ? 'bg-pastel-peach' : 'bg-pastel-lilac'}`}>
                        <Quote className="text-white" size={22} fill="currentColor" />
                      </div>
                      <p className="body-md text-navy-light mb-6">“{testimonial.testimonial}”</p>
                      <div className="testimonial-author">
                        <h4 className="label-lg text-navy">{testimonial.name}</h4>
                        {testimonial.designation && <p className="body-sm text-navy-light">{testimonial.designation}</p>}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Cloud Divider to White (CTASection below expects white above it) */}
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
