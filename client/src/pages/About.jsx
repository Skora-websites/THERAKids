import React from 'react';
import InlineCTA from '../components/InlineCTA';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero bg-pastel-lilac relative overflow-hidden" style={{ height: '450px', display: 'flex', alignItems: 'flex-start', width: '100%', paddingTop: 'calc(4rem + 104px)' }}>
        <div className="container center-text z-10 relative">
          <h1 className="headline-2xl text-black">A community of care, built for your family.</h1>
          <p className="body-lg about-subtitle text-black">
            We believe that every child deserves a nurturing environment to discover their potential. Our clinic was founded to bridge the gap between clinical excellence and warm, family-centered support.
          </p>
        </div>
        
        {/* Cloud Divider to White */}
        <div className="cloud-divider cloud-bottom fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      <section className="about-philosophy section-padding">
        <div className="container grid grid-cols-2 philosophy-grid">
          <div className="philosophy-visual">
            <div className="image-blob-mask">
              <img src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=800&q=80" alt="Therapist with child" className="philosophy-image" />
            </div>
          </div>
          <div className="philosophy-content">
            <h2 className="headline-xl text-black">Our Mission & Philosophy</h2>
            <p className="body-lg text-black">
              <strong className="text-black">THERAKids Foundation – Child Development Centre</strong> is a leading multidisciplinary organization dedicated to providing high-quality therapy services for children facing developmental, sensory, cognitive, and physical challenges.
            </p>
            <p className="body-lg text-black">
              We are committed to creating an environment where every child receives specialized care tailored to their unique needs. With a strong emphasis on early intervention and a structured therapeutic approach, we work closely with children and their families to enhance their abilities, promote independence, and improve their overall quality of life.
            </p>
            <ul className="values-list">
              <li>
                <div className="value-icon">✓</div>
                <div>
                  <h4 className="label-lg text-black">Equipping for Independence</h4>
                  <p className="body-sm text-black">Our mission is to equip children with the necessary skills to develop independence, confidence, and convenience in their daily lives.</p>
                </div>
              </li>
              <li>
                <div className="value-icon">✓</div>
                <div>
                  <h4 className="label-lg text-black">Nurturing Environment</h4>
                  <p className="body-sm text-black">We aim to create a safe, motivated, and encouraging space where children overcome challenges and celebrate every small milestone as a big achievement.</p>
                </div>
              </li>
              <li>
                <div className="value-icon">✓</div>
                <div>
                  <h4 className="label-lg text-black">Empowering Families</h4>
                  <p className="body-sm text-black">Therapy is not just about intervention; it is about empowering children and their parents to navigate daily life with greater ease and success.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container mt-16 z-10 relative">
          <InlineCTA />
        </div>
      </section>
      
      {/* Cloud Divider from White to Peach */}
      <div className="cloud-divider cloud-bottom fill-pastel-peach" style={{ marginTop: '-4rem', position: 'relative', zIndex: 1 }}>
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
        </svg>
      </div>

      {/* Meet the Founder */}
      <section className="founder-section bg-pastel-peach relative overflow-hidden pt-12 pb-32">
        <div className="container founder-flex-container relative z-10">
          <div className="founder-content">
            <p className="label-md text-black uppercase tracking-widest mb-2">Our Founder</p>
            <h2 className="headline-xl text-black mb-6">Dr. Sandeep Rana</h2>
            <p className="body-lg text-black mb-4">
              "Over the years, we have conducted thousands of therapy sessions, helping hundreds of children make remarkable progress. Many of our children have successfully transitioned into mainstream schools, developed essential life skills, and improved their communication and motor abilities significantly."
            </p>
            <p className="body-lg text-black mb-4">
              "We take immense pride in witnessing the transformation of our young learners as they grow in confidence, capability, and independence. The success stories of our children are a testament to the dedication, expertise, and relentless efforts of our team, who work tirelessly to ensure that every therapy session brings positive change."
            </p>
            <p className="body-lg text-black mb-6 font-semibold">
              THERAKids is not just a therapy center; it is a place where children find hope, where parents find guidance, and where every small milestone is celebrated as a big achievement.
            </p>
          </div>
          <div className="founder-visual">
            <div className="founder-image-wrapper">
              <img src="/images/dr_sandeep_rana.jpg" alt="Dr. Sandeep Rana - Founder" />
            </div>
          </div>
        </div>
        
        {/* Cloud Divider from Peach to White */}
        <div className="cloud-divider cloud-bottom fill-surface-lowest">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Meet Our Specialists */}
      <section className="specialists-section relative overflow-hidden">
        <div className="container">
          <div className="text-center">
            <p className="label-md text-black uppercase tracking-widest mb-2">Our Team</p>
            <h2 className="headline-xl text-black mb-4">Meet Our Specialists</h2>
            <p className="body-lg text-black max-w-2xl mx-auto">
              Our team consists of experienced and certified professionals, including psychologists, occupational therapists, physiotherapists, special educators, and speech therapists.
            </p>
          </div>
          
          <div className="specialists-grid">
            <div className="specialist-card">
              <div className="specialist-img-wrapper">
                <img src="/images/dr_priya.jpg" alt="Dr. Priya Sharma" />
              </div>
              <div className="specialist-info">
                <h3 className="headline-sm text-black mb-1">Dr. Priya Sharma</h3>
                <p className="body-sm text-black font-semibold">Lead Occupational Therapist</p>
              </div>
            </div>
            
            <div className="specialist-card">
              <div className="specialist-img-wrapper">
                <img src="/images/dr_rahul.jpg" alt="Dr. Rahul Verma" />
              </div>
              <div className="specialist-info">
                <h3 className="headline-sm text-black mb-1">Dr. Rahul Verma</h3>
                <p className="body-sm text-black font-semibold">Speech Pathologist</p>
              </div>
            </div>

            <div className="specialist-card">
              <div className="specialist-img-wrapper">
                <img src="/images/dr_neha.jpg" alt="Dr. Neha Kapoor" />
              </div>
              <div className="specialist-info">
                <h3 className="headline-sm text-black mb-1">Dr. Neha Kapoor</h3>
                <p className="body-sm text-black font-semibold">Child Psychologist</p>
              </div>
            </div>

            <div className="specialist-card">
              <div className="specialist-img-wrapper">
                <img src="/images/dr_vikram.jpg" alt="Dr. Vikram Singh" />
              </div>
              <div className="specialist-info">
                <h3 className="headline-sm text-black mb-1">Dr. Vikram Singh</h3>
                <p className="body-sm text-black font-semibold">Occupational Therapist</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
