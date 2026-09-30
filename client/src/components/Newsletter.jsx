import React, { useState } from 'react';
import './Newsletter.css';

/* Compact "Stay Updated" strip that lives at the top of the footer.
 *
 * Submissions go straight from the browser to a Google Apps Script Web App
 * that appends a row to a Google Sheet, so no subscriber data is ever stored
 * on the website's hosting/server or database.
 *
 * Setup when the client supplies the real sheet:
 *   1. Create the Sheet, then Extensions → Apps Script with a doPost(e) that
 *      appends the signup — full copy-paste script + deploy steps in
 *      docs/newsletter-apps-script.md. NOTE: this form sends the payload as a
 *      JSON string body (text/plain), so the script must read
 *      e.postData.contents, not e.parameter.
 *   2. Deploy → New deployment → Web app → access "Anyone".
 *   3. Put the /exec URL in client/.env as VITE_NEWSLETTER_ENDPOINT.
 * Until then the component still "submits" (dummy endpoint) so the flow and
 * success state can be reviewed end to end.
 */
const DUMMY_ENDPOINT = 'https://script.google.com/macros/s/DUMMY-ENDPOINT/exec';
const ENDPOINT = import.meta.env.VITE_NEWSLETTER_ENDPOINT || DUMMY_ENDPOINT;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!consent) {
      setError('Please agree to receive updates from TheraKids.');
      return;
    }

    setStatus('submitting');
    setError('');

    try {
      if (ENDPOINT === DUMMY_ENDPOINT) {
        // Dummy form (no real sheet yet): simulate the round-trip so the flow
        // and success state can be reviewed. No data goes anywhere.
        await new Promise((resolve) => setTimeout(resolve, 700));
      } else {
        // Real Apps Script endpoint. text/plain keeps this a "simple request":
        // no CORS preflight round-trip, which Google Apps Script endpoints
        // don't answer. The redirect trick bypasses Apps Script's opaque
        // cross-origin response so the promise resolves and success can be
        // shown client-side. Nothing lands on our server - the POST goes
        // directly from the visitor's browser to Google.
        await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ email: email.trim(), source: 'website-footer-newsletter' }),
          redirect: 'follow',
        });
      }
      setStatus('success');
      setEmail('');
      setConsent(false);
      setTimeout(() => setStatus('idle'), 8000);
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again in a moment.');
    }
  };

  return (
    <div className="footer-newsletter">
      <div className="footer-newsletter-copy">
        <p className="label-md footer-newsletter-heading">Stay Updated</p>
        <p className="body-sm footer-newsletter-sub">Gentle growth tips from our therapists. No spam, ever.</p>
      </div>

      {status === 'success' ? (
        <p className="footer-newsletter-success body-sm" role="status">
          You&rsquo;re on the list! Thank you for subscribing — we&rsquo;ll keep you posted.
        </p>
      ) : (
        <form className="footer-newsletter-form" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            name="email"
            className="input-field footer-newsletter-input"
            placeholder="Your email address"
            aria-label="Email address for newsletter"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'submitting'}
          />
          <button type="submit" className="btn btn-primary footer-newsletter-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}

      <label className="footer-newsletter-consent label-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={status === 'submitting'}
        />
        <span>
          I agree to receive email updates from TheraKids per the{' '}
          <a href="/legal#privacy-policy">Privacy Policy</a>.
        </span>
      </label>

      {error && (
        <p className="footer-newsletter-error label-sm" role="alert">{error}</p>
      )}
    </div>
  );
};

export default Newsletter;
