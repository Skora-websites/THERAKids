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

const otBenefits = [
  {
    id: 1,
    title: 'Fine Motor Skills',
    description: 'With age, a child can do certain joyful activities with the help of small hand muscles — shaking a hand, reacting to certain words, trying to babble, scrawl, hold a pencil, etc. This therapy helps your child develop these skills at an age-appropriate period.'
  },
  {
    id: 2,
    title: 'Sensory Processing Skills',
    description: 'If your child doesn\'t react to smell, sound, touch, or sometimes overreacts to it, it\'s a sign of sensory issues. This therapy helps your child know how to react while touching something, smelling, or on sound.'
  },
  {
    id: 3,
    title: 'Gross Motor Skills',
    description: 'This skill consists of the usage of major muscle groups in performing tasks. Our pediatric therapists help your child develop this skill in a playing method like running fast, climbing stairs, catching and throwing, etc.'
  },
  {
    id: 4,
    title: 'Self-Care Independence',
    description: 'We help children develop the ability to perform daily activities like eating, drinking, doing mathematics calculations, playing games, comfort their friends, draw pictures, and several other skills independently.'
  }
];

const otSigns = [
  'Difficulty with self-feeding, bathing, or crawling',
  'Challenges connecting in social activities or engagements',
  'Poor eye-hand movement and coordination',
  'Unable to perform age-appropriate activities like walking, running, writing',
  'Poor handwriting',
  'Sensory processing disorder — inability to feel touch, taste, smell, or sound',
  'Difficulty in gross motor activities such as climbing stairs, running fast, picking and throwing'
];

const otCauses = [
  'Abnormalities of the sensory system',
  'Birth harm or birth flaws',
  'Accidents',
  'Mental health or physical disability',
  'Issues with learning',
  'Traumatic injuries',
  'Rheumatoid arthritis in youngsters',
  'Behavioural problems',
  'Chronic conditions such as multiple sclerosis, cerebral palsy'
];

const faqData = [
  {
    id: 1,
    question: 'What is Occupational Therapy for children?',
    answer: 'Occupational therapy is a science-based study that helps people with disabilities overcome their issues. It helps children with various disabilities perform daily tasks like self-feeding, bathing, crawling, etc. Pediatric therapists work with a professional degree to help children develop essential life skills.'
  },
  {
    id: 2,
    question: 'What does a Pediatric Occupational Therapist do?',
    answer: 'A pediatric occupational therapist studies a person\'s mind and how a child with a disability analyzes things and reacts to them. They use different techniques to help children overcome their issues and develop fine motor, sensory processing, and gross motor skills.'
  },
  {
    id: 3,
    question: 'How do I know if my child needs OT?',
    answer: 'If your child has difficulty with self-feeding, bathing, crawling, connecting in social activities, poor eye-hand coordination, inability to perform age-appropriate activities, poor handwriting, or sensory processing issues, you should consult an occupational therapist.'
  },
  {
    id: 4,
    question: 'Is Occupational Therapy effective for Autism?',
    answer: 'Yes, Occupational Therapy helps improve functional independence in daily life by preventing or minimizing sensory, cognitive, or physical problems. It is a goal-oriented, highly structured, and customized program that can be very effective for children with autism.'
  },
  {
    id: 5,
    question: 'How long does Occupational Therapy take?',
    answer: 'The duration varies depending on the child\'s specific needs, the severity of the condition, and how the child responds to therapy. Our therapists track every child\'s improvement and adjust the program accordingly to ensure optimal progress.'
  }
];

