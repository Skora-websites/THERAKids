import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './InlineCTA.css';

const InlineCTA = () => {
  const { setIsModalOpen } = useAppContext();

  return (
    <div className="inline-cta-container">
      <div className="inline-cta-content">
        <div className="inline-cta-text-side">
          <div className="inline-cta-badge">
            <span className="badge-text">TAKE THE NEXT STEP</span>
          </div>
          <h2 className="inline-cta-title">Start Your Child's Journey with Us</h2>
          <p className="inline-cta-desc">
            Let's work together to support your child's journey. Schedule a session with our experienced team today.
          </p>
          <button className="inline-cta-btn" onClick={() => setIsModalOpen(true)}>
            Book an Appointment <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="inline-cta-image-side">
          <div className="handwritten-text text-left">
            <span>Brighter</span>
            <span>days ahead</span>
            <span className="heart-icon">♡</span>
          </div>
          
          <img src="/images/cta-illustration2.png" alt="Schedule an appointment" className="inline-cta-illustration" />
          
          <div className="handwritten-text text-right">
            <span>Small</span>
            <span>Steps</span>
            <span>Big</span>
            <span>Progress</span>
            <span className="heart-icon">♡</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineCTA;
