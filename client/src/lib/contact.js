/* Official TheraKids contact details - one source of truth for the footer,
   Contact page and legal pages. Phone/number formatting matches the site's
   business information sheet; the email is the client-designated official
   address (info@therakids.com, updated Sep 2026). */

export const OFFICIAL_PHONES = [
  { display: '+91 93135 13313', tel: '+919313513313' },
  { display: '+91 98993 38813', tel: '+919899338813' },
];

export const OFFICIAL_EMAIL = 'info@therakids.com';

/* WhatsApp number in international format (no +). The appointment modal and the
   floating chat button hand off here; VITE_WHATSAPP_NUMBER overrides when set. */
export const OFFICIAL_WHATSAPP = import.meta.env?.VITE_WHATSAPP_NUMBER || '919899338813';

/* Google Maps deep links - one per centre (official Maps "search" URL format,
   works on desktop and mobile). */
export const MAPS_URLS = {
  noida:
    'https://www.google.com/maps/search/?api=1&query=THERAKids%20Foundation%2C%20G-10%2C%20Block%20G%2C%20Sector%2022%2C%20Noida%2C%20Uttar%20Pradesh%20201301',
  greaterNoida:
    'https://www.google.com/maps/search/?api=1&query=THERAKids%20Foundation%2C%20173%20Itehara%2C%20Near%20NX-One%20Society%2C%20Greater%20Noida%20West%2C%20Uttar%20Pradesh%20201306',
};

/* Defaults used while /api/settings is loading (admin-edited settings always
   win once they resolve). */
export const CONTACT_FALLBACKS = {
  phone: OFFICIAL_PHONES.map((p) => p.display).join(' / '),
  email: OFFICIAL_EMAIL,
  address1: 'G-10, Block G, Sector 22, Noida - 201301',
  address2: '173, Itehara, Near NX-One Society, Gr. Noida West - 201306',
  hours_week: 'Mon-Fri: 8:00 AM - 6:00 PM',
  hours_sat: 'Saturday: 9:00 AM - 2:00 PM',
  hours_sun: 'Sunday: Closed',
};

/* Social media profile URLs. Overridden per-key by admin settings
 * (social_facebook, social_instagram, …) once /api/settings resolves. */
export const SOCIAL_FALLBACKS = {
  facebook: 'https://www.facebook.com/therakidsnoida',
  instagram: 'https://www.instagram.com/therakids_noida/',
  youtube: 'https://www.youtube.com/@therakids_noida',
  twitter: 'https://www.x.com/therakids_noida',
  linkedin: 'https://www.linkedin.com/company/therakidsnoida/home/',
};

/* Google Maps deep links per centre, overridden by admin settings
 * (map_url_noida, map_url_greater_noida). */
export const MAPS_FALLBACKS = {
  noida:
    'https://www.google.com/maps/search/?api=1&query=THERAKids%20Foundation%2C%20G-10%2C%20Block%20G%2C%20Sector%2022%2C%20Noida%2C%20Uttar%20Pradesh%20201301',
  greaterNoida:
    'https://www.google.com/maps/search/?api=1&query=THERAKids%20Foundation%2C%20173%20Itehara%2C%20Near%20NX-One%20Society%2C%20Greater%20Noida%20West%2C%20Uttar%20Pradesh%20201306',
};

/* Full settings seed for the app context: contact + social + maps + WhatsApp.
   /api/settings overwrites every key once it resolves, so admin edits always
   win — but on a frontend-only deploy (Vercel, no backend) every settings-driven
   section still renders official content instead of empty placeholders. */
export const SETTINGS_FALLBACKS = {
  ...CONTACT_FALLBACKS,
  social_facebook: SOCIAL_FALLBACKS.facebook,
  social_instagram: SOCIAL_FALLBACKS.instagram,
  social_youtube: SOCIAL_FALLBACKS.youtube,
  social_twitter: SOCIAL_FALLBACKS.twitter,
  social_linkedin: SOCIAL_FALLBACKS.linkedin,
  map_url_noida: MAPS_FALLBACKS.noida,
  map_url_greater_noida: MAPS_FALLBACKS.greaterNoida,
  whatsapp: OFFICIAL_WHATSAPP,
};

/* Centres: the admin maintains any number of locations as a JSON array in the
 * `centers` setting ([{ name, address, map_url }, …]). parseCenters() turns
 * that into a safe array — falling back to the two official centres (legacy
 * address1/address2/map_url keys, then hardcoded defaults) when the setting
 * is absent or malformed, so the site renders centres with zero backend. */
export const CENTER_FALLBACKS = [
  {
    name: 'Noida',
    address: CONTACT_FALLBACKS.address1,
    map_url: MAPS_FALLBACKS.noida,
  },
  {
    name: 'Gr. Noida West',
    address: CONTACT_FALLBACKS.address2,
    map_url: MAPS_FALLBACKS.greaterNoida,
  },
];

export const parseCenters = (settings = {}) => {
  try {
    const raw = JSON.parse(settings.centers || '[]');
    if (Array.isArray(raw)) {
      const rows = raw
        .map(c => ({
          name: String(c?.name || '').trim(),
          address: String(c?.address || '').trim(),
          map_url: String(c?.map_url || '').trim(),
        }))
        .filter(c => c.name || c.address);
      if (rows.length > 0) return rows;
    }
  } catch {
    // malformed JSON → legacy fallbacks below
  }
  // Legacy settings (address1 / address2 / map_url_*) when `centers` is absent
  const legacy = [
    {
      name: 'Noida',
      address: (settings.address1 || '').trim(),
      map_url: (settings.map_url_noida || '').trim(),
    },
    {
      name: 'Gr. Noida West',
      address: (settings.address2 || '').trim(),
      map_url: (settings.map_url_greater_noida || '').trim(),
    },
  ].filter(c => c.address || c.map_url);
  return legacy.length > 0
    ? legacy
    : CENTER_FALLBACKS;
};

/* "tel:" href for any formatted number the admin stores. */
export const telHref = (num) => `tel:${String(num).replace(/[^\d+]/g, '')}`;

/* Split "+91 93135 13313 / +91 98993 38813" into trimmed parts. */
export const splitPhones = (phone) =>
  String(phone || '').split('/').map((num) => num.trim()).filter(Boolean);
