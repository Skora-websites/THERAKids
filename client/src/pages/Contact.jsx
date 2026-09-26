import React, { useEffect, useRef, useState } from 'react';
import PageHero from '../components/PageHero';
import { useAppContext } from '../context/AppContext';
import { initScrollReveals } from '../lib/motion';
import { usePageSeo } from '../hooks/usePageSeo';
import './Contact.css';

const Contact = () => {
  usePageSeo('/contact');
  // Contact details come from admin (Site Settings) via /api/settings
  const { settings } = useAppContext();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const pageRef = useRef(null);

  /* GSAP scroll reveals for the contact cards & form */
  useEffect(() => {
    const cleanupReveals = initScrollReveals(pageRef.current);
    return () => cleanupReveals?.();
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate send
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
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
        imageAlt="Welcoming consultation at our centre"
        imagePosition="100% 44%"
        notePosition="bottom-right"
        scriptNote="We're here"
      />

      <section className="contact-content-section section-padding">
        <div className="container grid grid-cols-2 contact-grid">
          <div className="contact-details card" data-reveal>
            <h2 className="headline-lg mb-4">Contact Information</h2>
            
            <div className="contact-item">
              <h4 className="label-lg">Phone & WhatsApp</h4>
              <p className="body-md">
                {settings.phone.split('/').map((num, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {num.trim()}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div className="contact-item">
              <h4 className="label-lg">Email</h4>
              <p className="body-md">{settings.email}</p>
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
              <button type="submit" className="btn btn-primary mt-4">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
