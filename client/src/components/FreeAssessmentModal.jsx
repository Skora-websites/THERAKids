import React, { useEffect, useRef, useState } from 'react';
import API_URL from '../config';
import { CONTACT_FALLBACKS } from '../lib/contact';
import './AppointmentModal.css';

/* Free Screening / Assessment popup form — the first step of the lead funnel:
   Popup → Free Screening Form → Screening → Paid Full Assessment → Therapy.
   Styled with the site's shared modal classes (AppointmentModal.css) so it
   matches the Book-an-Appointment / Online Therapy popups exactly. */

const FreeAssessmentModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    parent_name: '',
    child_name: '',
    child_age: '',
    phone: '',
    email: '',
    concern: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const closeBtnRef = useRef(null);

  // Focus the close button on mount so keyboard users can dismiss immediately
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Esc closes while the popup is open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/free-assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Could not submit your request. Please try again.');
      }
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close popup" ref={closeBtnRef}>
          &times;
        </button>

        {submitted ? (
          <div className="modal-success" role="status" aria-live="polite">
            <div className="success-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="headline-md success-title">Request Received!</h3>
            <p className="body-sm success-text">
              Thank you! Our team will call you shortly to schedule your child's free screening.
            </p>
            <div className="success-actions">
              <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="headline-md modal-title">Book a Free Screening</h2>
            <p className="body-sm modal-subtitle">
              Start with a free initial screening — our experts will guide you on the next steps, no commitment needed.
            </p>

            {error && <div className="modal-error">{error}</div>}

            <form onSubmit={handleSubmit} className="appointment-form grid grid-cols-2">
              <div className="form-group col-span-2">
                <label className="label-sm">Parent / Guardian Name *</label>
                <input type="text" name="parent_name" className="input-field" required value={formData.parent_name} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="label-sm">Child's Name *</label>
                <input type="text" name="child_name" className="input-field" required value={formData.child_name} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="label-sm">Child's Age *</label>
                <input type="text" name="child_age" className="input-field" required value={formData.child_age} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="label-sm">Phone Number *</label>
                <input type="tel" name="phone" className="input-field" required pattern="[0-9+()\s-]{10,20}" title="Please enter a valid phone number (at least 10 digits, e.g. 98765 43210)" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="label-sm">Email Address *</label>
                <input type="email" name="email" className="input-field" required value={formData.email} onChange={handleChange} />
              </div>

              <div className="form-group col-span-2">
                <label className="label-sm">Primary Concern</label>
                <textarea
                  name="concern"
                  className="input-field"
                  rows="3"
                  placeholder="Tell us briefly about your child and what you'd like support with"
                  value={formData.concern}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-group col-span-2 submit-container">
                <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Request Free Screening'}
                </button>
                <p className="label-sm" style={{ marginTop: '0.75rem', color: 'var(--color-on-surface-variant)', textAlign: 'center' }}>
                  Prefer to talk first? Call us on{' '}
                  <a href={`tel:${CONTACT_FALLBACKS.phone.split('/')[0].replace(/[^\d+]/g, '')}`}>
                    {CONTACT_FALLBACKS.phone.split('/')[0].trim()}
                  </a>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FreeAssessmentModal;
