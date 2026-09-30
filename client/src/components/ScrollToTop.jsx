import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* Scroll management on route change.
 *
 * PUSH/REPLACE -> scroll to top (or to the #anchor, e.g. /legal#privacy-policy).
 * POP (back/forward) -> restore the scroll position the user left at.
 *
 * Three restore systems fight in an SPA otherwise:
 *   1. the browser's native history.scrollRestoration (restores while the new
 *      page is still mounting => clamps to the footer),
 *   2. GSAP ScrollTrigger's own recorded positions (reapplied on refresh()),
 *   3. ours. clearScrollMemory('manual') disables 1 and 2 on every route change,
 *      leaving the positions map below as the single source of truth.
 *
 * Positions are recorded with a cheap rAF sampler (not scroll events, which do
 * not fire in some embedded webviews), keyed by React Router's history index.
 * On POP the saved offset is re-asserted for ~1s while images and GSAP reveals
 * change the page height; the moment the user wheels/touches, we stop. */

const positions = new Map(); // history.state.idx -> scrollY

let lastY = 0;
let lastIdx = null;
const sample = () => {
  const y = window.scrollY;
  const idx = window.history.state?.idx;
  if (y !== lastY && idx != null) {
    positions.set(idx, y);
    lastY = y;
    lastIdx = idx;
  }
  raf = requestAnimationFrame(sample);
};
let raf = requestAnimationFrame(sample);

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType(); // 'PUSH' | 'POP' (back/forward) | 'REPLACE'

  useEffect(() => {
    // Neutralize ScrollTrigger's + the browser's own scroll restoration on every
    // route change; restoration is handled exclusively by the positions map.
    ScrollTrigger.clearScrollMemory('manual');

    if (navType === 'POP') {
      const idx = window.history.state?.idx;
      const y = idx != null && positions.has(idx) ? positions.get(idx) : 0;

      // Re-assert while the page settles (images / GSAP reveals change height).
      // Cancelled the moment the user scrolls on their own.
      let frames = 0;
      let rafId = 0;
      let stop = false;
      const onUserScroll = () => { stop = true; };
      window.addEventListener('wheel', onUserScroll, { passive: true, once: true });
      window.addEventListener('touchmove', onUserScroll, { passive: true, once: true });

      const reassert = () => {
        if (stop) return;
        if (window.scrollY !== y) window.scrollTo(0, y);
        if (frames++ < 60) rafId = requestAnimationFrame(reassert); // ~1s
      };
      rafId = requestAnimationFrame(reassert);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('wheel', onUserScroll);
        window.removeEventListener('touchmove', onUserScroll);
      };
    }

    if (hash) {
      // The target section mounts with the new route; retry across a few frames
      // in case the element is not in the very first committed frame.
      const id = hash.slice(1);
      let frames = 0;
      let rafId;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
        } else if (frames++ < 30) {
          rafId = requestAnimationFrame(tryScroll);
        }
      };
      rafId = requestAnimationFrame(tryScroll);
      return () => cancelAnimationFrame(rafId);
    }

    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash, navType]);

  return null;
};

export default ScrollToTop;
