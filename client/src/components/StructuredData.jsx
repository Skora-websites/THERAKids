import React from 'react';

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
          description: 'TheraKids Noida offers world-class Occupational therapy, physical therapy, speech therapy, and Counseling to child/kids in Noida, Delhi NCR.',
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
      
      case 'medicalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'MedicalBusiness',
          name: 'TheraKids Noida',
          url: 'https://therakidsnoida.com',
          description: 'Pediatric therapy center offering Occupational Therapy, Speech Therapy, and Physical Therapy for children in Noida and Greater Noida.',
          medicalSpecialty: [
            'Pediatric Occupational Therapy',
            'Pediatric Speech Therapy',
            'Pediatric Physical Therapy'
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default StructuredData;
