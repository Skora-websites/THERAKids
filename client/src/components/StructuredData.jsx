import React from 'react';

const SITE_URL = 'https://therakidsnoida.com';
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

const StructuredData = ({ type, data }) => {
  const getSchema = () => {
    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'TheraKids Noida',
          url: 'https://therakidsnoida.com',
          logo: 'https://therakidsnoida.com/images/thera-kids-logo1.png',
          description: 'TheraKids Noida offers world-class Occupational therapy, Physiotherapy, speech therapy, Special Education, and Counseling to child/kids in Noida, Delhi NCR.',
          address: [
            {
              '@type': 'PostalAddress',
              streetAddress: 'G-10, Block G, Sector 22',
              addressLocality: 'Noida',
              addressRegion: 'Uttar Pradesh',
              postalCode: '201301',
              addressCountry: 'IN'
            },
            {
              '@type': 'PostalAddress',
              streetAddress: '173, Itehara, Near NX-One Society',
              addressLocality: 'Greater Noida West',
              addressRegion: 'Uttar Pradesh',
              postalCode: '201306',
              addressCountry: 'IN'
            }
          ],
          telephone: ['+919313513313', '+919899338813'],
          email: ['contact@therakidsnoida.com', 'therakids.dc@gmail.com'],
          sameAs: [
            'https://www.facebook.com/therakidsnoida',
            'https://www.instagram.com/therakidsnoida',
            'https://www.twitter.com/therakidsnoida',
            'https://www.linkedin.com/company/therakidsnoida'
          ]
        };
      
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
          logo: `${SITE_URL}/images/thera-kids-logo1.png`,
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
          medicalSpecialty: [
            'Pediatric Occupational Therapy',
            'Pediatric Speech Therapy',
            'Pediatric Physiotherapy'
          ],
          sameAs: [
            'https://www.facebook.com/therakidsnoida',
            'https://www.instagram.com/therakidsnoida',
            'https://www.twitter.com/therakidsnoida',
            'https://www.linkedin.com/company/therakidsnoida'
          ]
        };
      }

      case 'medicalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'MedicalBusiness',
          name: 'TheraKids Noida',
          url: 'https://therakidsnoida.com',
          description: 'Pediatric child development center offering Occupational Therapy, Speech Therapy, Physiotherapy, Special Education, and Early Intervention for children in Noida and Greater Noida.',
          medicalSpecialty: [
            'Pediatric Occupational Therapy',
            'Pediatric Speech Therapy',
            'Pediatric Physiotherapy'
          ],
          availableService: data?.services || [],
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'G-10, Block G, Sector 22',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201301',
            addressCountry: 'IN'
          },
          telephone: '+919313513313'
        };
      
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
  if (!schema) return null;

  // \u003c (and the JS line separators) keep admin-supplied text from ever
  // closing the <script> block, while staying valid JSON for parsers.
  const json = JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
};

export default StructuredData;
