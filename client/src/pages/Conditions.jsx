import React, { useEffect, useRef, useState } from 'react';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import API_URL from '../config';
import { initScrollReveals, createFloatLoop } from '../lib/motion';
import { usePageSeo } from '../hooks/usePageSeo';
import { FALLBACK_DATA } from '../data/fallbackData';
import './Conditions.css';
// The condition cards reuse the service-detail layout classes defined in Services.css
import './Services.css';

/* Icons cycle onto condition cards by display order (the DB rows carry no icon). */
const CONDITION_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 16v-4"></path>
    <path d="M12 8h.01"></path>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20"></path>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z"></path>
    <path d="M12 3a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9z"></path>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3"></circle>
    <line x1="12" y1="22" x2="12" y2="8"></line>
    <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
    <line x1="16" y1="8" x2="2" y2="22"></line>
    <line x1="17.5" y1="15" x2="9" y2="15"></line>
  </svg>
];

// focus_areas is a JSON column (mysql2 may deliver a string or a parsed array)
const parseFocusAreas = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const Conditions = () => {
  usePageSeo('/conditions');
  const pageRef = useRef(null);
  const [conditions, setConditions] = useState(FALLBACK_DATA.conditions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/conditions`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) setConditions(data);
      })
      .catch(() => {
        // API unreachable - the section renders empty rather than hardcoded content
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* GSAP scroll reveals for the condition cards */
  useEffect(() => {
    const cleanupReveals = initScrollReveals(pageRef.current);
    const cleanupFloat = createFloatLoop(pageRef.current, '[data-float]');
    return () => {
      cleanupReveals?.();
      cleanupFloat?.();
    };
  }, []);

  return (
    <div className="conditions-page" ref={pageRef}>
      <PageHero
        bg="bg-pastel-lilac"
        blob={3}
        eyebrow="Who We Help"
        title="Every child's journey is unique."
        subtitle="We provide specialized, multidisciplinary care tailored to your child's unique developmental profile."
        image="/images/hero-conditions.jpg"
        imageAlt="Child development therapist supporting a child during a play-based activity at TheraKids Noida"
        imagePosition="27% 0%"
        scriptNote="Every step counts"
      />

      <div className="container py-12 z-10 relative bg-white" style={{ maxWidth: '100%' }}>
        <div className="container max-w-5xl mx-auto">
          <InlineCTA />
        </div>
      </div>

      <section className="bg-white section-padding pt-4">
        <div className="container max-w-6xl mx-auto">
          {loading ? (
            <div className="body-md text-navy-light text-center" style={{ padding: '2rem 0' }}>Loading conditions…</div>
          ) : (
            <div className="flex flex-col gap-8" data-reveal-group>
              {conditions.map((condition, index) => {
                const focusAreas = parseFocusAreas(condition.focus_areas);
                return (
                  <div
                    key={condition.id}
                    className="service-detail-card"
                  >
                    <div className={`service-detail-content ${index % 2 !== 0 ? 'reverse' : ''}`}>
                      <div className="service-text">
                        <div className="flex items-center gap-3">
                          <div className="text-navy w-8 h-8">
                            {CONDITION_ICONS[index % CONDITION_ICONS.length]}
                          </div>
                          <h2 className="headline-xl">{condition.name}</h2>
                        </div>
                        <p className="body-lg">{condition.description}</p>

                        {focusAreas.length > 0 && (
                          <div className="service-benefits">
                            <h4 className="label-lg">Key Focus Areas:</h4>
                            <ul>
                              {focusAreas.map((area, idx) => (
                                <li key={idx} className="body-sm">{area}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="service-visual">
                        <div className="condition-blob">
                          <img src={condition.image} alt={`${condition.name} treatment for children at TheraKids pediatric therapy center Noida`} style={{width: '100%', height: '100%', objectFit: 'cover'}} loading="lazy" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!loading && conditions.length === 0 && (
                <div className="body-md text-navy-light text-center" style={{ padding: '2rem 0' }}>
                  Condition information is being updated. Please contact us for details.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Conditions;
