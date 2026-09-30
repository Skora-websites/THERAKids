import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import Newsletter from './Newsletter';
import { useAppContext } from '../context/AppContext';
import { CONTACT_FALLBACKS, MAPS_URLS, splitPhones, telHref } from '../lib/contact';
import './Footer.css';

/* Fallbacks while /api/settings is loading (admin-edited settings always win
   once they resolve). Single source of truth lives in lib/contact.js. */
const FALLBACKS = CONTACT_FALLBACKS;

// Single source of truth for the site's social URLs (footer + anywhere else,
// e.g. the Programs page resource hub). Icons stay local to the footer.
export const SOCIAL_URLS = {
  facebook: 'https://www.facebook.com/therakidsnoida',
  instagram: 'https://www.instagram.com/therakids_noida/',
  youtube: 'https://www.youtube.com/@therakids_noida',
  twitter: 'https://x.com/therakids_noida',
};

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: SOCIAL_URLS.facebook,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: SOCIAL_URLS.instagram,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16Zm0 1.8c-3.15 0-3.5.01-4.73.07-2.4.11-3.53 1.25-3.64 3.64-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.11 2.39 1.24 3.53 3.64 3.64 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c2.4-.11 3.53-1.25 3.64-3.64.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.11-2.39-1.24-3.53-3.64-3.64-1.23-.06-1.58-.07-4.73-.07Zm0 3.07a6.16 6.16 0 1 1 0 12.32 6.16 6.16 0 0 1 0-12.32Zm0 1.8a4.36 4.36 0 1 0 0 8.72 4.36 4.36 0 0 0 0-8.72Zm6.41-2.93a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88Z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: SOCIAL_URLS.youtube,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: SOCIAL_URLS.twitter,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
      </svg>
    ),
  },
];

/* "Covered us" trust strip the client asked for. Official logo files live in
   public/images/partners/ (Amar Ujala, YourStory, Josh Talks); the local media
   outlets (Noida Today, Greater Noida News, Delhi NCR Times) render as styled
   wordmark badges until the client supplies their logo files. */
const MEDIA_PARTNERS = [
  { name: 'Amar Ujala', src: '/images/partners/amar-ujala-logo.png', href: 'https://www.amarujala.com/', height: 30 },
  { name: 'YourStory', src: '/images/partners/yourstory-logo.png', href: 'https://yourstory.com/companies/therakids-noida', height: 32 },
  { name: 'Josh Talks', src: '/images/partners/josh-talks-logo.svg', href: 'https://www.joshtalks.com/', height: 30 },
  { name: 'Noida Today', badge: 'Noida Today', href: 'https://www.noidatoday.in/' },
  { name: 'Greater Noida News', badge: 'Greater Noida News', href: 'https://www.greaternoidanews.com/' },
  { name: 'Delhi NCR Times', badge: 'Delhi NCR Times', href: 'https://delhincrtimes.com/' },
];

const Footer = () => {
  // Contact details come from admin (Site Settings) via /api/settings
  const { settings } = useAppContext();
  const phone = settings.phone || FALLBACKS.phone;
  const email = settings.email || FALLBACKS.email;
  const phones = splitPhones(phone);

  return (
    <footer className="global-footer">
      {/* Compact "Stay Updated" strip — top of the footer per the client brief */}
      <div className="container">
        <Newsletter />
      </div>

      <div className="container footer-content footer-grid">
        <div className="footer-brand">
          <Logo className="footer-logo" />
          <p className="body-sm footer-desc">
            A leading multidisciplinary organization dedicated to providing high-quality therapy services for children.
          </p>
          <div className="footer-social" aria-label="Follow TheraKids on social media">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`TheraKids on ${social.label}`}
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          {/* Legal: Privacy Policy only — the Terms & Conditions anchor was
              removed (it resolved to the same legal page). */}
          <nav className="footer-legal label-sm" aria-label="Legal">
            <NavLink to="/legal#privacy-policy">Privacy Policy</NavLink>
          </nav>
        </div>

        <div className="footer-links">
          <h4 className="label-lg">Quick Links</h4>
          <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/services">Our Services</NavLink>
            <NavLink to="/conditions">Conditions We Treat</NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
            <NavLink to="/blogs">Blogs</NavLink>
            <NavLink to="/programs">THERAKids Academy</NavLink>
            <NavLink to="/contact">Contact Us</NavLink>
          </nav>
        </div>

        <div className="footer-contact">
          <h4 className="label-lg">Contact</h4>
          <p className="body-sm">
            {phones.map((num) => (
              <a key={num} href={telHref(num)} className="footer-contact-link footer-phone-link">
                {num}
              </a>
            ))}
          </p>
          <p className="body-sm">
            <a href={`mailto:${email}`} className="footer-contact-link">{email}</a>
          </p>
          <p className="body-sm">
            <strong>Noida:</strong>{' '}
            <a href={MAPS_URLS.noida} target="_blank" rel="noopener noreferrer" className="footer-contact-link" aria-label="Open the Noida centre in Google Maps">
              {settings.address1 || FALLBACKS.address1}
            </a>
          </p>
          <p className="body-sm">
            <strong>Gr. Noida West:</strong>{' '}
            <a href={MAPS_URLS.greaterNoida} target="_blank" rel="noopener noreferrer" className="footer-contact-link" aria-label="Open the Greater Noida West centre in Google Maps">
              {settings.address2 || FALLBACKS.address2}
            </a>
          </p>
        </div>

        <div className="footer-hours">
          <h4 className="label-lg">Hours</h4>
          <p className="body-sm">{settings.hours_week || FALLBACKS.hours_week}</p>
          <p className="body-sm">{settings.hours_sat || FALLBACKS.hours_sat}</p>
          <p className="body-sm">{settings.hours_sun || FALLBACKS.hours_sun}</p>
          <p className="body-sm">
            <a href={MAPS_URLS.noida} target="_blank" rel="noopener noreferrer" className="footer-maps-link">
              Find us on Google Maps <span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      </div>

      {/* "Also covered us" trust strip - media partners whose logos the client
          supplied for the bottom of the footer. */}
      <div className="container footer-media">
        <p className="label-sm footer-media-label">As covered by</p>
        <div className="footer-media-logos">
          {MEDIA_PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-media-logo"
              aria-label={`TheraKids featured on ${partner.name}`}
              title={partner.name}
            >
              {partner.src ? (
                <img src={partner.src} alt={`${partner.name} logo`} style={{ height: partner.height }} loading="lazy" />
              ) : (
                <span className="partner-badge">{partner.badge}</span>
              )}
            </a>
          ))}
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="label-sm">
          &copy; {new Date().getFullYear()} TheraKids. All rights reserved.
          <span className="footer-credit-sep" aria-hidden="true">&middot;</span>
          Designed by{' '}
          <a
            href="https://skorainfotech.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-credit-link"
          >
            SkoraInfotech
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
