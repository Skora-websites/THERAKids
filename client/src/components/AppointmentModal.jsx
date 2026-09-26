import React, { useEffect, useState } from 'react';
import API_URL from '../config';
import './AppointmentModal.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919899338813';

// Seconds the success screen stays open before auto-dismissing
const AUTO_CLOSE_SECONDS = 15;
// Circumference of the countdown ring (r = 15.5 in the SVG below)
const RING_CIRCUMFERENCE = 97.4;

const AppointmentModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    parent_name: '',
    child_name: '',
    child_age: '',
    phone: '',
    email: '',
    service_id: '',
    preferred_date: '',
    preferred_time: '',
    additional_info: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Confirmation step shown after the WhatsApp handoff
  const [submitted, setSubmitted] = useState(false);
  const [confirmedService, setConfirmedService] = useState('');
  const [savedToDb, setSavedToDb] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // Auto-dismiss: counts down once the success screen is shown; clicking the ring cancels it
  const [autoClose, setAutoClose] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(null);

  // Services come from the DB; the modal shows real names and sends a real service_id (or null).
  const [services, setServices] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services`);
        if (response.ok) setServices(await response.json());
      } catch {
        // API unreachable - the select just shows the static fallback options below
      }
    };
    load();
  }, []);

  // Countdown effect - a self-chaining 1s timeout so each tick re-renders the ring.
  // Fires onClose when the timer reaches zero.
  useEffect(() => {
    if (!submitted || !autoClose || secondsLeft === null) return undefined;
    if (secondsLeft <= 0) {
      onClose();
      return undefined;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(timer);
  }, [submitted, autoClose, secondsLeft, onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Resolve the selected option back to a services.id (FK constraint on appointments.service_id)
      const selected = services.find((s) => String(s.id) === String(formData.service_id));

      // API call to store in DB - service_id is a nullable FK, so send null when not chosen
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, service_id: selected ? selected.id : null })
      });

      setSavedToDb(response.ok);
      if (!response.ok) {
        // Log but don't block: WhatsApp handoff is the primary booking channel
        console.error('Failed to save appointment to DB');
      }

      // Generate WhatsApp message
      const message = `NEW APPOINTMENT REQUEST\n\nParent/Guardian:\n${formData.parent_name}\n\nChild:\n${formData.child_name}\n\nChild Age:\n${formData.child_age}\n\nPhone:\n${formData.phone}\n\nEmail:\n${formData.email}\n\nService:\n${selected ? selected.name : 'Not specified'}\n\nPreferred Date:\n${formData.preferred_date}\n\nPreferred Time:\n${formData.preferred_time}\n\nAdditional Information:\n${formData.additional_info || 'None'}\n`;

      setConfirmedService(selected ? selected.name : formData.service_id || 'Not specified');

      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      setWhatsappUrl(url);

      // Hand off to WhatsApp. window.open returns null when a popup blocker stops the tab,
      // so track it and offer a manual fallback button on the confirmation screen.
      const win = window.open(url, '_blank');
      setPopupBlocked(!win);
      // Auto-close only when WhatsApp actually opened - if the popup was blocked the
      // user still needs the manual fallback button, so the screen stays open.
      setAutoClose(Boolean(win));
      setSecondsLeft(win ? AUTO_CLOSE_SECONDS : null);

      // Don't close the modal - show a success confirmation step instead
      setIsSubmitting(false);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const formatSummaryDate = (isoDate) => {
    if (!isoDate) return 'Not specified';
    const d = new Date(`${isoDate}T00:00:00`);
    return Number.isNaN(d.getTime()) ? isoDate : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        {submitted ? (
          <div className="modal-success" role="status" aria-live="polite">
            <div className="success-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="headline-md success-title">Request Received!</h3>
            <p className="body-sm success-text">
              {popupBlocked
                ? 'Your browser blocked the WhatsApp popup. Tap the button below to open WhatsApp and send your request.'
                : 'WhatsApp should have opened in a new tab with your details. Just hit send there and our team will confirm the slot shortly.'}
            </p>

            <div className="success-summary">
              <div className="success-row"><span>Child</span><strong>{formData.child_name}</strong></div>
              <div className="success-row"><span>Service</span><strong>{confirmedService}</strong></div>
              <div className="success-row"><span>Preferred Date</span><strong>{formatSummaryDate(formData.preferred_date)}</strong></div>
              <div className="success-row"><span>Preferred Time</span><strong>{formData.preferred_time || 'Not specified'}</strong></div>
            </div>

            {!savedToDb && (
              <p className="success-note">Heads up: we couldn't save a copy in our system, but your WhatsApp message contains everything we need.</p>
            )}

            <div className="success-actions">
              {popupBlocked && (
                <a className="btn btn-secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
              )}
              {autoClose && secondsLeft !== null && (
                <button
                  type="button"
                  className="success-countdown"
                  onClick={() => setAutoClose(false)}
                  aria-label={`Closing automatically in ${secondsLeft} seconds. Click to keep this open.`}
                  title="Click to keep this open"
                >
                  <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
                    <circle className="countdown-track" cx="18" cy="18" r="15.5" />
                    <circle
                      className="countdown-progress"
                      cx="18"
                      cy="18"
                      r="15.5"
                      style={{ strokeDashoffset: RING_CIRCUMFERENCE * (1 - secondsLeft / AUTO_CLOSE_SECONDS) }}
                    />
                  </svg>
                  <span className="countdown-num" aria-hidden="true">{secondsLeft}</span>
                </button>
              )}
              <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          </div>
        ) : (
        <>
        <h2 className="headline-md modal-title">Book an Appointment</h2>
        <p className="body-sm modal-subtitle">We are here to support your child's journey. Let us know how we can help.</p>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="appointment-form grid grid-cols-2">
          <div className="form-group col-span-2">
            <label className="label-sm">Parent / Guardian Name</label>
            <input type="text" name="parent_name" className="input-field" required value={formData.parent_name} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label className="label-sm">Child's Name</label>
            <input type="text" name="child_name" className="input-field" required value={formData.child_name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="label-sm">Child's Age</label>
            <input type="text" name="child_age" className="input-field" required value={formData.child_age} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="label-sm">Phone Number</label>
            <input type="tel" name="phone" className="input-field" required value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="label-sm">Email Address</label>
            <input type="email" name="email" className="input-field" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group col-span-2">
            <label className="label-sm">Therapy / Service Interested In</label>
            <select name="service_id" className="input-field" value={formData.service_id} onChange={handleChange}>
              <option value="">Select a service...</option>
              {services.length > 0
                ? services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))
                : (
                  <>
                    <option value="Occupational Therapy">Occupational Therapy</option>
                    <option value="Speech Therapy">Speech Therapy</option>
                    <option value="Physiotherapy (Paeds)">Physiotherapy (Paeds)</option>
                    <option value="Special Education">Special Education</option>
                    <option value="Early Intervention">Early Intervention</option>
                    <option value="Counseling">Counseling</option>
                  </>
                )}
            </select>
          </div>

          <div className="form-group">
            <label className="label-sm">Preferred Date</label>
            <input type="date" name="preferred_date" className="input-field" required value={formData.preferred_date} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="label-sm">Preferred Time</label>
            <select name="preferred_time" className="input-field" required value={formData.preferred_time} onChange={handleChange}>
              <option value="">Select time...</option>
              <option value="Morning (8am - 12pm)">Morning (8am - 12pm)</option>
              <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
              <option value="Evening (4pm - 6pm)">Evening (4pm - 6pm)</option>
            </select>
          </div>

          <div className="form-group col-span-2">
            <label className="label-sm">Additional Information</label>
            <textarea name="additional_info" className="input-field" rows="3" value={formData.additional_info} onChange={handleChange}></textarea>
          </div>

          <div className="form-group col-span-2 submit-container">
            <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Submit Request via WhatsApp'}
            </button>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
