import React, { useEffect, useState } from 'react';
import './ThemeSwitcher.css';

const THEMES = [
  { id: 'signature', label: 'Signature', swatch: 'linear-gradient(135deg, #FADBBE 50%, #E3D4FF 50%)' },
  { id: 'pastel', label: 'Pastel', swatch: 'linear-gradient(135deg, #f9ede2 50%, #ece6f8 50%)' },
  { id: 'bright', label: 'Bright', swatch: 'linear-gradient(135deg, #FF9E4D 50%, #BE95FF 50%)' },
];

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('therakids-theme') || 'signature');

  useEffect(() => {
    if (theme === 'signature') {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }
    localStorage.setItem('therakids-theme', theme);
  }, [theme]);

  return (
    <div className="theme-switcher" role="radiogroup" aria-label="Color theme">
      <svg className="theme-switcher-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none" />
      </svg>
      <div className="theme-switcher-options">
        {THEMES.map(({ id, label, swatch }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={theme === id}
            title={label}
            className={`theme-switcher-btn ${theme === id ? 'active' : ''}`}
            onClick={() => setTheme(id)}
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
