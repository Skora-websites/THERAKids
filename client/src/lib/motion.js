import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------
   Environment
--------------------------------------------- */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
   All creators run inside a gsap.context and return a revert() cleanup.
   This matters under React StrictMode (double-mounted effects): revert()
   restores the DOM to its pre-animation state, whereas tween.kill() would
   leave elements stuck at their hidden .from() values.
   Every creator returns a cleanup function: () => void.
--------------------------------------------- */

/* ---------------------------------------------
   Page-enter hero timeline
   eyebrow -> title -> paragraph -> CTAs -> badges -> visual -> doodles
--------------------------------------------- */
export const createHeroTimeline = (scope, selectors = {}) => {
  const {
    eyebrow = '[data-hero="eyebrow"]',
    title = '[data-hero="title"]',
    text = '[data-hero="text"]',
    actions = '[data-hero="actions"]',
    badges = '[data-hero="badges"]',
    visual = '[data-hero="visual"]',
    doodles = '[data-hero="doodles"]',
  } = selectors;

  if (prefersReducedMotion() || !scope) return () => {};

  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(scope);
    const targets = {
      eyebrow: q(eyebrow),
      title: q(title),
      text: q(text),
      actions: q(actions),
      badges: q(badges),
      visual: q(visual),
      doodles: q(doodles),
    };

    if (!targets.title.length) return; // nothing to sequence

    // Skip empty selector groups so GSAP never logs "target not found"
    const present = (key) => (targets[key].length ? targets[key] : null);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    let cursor = '>';

    const add = (key, vars, at) => {
      const t = present(key);
      if (!t) return;
      tl.from(t, vars, at ?? cursor);
      cursor = '>';
    };

    add('eyebrow', { autoAlpha: 0, y: 18, duration: 0.5 });
    add('title', { autoAlpha: 0, y: 36, duration: 0.7 });
    add('text', { autoAlpha: 0, y: 24, duration: 0.55 });
    add('actions', { autoAlpha: 0, y: 20, duration: 0.5 });
    add('badges', { autoAlpha: 0, y: 16, duration: 0.45, stagger: 0.08 });
    add('visual', { autoAlpha: 0, scale: 0.94, y: 24, duration: 0.8, ease: 'power4.out' }, 0.25);
    add('doodles', { autoAlpha: 0, scale: 0.6, duration: 0.6, ease: 'back.out(1.6)' });
  }, scope);

  return () => ctx.revert();
};

/* ---------------------------------------------
   Scroll-triggered reveal (batched children)
   data-reveal        -> single element reveal
   data-reveal-group  -> staggered children reveal
--------------------------------------------- */
const REVEAL_DEFAULTS = { y: 28, autoAlpha: 0, duration: 0.6, ease: 'power3.out' };

export const initScrollReveals = (scope) => {
  if (prefersReducedMotion() || !scope) return () => {};

  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(scope);

    q('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        ...REVEAL_DEFAULTS,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    q('[data-reveal-group]').forEach((group) => {
      gsap.from(group.children, {
        ...REVEAL_DEFAULTS,
        stagger: 0.08,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      });
    });
  }, scope);

  // ScrollTrigger.refresh() after images load so trigger positions stay accurate
  // (window 'load' covers most cases; late-loading imgs — e.g. remote photos —
  // each get a one-shot refresh so positions never go stale)
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh);
  scope.querySelectorAll('img:not([complete])').forEach((img) => {
    img.addEventListener('load', refresh, { once: true });
  });

  // Fail-safe watchdog: `from` tweens pre-hide content; if a trigger's position
  // goes stale (late image loads, HMR remounts) it may never fire, leaving an
  // "empty" section. While the scope is alive, reveal any element that is still
  // hidden once it has reached the fold — below-fold content keeps its reveal.
  const rescued = new WeakSet();
  let rescueRaf = 0;
  const rescueStuck = () => {
    rescueRaf = 0;
    if (!scope.isConnected) return;
    const viewportBottom = window.innerHeight;
    scope.querySelectorAll('[data-reveal], [data-reveal-group] > *').forEach((el) => {
      if (rescued.has(el) || gsap.isTweening(el)) return;
      if (parseFloat(getComputedStyle(el).opacity) >= 0.99) {
        rescued.add(el); // revealed normally; stop tracking
        return;
      }
      // Stuck hidden and at/above the fold -> reveal now
      if (el.getBoundingClientRect().top <= viewportBottom) {
        rescued.add(el);
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      }
    });
  };
  const scheduleRescue = () => {
    if (!rescueRaf) rescueRaf = requestAnimationFrame(rescueStuck);
  };
  const settleTimer = setTimeout(scheduleRescue, 2500); // initial settle pass
  window.addEventListener('scroll', scheduleRescue, { passive: true });
  window.addEventListener('resize', scheduleRescue, { passive: true });

  return () => {
    clearTimeout(settleTimer);
    if (rescueRaf) cancelAnimationFrame(rescueRaf);
    window.removeEventListener('scroll', scheduleRescue);
    window.removeEventListener('resize', scheduleRescue);
    window.removeEventListener('load', refresh);
    scope.querySelectorAll('img').forEach((img) => {
      img.removeEventListener('load', refresh);
    });
    ctx.revert();
  };
};

/* ---------------------------------------------
   Gentle infinite float for decorative elements
--------------------------------------------- */
export const createFloatLoop = (scope, selector = '[data-float]') => {
  if (prefersReducedMotion() || !scope) return () => {};

  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(scope);
    q(selector).forEach((el, i) => {
      gsap.to(el, {
        y: -(6 + (i % 3) * 3), // varied, small amplitude
        duration: 3 + (i % 4) * 0.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.25,
      });
    });
  }, scope);

  return () => ctx.revert();
};

/* ---------------------------------------------
   Subtle scroll parallax
--------------------------------------------- */
export const createParallax = (scope, selector = '[data-parallax]', strength = 40) => {
  if (prefersReducedMotion() || !scope) return () => {};

  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(scope);
    q(selector).forEach((el) => {
      gsap.to(el, {
        y: strength,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }, scope);

  return () => ctx.revert();
};
