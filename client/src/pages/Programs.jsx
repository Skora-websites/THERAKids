import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  GraduationCap,
  Send,
  Sparkles,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import InlineCTA from '../components/InlineCTA';
import JobApplicationModal from '../components/JobApplicationModal';
import { usePageSeo } from '../hooks/usePageSeo';
import { initScrollReveals } from '../lib/motion';
import API_URL from '../config';
import { CERTIFICATION, INTERNSHIP } from '../data/programsData';
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

/* THERAKids Academy page: the flagship certification + the internship
 * program, with applications landing in the admin panel via
 * POST /api/job-applications. Careers live on /jobs; the old resource-hub
 * sections (YouTube, expert insights, workshops) were dropped per brief. */
const Programs = () => {
  const pageRef = useRef(null);
  const [openModule, setOpenModule] = useState(0);
  // Application modal (the form itself lives in the shared JobApplicationModal)
  const [modalOpen, setModalOpen] = useState(false);
  const [presetPosition, setPresetPosition] = useState('');
  // Admin-managed benefits for the certification, with the static list as
  // fallback while loading / if the API is unreachable. The module list is
  // NOT fetched: the certification is offline and the page publishes only
  // the official syllabus (see CERTIFICATION.modules).
  const [academics, setAcademics] = useState(null);

  usePageSeo('/programs', {
    title: 'THERAKids Academy | Certification & Internships in Noida',
    description:
      'THERAKids Academy — the offline certification in child therapy (official syllabus) and hands-on internships from the THERAKids clinical team, for aspiring therapists, parents and educators in Noida.',
    keywords:
      'therakids academy, child therapy certification noida, therapy internship noida, child therapy course india, special education courses india',
  });

  useEffect(() => {
    const cleanup = initScrollReveals(pageRef.current);
    return cleanup;
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/programs/academics`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad status'))))
      .then((d) => {
        if (!cancelled && d && Array.isArray(d.benefits)) setAcademics(d);
      })
      .catch(() => {
        // keep static fallback; page still renders
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Official syllabus only — straight from the course document, five modules.
  const modules = CERTIFICATION.modules;
  const benefits = academics?.benefits?.length ? academics.benefits : CERTIFICATION.benefits;

  const openApplication = (position = '') => {
    setPresetPosition(position);
    setModalOpen(true);
  };

  const closeJobModal = () => setModalOpen(false);

  return (
    <div className="programs-page" ref={pageRef}>
      <PageHero
        bg="bg-pastel-peach"
        eyebrow="THERAKids Academy"
        title="Learn. Grow. "
        accent="Inspire."
        subtitle="An offline certification, internships and hands-on training from the THERAKids clinical team — for aspiring therapists, parents and educators."
        image="/images/services/parent-training.jpg"
        imageAlt="TheraKids therapist leading a parent training workshop in Noida - certification courses and internships"
        blob={2}
        scriptNote="learn. grow. inspire!"
        imagePosition="50% 30%"
      >
        <div className="programs-hero-actions">
          <a className="prog-btn prog-btn-solid" href="#certification">
            Explore the Certification <ArrowRight size={16} />
          </a>
          <Link className="prog-btn prog-btn-outline" to="/jobs">
            View Open Roles
          </Link>
        </div>
      </PageHero>

      {/* ------------------------- Certification ------------------------- */}
      <section className="programs-section programs-cert" id="certification">
        <div className="container">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Flagship Program</p>
            <h2 className="headline-lg text-navy">{CERTIFICATION.name}</h2>
            <p className="body-lg text-navy-light cert-intro">{CERTIFICATION.intro}</p>
            <div className="cert-meta">
              <span className="meta-pill">
                <Clock size={15} /> {CERTIFICATION.duration}
              </span>
              <span className="meta-pill">
                <CalendarDays size={15} /> {CERTIFICATION.format}
              </span>
            </div>
          </div>

          <div className="cert-layout">
            <div className="curriculum" data-reveal>
              <p className="curriculum-label">
                <GraduationCap size={17} /> Curriculum — five modules, one strong foundation
              </p>
              {modules.map((m, i) => (
                <div className={`module-card ${openModule === i ? 'open' : ''}`} key={m.id ?? m.title}>
                  <button
                    type="button"
                    className="module-head"
                    aria-expanded={openModule === i}
                    onClick={() => setOpenModule(openModule === i ? -1 : i)}
                  >
                    <span className="module-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="module-titles">
                      <span className="module-name">{m.title}</span>
                      <span className="module-sub">
                        <Clock size={12} /> {m.duration} · {m.topics.length} topics
                      </span>
                    </span>
                    <ChevronDown size={18} className="module-chevron" />
                  </button>
                  <div className="module-body">
                    <div className="module-topics">
                      {m.topics.map((t) => (
                        <span key={t} className="topic-chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="benefits-panel" data-reveal>
              <h3>Why this certification</h3>
              <ul>
                {benefits.map((b) => (
                  <li key={b}>
                    <span className="check-dot">
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="prog-btn prog-btn-solid benefits-apply"
                onClick={() => openApplication('Certification Program')}
              >
                Apply for the Certification <ArrowRight size={15} />
              </button>
              <p className="benefits-note">Applications are reviewed on a rolling basis.</p>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA — sits after the first section so it never lands next to the
          footer's own CTA (client brief) */}
      <div className="container pb-12 pt-8 z-10 relative">
        <InlineCTA />
      </div>

      {/* -------------------------- Internship --------------------------- */}
      <section className="programs-section programs-internship bg-pastel-lilac">
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

export default Programs;
