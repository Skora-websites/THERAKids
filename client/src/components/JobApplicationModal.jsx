import React, { useEffect, useState } from 'react';
import { Briefcase, Check, Send, UploadCloud, X } from 'lucide-react';
import API_URL from '../config';
import { JOB_FORM_POSITIONS } from '../data/programsData';
// Modal + form styles live with the Programs stylesheet (class-scoped).
import '../pages/Programs.css';

/* Shared job/application modal used by the THERAKids Academy page
   (certification + internship applications) and the Jobs page (openings).
   POSTs multipart FormData to /api/job-applications — the server stores the
   row and (optionally) the uploaded resume in the admin panel. */
const EMPTY_FORM = { name: '', email: '', phone: '', position: '', experience: '', coverNote: '' };
const RESUME_MAX_MB = 5;
const RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const RESUME_EXTS = ['.pdf', '.doc', '.docx'];

const JobApplicationModal = ({ open, position = '', onClose }) => {
  // Keyed remount (see callers): every open mounts a fresh form, so the
  // initial state can bake in the preset position without a reset effect.
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, position }));
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

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

  if (!open) return null;

  return (
    <div
      className="job-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="job-modal" role="dialog" aria-modal="true" aria-labelledby="job-modal-title">
        <button type="button" className="job-modal-close" onClick={onClose} aria-label="Close">
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
            <button type="button" className="prog-btn prog-btn-solid" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="job-modal-eyebrow">
              <Briefcase size={13} /> Careers at THERAKids
            </p>
            <h3 id="job-modal-title">Apply for {position || 'a Role'}</h3>
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
  );
};

export default JobApplicationModal;
