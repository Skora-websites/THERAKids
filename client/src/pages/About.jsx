import React, { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import { Sparkle, LeafDoodle, SunDoodle, UnderlineFlourish } from '../components/doodles/Doodles';
import { initScrollReveals, createFloatLoop } from '../lib/motion';
import './About.css';

const About = () => {
  const founderRef = useRef(null);

  /* GSAP scroll reveals + gentle floating doodles in the founder section */
  useEffect(() => {
    const cleanupReveals = initScrollReveals(document.querySelector('.about-page'));
    const cleanupFloat = createFloatLoop(founderRef.current, '[data-float]');
    return () => {
      cleanupReveals?.();
      cleanupFloat?.();
    };
  }, []);

  return (
    <div className="about-page">
      <PageHero
        bg="bg-pastel-lilac"
        eyebrow="Our Story"
        title="A place where children blossom."
        subtitle="THERAKids Foundation is a multidisciplinary team dedicated to helping children aged 0-18 reach their fullest potential — through early intervention, structured therapy, and true family partnership."
        image="/images/hero-about.jpg"
        imageAlt="Child playing and learning in a bright therapy space"
        imagePosition="0% 100%"
        notePosition="bottom-right"
        scriptNote={
          <>
            <span>Family first</span>
            <Heart className="script-heart" size={16} fill="currentColor" />
          </>
        }
      />

      <section className="about-philosophy section-padding">
        <div className="container grid grid-cols-2 philosophy-grid">
          <div className="philosophy-visual" data-reveal>
            <div className="image-blob-mask">
              <img src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=800&q=80" alt="Therapist with child" className="philosophy-image" />
            </div>
            <Sparkle className="philosophy-doodle" data-float />
          </div>
          <div className="philosophy-content" data-reveal>
            <h2 className="headline-xl text-navy">Our Mission & Philosophy</h2>
            <UnderlineFlourish className="heading-flourish" />
            <p className="body-lg text-navy-light">
              <strong className="text-navy">THERAKids Foundation – Child Development Centre</strong> is a leading multidisciplinary organization dedicated to providing high-quality therapy services for children facing developmental, sensory, cognitive, and physical challenges.
            </p>
            <p className="body-lg text-navy-light">
              We are committed to creating an environment where every child receives specialized care tailored to their unique needs. With a strong emphasis on early intervention and a structured therapeutic approach, we work closely with children and their families to enhance their abilities, promote independence, and improve their overall quality of life.
            </p>
            <ul className="values-list">
              <li>
                <div className="value-icon">✓</div>
                <div>
                  <h4 className="label-lg text-navy">Equipping for Independence</h4>
                  <p className="body-sm text-navy-light">Our mission is to equip children with the necessary skills to develop independence, confidence, and convenience in their daily lives.</p>
                </div>
              </li>
              <li>
                <div className="value-icon">✓</div>
                <div>
                  <h4 className="label-lg text-navy">Nurturing Environment</h4>
                  <p className="body-sm text-navy-light">We aim to create a safe, motivated, and encouraging space where children overcome challenges and celebrate every small milestone as a big achievement.</p>
                </div>
              </li>
              <li>
                <div className="value-icon">✓</div>
                <div>
                  <h4 className="label-lg text-navy">Empowering Families</h4>
                  <p className="body-sm text-navy-light">Therapy is not just about intervention; it is about empowering children and their parents to navigate daily life with greater ease and success.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mt-12 z-10 relative">
          <InlineCTA />
        </div>
      </section>

      {/* Meet the Founder — white top wave blends it out of the philosophy section;
          extra bottom padding keeps content clear of the 150px bottom wave */}
      <section className="founder-section bg-pastel-peach relative overflow-hidden" ref={founderRef}>
        <LeafDoodle className="founder-doodle founder-doodle-leaf" data-float />
        <SunDoodle className="founder-doodle founder-doodle-sun" data-float />
        <div className="container founder-flex-container relative z-10">
          <div className="founder-content" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Our Founder</p>
            <h2 className="headline-xl text-navy mb-6">Dr. Sandeep Rana</h2>
            <p className="body-lg text-navy-light mb-4">
              "Over the years, we have conducted thousands of therapy sessions, helping hundreds of children make remarkable progress. Many of our children have successfully transitioned into mainstream schools, developed essential life skills, and improved their communication and motor abilities significantly."
            </p>
            <p className="body-lg text-navy-light mb-4">
              "We take immense pride in witnessing the transformation of our young learners as they grow in confidence, capability, and independence. The success stories of our children are a testament to the dedication, expertise, and relentless efforts of our team, who work tirelessly to ensure that every therapy session brings positive change."
            </p>
            <p className="body-lg text-navy mb-6 font-semibold">
              THERAKids is not just a therapy center; it is a place where children find hope, where parents find guidance, and where every small milestone is celebrated as a big achievement.
            </p>
          </div>
          <div className="founder-visual" data-reveal>
            <div className="founder-image-wrapper">
              <img src="/images/dr_sandeep_rana.jpg" alt="Dr. Sandeep Rana - Founder" />
            </div>
          </div>
        </div>

        {/* Cloud Divider from White to Peach */}
        <div className="cloud-divider cloud-top fill-white">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
        </svg>
        </div>

        {/* Cloud Divider from Peach to White */}
        <div className="cloud-divider cloud-bottom fill-surface-lowest">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
        </svg>
        </div>
      </section>

      {/* Meet the Co-Founder — mirrors the founder band with the image on the left.
          White background: it sits between the founder band's white-fading cloud and the
          global CTA's white top cloud, so any color here would read as a stray stripe. */}
      <section className="founder-section co-founder-section bg-white relative overflow-hidden">
        <div className="container founder-flex-container relative z-10">
          <div className="founder-visual" data-reveal>
            <div className="founder-image-wrapper">
              <img src="/images/dr_ananya_sharma.jpg" alt="Dr. Ananya Sharma - Co-Founder" />
            </div>
          </div>
          <div className="founder-content" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Our Co-Founder</p>
            <h2 className="headline-xl text-navy mb-6">Dr. Ananya Sharma</h2>
            <p className="body-lg text-navy-light mb-4">
              "Every child who walks through our doors brings a unique spark. Our role is to nurture that spark into confidence, capability, and joy — one milestone at a time."
            </p>
            <p className="body-lg text-navy-light mb-4">
              "Working hand in hand with families, we design therapy plans that fit into real, everyday life. Progress is never one-size-fits-all, and neither is our care."
            </p>
            <p className="body-lg text-navy mb-6 font-semibold">
              Together with our team, she champions compassionate, evidence-based care so that every family feels supported long after the session ends.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
