import React, { useEffect, useRef, useState } from 'react';
import PageHero from '../components/PageHero';
import { useAppContext } from '../context/AppContext';
import { initScrollReveals } from '../lib/motion';
import { usePageSeo } from '../hooks/usePageSeo';
import { CONTACT_FALLBACKS, OFFICIAL_PHONES, splitPhones, telHref } from '../lib/contact';
import API_URL from '../config';
import './Contact.css';

const Contact = () => {
  usePageSeo('/contact');
  // Contact details come from admin (Site Settings) via /api/settings, with the
  // official details from lib/contact.js as fallback while it loads.
  const { settings } = useAppContext();
  const phones = splitPhones(settings.phone || CONTACT_FALLBACKS.phone);
  const email = settings.email || CONTACT_FALLBACKS.email;
  const primaryPhone = OFFICIAL_PHONES[0];
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const pageRef = useRef(null);

  /* GSAP scroll reveals for the contact cards & form */
  useEffect(() => {
    const cleanupReveals = initScrollReveals(pageRef.current);
    return () => cleanupReveals?.();
  }, []);
  
  // Submits to the contact_messages table (admin "Messages" panel) - a
  // separate store from appointment requests.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Could not send your message. Please try again.');
      }
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page" ref={pageRef}>
      <PageHero
        bg="bg-pastel-peach"
        blob={1}
        eyebrow="Get in touch"
        title="Let's connect."
        subtitle="Whether you have a quick question or want to discuss your child's needs in detail, our doors are open."
        image="/images/hero-contact.jpg"
        imageAlt="Friendly staff welcoming a parent and child for a consultation at TheraKids therapy center, Noida"
        imagePosition="100% 44%"
        notePosition="bottom-right"
        scriptNote="We're here"
      >
        {/* Official number, one tap away on mobile */}
        <a className="btn btn-primary contact-call-cta" href={`tel:${primaryPhone.tel}`}>
          Call us: {primaryPhone.display}
        </a>
      </PageHero>

      <section className="contact-content-section section-padding">
        <div className="container grid grid-cols-2 contact-grid">
          <div className="contact-details card" data-reveal>
            <h2 className="headline-lg mb-4">Contact Information</h2>
            
            <div className="contact-item">
              <h4 className="label-lg">Phone &amp; WhatsApp</h4>
              <p className="body-md contact-phone-list">
                {phones.map((num) => (
                  <a key={num} href={telHref(num)} className="contact-phone-link">
                    {num}
                  </a>
                ))}
              </p>
            </div>

            <div className="contact-item">
              <h4 className="label-lg">Email</h4>
              <p className="body-md">
                <a href={`mailto:${email}`} className="contact-phone-link">{email}</a>
              </p>
            </div>

            <div className="contact-item">
              <h4 className="label-lg">Our Centers</h4>
              <p className="body-md"><strong>Noida:</strong><br/>{settings.address1}</p>
              <br/>
              <p className="body-md"><strong>Greater Noida West:</strong><br/>{settings.address2}</p>
            </div>

            <div className="contact-item">
              <h4 className="label-lg">Hours of Operation</h4>
              <p className="body-md">{settings.hours_week}</p>
              <p className="body-md">{settings.hours_sat}</p>
              <p className="body-md">{settings.hours_sun}</p>
            </div>
          </div>

          <div className="contact-form-wrapper" data-reveal>
            <h2 className="headline-lg mb-4">Send a Message</h2>
            <form id="contact-form" onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="label-sm">Your Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="label-sm">Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="label-sm">How can we help?</label>
                <textarea 
                  className="input-field" 
                  rows="5" 
                  required
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})} 
                ></textarea>
              </div>
              {submitError && (
                <div className="contact-form-error body-sm">{submitError}</div>
              )}
              {submitted && (
                <div className="contact-form-success body-sm" role="status">
                  Thank you for reaching out! Our team will get back to you soon.
                </div>
              )}
              <button type="submit" className="btn btn-primary mt-4" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
