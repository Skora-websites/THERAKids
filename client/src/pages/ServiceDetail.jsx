import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import InlineCTA from '../components/InlineCTA';
import TiltCard from '../components/TiltCard';
import RelatedServices from '../components/RelatedServices';
import StructuredData from '../components/StructuredData';
import { initScrollReveals, createFloatLoop } from '../lib/motion';
import { setSeo, resetSeo, stripHtml } from '../lib/seo';
import { useAppContext } from '../context/AppContext';
import API_URL from '../config';
import fallbackServices from '../data/fallbackServices';
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

const CloudTop = () => (
  <div className="cloud-divider cloud-top fill-white">
    <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
      <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
    </svg>
  </div>
);

const CloudBottom = () => (
  <div className="cloud-divider cloud-bottom fill-white">
    <svg viewBox="0 0 2400 120" preserveAspectRatio="none">
      <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 C1350,120 1550,0 1800,60 C2050,120 2250,0 2400,60 L2400,120 L0,120 Z" />
    </svg>
  </div>
);

const SectionHeader = ({ section }) => (
  <div className="section-header center mb-12" data-reveal>
    {section.eyebrow && (
      <p className="label-md text-navy uppercase tracking-widest">{section.eyebrow}</p>
    )}
    {section.title && <h2 className="headline-xl text-navy">{section.title}</h2>}
    {(section.subtitle || section.text) && (
      <p className="body-lg text-navy-light max-w-3xl mx-auto mt-4">
        {section.subtitle || section.text}
      </p>
    )}
  </div>
);

// One band per entry of services.page_sections (JSON edited in the admin panel).
// kind: cards | lists | tags | prose
const PageSection = ({ section, service }) => {
  const colored = Boolean(section.bg);
  const className = `therapy-extra section-padding${colored ? ` ${section.bg}` : ''} relative overflow-hidden`;

  if (section.kind === 'cards') {
    return (
      <section className={className}>
        {colored && <CloudTop />}
        <div className="container z-10 relative">
          <SectionHeader section={section} />
          <div className="grid grid-cols-3 gap-6 disorders-grid" data-reveal-group>
            {(section.items || []).map((item, i) => (
              <TiltCard key={i} maxTilt={6}>
                {item.icon ? (
                  <div className="therapy-type-card text-center">
                    <div className="therapy-type-icon">{item.icon}</div>
                    <h3 className="headline-sm text-navy mb-3">{item.title}</h3>
                    <p className="body-sm text-navy-light">{item.text}</p>
                  </div>
                ) : (
                  <div className="disorder-card">
                    <h3 className="headline-sm text-navy mb-3">{item.title}</h3>
                    <p className="body-sm text-navy-light">{item.text}</p>
                  </div>
                )}
              </TiltCard>
            ))}
          </div>
        </div>
        {colored && <CloudBottom />}
      </section>
    );
  }

  if (section.kind === 'lists') {
    return (
      <section className={className}>
        {colored && <CloudTop />}
        <div className="container">
          <div className="grid grid-cols-2 gap-12 signs-grid">
            {(section.blocks || []).map((block, i) => {
              const isCauses = block.bullet === '•';
              return (
                <div key={i} className={isCauses ? 'causes-content' : 'signs-content'} data-reveal>
                  <h2 className="headline-xl text-navy mb-6">{block.title}</h2>
                  <p className="body-lg text-navy-light mb-6">{block.text}</p>
                  <ul className={isCauses ? 'causes-list' : 'signs-list'}>
                    {(block.items || []).map((entry, j) => (
                      <li key={j} className="body-md text-navy-light">
                        <span className={isCauses ? 'cause-bullet' : 'sign-bullet'}>
                          {block.bullet || '✓'}
                        </span>
                        {entry}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        {colored && <CloudBottom />}
      </section>
    );
  }

  if (section.kind === 'tags') {
    return (
      <section className={className}>
        {colored && <CloudTop />}
        <div className="container">
          <div className="grid grid-cols-2 gap-12 conditions-content-grid">
            <div className="conditions-text" data-reveal>
              <h2 className="headline-xl text-navy mb-6">{section.title}</h2>
              <p className="body-lg text-navy-light mb-8">{section.text}</p>
              <div className="conditions-tags">
                {(section.items || []).map((tag, i) => (
                  <span key={i} className="condition-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="conditions-visual" data-reveal>
              <div className="therapy-blob-mask">
                <img src={service.image} alt={`${service.name} at THERAKids`} />
              </div>
            </div>
          </div>
        </div>
        {colored && <CloudBottom />}
      </section>
    );
  }

  if (section.kind === 'prose') {
    return (
      <section className={className}>
        {colored && <CloudTop />}
        <div className="container z-10 relative">
          <SectionHeader section={section} />
          <div
            className="container max-w-3xl mx-auto"
            data-reveal
            dangerouslySetInnerHTML={{ __html: section.html || '' }}
          />
        </div>
        {colored && <CloudBottom />}
      </section>
    );
  }

  return null;
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setIsModalOpen } = useAppContext();
  const pageRef = useRef(null);
  const faqRef = useRef(null);

  const [service, setService] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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
        const [serviceRes, faqRes] = await Promise.all([
          fetch(`${API_URL}/api/services/${slug}`),
          fetch(`${API_URL}/api/faqs?page=${encodeURIComponent(slug)}`)
        ]);
        if (cancelled) return;
        if (serviceRes.ok) {
          setService(await serviceRes.json());
        } else {
          // Slug missing from the DB - fall back to the static content below so
          // the page still renders on a backend-less (static) deploy.
          const staticService = fallbackServices.find((s) => s.slug === slug);
          if (staticService) {
            setService(staticService);
          } else {
            setNotFound(true);
          }
        }
        if (faqRes.ok) setFaqs(await faqRes.json());
      } catch {
        // API unreachable - render the static service data rather than a blank page
        const staticService = fallbackServices.find((s) => s.slug === slug);
        if (staticService) {
          setService(staticService);
        } else if (!cancelled) {
          setNotFound(true);
        }
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
  const sections = parseJson(service.page_sections, []);
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
            alt={`${service.name} at THERAKids`}
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

      {/* Admin-managed content bands (services.page_sections) */}
      {sections.map((section, i) => (
        <PageSection key={i} section={section} service={service} />
      ))}

      {/* FAQs (admin-managed per page) */}
      {faqs.length > 0 && (
        <section
          className="therapy-faq section-padding bg-pastel-lilac relative overflow-hidden"
          ref={faqRef}
        >
          <CloudTop />
          <div className="container z-10 relative">
            <div className="section-header center mb-12" data-reveal>
              <p className="label-md text-navy uppercase tracking-widest">Got Questions?</p>
              <h2 className="headline-xl text-navy">Frequently Asked Questions</h2>
            </div>
            <div className="faq-list" data-reveal-group>
              {faqs.map((faq) => (
                <div key={faq.id} className={`faq-item ${openFaq === faq.id ? 'open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  >
                    <span className="faq-question-text headline-sm text-navy">{faq.question}</span>
                    <span className="faq-toggle">
                      {openFaq === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p className="body-md text-navy-light">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CloudBottom />
        </section>
      )}

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
