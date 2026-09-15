import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import './Header.css';

const Header = ({ onBookAppointment }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="global-header">
      <div className="header-pill">
        <div className="logo-container">
          <NavLink to="/">
            <Logo className="header-logo" />
          </NavLink>
        </div>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>About Us</NavLink>
          <NavLink to="/services" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Our Services</NavLink>
          <NavLink to="/conditions" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Conditions We Treat</NavLink>
          <NavLink to="/gallery" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Gallery</NavLink>
          <NavLink to="/blogs" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Blogs</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Contact Us</NavLink>
        </nav>

        <div className="cta-container">
          <button className="btn btn-primary" onClick={onBookAppointment}>
            Book an Appointment
          </button>
          
          <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
