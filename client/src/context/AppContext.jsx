/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import API_URL from '../config';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Contact info comes solely from the site_settings table via /api/settings.
  // Components render placeholders until the fetch resolves.
  const [settings, setSettings] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && Object.keys(data).length > 0) {
          setSettings(data);
        }
      })
      .catch(() => {
        // API unreachable - components show their loading/empty placeholders
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
