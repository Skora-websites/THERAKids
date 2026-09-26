import { useEffect } from 'react';
import API_URL from '../config';
import { resetSeo, setSeo } from '../lib/seo';

/* Admin-managed SEO for the routes that live in the admin "SEO" tab.
 *
 * Blog posts and service detail pages are NOT here: they carry their own meta
 * columns, edited in the Blogs / Services panels.
 *
 * The table is a handful of rows, so it is fetched once per page load and shared
 * by every route that asks for it. When the API is unreachable every page simply
 * keeps its built-in defaults.
 */
let rowsPromise = null;

const loadRows = () => {
  if (!rowsPromise) {
    rowsPromise = fetch(`${API_URL}/api/seo`)
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);
  }
  return rowsPromise;
};

/** Drop the cached rows so the next page load re-reads them (after an admin save). */
export const invalidatePageSeo = () => {
  rowsPromise = null;
};

/**
 * Apply the SEO row for `pageKey` (a route path such as "/about").
 *
 * Precedence per field: admin value → the defaults passed here → the static
 * index.html value. A field with no value at all is left alone rather than
 * cleared, so a page never loses the site-wide title/keywords/description. The
 * meta title is printed verbatim - no site name is appended to it.
 *
 * @param {string|null} pageKey  route path, e.g. "/about" (null skips the lookup)
 * @param {{title?: string, keywords?: string, description?: string,
 *          type?: string, image?: string}} defaults  built-in fallbacks for this page
 */
export const usePageSeo = (pageKey, defaults = {}) => {
  // Destructured so the effect depends on stable primitives: callers pass a fresh
  // object literal on every render.
  const { title: defaultTitle = '', keywords: defaultKeywords = '', description: defaultDescription = '', type, image } =
    defaults;

  useEffect(() => {
    if (!pageKey) return undefined;
    let cancelled = false;

    loadRows().then((rows) => {
      if (cancelled) return;
      const row = (rows || []).find((r) => r.page_key === pageKey) || {};
      const field = (fromRow, fromDefaults) => (fromRow || '').trim() || fromDefaults || '';

      const tags = {};
      const title = field(row.meta_title, defaultTitle);
      const keywords = field(row.meta_keywords, defaultKeywords);
      const description = field(row.meta_description, defaultDescription);
      const canonical = (row.canonical_url || '').trim();

      // Only override what has a value, so an un-filled SEO row leaves the static
      // site-wide tags in place instead of stripping them.
      if (title) tags.title = title;
      if (keywords) tags.keywords = keywords;
      if (description) tags.description = description;
      if (canonical) tags.canonical = canonical;
      if (type) tags.type = type;
      if (image) tags.image = image;

      setSeo(tags);
    });

    // Back to the route defaults (static index.html head) on unmount.
    return () => {
      cancelled = true;
      resetSeo();
    };
  }, [pageKey, defaultTitle, defaultKeywords, defaultDescription, type, image]);
};
