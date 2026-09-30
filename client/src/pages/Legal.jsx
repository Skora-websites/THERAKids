import React from 'react';
import PageHero from '../components/PageHero';
import { usePageSeo } from '../hooks/usePageSeo';
import { useAppContext } from '../context/AppContext';
import { CONTACT_FALLBACKS, OFFICIAL_PHONES } from '../lib/contact';
import './Legal.css';

const lastUpdated = 'September 29, 2026';

/* Table of contents - each entry anchors to a section below. */
const SECTIONS = [
  ['website-terms', 'Website Terms of Use'],
  ['privacy-policy', 'Privacy Policy'],
  ['data-collection', 'Data Collection'],
  ['consent', 'Consent'],
  ['newsletter', 'Newsletter Subscription'],
  ['free-screening', 'Free Screening / Assessment'],
  ['therapy-disclaimers', 'Therapy-Related Disclaimers'],
  ['online-therapy', 'Online Therapy Terms'],
  ['cancellations', 'Cancellation & Rescheduling'],
  ['payments', 'Payment & Refund Terms'],
  ['appointments', 'Appointment Terms'],
  ['user-responsibilities', 'User Responsibilities'],
  ['liability', 'Limitation of Liability'],
  ['third-party', 'Third-Party Services'],
  ['children-data', "Children's Data & Privacy"],
  ['communication-consent', 'Communication & WhatsApp Consent'],
  ['intellectual-property', 'Intellectual Property'],
  ['changes', 'Changes to These Terms'],
  ['contact', 'Contact Information'],
];

