import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import API_URL from '../config';
import InlineCTA from '../components/InlineCTA';
import PageHero from '../components/PageHero';
import { initScrollReveals, createFloatLoop } from '../lib/motion';
import { Sparkle } from '../components/doodles/Doodles';
import './Services.css';

// Map service names to their detail page paths
const serviceDetailLinks = {
  'Speech Therapy': '/services/speech-therapy',
  'Occupational Therapy': '/services/occupational-therapy',
  'Physical Therapy': '/services/physical-therapy'
};

const fallbackServices = [
  { 
    id: 1, 
    name: 'Occupational Therapy', 
    full_description: 'Occupational therapy is an exercise that helps an individual to alter his awkward behaviour. Our occupational therapists keep records of every child\'s improvement. Activities of everyday life may be difficult for some people — that\'s why we have this service. Under this therapy, a person can learn to perform various activities including self-feeding, bathing, crawling, and more. This process enables children to develop confidence in various activities, learn to communicate, be creative, walk properly, and act nicely in a crunch situation. Occupational therapy can bring an impressive change in a child\'s personality, helping them control their anger and be friendly to others.',
    benefits: JSON.stringify(['Fine motor skill development', 'Sensory regulation strategies', 'Self-care independence (dressing, feeding)', 'Hand-eye coordination', 'Gross motor skill development', 'Social engagement improvement']),
    image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 2, 
    name: 'Speech Therapy', 
    full_description: 'Our speech-language pathologists are keen on helping kids who have speaking problems. Speaking is an essential part of human nature — through speaking, we can describe our deepest emotions to others. With this therapy, kids learn to speak difficult words, express new thoughts and ideas, and develop very good conversation skills. One more quality our speech therapists have is that they also have a solution for children who have difficulties in swallowing food or water. With great speaking ability, they can profoundly connect with society without any shame.',
    benefits: JSON.stringify(['Articulation and pronunciation', 'Receptive and expressive language', 'Social communication (pragmatics)', 'Stuttering and fluency support', 'Oral-motor and feeding therapy', 'Cognitive communication skills']),
    image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 3, 
    name: 'Special Education', 
    full_description: 'Apart from play, exercises, and many other activities, we also play a vital role in educating children. Our management group will keep your kid\'s studies on track and give strict attention to how he is doing and how much improvement is still required. Education is vital for every individual, even for children with disabilities. Our remedial intervention helps children learn to read, write, and do calculations in a specialized environment with small group sizes for better attention and support.',
    benefits: JSON.stringify(['Individualized Education Plans', 'Literacy and numeracy support', 'Cognitive skill building', 'School readiness', 'Small group learning', 'Specialized teaching methods']),
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 4, 
    name: 'Physical Therapy', 
    full_description: 'Physical therapy is known as proper management given to a person to overcome a critical physical condition. We work hard on every child in making them a good personality who can work and act independently in any situation. Our paediatric physical therapists bring children to proper activities like stretching, running, jumping, and more. They give good concentration in making a kid go free from all the muscular pain and increase their ease of movement. Physical therapists also take the help of technologies to treat certain conditions related to genetics, orthopaedic disorders, and walking disorders.',
    benefits: JSON.stringify(['Mobility improvement', 'Muscle strengthening', 'Balance and coordination', 'Pain relief through exercise', 'Walking and running support', 'Orthopaedic rehabilitation']),
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 5, 
    name: 'Personal Counselling', 
    full_description: 'Before acting towards any child, we let them go through a proper counselling period. Our team surveys their conditions and problems and then as per their requirements we proceed with our work. Through counselling we provide better security and a better future for kids. Counselling is crucial as it allows an individual to express their problems or any difficulty they are facing. This method works well as it opens for us to understand the critical condition of children. Children will get the confidence to fight with their disabilities and gain high hope, encouragement, and motivation.',
    benefits: JSON.stringify(['Emotional support and guidance', 'Confidence building', 'Parent education and support', 'Family dynamics guidance', 'Coping strategies for caregivers', 'Motivation and encouragement']),
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 6, 
    name: 'Behaviour Modification', 
    full_description: 'We utilize evidence-based approaches to support children with emotional regulation, transitions, and developing positive coping mechanisms. Our therapists work to understand the root causes of behavioural challenges and develop customized intervention plans that promote positive behaviour changes.',
    benefits: JSON.stringify(['Emotional regulation techniques', 'Managing transitions and routines', 'Reducing anxiety', 'Building positive social interactions', 'Customized behaviour plans', 'Positive reinforcement strategies']),
    image: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 7, 
    name: 'Social Group Training', 
    full_description: 'Structured group sessions that help children prepare for academic and social settings, focusing on peer interaction and play skills. Children learn to interact with others, develop friendships, and build the social confidence needed for school and community settings.',
    benefits: JSON.stringify(['Peer interaction', 'Turn-taking and sharing', 'Group participation', 'Building friendships', 'Social confidence', 'Play-based learning']),
    image: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 8, 
    name: 'Pre-Vocational Training', 
    full_description: 'Programs designed to help older children and adolescents develop practical life skills, independence, and readiness for future vocational opportunities. We focus on teaching functional skills that enable individuals to become more self-sufficient and prepared for adult life.',
    benefits: JSON.stringify(['Life skills development', 'Task completion and organization', 'Time management', 'Independence building', 'Workplace readiness', 'Community participation skills']),
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80'
  }
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);
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
                            // DB rows carry a real JSON array; fallbacks carry a JSON string.
                            let parsed = service.benefits;
                            if (typeof parsed === 'string') {
                              try { parsed = JSON.parse(parsed); } catch { parsed = []; }
                            }
                            return (Array.isArray(parsed) ? parsed : []).map((benefit, i) => (
                              <li key={i} className="body-sm">{benefit}</li>
                            ));
                          })()}
                        </ul>
                      </div>
                      {serviceDetailLinks[service.name] && (
                        <button
                          className="btn btn-outline border-navy text-navy mt-4"
                          onClick={() => {
                            navigate(serviceDetailLinks[service.name]);
                            window.scrollTo(0, 0);
                          }}
                        >
                          Learn More <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                    <div className="service-visual">
                       <div className="service-blob">
                         {service.image && <img src={service.image} alt={service.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
                       </div>
                       <Sparkle className="service-card-sparkle" data-float />
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
