import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import InlineCTA from '../components/InlineCTA';
import './Conditions.css';

const Conditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const conditions = [
    {
      id: 1,
      name: 'Autism Spectrum Disorder',
      short_name: 'Autism',
      description: 'A neurodevelopmental condition affecting communication, social interaction, and behavior. We focus on enhancing social skills, sensory processing, and promoting independence.',
      focus_areas: ['Social Skills', 'Sensory Regulation', 'Communication'],
      image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      )
    },
    {
      id: 2,
      name: 'ADHD',
      short_name: 'ADHD',
      description: 'Attention-Deficit/Hyperactivity Disorder involves differences in attention, focus, and impulse control. Our therapies help build executive functioning, emotional regulation, and academic success.',
      focus_areas: ['Executive Functioning', 'Impulse Control', 'Attention Span'],
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      )
    },
    {
      id: 3,
      name: 'Down Syndrome',
      short_name: 'Down Syndrome',
      description: 'A genetic condition causing developmental and physical differences. We provide early intervention focusing on motor milestones, speech development, and cognitive skills.',
      focus_areas: ['Motor Milestones', 'Speech Development', 'Cognitive Skills'],
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      )
    },
    {
      id: 4,
      name: 'Cerebral Palsy',
      short_name: 'Cerebral Palsy',
      description: 'A group of disorders affecting movement and muscle tone. Our therapies focus on maximizing mobility, functional independence, and overall quality of life.',
      focus_areas: ['Mobility', 'Muscle Tone', 'Functional Independence'],
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      )
    },
    {
      id: 5,
      name: 'Global Developmental Delay (GDD)',
      short_name: 'GDD',
      description: 'When a child is significantly delayed in multiple developmental areas (motor, speech, cognitive). We provide comprehensive, multidisciplinary intervention to bridge the gaps.',
      focus_areas: ['Multidisciplinary Care', 'Milestone Tracking', 'Early Intervention'],
      image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20"></path>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      id: 6,
      name: 'Learning Disability',
      short_name: 'LD',
      description: 'Challenges affecting how the brain receives, processes, or responds to information (e.g., Dyslexia). We offer specialized educational support to build academic confidence.',
      focus_areas: ['Reading & Writing', 'Academic Confidence', 'Special Education'],
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    },
    {
      id: 7,
      name: 'Speech & Language Delay',
      short_name: 'Speech Delay',
      description: 'When a child’s language development is slower than typical milestones. Our speech pathologists work to improve articulation, comprehension, and expressive communication.',
      focus_areas: ['Articulation', 'Comprehension', 'Expressive Language'],
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      )
    },
    {
      id: 8,
      name: 'High Risk Infants',
      short_name: 'High Risk Infants',
      description: 'Infants born prematurely or with medical complications requiring early developmental monitoring and preventative therapy to ensure optimal growth trajectories.',
      focus_areas: ['Early Monitoring', 'Preventative Therapy', 'Infant Care'],
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z"></path>
          <path d="M12 3a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9z"></path>
        </svg>
      )
    },
    {
      id: 9,
      name: 'Intellectual Disability',
      short_name: 'ID',
      description: 'Characterized by significant limitations in intellectual functioning and adaptive behavior. We focus on teaching functional life skills and enhancing independence.',
      focus_areas: ['Life Skills', 'Independence', 'Adaptive Behavior'],
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
        </svg>
      )
    },
    {
      id: 10,
      name: 'Developmental Coordination Disorder',
      short_name: 'DCD',
      description: 'Also known as dyspraxia, affecting physical coordination. We help improve motor planning, balance, and execution of daily physical tasks.',
      focus_areas: ['Motor Planning', 'Balance', 'Physical Coordination'],
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="3"></circle>
          <line x1="12" y1="22" x2="12" y2="8"></line>
          <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
        </svg>
      )
    },
    {
      id: 11,
      name: 'Social Communication Disorder',
      short_name: 'SCD',
      description: 'Difficulties with the use of verbal and nonverbal language for social purposes. We facilitate social groups to practice pragmatic language and peer interactions.',
      focus_areas: ['Pragmatic Language', 'Peer Interaction', 'Group Sessions'],
      image: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      id: 12,
      name: 'Hemiparesis',
      short_name: 'Hemiparesis',
      description: 'Weakness or partial paralysis on one side of the body. Our PT and OT programs focus on strengthening, bilateral coordination, and functional mobility.',
      focus_areas: ['Strengthening', 'Bilateral Coordination', 'Functional Mobility'],
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
          <line x1="16" y1="8" x2="2" y2="22"></line>
          <line x1="17.5" y1="15" x2="9" y2="15"></line>
        </svg>
      )
    }
  ];

  return (
    <div className="conditions-page">
      <section className="conditions-hero bg-pastel-lilac relative overflow-hidden" style={{ height: '450px', display: 'flex', alignItems: 'flex-start', width: '100%', paddingTop: 'calc(4rem + 104px)' }}>
        <div className="container center-text z-10 relative">
          <h1 className="headline-2xl text-black">Who We Help</h1>
          <p className="body-lg conditions-subtitle text-black mx-auto max-w-2xl mt-4">
            We provide specialized, multidisciplinary care tailored to your child’s unique developmental profile.
          </p>
        </div>
        
        {/* Cloud Divider to White */}
        <div className="cloud-divider cloud-bottom fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      <div className="container py-12 z-10 relative bg-white" style={{ maxWidth: '100%' }}>
        <div className="container max-w-5xl mx-auto">
          <InlineCTA />
        </div>
      </div>

      <section className="bg-white section-padding pt-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col gap-12">
            {conditions.map((condition, index) => (
              <motion.div 
                key={condition.id}
                className="service-detail-card"
                style={{ marginBottom: '1rem' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <div className={`service-detail-content ${index % 2 !== 0 ? 'reverse' : ''}`}>
                  <div className="service-text">
                    <div className="flex items-center gap-3">
                      <div className="text-navy w-8 h-8">
                        {condition.icon}
                      </div>
                      <h2 className="headline-xl">{condition.name}</h2>
                    </div>
                    <p className="body-lg">{condition.description}</p>
                    
                    <div className="service-benefits bg-white/60">
                      <h4 className="label-lg">Key Focus Areas:</h4>
                      <ul>
                        {condition.focus_areas.map((area, idx) => (
                          <li key={idx} className="body-sm">{area}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="service-visual">
                    <div className="condition-blob">
                      <img src={`https://picsum.photos/seed/${condition.id + 10}/800/800`} alt={condition.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Conditions;
