import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  FileText,
  GraduationCap,
  Heart,
  MapPin,
  Megaphone,
  Mic,
  Play,
  Radio,
  Send,
  Sparkles,
  Users,
  UploadCloud,
  X,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import InlineCTA from '../components/InlineCTA';
import MediaViewer from '../components/MediaViewer';
import { usePageSeo } from '../hooks/usePageSeo';
import { initScrollReveals } from '../lib/motion';
import API_URL from '../config';
import { SOCIAL_URLS } from '../components/Footer';
import {
  CERTIFICATION,
  INTERNSHIP,
  WORKSHOPS,
  VIDEO_GROUPS,
  EXPERT_ARTICLES,
  CASE_STORIES,
  JOB_OPENINGS,
  JOB_FORM_POSITIONS,
} from '../data/programsData';
import './Programs.css';

const GROUP_ICONS = { radio: Radio, play: Play, megaphone: Megaphone, mic: Mic };
const GROUP_ICON_CYCLE = ['radio', 'play', 'megaphone', 'mic'];

const TYPE_LABELS = {
  video: 'Video',
  document: 'Document',
  link: 'Link',
  worksheet: 'Worksheet',
};

const EMPTY_FORM = { name: '', email: '', phone: '', position: '', experience: '', coverNote: '' };
const RESUME_MAX_MB = 5;
const RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const RESUME_EXTS = ['.pdf', '.doc', '.docx'];

/* Cloud wave used between the alternating pastel bands (same SVG as the
 * rest of the site; fill comes from the modifier class). */
const Wave = ({ pos, fill }) => (
  <div className={`cloud-divider cloud-${pos} ${fill}`}>
    <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
      <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
    </svg>
  </div>
);

/* Static Programs page (dummy data): integrated Academic & Learning
 * Initiatives + Resource Hub, with a careers band whose applications
 * land in the admin panel via POST /api/job-applications. */
