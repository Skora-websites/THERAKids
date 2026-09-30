import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import RelatedServices from '../components/RelatedServices';
import StructuredData from '../components/StructuredData';
import { initScrollReveals, createFloatLoop } from '../lib/motion';
import { setSeo, resetSeo, stripHtml } from '../lib/seo';
import { useAppContext } from '../context/AppContext';
import API_URL from '../config';
import { FALLBACK_DATA } from '../data/fallbackData';
import './TherapyDetail.css';

const parseJson = (raw, fallback) => {
  if (raw == null || raw === '') return fallback;
  if (typeof raw !== 'string') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setIsModalOpen } = useAppContext();
  const pageRef = useRef(null);

  // Static fallback first (frontend-only deploys); the API replaces it live.
  const fallbackService = FALLBACK_DATA.services.find((s) => s.slug === slug) || null;
  const [service, setService] = useState(fallbackService);
  const [loading, setLoading] = useState(!fallbackService);
  const [notFound, setNotFound] = useState(false);

  /* Per-service SEO, edited in the Services panel (not the SEO tab): <title> is the
     meta title verbatim, falling back to the service name; keywords/description fall
     back to the short description; an empty field is left alone so the site-wide
     tags survive. */
  useEffect(() => {
    if (!service) return undefined;
    const field = (value) => (value || '').trim();
    const tags = {};
    const title = field(service.meta_title) || field(service.name);
    const keywords = field(service.meta_keywords);
    const description = field(service.meta_description) || stripHtml(service.short_description);
    const canonical = field(service.canonical_url);
    if (title) tags.title = title;
    if (keywords) tags.keywords = keywords;
    if (description) tags.description = description;
    if (canonical) tags.canonical = canonical;
    if (service.image) tags.image = service.image;
    setSeo(tags);
    return () => resetSeo();
  }, [service]);

  useEffect(() => {
    let cancelled = false;
    window.scrollTo(0, 0);

    const load = async () => {
      try {
        // FAQs live on the home page only now, so no faqs fetch here.
        const serviceRes = await fetch(`${API_URL}/api/services/${slug}`);
        if (cancelled) return;
        if (serviceRes.ok) {
          setService(await serviceRes.json());
        } else if (!cancelled && fallbackService) {
          // Slug missing from the DB — static fallback copy still has it
          setService(fallbackService);
        } else if (!cancelled) {
          // Slug missing from the DB - show the not-found state
          setNotFound(true);
        }
      } catch {
        // API unreachable - keep the static fallback rather than an error page
        if (!cancelled && !fallbackService) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  /* GSAP scroll reveals + floating doodles, once the content has loaded */
  useEffect(() => {
    if (loading || notFound) return undefined;
    const cleanupReveals = initScrollReveals(pageRef.current);
    const cleanupFloat = createFloatLoop(pageRef.current, '[data-float]');
    return () => {
      cleanupReveals?.();
      cleanupFloat?.();
    };
  }, [loading, notFound, slug]);

  const breadcrumbItems = service
    ? [
        { label: 'Home', path: '/' },
        { label: 'Services', path: '/services' },
        { label: service.name, path: `/services/${service.slug}` }
      ]
    : [];

  if (loading) {
    return (
      <div className="therapy-detail-page">
        <div className="container section-padding">
          <p className="body-md text-navy-light">Loading service…</p>
        </div>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="therapy-detail-page">
        <div className="container section-padding text-center">
          <h1 className="headline-xl text-navy mb-4">Service not found</h1>
          <p className="body-lg text-navy-light mb-6">
            The page you are looking for does not exist or is no longer available.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate('/services');
              window.scrollTo(0, 0);
            }}
          >
            Browse all services <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const benefits = parseJson(service.benefits, []);
  const paragraphs = String(service.full_description || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  // Key Benefits always appear on the detail page - the services listing no longer
  // carries them, so this is where families see each service's headline features.
  const showIntroBenefits = benefits.length > 0;

  return (
    <div className="therapy-detail-page" ref={pageRef}>
      <StructuredData type="breadcrumb" data={breadcrumbItems} />
      <StructuredData
        type="service"
        data={{
          name: service.name,
          description: service.short_description || '',
          benefits
        }}
      />

      {/* Article-style header, mirrors the blog detail pages (no hero section) */}
      <div className="container" style={{ paddingTop: 'calc(2rem + 104px)' }}>
        <Link to="/services" className="label-md" style={{ color: 'var(--color-primary)' }}>&larr; Back to all services</Link>
      </div>
      <header className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 0' }}>
        <span className="badge badge-sensory" style={{ marginBottom: '1rem', display: 'inline-block' }}>{service.name}</span>
        <h1 className="headline-2xl" style={{ marginBottom: '1rem' }}>{service.hero_title || service.name}</h1>
        {service.short_description && (
          <p className="body-lg text-navy-light" style={{ marginBottom: '2rem' }}>{service.short_description}</p>
        )}
        <div className="blog-post-hero-image" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '3rem' }} data-reveal>
          <img
            src={service.image}
            alt={`${service.name} for children at TheraKids pediatric therapy center, Noida - specialized child therapy services`}
            style={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover' }}
          />
        </div>
      </header>

      {/* Introduction */}
      <section className="therapy-intro" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          <div className="therapy-intro-content" data-reveal>
            <h2 className="headline-xl mb-6">What is {service.name}?</h2>
            {paragraphs.map((paragraph, i) => (
              <p key={i} className={`body-lg ${i === paragraphs.length - 1 ? 'mb-6' : 'mb-4'}`}>
                {paragraph}
              </p>
            ))}
            {paragraphs.length === 0 && <p className="body-lg mb-6">{service.short_description}</p>}
            {showIntroBenefits && (
              <div className="mb-6">
                <h4 className="label-lg mb-3">Key Benefits</h4>
                <ul className="signs-list">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="body-md text-navy-light">
                      <span className="sign-bullet">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                Book an Appointment <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs now live on the home page only, so service pages skip them. */}

      {/* Related Services */}
      <RelatedServices currentService={service.slug} />

      {/* CTA Section */}
      <div className="container pb-12 pt-8 z-10 relative">
        <InlineCTA />
      </div>
    </div>
  );
};

export default ServiceDetail;