const OccupationalTherapy = () => {
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
    { label: 'Occupational Therapy', path: '/services/occupational-therapy' }
  ];

  return (
    <div className="therapy-detail-page" ref={pageRef}>
      <StructuredData type="breadcrumb" data={breadcrumbItems} />
      <StructuredData type="service" data={{
        name: 'Occupational Therapy',
        description: 'Our occupational therapists help children develop the fine motor, sensory processing, and visual motor skills needed for everyday activities like dressing, writing, and playing.',
        benefits: ['Fine motor skill development', 'Sensory regulation strategies', 'Self-care independence', 'Hand-eye coordination']
      }} />
      <PageHero
        bg="bg-pastel-peach"
        blob={2}
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        eyebrow="Occupational Therapy"
        title="Building independence through meaningful activities."
        subtitle="Our occupational therapists help children develop the fine motor, sensory processing, and visual motor skills needed for everyday activities like dressing, writing, and playing."
        image="/images/gallery/d1copy.webp"
        imageAlt="Occupational therapy session with a child"
        imagePosition="50% 40%"
        notePosition="top-left"
        scriptNote={
          <>
            <span>Build skills</span>
            <Heart className="script-heart" size={16} fill="currentColor" />
          </>
        }
      />

      {/* Introduction Section */}
      <section className="therapy-intro section-padding">
        <div className="container grid grid-cols-2 therapy-intro-grid">
          <div className="therapy-intro-content" data-reveal>
            <h2 className="headline-xl mb-6">What is Occupational Therapy?</h2>
            <p className="body-lg mb-4">
              Any nation's future lies with its children. If they have any problems that are hard to manage on their own, either physical or mental, their family plays a crucial role while coping with these issues.
            </p>
            <p className="body-lg mb-4">
              Professional Occupational Therapy (OT) helps a person with various disabilities that make them unable to perform daily tasks like self-feeding, bathing, crawling, etc. OT is a science-based study that includes studying a person's mind and how a person with a disability analyzes things and reacts to them.
            </p>
            <p className="body-lg mb-6">
              This process enables children to develop their confidence in various activities. They learn to communicate, be creative, walk properly, and act nicely in a crunch situation. Occupational therapy can bring an impressive change in a child's personality.
            </p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              Book an Appointment <ArrowRight size={18} />
            </button>
          </div>
          <div className="therapy-intro-visual" data-reveal>
            <div className="therapy-blob-mask">
              <img src="/images/gallery/d3copy.webp" alt="Occupational therapy activities" />
            </div>
            <Sparkle className="therapy-sparkle" data-float />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="therapy-benefits section-padding bg-pastel-peach">
        <div className="container z-10 relative">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">Key Benefits</p>
            <h2 className="headline-xl text-navy">Primary Skills We Develop</h2>
            <p className="body-lg text-navy-light max-w-3xl mx-auto mt-4">
              Our therapists assist children in developing many essential skills that help improve self-esteem and overcome challenges. Development of these skills at an appropriate age is necessary.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 benefits-grid" data-reveal-group>
            {otBenefits.map((benefit) => (
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

      {/* Signs & Causes Section */}
      <section className="therapy-signs section-padding">
        <div className="container grid grid-cols-2 gap-12 signs-grid">
          <div className="signs-content" data-reveal>
            <h2 className="headline-xl text-navy mb-6">Signs Your Child Needs OT</h2>
            <p className="body-lg text-navy-light mb-6">
              If you find any of these symptoms in your child, then you need to consult with an occupational therapist:
            </p>
            <ul className="signs-list">
              {otSigns.map((sign, index) => (
                <li key={index} className="body-md text-navy-light">
                  <span className="sign-bullet">✓</span>
                  {sign}
                </li>
              ))}
            </ul>
          </div>
          <div className="causes-content" data-reveal>
            <h2 className="headline-xl text-navy mb-6">Common Causes</h2>
            <p className="body-lg text-navy-light mb-6">
              Multiple reasons can cause this disorder to occur by birth or after an incident:
            </p>
            <ul className="causes-list">
              {otCauses.map((cause, index) => (
                <li key={index} className="body-md text-navy-light">
                  <span className="cause-bullet">•</span>
                  {cause}
                </li>
              ))}
            </ul>
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
      <RelatedServices currentService="/services/occupational-therapy" />

      {/* CTA Section */}
      <div className="container pb-12 pt-8 z-10 relative">
        <InlineCTA />
      </div>
    </div>
  );
};

export default OccupationalTherapy;