const Programs = () => {
  const pageRef = useRef(null);
  const [openModule, setOpenModule] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [presetPosition, setPresetPosition] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  // Dynamic academics content (modules, benefits, video groups) with the
  // static data as fallback while loading / if the API is unreachable.
  const [academics, setAcademics] = useState(null);
  // In-page viewer state: { title, url, description, resourceType }
  const [viewerItem, setViewerItem] = useState(null);

  usePageSeo('/programs', {
    title: 'THERAKids Academy | Certification, Internships & Workshops in Noida',
    description:
      'THERAKids Academy — certification in child therapy, internships, hands-on workshops and a rich resource hub for aspiring therapists, parents and educators in Noida.',
    keywords:
      'therakids academy, child therapy certification noida, therapy internship noida, aba workshop, sensory integration workshop, special education courses india',
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
        if (!cancelled && d && Array.isArray(d.modules)) setAcademics(d);
      })
      .catch(() => {
        // keep static fallback; page still renders
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const modules = academics?.modules?.length
    ? academics.modules
    : CERTIFICATION.modules.map((m, i) => ({
        id: i + 1,
        title: m.title,
        duration: m.duration,
        topics: m.topics,
        resources: m.resources.map((r) => ({ id: `${i}-${r.title}`, title: r.title, url: null, resource_type: 'link' })),
      }));
  const benefits = academics?.benefits?.length ? academics.benefits : CERTIFICATION.benefits;
  const videoGroups = academics?.videoGroups?.length
    ? academics.videoGroups
    : VIDEO_GROUPS.map((g) => ({
        group: g.group,
        videos: g.videos.map((v, i) => ({ id: `${g.group}-${i}`, title: v.title, url: SOCIAL_URLS.youtube, length: v.length, views: v.views })),
      }));

  const openViewer = (item) => setViewerItem(item);
  const closeViewer = () => setViewerItem(null);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const openApplication = (position = '') => {
    setPresetPosition(position);
    setForm({ ...EMPTY_FORM, position });
    setResumeFile(null);
    setResumeError('');
    setSent(false);
    setFormError('');
    setModalOpen(true);
  };

  const closeJobModal = () => setModalOpen(false);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Resume guardrails: MIME + extension whitelist, 5 MB cap. Mirrors the
  // server checks so users get instant feedback (server stays authoritative).
  const validateResume = (file) => {
    if (!file) return '';
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!RESUME_TYPES.includes(file.type) || !RESUME_EXTS.includes(ext)) {
      return 'Resume must be a PDF, DOC or DOCX file.';
    }
    if (file.size > RESUME_MAX_MB * 1024 * 1024) {
      return `Resume is too large — the maximum file size is ${RESUME_MAX_MB} MB.`;
    }
    return '';
  };

  const onResumeChange = (e) => {
    const file = e.target.files && e.target.files[0];
    const problem = validateResume(file);
    setResumeError(problem);
    setResumeFile(problem ? null : file || null);
    if (problem) e.target.value = ''; // let them re-pick the same broken file
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (resumeFile) {
      const problem = validateResume(resumeFile);
      if (problem) {
        setResumeError(problem);
        return;
      }
    }
    setSubmitting(true);
    setFormError('');
    try {
      // Always multipart: the endpoint accepts JSON-less FormData, and an
      // optional resume rides along in the same request.
      const body = new FormData();
      body.append('name', form.name);
      body.append('email', form.email);
      body.append('phone', form.phone);
      body.append('position', form.position);
      body.append('experience', form.experience || '');
      body.append('cover_note', form.coverNote || '');
      if (resumeFile) body.append('resume', resumeFile);

      const res = await fetch(`${API_URL}/api/job-applications`, { method: 'POST', body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setSent(true);
    } catch (err) {
      setFormError(err.message || 'Could not submit your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="programs-page" ref={pageRef}>
      <PageHero
        bg="bg-pastel-peach"
        eyebrow="THERAKids Academy"
        title="Learn. Grow. "
        accent="Inspire."
        subtitle="Certification, internships and hands-on training from the THERAKids clinical team — for aspiring therapists, parents and educators."
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
          <a className="prog-btn prog-btn-outline" href="#careers">
            View Open Roles
          </a>
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
                        <Clock size={12} /> {m.duration} · {m.topics.length} topics · {m.resources.length} resources
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
                    <p className="module-res-label">
                      <FileText size={13} /> Module resources
                    </p>
                    <ul className="module-resources">
                      {m.resources.map((r) => {
                        const usable = Boolean(r.url);
                        const label = TYPE_LABELS[r.resource_type] || (usable ? 'Open' : 'Coming soon');
                        return (
                          <li key={r.id ?? r.title}>
                            {usable ? (
                              <button
                                type="button"
                                className="res-row res-row-link"
                                title={`Open "${r.title}" in-page`}
                                onClick={() =>
                                  openViewer({
                                    title: r.title,
                                    url: r.url,
                                    description: r.description,
                                    resourceType: r.resource_type,
                                  })
                                }
                              >
                                <span className="res-title">{r.title}</span>
                                <span className="res-type">{label}</span>
                              </button>
                            ) : (
                              <span className="res-row">
                                <span className="res-title">{r.title}</span>
                                <span className="res-type">{label}</span>
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
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

      {/* --------------------------- Workshops --------------------------- */}
      <section className="programs-section programs-workshops">
        <div className="container">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Workshops &amp; Training</p>
            <h2 className="headline-lg text-navy">Short Courses, Serious Skills</h2>
            <p className="body-lg text-navy-light">
              Hands-on workshops for parents, teachers and working therapists — led by the THERAKids clinical team.
            </p>
          </div>
          <div className="workshops-grid" data-reveal-group>
            {WORKSHOPS.map((w) => (
              <article key={w.title} className="workshop-card">
                <div className="workshop-pills">
                  <span className="meta-pill small">
                    <Clock size={12} /> {w.duration}
                  </span>
                  <span className="meta-pill small">
                    <Users size={12} /> {w.audience}
                  </span>
                </div>
                <h3>{w.title}</h3>
                <p>{w.description}</p>
              </article>
            ))}
          </div>
          <p className="workshops-note" data-reveal>
            New batches are announced to our newsletter subscribers first.
          </p>
        </div>
      </section>

      {/* ------------------------ YouTube (Peach) ------------------------ */}
      <section className="programs-section programs-youtube bg-pastel-peach">
        <Wave pos="top" fill="fill-white" />
        <div className="container">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Watch &amp; Learn</p>
            <h2 className="headline-lg text-navy">THERAKids on YouTube</h2>
            <p className="body-lg text-navy-light yt-section-sub">
              Live sessions, therapy demonstrations and expert talks — tap any video to play it right here.
            </p>
          </div>
          <div className="youtube-grid" data-reveal-group>
            {videoGroups.map((g, idx) => {
              const GroupIcon = GROUP_ICONS[g.icon || GROUP_ICON_CYCLE[idx % GROUP_ICON_CYCLE.length]] || Play;
              return (
                <div className="yt-group card-panel" key={g.group}>
                  <p className="yt-group-name">
                    <span className="yt-group-icon">
                      <GroupIcon size={14} />
                    </span>
                    {g.group}
                  </p>
                  <ul>
                    {g.videos.map((v) => (
                      <li key={v.id ?? v.title}>
                        <button
                          type="button"
                          className="yt-row"
                          title={v.url ? `Play "${v.title}" in-page` : 'Video link coming soon'}
                          onClick={() =>
                            v.url &&
                            openViewer({ title: v.title, url: v.url, description: v.description, resourceType: 'video' })
                          }
                        >
                          <span className="yt-play">
                            <Play size={11} />
                          </span>
                          <span className="yt-title">{v.title}</span>
                          <span className="yt-meta">{[v.length, v.views].filter(Boolean).join(' · ')}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="hub-cta-row" data-reveal>
            <a className="prog-btn prog-btn-solid" href={SOCIAL_URLS.youtube} target="_blank" rel="noopener noreferrer">
              Visit Our Channel <ArrowUpRight size={15} />
            </a>
            <span className="hub-cta-note">Subscribe for new sessions, demos and parent Q&amp;As.</span>
          </div>
        </div>
        <Wave pos="bottom" fill="fill-white" />
      </section>

      {/* --------------------------- Stories ----------------------------- */}
      <section className="programs-section programs-stories">
        <div className="container">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">Real Stories</p>
            <h2 className="headline-lg text-navy">Video Testimonials &amp; Case Study Highlights</h2>
            <p className="body-lg text-navy-light">
              Every graduate of our programs is a child who moved forward — meet a few of them.
            </p>
          </div>
          <div className="stories-grid" data-reveal-group>
            {CASE_STORIES.map((s) => (
              <article key={s.title} className="story-card card-panel">
                <div className="story-top">
                  <span className={`story-type ${s.type === 'Video Testimonial' ? 'is-video' : 'is-story'}`}>
                    {s.type === 'Video Testimonial' ? <Play size={11} /> : <BookOpen size={11} />}
                    {s.type}
                  </span>
                  <span className="story-len">{s.duration}</span>
                </div>
                <h3>{s.title}</h3>
                <p className="story-family">
                  {s.family} · {s.condition}
                </p>
                <p className="story-outcome">
                  <Heart size={13} /> {s.outcome}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- Insights (Lilac) -------------------------- */}
      <section className="programs-section programs-insights bg-pastel-lilac">
        <Wave pos="top" fill="fill-white" />
        <div className="container">
          <div className="section-header center mb-12" data-reveal>
            <p className="label-md text-navy uppercase tracking-widest mb-2">From The Team</p>
            <h2 className="headline-lg text-navy">Insights from Our Experts</h2>
            <p className="body-lg text-navy-light">
              Practical, experience-tested guidance from the therapists who work with children every day.
            </p>
          </div>
          <div className="articles-grid" data-reveal-group>
            {EXPERT_ARTICLES.map((a) => (
              <article key={a.title} className="article-card card-panel">
                <span className="article-tag">{a.tag}</span>
                <h4>{a.title}</h4>
                <p className="article-excerpt">{a.excerpt}</p>
                <p className="article-byline">
                  {a.author} · {a.date} · {a.readTime}
                </p>
                <Link className="article-cta" to="/blogs">
                  Read on our blog <ArrowRight size={13} />
                </Link>
              </article>
            ))}
          </div>
          <div className="hub-cta-row" data-reveal>
            <Link className="prog-btn prog-btn-solid" to="/blogs">
              Explore All Articles <ArrowRight size={15} />
            </Link>
            <span className="hub-cta-note">Fresh posts from our clinical team, every month.</span>
          </div>
        </div>
        <Wave pos="bottom" fill="fill-white" />
      </section>

      {/* ------------------------ Careers band --------------------------- */}
      <section className="programs-section programs-careers" id="careers">
        <Wave pos="top" fill="fill-white" />
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
        <Wave pos="bottom" fill="fill-white" />
      </section>

      {/* CTA — standalone band on the page surface, same pattern as other pages */}
      <div className="container pb-12 pt-8 z-10 relative">
        <InlineCTA />
      </div>

      {/* --------------------- Media viewer (in-page) -------------------- */}
      <MediaViewer open={!!viewerItem} item={viewerItem} onClose={closeViewer} />

      {/* --------------------- Application modal ------------------------- */}
      {modalOpen && (
        <div
          className="job-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeJobModal();
          }}
        >
          <div className="job-modal" role="dialog" aria-modal="true" aria-labelledby="job-modal-title">
            <button type="button" className="job-modal-close" onClick={closeJobModal} aria-label="Close">
              <X size={18} />
            </button>
            {sent ? (
              <div className="job-modal-success">
                <span className="success-check">
                  <Check size={26} strokeWidth={3.5} />
                </span>
                <h3>Application received!</h3>
                <p>
                  Thank you for applying{form.position ? ` for ${form.position}` : ''}. Our team reviews every
                  application and will reach out to shortlisted candidates within a week.
                </p>
                <button type="button" className="prog-btn prog-btn-solid" onClick={closeJobModal}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="job-modal-eyebrow">
                  <Briefcase size={13} /> Careers at THERAKids
                </p>
                <h3 id="job-modal-title">Apply for {presetPosition || 'a Role'}</h3>
                <p className="job-modal-sub">Fill in your details — shortlisted candidates are contacted within a week.</p>
                <form className="job-form" onSubmit={submitApplication}>
                  <div className="job-form-row">
                    <label>
                      Full Name *
                      <input required value={form.name} onChange={setField('name')} placeholder="Your full name" />
                    </label>
                    <label>
                      Email *
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={setField('email')}
                        placeholder="you@example.com"
                      />
                    </label>
                  </div>
                  <div className="job-form-row">
                    <label>
                      Phone *
                      <input required value={form.phone} onChange={setField('phone')} placeholder="+91 98XXX XXXXX" />
                    </label>
                    <label>
                      Applying For *
                      <select required value={form.position} onChange={setField('position')}>
                        <option value="" disabled>
                          Select a position
                        </option>
                        {JOB_FORM_POSITIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    Experience
                    <input
                      value={form.experience}
                      onChange={setField('experience')}
                      placeholder="e.g. 3 years pediatric practice"
                    />
                  </label>
                  <label>
                    Cover Note
                    <textarea
                      rows={3}
                      value={form.coverNote}
                      onChange={setField('coverNote')}
                      placeholder="Tell us briefly why you'd be a great fit…"
                    />
                  </label>
                  <div className="job-form-field">
                    <span className="job-form-label">Resume (optional)</span>
                    <label className="job-resume-drop" htmlFor="job-resume-input">
                      <UploadCloud size={20} aria-hidden="true" />
                      <span className="job-resume-text">
                        {resumeFile ? resumeFile.name : 'Attach your resume — PDF or Word, max 5 MB'}
                      </span>
                      <span className="job-resume-btn">Browse</span>
                    </label>
                    <input
                      id="job-resume-input"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={onResumeChange}
                      hidden
                    />
                    {resumeError && <p className="job-form-error">{resumeError}</p>}
                  </div>
                  {formError && <p className="job-form-error">{formError}</p>}
                  <button type="submit" className="prog-btn prog-btn-solid job-submit" disabled={submitting}>
                    {submitting ? (
                      'Submitting…'
                    ) : (
                      <>
                        Submit Application <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
