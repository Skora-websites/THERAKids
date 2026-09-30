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

/* "tel:" href for any formatted number the admin stores. */
export const telHref = (num) => `tel:${String(num).replace(/[^\d+]/g, '')}`;

/* Split "+91 93135 13313 / +91 98993 38813" into trimmed parts. */
export const splitPhones = (phone) =>
  String(phone || '').split('/').map((num) => num.trim()).filter(Boolean);
