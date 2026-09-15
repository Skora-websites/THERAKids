import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import API_URL from '../config';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import './Services.css';

const fallbackServices = [
  { 
    id: 1, 
    name: 'Occupational Therapy', 
    full_description: 'Occupational therapy helps children develop the fine motor, sensory processing, and visual motor skills needed for everyday activities like dressing, writing, and playing.',
    benefits: JSON.stringify(['Fine motor skill development', 'Sensory regulation strategies', 'Self-care independence (dressing, feeding)', 'Hand-eye coordination']),
    image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 2, 
    name: 'Speech Therapy', 
    full_description: 'Our speech-language pathologists support children in developing strong communication skills, addressing articulation, receptive/expressive language, and social pragmatic skills.',
    benefits: JSON.stringify(['Articulation and pronunciation', 'Receptive and expressive language', 'Social communication (pragmatics)', 'Stuttering and fluency support']),
    image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 3, 
    name: 'Special Education', 
    full_description: 'Tailored educational support for children facing learning challenges, focusing on literacy, numeracy, and overall academic readiness.',
    benefits: JSON.stringify(['Individualized Education Plans', 'Literacy and numeracy support', 'Cognitive skill building', 'School readiness']),
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 4, 
    name: 'ABA Therapy', 
    full_description: 'Applied Behavior Analysis (ABA) therapy focuses on improving specific behaviors, such as social skills, communication, reading, and academics as well as adaptive learning skills.',
    benefits: JSON.stringify(['Positive reinforcement', 'Skill acquisition', 'Reducing challenging behaviors', 'Improving attention and focus']),
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 5, 
    name: 'Social Group Training', 
    full_description: 'Structured group sessions that help children prepare for academic and social settings, focusing on peer interaction and play skills.',
    benefits: JSON.stringify(['Peer interaction', 'Turn-taking and sharing', 'Group participation', 'Building friendships']),
    image: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 6, 
    name: 'Behaviour Modification', 
    full_description: 'We utilize evidence-based approaches to support children with emotional regulation, transitions, and developing positive coping mechanisms.',
    benefits: JSON.stringify(['Emotional regulation techniques', 'Managing transitions and routines', 'Reducing anxiety', 'Building positive social interactions']),
    image: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 7, 
    name: 'Parents and Child Counselling', 
    full_description: 'Therapy is a collaborative journey. We provide dedicated counseling sessions for parents to navigate the challenges of raising a child with developmental needs.',
    benefits: JSON.stringify(['Parent education and support', 'Family dynamics guidance', 'Coping strategies for caregivers', 'Individualized Family Service Plans (IFSP)']),
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 8, 
    name: 'Pre-Vocational Training', 
    full_description: 'Programs designed to help older children and adolescents develop practical life skills, independence, and readiness for future vocational opportunities.',
    benefits: JSON.stringify(['Life skills development', 'Task completion and organization', 'Time management', 'Independence building']),
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80'
  }
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services`);
        if (response.ok) {
          const data = await response.json();
          setServices(data.length ? data : fallbackServices);
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
    <div className="services-page">
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
            <div className="services-list">
              {services.map((service, index) => (
                <div key={service.id} className="service-detail-card" id={`service-${service.id}`}>
                  <div className={`service-detail-content ${index % 2 !== 0 ? 'reverse' : ''}`}>
                    <div className="service-text">
                      <h2 className="headline-xl">{service.name}</h2>
                      <p className="body-lg">{service.full_description}</p>
                      
                      <div className="service-benefits">
                        <h4 className="label-lg">Key Benefits:</h4>
                        <ul>
                          {(() => {
                            try {
                              const parsed = JSON.parse(service.benefits || '[]');
                              return parsed.map((benefit, i) => (
                                <li key={i} className="body-sm">{benefit}</li>
                              ));
                            } catch {
                              return null;
                            }
                          })()}
                        </ul>
                      </div>
                    </div>
                    <div className="service-visual">
                       <div className="service-blob">
                         {service.image && <img src={service.image} alt={service.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
          <div className="text-center mb-12">
            <span className="badge badge-sensory">Evaluation</span>
            <h2 className="headline-xl mt-4">Comprehensive Assessments</h2>
            <p className="body-lg max-w-3xl mx-auto mt-4 text-navy-light">
              We conduct thorough evaluations to understand your child's unique needs and create individualized family service plans.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
