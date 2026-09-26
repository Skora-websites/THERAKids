import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { useAppContext } from '../context/AppContext';
import './Footer.css';

const Footer = () => {
  // Contact details come from admin (Site Settings) via /api/settings
  const { settings } = useAppContext();

  return (
    <footer className="global-footer">
      <div className="container footer-content grid grid-cols-4">
        <div className="footer-brand">
          <Logo className="footer-logo" />
          <p className="body-sm footer-desc">
            A leading multidisciplinary organization dedicated to providing high-quality therapy services for children.
          </p>
        </div>
        
        <div className="footer-links">
            <h4 className="label-lg">Quick Links</h4>
            <nav>
              <NavLink to="/about">About Us</NavLink>
              <NavLink to="/services">Our Services</NavLink>
              <NavLink to="/services/speech-therapy">Speech Therapy</NavLink>
              <NavLink to="/services/occupational-therapy">Occupational Therapy</NavLink>
              <NavLink to="/services/physiotherapy-paeds">Physiotherapy (Paeds)</NavLink>
              <NavLink to="/conditions">Conditions We Treat</NavLink>
              <NavLink to="/gallery">Gallery</NavLink>
              <NavLink to="/blogs">Blogs</NavLink>
              <NavLink to="/contact">Contact Us</NavLink>
            </nav>
        </div>

        <div className="footer-contact">
          <h4 className="label-lg">Contact</h4>
          <p className="body-sm">{settings.phone}</p>
          <p className="body-sm">{settings.email}</p>
          <br />
          <p className="body-sm"><strong>Noida:</strong> {settings.address1}</p>
          <p className="body-sm"><strong>Gr. Noida West:</strong> {settings.address2}</p>
        </div>

        <div className="footer-hours">
          <h4 className="label-lg">Hours</h4>
          <p className="body-sm">{settings.hours_week}</p>
          <p className="body-sm">{settings.hours_sat}</p>
          <p className="body-sm">{settings.hours_sun}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p className="label-sm">&copy; {new Date().getFullYear()} TheraKids. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
