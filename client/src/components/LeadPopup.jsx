import React, { useEffect, useRef, useState } from 'react';
import { HeartDoodle, Sparkle } from './doodles/Doodles';
import { CONTACT_FALLBACKS } from '../lib/contact';
import './LeadPopup.css';

/* Home-page lead-generation popup (free screening / assessment funnel).
 *
 * Funnel: Website → Popup → Free Screening/Assessment Form or Online Therapy
 * Form (both in-site popups) → Screening → Paid Full Assessment → Therapy.
 *
 * Behaviour (per client brief):
 *  - shows ~7 seconds after the Home page opens;
 *  - appears on EVERY open/reload of the home page - deliberately not
 *    suppressed by localStorage, so it is never permanently hidden;
 *  - two buttons opening the two popup forms (handled by the parent, Home).
 *
 * `onFreeAssessment` / `onOnlineTherapy` are supplied by the parent so the
 * forms themselves can live at the layout level (shared across pages).
 */

const LeadPopup = ({ open, onClose, onFreeAssessment, onOnlineTherapy }) => {
  const [visible, setVisible] = useState(false); // drives the entrance animation
  const closeBtnRef = useRef(null);

  // Pop in right after the timer fires; focus lands on the close button so
  // keyboard users can dismiss immediately.
  useEffect(() => {
    if (!open) return undefined;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (open && visible) closeBtnRef.current?.focus();
  }, [open, visible]);

  // Esc closes while the popup is open
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`lead-popup-backdrop ${visible ? 'is-visible' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
    >
      <div className="lead-popup" onClick={(e) => e.stopPropagation()}>
        <div className="lead-popup-panel">
          <span className="lead-popup-gloss" aria-hidden="true" />

          <button
            type="button"
            className="lead-popup-close"
            onClick={onClose}
            aria-label="Close popup"
            ref={closeBtnRef}
          >
            &times;
          </button>

          <Sparkle className="lead-popup-doodle lead-popup-sparkle" />
          <HeartDoodle className="lead-popup-doodle lead-popup-heart" />

          <p className="lead-popup-eyebrow">Free Screening</p>
          <h2 className="lead-popup-title" id="lead-popup-title">
            Is your child<br />
            <em className="lead-popup-title-accent">on track?</em>
          </h2>
          <p className="body-md lead-popup-text">
            Begin with a <strong>free initial screening</strong> at TheraKids.
            Our experts will guide you on the next steps —
            no commitment needed.
          </p>

          <div className="lead-popup-actions">
            <button
              type="button"
              className="lead-popup-btn lead-popup-btn-primary"
              onClick={onFreeAssessment}
            >
              Free Assessment <span className="lead-popup-btn-arrow" aria-hidden="true">&rarr;</span>
            </button>
            <button
              type="button"
              className="lead-popup-btn lead-popup-btn-secondary"
              onClick={onOnlineTherapy}
            >
              Online Therapy <span className="lead-popup-btn-arrow" aria-hidden="true">&rarr;</span>
            </button>
          </div>

          <p className="label-sm lead-popup-note">
            Prefer to talk first? Call us on{' '}
            <a href={`tel:${CONTACT_FALLBACKS.phone.split('/')[0].replace(/[^\d+]/g, '')}`}>
              {CONTACT_FALLBACKS.phone.split('/')[0].trim()}
            </a>{' '}
            or see our <a href="/legal#privacy-policy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadPopup;
