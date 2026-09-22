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

const speechDisorders = [
  {
    id: 1,
    name: 'Articulation Disorder',
    description: 'A child with verbalism disorder cannot pronounce certain alphabets or words — they may say "tith" instead of "teeth." Children add, swap, or distort some words, requiring speech therapy intervention.'
  },
  {
    id: 2,
    name: 'Fluency Disorder',
    description: 'This disorder affects the flow and rhythm of communication. It includes stuttering (difficulty pronouncing words with interruptions or blocks) and cluttering (speaking very fast, making it hard to understand).'
  },
  {
    id: 3,
    name: 'Receptive Disorder',
    description: 'The most common symptom is the inability to understand what others are saying or processing it late in the brain. Hearing loss, stroke, or injury can lead to this disorder.'
  },
  {
    id: 4,
    name: 'Expressive Disorder',
    description: 'An issue where a child becomes unable to form correct sentences — making grammatical errors or incorrect verb use. This disorder is caused by unhealthy development, critical medical conditions, Down syndrome, etc.'
  },
  {
    id: 5,
    name: 'Apraxia',
    description: 'A common speech disease where you understand what others say, but when you try to reply, you find it difficult to form the correct sentence.'
  },
  {
    id: 6,
    name: 'Aphasia',
    description: 'A person with this disorder is unable to speak a word and finds it difficult to understand what others are saying. Without proper speech therapy, this disorder can cause reading and writing disabilities.'
  }
];

const therapyTypes = [
  {
    id: 1,
    name: 'Articulation Therapy',
    description: 'Specialists use a play method tailored to the age of the child. A therapist helps children make certain sounds and guides them to pronounce sounds using the tongue.',
    icon: '🗣️'
  },
  {
    id: 2,
    name: 'Speech Obtrusive Therapy',
    description: 'Pathologists treat children using books, objects, and by talking and playing with them. This method improves grammar, language ascent, and vocabulary enhancement through reiteration methods.',
    icon: '📚'
  },
  {
    id: 3,
    name: 'Oral-Motor/Feeding Therapy',
    description: 'Different exercises including facial massage, neck exercise, and muscle exercise. It helps children to be orally active while drinking, eating, or swallowing.',
    icon: '🍽️'
  }
];

const faqData = [
  {
    id: 1,
    question: 'What does speech therapy do?',
    answer: 'Speech therapy is a medical process that helps you overcome your language disorder with the help of a speech-language therapist. It addresses articulation, fluency, receptive and expressive language skills.'
  },
  {
    id: 2,
    question: 'What are some speech therapy techniques?',
    answer: 'There are many types of speech therapy techniques including Speech Obtrusive technique, Articulation therapy, and Oral-Motor/Feeding and Swallowing technique. The type depends on the specific disorder.'
  },
  {
    id: 3,
    question: 'How do I know if my child needs speech therapy?',
    answer: 'A normal child starts babbling at the age of 2-3. If your child doesn\'t react to your sound, or finds it difficult to speak words in flow, they may need speech therapy. Kids with Down syndrome also often need therapy.'
  },
  {
    id: 4,
    question: 'Does speech delay mean autism?',
    answer: 'No, speech delay is not specific to autism. Many factors can cause speech issues including global developmental delay, physical disability, stroke, and many more conditions.'
  },
  {
    id: 5,
    question: 'At what age should you worry about a child not talking?',
    answer: 'If your child won\'t start babbling at the age of 2-3, doesn\'t react to your actions, or is unable to speak, then your child may need speech therapy intervention.'
  },
  {
    id: 6,
    question: 'How long does speech therapy usually last?',
    answer: 'There is no specific time period for recovery. Several factors affect duration including age, critical medical condition, type of speech disorder, and method of treatment.'
  }
];

