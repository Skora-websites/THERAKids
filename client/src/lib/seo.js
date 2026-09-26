/* Per-page SEO management for the SPA: <title>, meta keywords/description,
 * canonical URL and the Open Graph / Twitter Card tags.
 *
 * Every public route gets canonical + OG + Twitter tags derived from the current
 * location - Layout calls setRouteSeo(pathname) on each navigation. Pages layer
 * their own overrides on top via setSeo({ title, keywords, description, type,
 * image, canonical }); BlogPost uses that for the per-article tags (og:type
 * "article", featured image, admin-provided canonical URL) and usePageSeo() does
 * it for the admin-managed routes. resetSeo() drops the overrides back to route
 * defaults (the static index.html values).
 *
 * Per field there are three states - this is what keeps metadata from leaking
 * between pages and from wiping the site-wide defaults:
 *   undefined  → not overridden: the static index.html value stays in place
 *   ''         → explicitly cleared: the tag is removed for this page
 *   'value'    → used verbatim (no site name is ever appended)
 *
 * Values are written with document.title and setAttribute('content', …) - both
 * treat the value as plain text, so a payload like "/><script>alert(1)</script>
 * stays inert text: when the head is serialised it comes out escaped (&lt;script&gt;),
 * never as an executable node. Nothing here uses innerHTML.
 */

const SITE_URL = 'https://therakidsnoida.com'; // canonical production origin (matches index.html)
const DEFAULT_OG_IMAGE = '/images/home hero img.png';
const MANAGED_META = ['keywords', 'description'];

let baseline = null; // static index.html head, captured before the first override
let routePath = '/';  // current pathname (set by setRouteSeo)
let page = null;      // per-page overrides; null = route-default mode

const findMeta = (name) => document.head.querySelector(`meta[name="${name}"]`);
// OG/Twitter tags are conventionally property=… (index.html); accept name= too.
const findProp = (prop) =>
  document.head.querySelector(`meta[property="${prop}"]`) ||
  document.head.querySelector(`meta[name="${prop}"]`);

const captureBaseline = () => {
  if (baseline) return;
  baseline = { title: document.title, metas: {} };
  MANAGED_META.forEach((name) => {
    const el = findMeta(name);
    baseline.metas[name] = el ? el.getAttribute('content') : null;
  });
};

const setMeta = (name, content) => {
  let el = findMeta(name);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content); // escaped on serialisation
};

const removeMeta = (name) => {
  const el = findMeta(name);
  if (el) el.remove();
};

const setProp = (prop, content) => {
  let el = findProp(prop);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', prop);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const removeProp = (prop) => {
  const el = findProp(prop);
  if (el) el.remove();
};

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

// External URLs pass through; site paths become SITE_URL + path (spaces encoded).
const absoluteUrl = (value) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return SITE_URL + encodeURI(value.startsWith('/') ? value : `/${value}`);
};

// Render the full tag set from baseline + routePath + page overrides.
const apply = () => {
  if (!baseline) return;

  // undefined → inherit the static value; null/'' → cleared; string → use it.
  const overridden = (key) => page !== null && page[key] !== undefined;
  const pick = (key, fallback) => (overridden(key) ? page[key] : fallback);

  const title = pick('title', null) || baseline.title; // meta title, printed verbatim
  document.title = title;

  const keywords = pick('keywords', baseline.metas.keywords);
  if (keywords && keywords.trim()) setMeta('keywords', keywords.trim());
  else removeMeta('keywords'); // empty → omit the tag entirely

  const description = pick('description', baseline.metas.description);
  const desc = description && description.trim() ? description.trim() : '';
  if (desc) setMeta('description', desc);
  else removeMeta('description');

  // Canonical + Open Graph + Twitter Card - every route; article override wins.
  const canonical = (overridden('canonical') && absoluteUrl(page.canonical)) || `${SITE_URL}${routePath}`;
  setCanonical(canonical);

  const image = (overridden('image') && absoluteUrl(page.image)) || absoluteUrl(DEFAULT_OG_IMAGE);
  const effectiveType = overridden('type') && page.type ? page.type : 'website';

  setProp('og:type', effectiveType);
  setProp('og:url', canonical);
  setProp('og:title', title);
  if (desc) setProp('og:description', desc);
  else removeProp('og:description');
  setProp('og:image', image);

  setProp('twitter:card', 'summary_large_image');
  setProp('twitter:url', canonical);
  setProp('twitter:title', title);
  if (desc) setProp('twitter:description', desc);
  else removeProp('twitter:description');
  setProp('twitter:image', image);
  // og:site_name / og:locale stay as shipped in index.html (site-wide constants)
};

/**
 * Track the current route so canonical/OG/Twitter point at the right URL.
 * Called by Layout on every navigation; re-applies any active page overrides.
 * @param {string} pathname
 */
export const setRouteSeo = (pathname) => {
  captureBaseline();
  routePath = pathname || '/';
  apply();
};

/**
 * Apply per-page SEO overrides. Only the fields passed are overridden - anything
 * omitted keeps the static index.html value, so a page that sets no meta title
 * still shows the site title. Pass an explicit '' to clear a tag for this page.
 * `title` is printed verbatim (the meta title is the <title>).
 * @param {{title?: string, keywords?: string, description?: string,
 *          type?: string, image?: string, canonical?: string}} tags
 */
export const setSeo = ({ title, keywords, description, type, image, canonical } = {}) => {
  captureBaseline();
  page = {};
  const override = (key, value) => {
    if (value === undefined) return; // absent → inherit the static value
    page[key] = typeof value === 'string' ? value.trim() || null : value || null;
  };
  override('title', title);
  override('keywords', keywords);
  override('description', description);
  override('type', type);
  override('image', image);
  override('canonical', canonical);
  apply();
};

/** Drop per-page overrides: title/meta fall back to the static index.html
 *  defaults, canonical/OG/Twitter to the current route's derived values. */
export const resetSeo = () => {
  if (!baseline) return;
  page = null;
  apply();
};

/** Strip HTML to collapsed plain text (DOMParser is inert, nothing executes). */
export const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
};

/** Plain-text excerpt capped at `max` chars, with an ellipsis when truncated. */
export const makeExcerpt = (html, max = 160) => {
  const text = stripHtml(html);
  return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text;
};

export { SITE_URL };