const Legal = () => {
  usePageSeo('/legal', {
    title: 'Legal / Terms & Conditions | TheraKids Noida',
    description:
      'TheraKids Noida legal hub: terms of use, privacy policy, data collection and consent, free screening and online therapy terms, cancellation, payment and refund terms, and children\u2019s privacy.',
    keywords:
      'therakids noida terms and conditions, privacy policy, online therapy terms, free screening assessment, cancellation refund policy',
  });

  const { settings } = useAppContext();
  const email = settings.email || CONTACT_FALLBACKS.email;

  return (
    <div className="legal-page">
      <PageHero
        bg="bg-pastel-lilac"
        eyebrow="Legal"
        title="Terms & Policies."
        subtitle="Everything you need to know about using this website and engaging with TheraKids services."
      />

      <section className="legal-content section-padding">
        <div className="container legal-layout">
          {/* Sticky table of contents */}
          <nav className="legal-toc" aria-label="Legal sections">
            <p className="label-sm legal-toc-title">On this page</p>
            <ol>
              {SECTIONS.map(([id, label], i) => (
                <li key={id}>
                  <a href={`#${id}`}>{i + 1}. {label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-body">
            <p className="legal-updated label-sm">Last updated: {lastUpdated}</p>

            <h2 id="website-terms">1. Website Terms of Use</h2>
            <p>
              Welcome to TheraKids. By accessing <a href="https://therakidsnoida.com">therakidsnoida.com</a> (the
              &ldquo;Website&rdquo;) or using any of its features, you agree to these Terms &amp; Conditions and our
              Privacy Policy. If you do not agree, please do not use the Website. We may update these terms from time
              to time; the current version is always available on this page, and continued use after changes means you
              accept the updated terms.
            </p>

            <h2 id="privacy-policy">2. Privacy Policy</h2>
            <p>
              We respect your privacy and are committed to protecting the personal information you share with us. This
              section, together with the sections below, explains what we collect, how we use it, and the choices
              available to you. We collect information only when you provide it voluntarily — for example through our
              contact form, appointment requests, the newsletter, or the free screening / assessment form.
            </p>

            <h2 id="data-collection">3. Data Collection</h2>
            <ul>
              <li>
                <strong>Contact form &amp; appointment requests:</strong> your name, your child&rsquo;s name and age,
                phone number, email address, preferred date/time, and any additional information you choose to share.
              </li>
              <li>
                <strong>Newsletter subscription:</strong> your email address, collected only when you opt in.
              </li>
              <li>
                <strong>Free screening / assessment &amp; online therapy forms:</strong> basic parent/child details
                submitted through Google Forms, handled directly by our reception team (see sections 6, 8 and 14).
              </li>
              <li>
                <strong>Basic usage data:</strong> standard technical logs (browser type, pages visited) used only to
                keep the Website working well.
              </li>
            </ul>

            <h2 id="consent">4. Consent</h2>
            <p>
              By submitting any form on this Website you consent to us using the information you provide to respond to
              your enquiry and manage your engagement with TheraKids. For newsletters and marketing communication we
              ask for your explicit opt-in (a checkbox you actively tick). You may withdraw consent at any time by
              writing to us (see section 19) — withdrawal does not affect the lawfulness of processing already carried
              out.
            </p>

            <h2 id="newsletter">5. Newsletter Subscription</h2>
            <p>
              Our &ldquo;Stay Updated&rdquo; newsletter shares occasional notes on child development, early milestones
              and upcoming programs. Subscriptions are handled through Google&rsquo;s infrastructure (Google Sheets via
              Google Apps Script) and are <strong>not stored on this Website&rsquo;s server or database</strong>. Every
              email we send is an update you opted into. You can unsubscribe at any time by replying to any email or
              writing to us, and we will remove your address promptly.
            </p>

            <h2 id="free-screening">6. Free Screening / Assessment</h2>
            <p>
              The free initial screening offered through this Website is a brief, preliminary observation intended to
              identify whether a fuller evaluation may be helpful. It is <strong>not a diagnosis</strong> and does not
              establish a therapist–patient relationship. Submission of the screening form does not guarantee a slot;
              our reception team will contact you to schedule. Based on the screening, our team may recommend a paid
              full assessment before any therapy plan is made. Results and recommendations are shared in person or by
              phone and remain confidential.
            </p>

            <h2 id="therapy-disclaimers">7. Therapy-Related Disclaimers</h2>
            <p>
              Content on this Website — including blog posts and service descriptions — is for general information
              only and is not a substitute for professional medical advice, diagnosis or treatment. Every child&rsquo;s
              needs are different; always consult a qualified therapist or physician before acting on anything you
              read here. Never disregard professional medical advice or delay seeking it because of something on this
              Website. Clinical outcomes depend on many factors and cannot be guaranteed by any statement on this
              Website.
            </p>

            <h2 id="online-therapy">8. Online Therapy Terms</h2>
            <p>
              Where therapy sessions are conducted online (video or tele-therapy): (a) sessions are delivered by
              qualified TheraKids therapists; (b) a stable internet connection and a suitable, private space are the
              participant&rsquo;s responsibility; (c) online sessions may not be appropriate for every child or every
              concern, and our therapists may recommend in-person sessions where clinically appropriate; (d) online
              sessions are not for emergencies — if your child is in crisis or danger, contact local emergency
              services immediately; (e) recording of sessions requires prior written consent from both the therapist
              and the parent/guardian.
            </p>

            <h2 id="cancellations">9. Cancellation &amp; Rescheduling</h2>
            <p>
              Session fees, packages and the applicable cancellation/rescheduling windows are shared at the time of
              booking and are governed by the centre&rsquo;s written policy. As a general guide, we request at least
              24 hours&rsquo; notice for cancellations or rescheduling; sessions cancelled with shorter notice may be
              charged. Repeated no-shows may affect future priority booking. Website content does not constitute a
              cancellation-policy commitment.
            </p>

            <h2 id="payments">10. Payment &amp; Refund Terms</h2>
            <p>
              Fees for assessments, therapy packages and programs are communicated before commencement and are payable
              per the centre&rsquo;s invoicing policy. Payments made for completed sessions, assessments or partial
              packages are non-refundable. Refund requests for prepaid but undelivered services are considered on a
              case-by-case basis at management&rsquo;s discretion and, where approved, are processed within a
              reasonable time to the original payment method. Website content does not constitute a price commitment.
            </p>

            <h2 id="appointments">11. Appointment Terms</h2>
            <p>
              Appointment requests submitted through this Website (including the booking modal and WhatsApp handoff)
              are <strong>requests only</strong>. A session is confirmed only after a member of our team contacts you
              and confirms the slot. We may suggest an alternative time, centre or therapist based on availability and
              your child&rsquo;s needs. Arriving significantly late may shorten the session so that the next family is
              not kept waiting.
            </p>

            <h2 id="user-responsibilities">12. User Responsibilities</h2>
            <ul>
              <li>Provide accurate, current information in forms and bookings.</li>
              <li>
                Share only information about a child that you are legally entitled to share (i.e. you are the
                parent or legal guardian, or have their authorization).
              </li>
              <li>Use the Website lawfully and not attempt to disrupt, scrape or misuse it.</li>
              <li>
                Attend sessions on time and participate in the home-practice guidance our therapists provide —
                therapy outcomes depend heavily on family participation.
              </li>
            </ul>

            <h2 id="liability">13. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, TheraKids is not liable for indirect, incidental or
              consequential losses arising from use of this Website. Nothing on this Website creates any warranty,
              express or implied. Clinical outcomes depend on many factors and cannot be guaranteed. Nothing in these
              terms excludes liability that cannot be excluded under applicable Indian law.
            </p>

            <h2 id="third-party">14. Third-Party Services</h2>
            <p>
              This Website relies on and links to third-party services, including Google Forms (screening/assessment
              intake), Google Maps (location links), WhatsApp (appointment handoff), Google Sheets/Apps Script
              (newsletter) and our social media pages. Those platforms operate under their own privacy policies and
              terms, and we are not responsible for their practices once you interact with them. Media and partner
              names and logos displayed in the footer belong to their respective owners.
            </p>

            <h2 id="children-data">15. Children&rsquo;s Data &amp; Privacy</h2>
            <p>
              We collect information about children only from a parent or legal guardian, and only as needed to plan
              appropriate therapy or respond to an enquiry. Access to submitted appointment requests, screening forms
              and messages is restricted to authorised TheraKids clinical and administrative staff (including the
              reception team that handles the screening funnel). We keep children&rsquo;s records only as long as
              needed to provide services or as required by law, and parents/guardians may request access to,
              correction of, or deletion of their child&rsquo;s records at any time.
            </p>

            <h2 id="communication-consent">16. Communication &amp; WhatsApp Consent</h2>
            <p>
              When you submit a contact form, appointment request or screening form, you consent to being contacted by
              TheraKids on the phone number and email you provide — including via <strong>WhatsApp</strong>, which we
              use for appointment confirmations, reminders and coordination. By providing a phone number you confirm
              it belongs to you (or the child&rsquo;s guardian) and agree to receive service-related messages on it.
              You can opt out of WhatsApp or email communication at any time by telling our team or writing to us.
            </p>

            <h2 id="intellectual-property">17. Intellectual Property</h2>
            <p>
              All content on this Website — text, graphics, logos, images and the TheraKids name — belongs to
              TheraKids Foundation or its licensors and may not be copied, reproduced or used commercially without
              written permission. Third-party names and logos (including media partners) belong to their respective
              owners.
            </p>

            <h2 id="changes">18. Changes to These Terms</h2>
            <p>
              We may update these Terms &amp; Policies from time to time to reflect changes in our services or legal
              requirements. The current version will always be on this page with the &ldquo;Last updated&rdquo; date
              above. Material changes will be highlighted on this page, and continuing to use the Website after
              changes take effect constitutes acceptance.
            </p>

            <h2 id="contact">19. Contact Information for Privacy / Legal Queries</h2>
            <p>
              For any question, request or complaint about these terms, your data, or your child&rsquo;s records:
            </p>
            <ul>
              <li>
                Email: <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                Phone:{' '}
                {OFFICIAL_PHONES.map((p, i) => (
                  <React.Fragment key={p.tel}>
                    {i > 0 && ' / '}
                    <a href={`tel:${p.tel}`}>{p.display}</a>
                  </React.Fragment>
                ))}
              </li>
              <li>
                In person: Noida Center — G-10, Block G, Sector 22, Noida, Uttar Pradesh 201301
              </li>
            </ul>
            <p>
              These terms are governed by the laws of India, with jurisdiction at the courts of Gautam Buddha Nagar,
              Uttar Pradesh.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Legal;