const SpeechTherapy = () => {
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
    { label: 'Speech Therapy', path: '/services/speech-therapy' }
  ];

  return (
    <div className="therapy-detail-page" ref={pageRef}>
      <StructuredData type="breadcrumb" data={breadcrumbItems} />
      <StructuredData type="service" data={{
        name: 'Speech Therapy',
        description: 'Our speech-language pathologists support children in developing strong communication skills, addressing articulation, receptive/expressive language, and social pragmatic skills.',
        benefits: ['Articulation and pronunciation', 'Receptive and expressive language', 'Social communication', 'Stuttering and fluency support']
      }} />
      <PageHero
        bg="bg-pastel-lilac"
        blob={2}
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        eyebrow="Speech & Language"
        title="Helping children find their voice."
        subtitle="Our speech-language pathologists support children in developing strong communication skills, addressing articulation, receptive/expressive language, and social pragmatic skills."
        image="/images/gallery/d2copy.webp"
        imageAlt="Speech therapy session with a child"
        imagePosition="0% 100%"
        notePosition="bottom-right"
        scriptNote={
          <>
            <span>Find your voice</span>
            <Heart className="script-heart" size={16} fill="currentColor" />
          </>
        }
      />

      {/* Introduction Section */}
      <section className="therapy-intro section-padding">
        <div className="container grid grid-cols-2 therapy-intro-grid">
          <div className="therapy-intro-content" data-reveal>
            <h2 className="headline-xl mb-6">What is Speech Therapy?</h2>
            <p className="body-lg mb-4">
              Speech therapy is a medical process that helps improve your communication skills and language disorders. A speech therapy specialist is known as a speech therapist or language pathologist.
            </p>
            <p className="body-lg mb-4">
              It includes several programs that include language-mediated activities, articulation remedies, and others, depending on the type of disorder. Speaking is an essential part of human nature — through speaking, we describe our deepest emotions to others.
            </p>
            <p className="body-lg mb-6">
              Our speech-language pathologists are keen on helping kids who have speaking problems. With this therapy, kids learn to speak difficult words, express new thoughts and ideas, and develop very good conversation skills.
            </p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              Book an Appointment <ArrowRight size={18} />
            </button>
          </div>
          <div className="therapy-intro-visual" data-reveal>
            <div className="therapy-blob-mask">
              <img src="/images/gallery/d1copy.webp" alt="Speech therapy session" />
            </div>
            <Sparkle className="therapy-sparkle" data-float />
          </div>
        </div>
      </section>

      {/* Speech Disorders Section */}
      <section className="therapy-disorders section-padding bg-pastel-lilac">
        <div className="container z-10 relative">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">Types of Disorders</p>
            <h2 className="headline-xl text-navy">Speech & Language Disorders We Treat</h2>
            <p className="body-lg text-navy-light max-w-3xl mx-auto mt-4">
              Children face varieties of problems while speaking. Our speech therapists have great experience working with many kids and addressing these conditions.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 disorders-grid" data-reveal-group>
            {speechDisorders.map((disorder) => (
              <TiltCard key={disorder.id} maxTilt={6}>
                <div className="disorder-card">
                  <h3 className="headline-sm text-navy mb-3">{disorder.name}</h3>
                  <p className="body-sm text-navy-light">{disorder.description}</p>
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

      {/* Therapy Types Section */}
      <section className="therapy-types section-padding">
        <div className="container">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">Our Approach</p>
            <h2 className="headline-xl text-navy">Therapy Types & Activities</h2>
          </div>
          <div className="grid grid-cols-3 gap-8 therapy-types-grid" data-reveal-group>
            {therapyTypes.map((type) => (
              <TiltCard key={type.id} maxTilt={7}>
                <div className="therapy-type-card text-center">
                  <div className="therapy-type-icon">{type.icon}</div>
                  <h3 className="headline-sm text-navy mb-3">{type.name}</h3>
                  <p className="body-sm text-navy-light">{type.description}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="therapy-why section-padding bg-pastel-peach">
        <div className="cloud-divider cloud-top fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
        <div className="container z-10 relative">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest">Why TheraKids?</p>
            <h2 className="headline-xl text-navy">Best Speech Therapy Service in Noida</h2>
          </div>
          <div className="container max-w-3xl mx-auto" data-reveal>
            <p className="body-lg text-navy-light text-center mb-6">
              Therakids Noida is the best speech therapy service provider for kids in Noida. With affordable charges and fees depending on the duration of therapy a child needs, we highly recommend providing your child a safe place with high professional pathologists.
            </p>
            <p className="body-lg text-navy-light text-center mb-8">
              We prove it possible for your child to become normal and help them communicate with good fluency. Send your kid to our facility — we guarantee that they will be in good hands.
            </p>
            <div className="text-center">
              <button className="btn btn-primary px-8" onClick={() => setIsModalOpen(true)}>
                Enquire Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="cloud-divider cloud-bottom fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="therapy-faq section-padding" ref={faqRef}>
        <div className="container">
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

      {/* Related Services */}
      <RelatedServices currentService="/services/speech-therapy" />

      {/* CTA Section */}
      <div className="container pb-12 pt-8 z-10 relative">
        <InlineCTA />
      </div>
    </div>
  );
};

export default SpeechTherapy;
