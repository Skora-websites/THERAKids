import React, { useEffect, useRef, useState } from 'react';
import PageHero from '../components/PageHero';
import { initScrollReveals } from '../lib/motion';
import './Contact.css';

const Contact = () => {
  // const { settings } = useAppContext(); // Not used currently
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
              <p className="body-md">+91 93135 13313<br/>+91 98993 38813</p>
            </div>
            
            <div className="contact-item">
              <h4 className="label-lg">Email</h4>
              <p className="body-md">therakids.dc@gmail.com</p>
            </div>

            <div className="contact-item">
              <h4 className="label-lg">Our Centers</h4>
              <p className="body-md"><strong>Noida:</strong><br/>G-10, Block G, Sector 22, Noida, Uttar Pradesh – 201301</p>
              <br/>
              <p className="body-md"><strong>Greater Noida West:</strong><br/>173, Itehara, Near NX-One Society, Greater Noida West, Uttar Pradesh – 201306</p>
            </div>

            <div className="contact-item">
              <h4 className="label-lg">Hours of Operation</h4>
              <p className="body-md">Mon-Fri: 8:00 AM - 6:00 PM</p>
              <p className="body-md">Saturday: 9:00 AM - 2:00 PM</p>
              <p className="body-md">Sunday: Closed</p>
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
