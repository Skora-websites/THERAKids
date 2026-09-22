import React, { useEffect, useRef, useState } from 'react';
import { Heart, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import TiltCard from '../components/TiltCard';
import Breadcrumb from '../components/Breadcrumb';
import RelatedServices from '../components/RelatedServices';
import StructuredData from '../components/StructuredData';
import { Sparkle } from '../components/doodles/Doodles';
import { initScrollReveals, createFloatLoop } from '../lib/motion';
import { useAppContext } from '../context/AppContext';
import './TherapyDetail.css';

const ptBenefits = [
  {
    id: 1,
    title: 'Pain Relief Through Exercise',
    description: 'By doing good exercise, children can get relief from muscular pain. Our therapists design exercise programs that are fun and engaging while effectively reducing discomfort.'
  },
  {
    id: 2,
    title: 'Balance & Coordination',
    description: 'This therapy helps kids to balance themselves correctly and avoid falling. Children develop better body awareness and coordination through targeted activities.'
  },
  {
    id: 3,
    title: 'Mobility Development',
    description: 'This therapy helps kids to develop normal mobility so that they don\'t have any trouble in walking, moving, or standing. We work on building strength and flexibility.'
  },
  {
    id: 4,
    title: 'Functional Independence',
    description: 'Sometimes physical therapy can also help an individual to such great measures that they don\'t have to go for surgery. We focus on maximizing independence in daily activities.'
  }
];

const ptConditions = [
  'Cerebral Palsy',
  'Muscular Dystrophy',
  'Spina Bifida',
  'Orthopaedic Disorders',
  'Walking Disorders',
  'Genetic Conditions',
  'Injury Rehabilitation',
  'Developmental Delays'
];

const faqData = [
  {
    id: 1,
    question: 'What is Pediatric Physical Therapy?',
    answer: 'Pediatric physical therapy is a specialized form of therapy that helps children improve their physical abilities, including movement, strength, balance, and coordination. Our therapists work with children to help them reach their maximum physical potential.'
  },
  {
    id: 2,
    question: 'When does my child need Physical Therapy?',
    answer: 'If your child has difficulty performing basic movements because of an injury or illness, they may need physical therapy. Delay in learning motor skills is not always considered a problem with movement, but our physiotherapists can assess whether your child would benefit.'
  },
  {
    id: 3,
    question: 'What conditions does Physical Therapy treat?',
    answer: 'Physical therapy can help with cerebral palsy, muscular dystrophy, spina bifida, orthopaedic disorders, walking disorders, genetic conditions, injury rehabilitation, and developmental delays.'
  },
  {
    id: 4,
    question: 'How does Physical Therapy help children?',
    answer: 'Physical therapy helps children by providing proper management to overcome critical physical conditions. Our therapists bring children to activities like stretching, running, jumping, and use technologies to treat various conditions.'
  },
  {
    id: 5,
    question: 'What techniques are used in Pediatric Physical Therapy?',
    answer: 'We use a variety of techniques including therapeutic exercises, stretching, balance training, gait training, functional mobility training, and advanced technologies for conditions related to genetics, orthopaedic disorders, and walking disorders.'
  }
];

const PhysicalTherapy = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const pageRef = useRef(null);
  const faqRef = useRef(null);
  const { setIsModalOpen } = useAppContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const cleanupReveals = initScrollReveals(pageRef.current);
    const cleanupFloat = createFloatLoop(pageRef.current, '[data-float]');
    return () => {
      cleanupReveals?.();
      cleanupFloat?.();
    };
  }, []);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Physical Therapy', path: '/services/physical-therapy' }
  ];

  return (
    <div className="therapy-detail-page" ref={pageRef}>
      <StructuredData type="breadcrumb" data={breadcrumbItems} />
      <StructuredData type="service" data={{
        name: 'Physical Therapy',
        description: 'Our pediatric physical therapists help children overcome physical challenges, developing strength, balance, and coordination for improved independence.',
        benefits: ['Mobility improvement', 'Muscle strengthening', 'Balance and coordination', 'Pain relief through exercise']
      }} />
      <PageHero
        bg="bg-pastel-mint"
        blob={3}
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        eyebrow="Physical Therapy"
        title="Empowering movement and mobility."
        subtitle="Our pediatric physical therapists help children overcome physical challenges, developing strength, balance, and coordination for improved independence."
        image="/images/gallery/d6copy.webp"
        imageAlt="Physical therapy session with a child"
        imagePosition="50% 30%"
        notePosition="bottom-right"
        scriptNote={
          <>
            <span>Move freely</span>
            <Heart className="script-heart" size={16} fill="currentColor" />
          </>
        }
      />

      {/* Introduction Section */}
      <section className="therapy-intro section-padding">
        <div className="container grid grid-cols-2 therapy-intro-grid">
          <div className="therapy-intro-content" data-reveal>
            <h2 className="headline-xl mb-6">What is Physical Therapy?</h2>
            <p className="body-lg mb-4">
              Physical therapy is known as proper management given to a person to overcome a critical physical condition. We work hard on every child in making them a good personality who can work and act independently in any situation.
            </p>
            <p className="body-lg mb-4">
              Our paediatric physical therapists have been doing great work in this area. They bring children to proper activities like stretching, running, jumping, and more. They give good concentration in making a kid go free from all the muscular pain and increase their ease of movement.
            </p>
            <p className="body-lg mb-6">
              Physical therapists also take the help of technologies to treat certain conditions related to genetics, orthopaedic disorders, and walking disorders.
            </p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              Book an Appointment <ArrowRight size={18} />
            </button>
          </div>
          <div className="therapy-intro-visual" data-reveal>
            <div className="therapy-blob-mask">
              <img src="/images/gallery/d4copy.webp" alt="Physical therapy exercises" />
            </div>
            <Sparkle className="therapy-sparkle" data-float />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="therapy-benefits section-padding bg-pastel-mint">
        <div className="container z-10 relative">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">Key Benefits</p>
            <h2 className="headline-xl text-navy">Advantages of Physical Therapy</h2>
            <p className="body-lg text-navy-light max-w-3xl mx-auto mt-4">
              Physical therapy provides comprehensive support for children with physical challenges, helping them achieve greater independence and confidence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 benefits-grid" data-reveal-group>
            {ptBenefits.map((benefit) => (
              <TiltCard key={benefit.id} maxTilt={6}>
                <div className="benefit-card">
                  <div className="benefit-number">{String(benefit.id).padStart(2, '0')}</div>
                  <h3 className="headline-sm text-navy mb-3">{benefit.title}</h3>
                  <p className="body-sm text-navy-light">{benefit.description}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
        <div className="cloud-divider cloud-bottom fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="therapy-conditions section-padding">
        <div className="container">
          <div className="grid grid-cols-2 gap-12 conditions-content-grid">
            <div className="conditions-text" data-reveal>
              <h2 className="headline-xl text-navy mb-6">Conditions We Treat</h2>
              <p className="body-lg text-navy-light mb-8">
                Our physical therapy programs address a wide range of conditions affecting children's movement, strength, and mobility. We provide specialized intervention for:
              </p>
              <div className="conditions-tags">
                {ptConditions.map((condition, index) => (
                  <span key={index} className="condition-tag">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
            <div className="conditions-visual" data-reveal>
              <div className="therapy-blob-mask">
                <img src="/images/gallery/d5copy.webp" alt="Physical therapy activities" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="therapy-faq section-padding bg-pastel-lilac" ref={faqRef}>
        <div className="cloud-divider cloud-top fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
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
        <div className="cloud-divider cloud-bottom fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Related Services */}
      <RelatedServices currentService="/services/physical-therapy" />

      {/* CTA Section */}
      <div className="container pb-12 pt-8 z-10 relative">
        <InlineCTA />
      </div>
    </div>
  );
};

export default PhysicalTherapy;
