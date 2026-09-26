import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TiltCard from './TiltCard';
import API_URL from '../config';
import fallbackServices from '../data/fallbackServices';
import './RelatedServices.css';

const SERVICE_ICONS = ['🗣️', '✋', '🏃', '📚', '🎨', '💬', '🧩', '🎒'];

const RelatedServices = ({ currentService }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/services`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) setServices(data);
      })
      .catch(() => {
        // API unreachable - the shared static fallback list stays in place
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Show two other services (a single row), each linking to /services/:slug
  const relatedServices = services
    .filter((s) => s.slug && s.slug !== currentService)
    .slice(0, 2)
    .map((s, i) => ({ ...s, icon: s.icon || SERVICE_ICONS[i % SERVICE_ICONS.length] }));

  if (relatedServices.length === 0) return null;

  return (
    <section className="related-services section-padding bg-pastel-lilac relative overflow-hidden">
      <div className="cloud-divider cloud-top fill-white">
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
        </svg>
      </div>
      <div className="container z-10 relative">
        <div className="section-header center mb-12" data-reveal>
          <p className="label-md text-navy uppercase tracking-widest">Explore More</p>
          <h2 className="headline-xl text-navy">Other Therapy Services</h2>
          <p className="body-lg text-navy-light max-w-2xl mx-auto mt-4">
            We offer a comprehensive range of therapy services to support your child's development. Discover how our other specialties can help.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 related-services-grid" data-reveal-group>
          {relatedServices.map((service) => (
            <TiltCard key={service.id} maxTilt={6}>
              <div
                className="related-service-card"
                onClick={() => {
                  navigate(`/services/${service.slug}`);
                  window.scrollTo(0, 0);
                }}
              >
                <div className="related-service-image">
                  <img src={service.image} alt={service.name} />
                  <div className="related-service-icon">{service.icon}</div>
                </div>
                <div className="related-service-content">
                  <h3 className="headline-sm text-navy mb-2">{service.name}</h3>
                  <p className="body-sm text-navy-light mb-4">{service.short_description}</p>
                  <span className="related-service-link">
                    Learn More <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
      <div className="cloud-divider cloud-bottom fill-white">
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
};

export default RelatedServices;
