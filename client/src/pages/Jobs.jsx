import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  Clock,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import InlineCTA from '../components/InlineCTA';
import JobApplicationModal from '../components/JobApplicationModal';
import { usePageSeo } from '../hooks/usePageSeo';
import { initScrollReveals } from '../lib/motion';
import { INTERNSHIP, JOB_OPENINGS } from '../data/programsData';
import './Programs.css';

/* Cloud wave used between the alternating pastel bands (same SVG as the
 * rest of the site; fill comes from the modifier class). */
const Wave = ({ pos, fill }) => (
  <div className={`cloud-divider cloud-${pos} ${fill}`}>
    <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
      <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
    </svg>
  </div>
);

/* Careers page (/jobs): open roles + the THERAKids Internship Program, with
 * applications landing in the admin panel via POST /api/job-applications.
 * The openings band ("We're Hiring") and the internship block were moved here
 * from the THERAKids Academy page; the internship stays on both pages. */
const Jobs = () => {
  const pageRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [presetPosition, setPresetPosition] = useState('');

  usePageSeo('/jobs', {
    title: 'Careers at THERAKids | Job Openings in Noida',
    description:
      'Open roles at THERAKids Noida — occupational therapy, speech therapy, special education, ABA and coordinator positions, plus the THERAKids Internship Program.',
    keywords:
      'therakids jobs, therapy jobs noida, occupational therapist job noida, special educator jobs noida, speech therapist vacancy noida, therapist internship noida',
  });

  useEffect(() => {
    const cleanup = initScrollReveals(pageRef.current);
    return cleanup;
  }, []);

  const openApplication = (position = '') => {
    setPresetPosition(position);
    setModalOpen(true);
  };

  const closeJobModal = () => setModalOpen(false);

  return (
    <div className="programs-page jobs-page" ref={pageRef}>
      <PageHero
        bg="bg-pastel-lilac"
        eyebrow="Careers at THERAKids"
        title="Work where it "
        accent="matters."
        subtitle="Open roles at Noida's multidisciplinary child development centre — plus an internship program for aspiring therapists."
        image="/images/gallery/therakids/happy-moments-11.jpg"
        imageAlt="Team THERAKids celebrating together - pediatric therapists and special educators in Noida"
        blob={5}
        scriptNote="grow with us!"
        imagePosition="50% 40%"
        notePosition="bottom-right"
      >
        <div className="programs-hero-actions">
          <a className="prog-btn prog-btn-solid" href="#openings">
            View Open Roles <ArrowRight size={16} />
          </a>
          <a className="prog-btn prog-btn-outline" href="#internship">
            Internship Program
          </a>
        </div>
      </PageHero>

      {/* --------------------------- Openings --------------------------- */}
      <section className="programs-section programs-careers" id="openings">
        <div className="container">
          <div className="careers-panel">
            <div className="section-header center mb-12" data-reveal>
              <p className="label-md uppercase tracking-widest mb-2 careers-eyebrow">
                <Briefcase size={14} /> We&rsquo;re Hiring
              </p>
              <h2 className="headline-lg careers-title">Build a Career That Builds Childhoods</h2>
              <p className="body-lg careers-sub">
                Join a multidisciplinary team where therapy, education and genuine care share one roof.
              </p>
            </div>
            <div className="jobs-grid" data-reveal-group>
              {JOB_OPENINGS.map((j) => (
                <article key={j.id} className="job-card">
                  <div className="job-card-head">
                    <h3>{j.title}</h3>
                    <span className="job-type">{j.type}</span>
                  </div>
                  <div className="job-meta">
                    <span>
                      <MapPin size={13} /> {j.location}
                    </span>
                    <span>
                      <Clock size={13} /> {j.experience}
                    </span>
                    <span>
                      <BookOpen size={13} /> {j.department}
                    </span>
                  </div>
                  <p className="job-desc">{j.description}</p>
                  <ul className="job-reqs">
                    {j.requirements.map((r) => (
                      <li key={r}>
                        <Check size={11} strokeWidth={3.5} /> {r}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="prog-btn prog-btn-ghost job-apply"
                    onClick={() => openApplication(j.title)}
                  >
                    Apply Now <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </div>
            <div className="careers-fallback" data-reveal>
              <p>Don&rsquo;t see your role? We&rsquo;re always glad to meet good people.</p>
              <button type="button" className="prog-btn prog-btn-outline-light" onClick={() => openApplication('Other')}>
                Submit a General Application
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — sits after the first section so it never lands next to the
          footer's own CTA (client brief) */}
      <div className="container pb-12 pt-8 z-10 relative">
        <InlineCTA />
      </div>

      {/* -------------------------- Internship --------------------------- */}
      <section className="programs-section programs-internship bg-pastel-lilac" id="internship">
        <Wave pos="top" fill="fill-white" />
        <div className="container">
          <div className="internship-layout">
            <aside className="internship-benefits card-panel panel-tint" data-reveal>
              <h3>What interns gain</h3>
              <ul>
                {INTERNSHIP.benefits.map((b) => (
                  <li key={b}>
                    <span className="check-dot">
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </aside>
            <div className="internship-content" data-reveal>
              <p className="label-md text-navy uppercase tracking-widest mb-2">Learn With Us</p>
              <h2 className="headline-lg text-navy">{INTERNSHIP.title}</h2>
              <p className="body-lg text-navy-light">{INTERNSHIP.intro}</p>
              <div className="domain-chips">
                {INTERNSHIP.domains.map((d) => (
                  <span key={d} className="domain-chip">
                    {d}
                  </span>
                ))}
              </div>
              <p className="internship-meta">
                <Clock size={15} /> Duration: {INTERNSHIP.duration}
              </p>
              <button type="button" className="prog-btn prog-btn-solid" onClick={() => openApplication('Internship')}>
                Submit Your Resume <Send size={15} />
              </button>
            </div>
          </div>
          <div className="internship-banner" data-reveal>
            <span className="banner-spark" aria-hidden="true">
              <Sparkles size={16} />
            </span>
            <span>
              Apply for intern roles in any domain — <em>early bird access to academic programs available!</em>
            </span>
          </div>
        </div>
        <Wave pos="bottom" fill="fill-white" />
      </section>

      {/* --------------------- Application modal ------------------------- */}
      {/* Keyed on open+position so each application starts a fresh form. */}
      <JobApplicationModal
        key={modalOpen ? `open-${presetPosition}` : 'closed'}
        open={modalOpen}
        position={presetPosition}
        onClose={closeJobModal}
      />
    </div>
  );
};

export default Jobs;
