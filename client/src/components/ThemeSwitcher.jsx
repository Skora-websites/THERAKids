import React, { useEffect, useRef, useState } from 'react';
import './ThemeSwitcher.css';

const THEMES = [
  { id: 'signature', label: 'Signature', swatch: 'linear-gradient(135deg, #FADBBE 50%, #E3D4FF 50%)' },
  { id: 'pastel', label: 'Pastel', swatch: 'linear-gradient(135deg, #f9ede2 50%, #ece6f8 50%)' },
  { id: 'bright', label: 'Bright', swatch: 'linear-gradient(135deg, #FF9E4D 50%, #BE95FF 50%)' },
];

const ContrastIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none" />
  </svg>
);

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('therakids-theme') || 'signature');
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (theme === 'signature') {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }
    localStorage.setItem('therakids-theme', theme);
  }, [theme]);

  /* Close the mobile popover when clicking/tapping outside */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div
      className={`theme-switcher ${open ? 'open' : ''}`}
      ref={rootRef}
      role="radiogroup"
      aria-label="Color theme"
    >
      {/* Decorative icon on wide screens (options always visible) */}
      <ContrastIcon className="theme-switcher-icon theme-switcher-icon-desktop" />

      {/* Toggle that expands the options on small screens */}
      <button
        type="button"
        className="theme-switcher-toggle"
        aria-expanded={open}
        aria-label="Change color theme"
        onClick={() => setOpen((o) => !o)}
      >
        <ContrastIcon className="theme-switcher-icon" />
      </button>

      <div className="theme-switcher-options" id="theme-switcher-options">
        {THEMES.map(({ id, label, swatch }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={theme === id}
            title={label}
            className={`theme-switcher-btn ${theme === id ? 'active' : ''}`}
            onClick={() => {
              setTheme(id);
              setOpen(false);
            }}
          >
            <span className="theme-swatch" style={{ background: swatch }} aria-hidden="true" />
            <span className="theme-switcher-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
