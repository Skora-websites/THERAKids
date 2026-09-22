import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { useAppContext } from '../context/AppContext';
import { prefersReducedMotion } from '../lib/motion';
import './Header.css';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Our Services' },
  { to: '/conditions', label: 'Conditions We Treat' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/contact', label: 'Contact Us' },
];

const Header = ({ onBookAppointment }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const { setIsModalOpen } = useAppContext();

  /* Soft drop-in entrance, once per load */
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = headerRef.current;
    if (!el) return undefined;
    el.animate(
      [
        { opacity: 0, transform: 'translateY(-16px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' }
    );
    return undefined;
  }, []);

  return (
    <header className="global-header" ref={headerRef}>
      <div className="header-pill">
        <div className="logo-container">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
            <Logo className="header-logo" />
          </NavLink>
        </div>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map(({ to, label }) => (
            <div key={to} className="nav-item-wrapper">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </NavLink>
            </div>
          ))}
          {/* Booking CTA lives inside the menu on mobile, where the header button is hidden */}
          <button
            type="button"
            className="btn btn-primary nav-booking-cta"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsModalOpen(true);
            }}
          >
            Book an Appointment
          </button>
        </nav>

        <div className="cta-container">
          <button className="btn btn-primary" onClick={onBookAppointment}>
            Book an Appointment
          </button>

          <button
            type="button"
            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-box" aria-hidden="true">
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
