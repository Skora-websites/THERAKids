import React from 'react';
import { OFFICIAL_WHATSAPP } from '../lib/contact';
import './WhatsAppButton.css';

/* Floating WhatsApp chat button (bottom-right, site-wide). Opens a chat with
 * the centre's WhatsApp number — the same source of truth the appointment
 * modal hands off to (lib/contact). Pure <a> link: works on a static
 * frontend-only deploy with no backend involved. */
const CHAT_URL = `https://wa.me/${OFFICIAL_WHATSAPP}?text=${encodeURIComponent(
  'Hi TheraKids! I would like to know more about your services.'
)}`;

const WhatsAppButton = () => (
  <a
    className="whatsapp-float"
    href={CHAT_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with TheraKids on WhatsApp"
    title="Chat with us on WhatsApp"
  >
    {/* Official WhatsApp glyph */}
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.46 1.72 6.4L3.2 28.8l6.56-1.68a12.76 12.76 0 0 0 6.24 1.6h.004c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.72-12.8-12.72Zm0 23.36h-.004a10.6 10.6 0 0 1-5.4-1.48l-.388-.23-3.9.998 1.04-3.8-.252-.392a10.56 10.56 0 0 1-1.62-5.656c0-5.864 4.772-10.632 10.64-10.632 2.84 0 5.508 1.108 7.516 3.116a10.56 10.56 0 0 1 3.112 7.52c-.004 5.864-4.772 10.632-10.744 10.632Zm5.836-7.964c-.32-.16-1.892-.932-2.184-1.04-.292-.108-.504-.16-.716.16-.212.32-.824 1.04-1.008 1.252-.188.212-.372.24-.692.08-.32-.16-1.352-.5-2.572-1.592-.952-.848-1.592-1.896-1.78-2.216-.188-.32-.02-.494.14-.652.144-.144.32-.372.48-.558.16-.188.212-.32.32-.532.108-.212.052-.396-.028-.556-.08-.16-.716-1.728-.98-2.364-.258-.62-.52-.536-.716-.544l-.612-.012a1.18 1.18 0 0 0-.852.4c-.292.32-1.116 1.092-1.116 2.66 0 1.568 1.144 3.084 1.304 3.296.16.212 2.248 3.432 5.444 4.812.76.328 1.356.524 1.82.672.764.24 1.456.208 2.004.128.612-.092 1.888-.772 2.156-1.516.268-.744.268-1.38.188-1.516-.08-.132-.292-.212-.612-.372Z" />
    </svg>
    <span className="whatsapp-float-label">Chat with us</span>
  </a>
);

export default WhatsAppButton;
