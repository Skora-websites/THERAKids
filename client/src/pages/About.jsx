import React, { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import { Sparkle, LeafDoodle, SunDoodle, UnderlineFlourish } from '../components/doodles/Doodles';
import { initScrollReveals, createFloatLoop } from '../lib/motion';
import { usePageSeo } from '../hooks/usePageSeo';
import './About.css';

const About = () => {
  usePageSeo('/about');
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
        subtitle="THERAKids Foundation is a multidisciplinary team dedicated to helping children aged 0-18 reach their fullest potential through early intervention, structured therapy, and true family partnership."
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
              <img src="/images/about-philosophy.jpg" alt="Child learning at a therapy table" className="philosophy-image" />
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

      {/* Meet the Founder, white top wave blends it out of the philosophy section;
          extra bottom padding keeps content clear of the 150px bottom wave */}
      <section className="founder-section bg-pastel-peach relative overflow-hidden" ref={founderRef}>
        <LeafDoodle className="founder-doodle founder-doodle-leaf" data-float />
        <SunDoodle className="founder-doodle founder-doodle-sun" data-float />
        <div className="container founder-flex-container relative z-10">
          <div className="founder-content" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Our Founder</p>
            <h2 className="headline-xl text-navy mb-2">Sandeep Rana</h2>
            <p className="body-lg text-navy font-semibold mb-6">Founder &amp; Chairman, THERAKids Foundation</p>
            <p className="body-lg text-navy-light mb-4">
              With over 20 years of experience in healthcare management and child development, Sandeep Rana brings visionary leadership, strategic insight, and a deep sense of purpose to THERAKids Foundation.
            </p>
            <p className="body-lg text-navy-light mb-4">
              For Sandeep, THERAKids is more than a child development centre&mdash;it is a vision built on compassion, purpose, and the belief that every child deserves the opportunity to thrive.
            </p>
            <p className="body-lg text-navy-light mb-4">
              What began in 2019 from a small space with a powerful dream has grown into two state-of-the-art child development centres in Noida and Greater Noida West, supported by a dedicated team of 40+ professionals across multiple disciplines of pediatric care.
            </p>
            <p className="body-lg text-navy-light mb-4">
              Under his leadership, THERAKids has evolved into a trusted name in child development, with a strong commitment to accessible, ethical, and quality therapeutic care. His vision is to create an environment where children receive the right support, families feel empowered, and professionals are encouraged to grow and make a meaningful difference.
            </p>
            <p className="body-lg text-navy-light mb-4">
              Beyond leading the organization, Sandeep is passionate about mentoring therapists and educators and contributing to the growth of pediatric care. He believes that true leadership is not only about building an organization, but about building people, creating impact, and transforming lives.
            </p>
            <p className="body-lg text-navy mb-6 font-semibold">
              At the heart of his journey are three guiding principles: Compassion. Purpose. Karma.
            </p>
          </div>
          <div className="founder-visual" data-reveal>
            <div className="founder-image-wrapper">
              <img src="/images/sandeep_rana.jpg" alt="Sandeep Rana - Founder & Chairman" />
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

      {/* Meet the Co-Founder, mirrors the founder band with the image on the left.
          White background: it sits between the founder band's white-fading cloud and the
          global CTA's white top cloud, so any color here would read as a stray stripe. */}
      <section className="founder-section co-founder-section bg-white relative overflow-hidden">
        <div className="container founder-flex-container relative z-10">
          <div className="founder-visual" data-reveal>
            <div className="founder-image-wrapper">
              <img src="/images/akanksha_rana.jpg" alt="Dr. Akanksha Rana - Co-Founder" />
            </div>
          </div>
          <div className="founder-content" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Our Co-Founder</p>
            <h2 className="headline-xl text-navy mb-2">Dr. Akanksha Rana</h2>
            <p className="body-lg text-navy font-semibold mb-2">Co-Founder &amp; Consultant, THERAKids Foundation</p>
            <p className="body-lg text-navy-light mb-6">Senior Pediatric Occupational Therapist</p>
            <p className="body-lg text-navy-light mb-4">
              With over 16 years of experience in pediatric occupational therapy and child development, Dr. Akanksha Rana is a distinguished clinician and a driving force behind the clinical vision of THERAKids Foundation.
            </p>
            <p className="body-lg text-navy-light mb-4">
              As Co-founder and Consultant, she plays a pivotal role in shaping THERAKids&rsquo; clinical standards, therapeutic philosophy, and commitment to child-centred care. Her expertise spans sensory integration, developmental delays, autism spectrum disorders, and pediatric rehabilitation, combining evidence-based practice with compassionate, individualized care.
            </p>
            <p className="body-lg text-navy-light mb-4">
              Over the years, her clinical expertise and unwavering commitment have helped thousands of children progress toward their developmental potential while empowering families with greater understanding, confidence, and hope.
            </p>
            <p className="body-lg text-navy-light mb-4">
              At THERAKids, Dr. Akanksha provides clinical leadership to a multidisciplinary team, fostering a culture of clinical excellence, innovation, continuous learning, and compassionate care.
            </p>
            <p className="body-lg text-navy-light mb-4">
              Her vision is to ensure that every child is understood beyond a diagnosis, supported according to their unique needs, and given every opportunity to reach their fullest potential.
            </p>
            <p className="body-lg text-navy mb-6 font-semibold">
              For Dr. Akanksha, therapy is not simply about achieving milestones&mdash;it is about unlocking potential, building confidence, and creating meaningful possibilities for every child.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
