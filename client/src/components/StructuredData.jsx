import React, { useEffect, useState } from 'react';
import API_URL from '../config';
import { CONTACT_FALLBACKS } from '../lib/contact';

const SITE_URL = 'https://therakidsnoida.com';
// Settings shape built from the official contact constants (used until /api/settings
// answers, or permanently on frontend-only deploys)
const CONTACT_FALLBACKS_SETTINGS = {
  phone: CONTACT_FALLBACKS.phone,
  email: CONTACT_FALLBACKS.email,
  address1: CONTACT_FALLBACKS.address1,
  address2: CONTACT_FALLBACKS.address2
};
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Official social profiles and Maps deep link (mirrored in the footer);
// sameAs helps search engines connect the brand across platforms.
const SOCIAL_PROFILES = [
  'https://www.facebook.com/therakidsnoida',
  'https://www.instagram.com/therakids_noida/',
  'https://www.youtube.com/@therakids_noida',
  'https://x.com/therakids_noida'
];
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=THERAKids%20Foundation%2C%20G-10%2C%20Block%20G%2C%20Sector%2022%2C%20Noida%2C%20Uttar%20Pradesh%20201301';

// "Mon-Fri" / "Saturday" → [day names] (≥3-char prefix match, e.g. Mon → Monday)
const parseDayPart = (dayPart) => {
  const range = String(dayPart).trim().match(/^([A-Za-z]{3,})\s*-\s*([A-Za-z]{3,})$/);
  if (range) {
    const start = WEEKDAYS.findIndex((d) => d.toLowerCase().startsWith(range[1].toLowerCase()));
    const end = WEEKDAYS.findIndex((d) => d.toLowerCase().startsWith(range[2].toLowerCase()));
    if (start < 0 || end < 0 || end < start) return null;
    return WEEKDAYS.slice(start, end + 1);
  }
  const single = String(dayPart).trim();
  if (single.length < 3) return null;
  const idx = WEEKDAYS.findIndex((d) => d.toLowerCase().startsWith(single.toLowerCase()));
  return idx < 0 ? null : [WEEKDAYS[idx]];
};

const to24h = (h, min, meridiem) => {
  let hh = Number(h) % 12;
  if (/p/i.test(meridiem)) hh += 12;
  return `${String(hh).padStart(2, '0')}:${(min || '00').padStart(2, '0')}`;
};

// "Mon-Fri: 8:00 AM - 6:00 PM" → OpeningHoursSpecification; "Sunday: Closed"
// or anything unparseable → null (omitted rather than emitted wrong).
const parseHoursLine = (line) => {
  const m = String(line || '').match(
    /^(.*?):\s*(\d{1,2}(?::\d{2})?\s*[AaPp][Mm]\s*-\s*\d{1,2}(?::\d{2})?\s*[AaPp][Mm])\s*$/
  );
  if (!m) return null;
  const days = parseDayPart(m[1]);
  if (!days) return null;
  const t = m[2].match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])\s*-\s*(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])$/);
  if (!t) return null;
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: days,
    opens: to24h(t[1], t[2], t[3]),
    closes: to24h(t[4], t[5], t[6])
  };
};

// "G-10, Block G, Sector 22, Noida - 201301" → street / locality / postcode.
const splitAddress = (addr) => {
  const m = String(addr || '').trim().match(/^(.+),\s*([^,]+?)\s*-\s*(\d{6})\s*$/);
  if (!m) return String(addr || '').trim() ? { streetAddress: String(addr).trim() } : null;
  return { streetAddress: m[1].trim(), addressLocality: m[2].trim(), postalCode: m[3] };
};

// First phone number, normalised to +91XXXXXXXXXX
const firstPhone = (phone) => String(phone || '').split('/')[0].replace(/[^+\d]/g, '') || null;

// Organization JSON-LD rendered on the Home page: name/logo/description are site
// boilerplate, but addresses, phones and emails come from admin-edited Site
// Settings. Not rendered until the settings fetch resolves.
const OrganizationSchema = () => {
  // Start from the official contact fallbacks so the org block renders even on
  // frontend-only deploys; admin-edited settings overwrite when /api answers.
  const [s, setS] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && Object.keys(data).length > 0) setS(data);
      })
      .catch(() => {
        // API unreachable - keep the fallback contact info below
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const settings = s || CONTACT_FALLBACKS_SETTINGS;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TheraKids Noida',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'TheraKids Noida - pediatric therapy and child development services in Noida and Greater Noida, Delhi NCR.',
    address: [settings.address1, settings.address2]
      .filter(Boolean)
      .map((addr) => {
        const parsed = splitAddress(addr);
        return parsed
          ? { '@type': 'PostalAddress', ...parsed, addressRegion: 'Uttar Pradesh', addressCountry: 'IN' }
          : null;
      })
      .filter(Boolean),
    telephone: (settings.phone || '').split('/').map(firstPhone).filter(Boolean),
    email: settings.email ? [settings.email] : undefined,
    sameAs: SOCIAL_PROFILES
  };
  return <JsonLd schema={schema} />;
};

const JsonLd = ({ schema }) => {
  if (!schema) return null;

  // \u003c (and the JS line separators) keep admin-supplied text from ever
  // closing the <script> block, while staying valid JSON for parsers.
  const json = JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
};

const StructuredData = ({ type, data }) => {
  if (type === 'organization') return <OrganizationSchema />;

  const getSchema = () => {
    switch (type) {
      case 'localBusiness': {
        // Business-type JSON-LD rendered site-wide (Layout); address, phone and
        // hours all come from admin-edited Site Settings (with App fallbacks).
        const s = data || {};
        const hours = [s.hours_week, s.hours_sat, s.hours_sun]
          .map(parseHoursLine)
          .filter(Boolean);
        const address = splitAddress(s.address1);
        return {
          '@context': 'https://schema.org',
          '@type': 'MedicalBusiness',
          name: 'TheraKids Noida',
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
          image: `${SITE_URL}/images/home%20hero%20img.png`,
          description: 'TheraKids Noida offers world-class Occupational therapy, physical therapy, speech therapy, and Counseling to child/kids in Noida, Delhi NCR under the supervision of highly trained specialists.',
          telephone: firstPhone(s.phone),
          email: s.email || undefined,
          address: address
            ? {
                '@type': 'PostalAddress',
                ...address,
                addressRegion: 'Uttar Pradesh',
                addressCountry: 'IN'
              }
            : undefined,
          openingHoursSpecification: hours,
          geo: { '@type': 'GeoCoordinates', latitude: 28.5802, longitude: 77.334 },
          hasMap: MAPS_URL,
          medicalSpecialty: [
            'Pediatric Occupational Therapy',
            'Pediatric Speech Therapy',
            'Pediatric Physiotherapy'
          ],
          sameAs: SOCIAL_PROFILES
        };
      }

      case 'service':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: data?.name,
          provider: {
            '@type': 'MedicalBusiness',
            name: 'TheraKids Noida'
          },
          description: data?.description,
          areaServed: {
            '@type': 'City',
            name: 'Noida'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: data?.name,
            itemListElement: data?.benefits?.map(benefit => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: benefit
              }
            }))
          }
        };
      
      case 'faq':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data?.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer
            }
          }))
        };
      
      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data?.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: `https://therakidsnoida.com${item.path}`
          }))
        };
      
      default:
        return null;
    }
  };

  const schema = getSchema();
  return <JsonLd schema={schema} />;
};

export default StructuredData;
