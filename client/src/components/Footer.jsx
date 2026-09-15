import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
  const [settings] = useState({
    phone: '+91 98993 38813 / +91 93135 13313',
    email: 'therakids.dc@gmail.com',
    address1: 'G-10, Block G, Sector 22, Noida - 201301',
    address2: '173, Itehara, Near NX-One Society, Gr. Noida West - 201306'
  });

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
          <p className="body-sm">Mon-Fri: 8am - 6pm</p>
          <p className="body-sm">Sat: 9am - 2pm</p>
          <p className="body-sm">Sun: Closed</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p className="label-sm">&copy; {new Date().getFullYear()} TheraKids. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
