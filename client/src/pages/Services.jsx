import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import API_URL from '../config';
import fallbackServices from '../data/fallbackServices';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import Pagination from '../components/Pagination';
import { initScrollReveals, createFloatLoop } from '../lib/motion';
import { usePageSeo } from '../hooks/usePageSeo';
import './Services.css';

const SERVICES_PER_PAGE = 9;

// Detail pages are rendered from the DB by ServiceDetail (/services/:slug)
const Services = () => {
  // Listing meta from the admin "SEO" tab; each /services/:slug page has its own
  // meta fields in the Services panel instead.
  usePageSeo('/services');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageRef = useRef(null);
  const gridTopRef = useRef(null);
  const navigate = useNavigate();

  /* GSAP scroll reveals for service cards & assessment cards */
  useEffect(() => {
    const cleanupReveals = initScrollReveals(pageRef.current);
    const cleanupFloat = createFloatLoop(pageRef.current, '[data-float]');
    return () => {
      cleanupReveals?.();
      cleanupFloat?.();
    };
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services`);
        if (response.ok) {
          const data = await response.json();
          setServices(data.length ? data.map((s) => ({
            ...s,
            // DB rows carry a real JSON array for benefits; keep fallbacks' JSON strings intact
            benefits: typeof s.benefits === 'string' ? s.benefits : JSON.stringify(s.benefits || [])
          })) : fallbackServices);
        } else {
          setServices(fallbackServices);
        }
      } catch {
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);



  return (
    <div className="services-page" ref={pageRef}>
      <PageHero
        bg="bg-pastel-peach"
        blob={2}
        eyebrow="More Than Therapy"
        title="A community of "
        accent="care,"
        titleAfter="built for your family."
        subtitle="We believe that every child deserves a nurturing environment to discover their potential. Our clinic was founded to bridge the gap between clinical excellence and warm, family-centered support."
        image="/images/hero_doctor_kid.jpg"
        imageAlt="Therapist building blocks with a child"
        imagePosition="100% 63%"
        notePosition="top-left"
        scriptNote={
          <>
            <span>Brighter Futures</span>
            <span className="script-line-2">Together</span>
            <Heart className="script-heart" size={16} fill="currentColor" />
          </>
        }
      />

      <section className="services-list-section section-padding">
        <div className="container">
          {loading ? (
            <div className="loading-state body-md">Loading services...</div>
          ) : (
            <>
            <div ref={gridTopRef} />
            <div className="services-compact-grid" data-reveal-group>
              {/* Compact cards — long descriptions, benefits & page content live on /services/:slug */}
              {services.slice((page - 1) * SERVICES_PER_PAGE, page * SERVICES_PER_PAGE).map((service) => (
                <div key={service.id} className="services-compact-cell">
                  <button
                    type="button"
                    className="services-compact-card"
                    disabled={!service.slug}
                    onClick={() => {
                      if (service.slug) {
                        navigate(`/services/${service.slug}`);
                        window.scrollTo(0, 0);
                      }
                    }}
                  >
                    <div className="services-compact-media">
                      {service.image && <img src={service.image} alt={service.name} />}
                    </div>
                    <h3 className="headline-sm text-navy">{service.name}</h3>
                    {service.short_description && (
                      <p className="body-sm text-navy-light services-compact-desc">
                        {service.short_description}
                      </p>
                    )}
                    <span className="services-compact-link">
                      Learn More <ArrowRight size={16} />
                    </span>
                  </button>
                </div>
              ))}
            </div>
            <Pagination
              page={page}
              total={services.length}
              perPage={SERVICES_PER_PAGE}
              onChange={(next) => {
                setPage(next);
                gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
            </>
          )}
        </div>
      </section>


      {/* Inline CTA Section */}
      <div className="container pb-12 pt-8 z-10 relative">
        <InlineCTA />
      </div>

      {/* Assessments Section */}
      <section className="assessments-section section-padding">
        <div className="container">
          <div className="text-center mb-12" data-reveal>
            <span className="badge badge-sensory">Evaluation</span>
            <h2 className="headline-xl mt-4">Comprehensive Assessments</h2>
            <p className="body-lg max-w-3xl mx-auto mt-4 text-navy-light">
              We conduct thorough evaluations to understand your child's unique needs and create individualized family service plans.
            </p>
          </div>
          <div className="grid assessments-grid gap-8 max-w-4xl mx-auto" data-reveal-group>
            <div className="assessment-card card">
              <h3 className="headline-md mb-4 text-navy">Psychological Assessments</h3>
              <ul className="body-md list-disc list-inside text-navy-light space-y-2">
                <li>Developmental Assessments (DQ)</li>
                <li>IQ Assessment (MISIC) & EQ Assessment</li>
                <li>Learning Disability (LD) Assessment</li>
                <li>VSMCs & Gesell Scale</li>
              </ul>
            </div>
            <div className="assessment-card card">
              <h3 className="headline-md mb-4 text-navy">OT & PT Assessments</h3>
              <ul className="body-md list-disc list-inside text-navy-light space-y-2">
                <li>Sensory Profile & Motor Assessment</li>
                <li>Manual Muscle Testing (MMT) & Goniometry</li>
                <li>Infant Neurological International Battery (INFANIB)</li>
                <li>Miller Assessment for Preschoolers (MAP) & Berg Balance Scale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
