/* =============================================================
   THERAKids decorative SVG doodles
   Thin rounded strokes, hand-drawn feel, theme-aware via
   currentColor / doodle CSS variables. All decorative (aria-hidden).
   ============================================================= */
import React from 'react';

const base = (extra = {}) => ({
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
  ...extra,
});

/* Hand-drawn heart outline */
export const HeartDoodle = ({ className = '', color = 'var(--color-doodle-pink)', strokeWidth = 2.5, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 24 22" stroke={color} strokeWidth={strokeWidth}>
    <path d="M12 20 C4 14 2 7 7 4.5 c3-1.5 5 1.5 5 1.5 s2-3 5-1.5 c5 2.5 3 9.5 -5 15.5 Z" />
  </svg>
);

/* Single sprig leaf — botanic, calm */
export const LeafDoodle = ({ className = '', color = 'var(--color-doodle-mint)', strokeWidth = 2.5, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 24 24" stroke={color} strokeWidth={strokeWidth}>
    <path d="M12 21 C6 16 4 9 6 4 c5 1 11 5 12 12 -2 3 -4 4.5 -6 5 Z" />
    <path d="M9 13 c2-3 4-5 8-6" />
  </svg>
);

/* Sun with soft rays */
export const SunDoodle = ({ className = '', color = 'var(--color-doodle-amber)', strokeWidth = 2.5, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 32 32" stroke={color} strokeWidth={strokeWidth}>
    <circle cx="16" cy="16" r="6" />
    <path d="M16 3 v3 M16 26 v3 M3 16 h3 M26 16 h3 M6.8 6.8 l2.1 2.1 M23.1 23.1 l2.1 2.1 M25.2 6.8 l-2.1 2.1 M8.9 23.1 l-2.1 2.1" />
  </svg>
);

/* Four-point sparkle — the signature THERAKids accent */
export const Sparkle = ({ className = '', color = 'var(--color-doodle-amber)', strokeWidth = 3, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 24 24" stroke={color} strokeWidth={strokeWidth}>
    <path d="M12 2 C12.8 7.5 14.5 9.2 20 10 C14.5 10.8 12.8 12.5 12 18 C11.2 12.5 9.5 10.8 4 10 C9.5 9.2 11.2 7.5 12 2 Z" />
  </svg>
);

/* Small three-ray burst (used after words/headlines) */
export const Burst = ({ className = '', color = 'var(--color-doodle-amber)', strokeWidth = 3.5, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 30 30" stroke={color} strokeWidth={strokeWidth}>
    <path d="M15 4 v7" />
    <path d="M6 9 l4 5" />
    <path d="M24 9 l-4 5" />
  </svg>
);

/* Five-point hand-drawn star */
export const StarDoodle = ({ className = '', color = 'var(--color-doodle-amber)', strokeWidth = 2.5, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 24 24" stroke={color} strokeWidth={strokeWidth}>
    <path d="M12 3.5 l2.3 5 5.4 0.6 -4 3.7 1.1 5.4 -4.8 -2.7 -4.8 2.7 1.1 -5.4 -4 -3.7 5.4 -0.6 Z" />
  </svg>
);

/* Gentle curved line — connectors and flourishes */
export const CurvedLine = ({ className = '', color = 'var(--color-doodle-lilac)', strokeWidth = 3, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 120 24" stroke={color} strokeWidth={strokeWidth} preserveAspectRatio="none">
    <path d="M2 16 C30 4 60 22 118 8" />
  </svg>
);

/* Hand-drawn arrow with a slightly curved shaft */
export const ArrowDoodle = ({ className = '', color = 'var(--color-doodle-lavender)', strokeWidth = 2.5, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 40 24" stroke={color} strokeWidth={strokeWidth}>
    <path d="M3 14 C14 10 24 11 34 12" />
    <path d="M27 5 c3 2.5 5 4.5 7 7 -2.5 2.5 -4.5 4.5 -7 7" />
  </svg>
);

/* Soft organic blob — background wash */
export const DecorativeBlob = ({ className = '', color = 'var(--color-pastel-lilac)', style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 200 200" fill={color} stroke="none">
    <path d="M45.9,-61.9C58.9,-53.4,68.3,-39.4,72.4,-24.2C76.4,-9,75.1,7.5,69.3,21.8C63.4,36.2,53.1,48.5,40.2,57.4C27.2,66.3,11.6,71.9,-4.4,77.1C-20.4,82.2,-36.7,86.9,-49.4,80.6C-62.1,74.4,-71.2,57.2,-76.3,39.4C-81.3,21.7,-82.3,3.4,-77.6,-12.9C-72.9,-29.2,-62.4,-43.6,-49.1,-52.1C-35.8,-60.6,-17.9,-63.3,-0.7,-62.4C16.5,-61.5,33,-57.1,45.9,-61.9Z" transform="translate(100 100)" />
  </svg>
);

/* Rainbow arcs with rays */
export const RainbowDoodle = ({ className = '', style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 80 48" strokeWidth="3">
    <path d="M8 44 a32 32 0 0 1 64 0" stroke="var(--color-doodle-amber)" />
    <path d="M16 44 a24 24 0 0 1 48 0" stroke="var(--color-doodle-mint)" />
    <path d="M24 44 a16 16 0 0 1 32 0" stroke="var(--color-doodle-pink)" />
    <path d="M40 6 v-4 M14 16 l-3-3 M66 16 l3-3" stroke="var(--color-doodle-amber)" />
  </svg>
);

/* Dashed spiral — playful but quiet */
export const SpiralDoodle = ({ className = '', color = 'var(--color-doodle-lavender)', strokeWidth = 2.5, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 48 48" stroke={color} strokeWidth={strokeWidth}>
    <path d="M24 24 m0 -2 a2 2 0 0 1 2 2 a4 4 0 0 1 -4 4 a6.5 6.5 0 0 1 -6.5 -6.5 a9.5 9.5 0 0 1 9.5 -9.5 a13 13 0 0 1 13 13 a17 17 0 0 1 -17 17" strokeDasharray="4 5" />
  </svg>
);

/* Small underline flourish for section headings */
export const UnderlineFlourish = ({ className = '', color = 'var(--color-doodle-amber)', strokeWidth = 3, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 140 14" stroke={color} strokeWidth={strokeWidth} preserveAspectRatio="none">
    <path d="M3 9 C30 3 70 12 137 6" />
    <path d="M12 12.5 C45 8.5 95 11.5 128 10" opacity="0.55" />
  </svg>
);

/* Pair of solid teardrop petals fanning up from a shared base —
   the reference's coral spray near the eyebrow and photo rim */
export const PetalDuo = ({ className = '', color = 'var(--color-hero-highlight)', style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 48 48" fill={color} stroke="none">
    <path d="M24 45 C13 35 5 20 9 5 C20 13 26 29 24 45 Z" />
    <path d="M24 45 C26 29 33 13 43 6 C45 21 37 37 24 45 Z" />
  </svg>
);

/* Tiny sprout — leaf badge on the note card */
export const SproutDoodle = ({ className = '', color = 'var(--color-doodle-mint)', strokeWidth = 2.5, style, ...rest }) => (
  <svg {...base({ className, style, ...rest })} viewBox="0 0 32 32" stroke={color} strokeWidth={strokeWidth}>
    <path d="M16 27 V15" />
    <path d="M16 15 C16 9 11 5 5 5 c0 6 4 11 11 10 Z" />
    <path d="M16 15 c0-6 5-10 11-10 0 6-4 11-11 10 Z" />
  </svg>
);
