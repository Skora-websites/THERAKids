/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import API_URL from '../config';

const AppContext = createContext();

// Fallbacks = the real contact values the site shipped with before settings
// became admin-editable, so a dead API never shows placeholder text.
const FALLBACK_SETTINGS = {
  phone: '+91 98993 38813 / +91 93135 13313',
  email: 'therakids.dc@gmail.com',
  address1: 'G-10, Block G, Sector 22, Noida - 201301',
  address2: '173, Itehara, Near NX-One Society, Gr. Noida West - 201306',
  hours_week: 'Mon-Fri: 8:00 AM - 6:00 PM',
  hours_sat: 'Saturday: 9:00 AM - 2:00 PM',
  hours_sun: 'Sunday: Closed',
  whatsapp: '7384448624'
};

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Site-wide contact info, edited in admin (Site Settings) and served by /api/settings
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && Object.keys(data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {
        // API unreachable — fallback settings stay in place
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppContext.Provider value={{ settings, isModalOpen, setIsModalOpen }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
