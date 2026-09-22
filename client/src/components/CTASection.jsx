import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Sparkle, HeartDoodle, StarDoodle } from './doodles/Doodles';
import { initScrollReveals, createFloatLoop } from '../lib/motion';
import './CTASection.css';

const CTASection = () => {
  const { setIsModalOpen } = useAppContext();
  const sectionRef = useRef(null);

  useEffect(() => {
    const cleanupReveals = initScrollReveals(sectionRef.current);
    const cleanupFloat = createFloatLoop(sectionRef.current, '[data-float]');
    return () => {
      cleanupReveals?.();
      cleanupFloat?.();
    };
  }, []);

  return (
    <section
      className="bg-pastel-peach relative overflow-hidden cta-section-wrapper"
      style={{ paddingTop: '6rem', paddingBottom: '6rem' }}
      ref={sectionRef}
    >
      {/* Cloud Divider to overlap the section above */}
      <div className="cloud-divider cloud-top fill-white">
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
        </svg>
      </div>

      {/* Theme-aware floating doodles */}
      <Sparkle className="cta-doodle cta-doodle-sparkle" data-float />
      <HeartDoodle className="cta-doodle cta-doodle-heart" data-float />
      <StarDoodle className="cta-doodle cta-doodle-star" data-float />

      <div className="container z-10 relative text-center" data-reveal>
        <div>
          <h2 className="headline-xl text-navy mb-4">Ready to Unlock Your Child's Potential?</h2>
          <p className="body-lg text-navy-light mb-8 max-w-2xl mx-auto">
            Take the first step towards personalized care and transformative growth. Schedule a consultation with our multidisciplinary experts today.
          </p>
          <button
            className="btn btn-primary font-semibold px-8 py-4 rounded-full shadow-md"
            onClick={() => setIsModalOpen(true)}
          >
            Book an Appointment
          </button>
        </div>
      </div>

      {/* Decorative floral/blob bottom shapes before footer */}
      <div className="footer-transition-shapes">
        <div className="ft-shape ft-shape-mint bg-pastel-peach"></div>
        <div className="ft-shape ft-shape-rose bg-pastel-lilac"></div>
        <div className="ft-shape ft-shape-peach bg-white"></div>
      </div>
    </section>
  );
};

export default CTASection;
