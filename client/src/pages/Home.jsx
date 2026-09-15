import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Brain, Puzzle, Users, Sparkles, MessageCircle, Ear, Award } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import { useAppContext } from '../context/AppContext';
import './Home.css';

const fallbackFeatures = [
  { id: 1, title: 'Expert Team', desc: 'Experienced and certified multidisciplinary professionals.', icon: <Award className="text-pastel-peach" size={28} /> },
  { id: 2, title: 'State-of-the-Art Facilities', desc: 'An inclusive environment designed for holistic development.', icon: <Heart className="text-pastel-lilac" size={28} /> },
  { id: 3, title: 'Individualized Plans', desc: 'Tailored learning programs for every child.', icon: <Users className="text-pastel-peach" size={28} /> },
  { id: 4, title: 'Transformative Results', desc: 'Proven success in developing confidence and independence.', icon: <Sparkles className="text-pastel-lilac" size={28} /> }
];

const fallbackServices = [
  { id: 1, name: 'Comprehensive Assessment', short_description: 'To identify speech and communication needs.', icon: <Activity className="pastel-icon text-pastel-peach" size={32} /> },
  { id: 2, name: 'Autism Assessment Clinic', short_description: 'Multidisciplinary autism assessment clinic.', icon: <Brain className="pastel-icon text-pastel-lilac" size={32} /> },
  { id: 3, name: 'Language Development', short_description: 'Support receptive and expressive language skills.', icon: <MessageCircle className="pastel-icon text-pastel-peach" size={32} /> },
  { id: 4, name: 'Literacy Support', short_description: 'Evidence-based program to support reading.', icon: <Sparkles className="pastel-icon text-pastel-lilac" size={32} /> },
  { id: 5, name: 'Social Communication', short_description: 'Working with children to gain confidence in social situations.', icon: <Users className="pastel-icon text-pastel-peach" size={32} /> },
  { id: 6, name: 'Speech Sound Disorders', short_description: 'Helping children improve their articulation.', icon: <Ear className="pastel-icon text-pastel-lilac" size={32} /> },
  { id: 7, name: 'Animal Assisted Therapy', short_description: 'Work with our golden retriever on social goals.', icon: <Heart className="pastel-icon text-pastel-peach" size={32} /> },
  { id: 8, name: 'Brick-by-BrickAr', short_description: 'Lego based social emotional program.', icon: <Puzzle className="pastel-icon text-pastel-lilac" size={32} /> }
];

const fallbackDoctors = [
  { id: 1, name: 'Dr. Priya Sharma', specialisation: 'Lead Occupational Therapist', profile_image: '/images/dr_priya.jpg' },
  { id: 2, name: 'Dr. Rahul Verma', specialisation: 'Speech Pathologist', profile_image: '/images/dr_rahul.jpg' }
];

const fallbackProcess = [
  { id: 1, step: '1', title: 'Contact us', desc: 'to make a referral.', img: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=300&q=80', color: 'peach' },
  { id: 2, step: '2', title: 'Assessment', desc: 'Provision of a customized, comprehensive assessment.', img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=300&q=80', color: 'lilac' },
  { id: 3, step: '3', title: 'Personalized Plan', desc: 'Customized care plans to support individual needs.', img: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=300&q=80', color: 'peach' },
  { id: 4, step: '4', title: 'Intervention', desc: 'Flexible therapy plans including clinic and school based.', img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=300&q=80', color: 'lilac' }
];

const Home = () => {
  const [services] = useState(fallbackServices);
  const [doctors] = useState(fallbackDoctors);
  const [process] = useState(fallbackProcess);
  const [features] = useState(fallbackFeatures);

  const { setIsModalOpen } = useAppContext();
  const navigate = useNavigate();;

  return (
    <div className="home-page">
      {/* Hero Section (Peach) */}
      <section className="bg-pastel-peach section-padding relative overflow-hidden" style={{ minHeight: '75vh', paddingTop: 'calc(4rem + 104px)' }}>
        <div className="container grid grid-cols-2 hero-grid z-10 relative">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge badge-speech hero-badge">Nurturing Growth</span>
            <h1 className="headline-2xl hero-title text-navy">
              Empowering Children to Reach Their Fullest Potential
            </h1>
            <p className="body-lg hero-subtitle text-navy">
              A leading multidisciplinary organization providing specialized therapy and support for children facing developmental, sensory, cognitive, and physical challenges.
            </p>
              <div className="hero-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn btn-lilac" onClick={() => {
                  navigate('/contact');
                  setTimeout(() => {
                    const form = document.getElementById('contact-form');
                    if (form) form.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}>Contact Us</button>
                <button className="btn btn-primary shadow-sm" onClick={() => setIsModalOpen(true)}>Book an Appointment</button>
              </div>
          </motion.div>
          
          <div className="hero-visual relative">
            <div className="hero-single-image-wrapper">
              <img src="/images/hero_doctor_kid.jpg" alt="Doctor helping child learn" className="hero-main-img float-anim" />
            </div>
            
            {/* Decorative cloud elements */}
            <div className="dec-cloud dec-cloud-1 bg-pastel-lilac float-anim-delayed-1"></div>
            <div className="dec-cloud dec-cloud-2 bg-white float-anim-delayed-2"></div>
            <div className="dec-cloud dec-cloud-3 bg-pastel-mint float-anim-delayed-3"></div>
          </div>
        </div>
        {/* Why Choose Us Banner */}
        <div className="container z-10 relative mt-16 pb-12 pt-12">
          <div className="grid grid-cols-4 gap-8 features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.id} 
                className="text-center flex flex-col items-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="feature-icon-wrapper mb-4 bg-white flex items-center justify-center shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="headline-sm text-navy mb-2">{feature.title}</h3>
                <p className="body-sm text-navy-light">{feature.desc}</p>
              </motion.div>
            ))}
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
            {services.map((service, index) => (
              <motion.div 
                key={service.id} 
                className="card pastel-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="pastel-icon-wrapper mb-4 mx-auto">
                  {service.icon}
                </div>
                <h3 className="headline-sm text-navy mb-2 text-center">{service.name}</h3>
                <p className="body-sm text-navy-light text-center">{service.short_description}</p>
              </motion.div>
            ))}
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
                className="process-step text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="process-img-wrapper mb-6 relative mx-auto">
                  <img src={step.img} alt={step.title} className="process-arch-img w-full object-cover" />
                  <div className={`process-badge bg-pastel-${step.color}`}>
                    {step.step}
                  </div>
                </div>
                <h3 className="headline-sm text-navy mb-2">{step.title}</h3>
                <p className="body-sm text-navy-light">{step.desc}</p>
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
            <button className="btn btn-outline border-navy text-navy">Learn more</button>
          </motion.div>
          
          <div className="flex gap-4 items-end">
            {doctors.map((doctor, index) => (
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
    </div>
  );
};

export default Home;
