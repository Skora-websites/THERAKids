import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import './CTASection.css';

const CTASection = () => {
  const { setIsModalOpen } = useAppContext();

  return (
    <section className="bg-pastel-peach relative overflow-hidden cta-section-wrapper" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      {/* Cloud Divider to overlap the section above */}
      <div className="cloud-divider cloud-top fill-white">
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
        </svg>
      </div>

      <div className="container z-10 relative text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="headline-xl text-navy mb-4">Ready to Unlock Your Child's Potential?</h2>
          <p className="body-lg text-navy-light mb-8 max-w-2xl mx-auto">
            Take the first step towards personalized care and transformative growth. Schedule a consultation with our multidisciplinary experts today.
          </p>
          <button 
            className="btn btn-primary text-white font-semibold px-8 py-4 rounded-full shadow-md" 
            onClick={() => setIsModalOpen(true)}
          >
            Book an Appointment
          </button>
        </motion.div>
      </div>
      
      {/* Decorative floral/blob bottom shapes before footer */}
      <div className="footer-transition-shapes">
        <div className="ft-shape ft-shape-mint bg-pastel-peach"></div>
        <div className="ft-shape ft-shape-rose bg-pastel-lilac"></div>
        <div className="ft-shape ft-shape-peach bg-white border border-gray-200"></div>
      </div>
    </section>
  );
};

export default CTASection;
