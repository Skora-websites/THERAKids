/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import API_URL from '../config';
import { SETTINGS_FALLBACKS } from '../lib/contact';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Contact info comes from the site_settings table via /api/settings.
  // Seeded with the official fallbacks so every settings-driven section renders
  // on a frontend-only deploy; admin values overwrite when /api answers.
  const [settings, setSettings] = useState(SETTINGS_FALLBACKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Lead funnel popups: the free screening form and the online-therapy form.
  const [isFreeAssessmentOpen, setIsFreeAssessmentOpen] = useState(false);
  const [isOnlineTherapyOpen, setIsOnlineTherapyOpen] = useState(false);

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
    <AppContext.Provider
      value={{
        settings,
        isModalOpen,
        setIsModalOpen,
        isFreeAssessmentOpen,
        setIsFreeAssessmentOpen,
        isOnlineTherapyOpen,
        setIsOnlineTherapyOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
