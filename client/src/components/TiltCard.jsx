import React, { useRef, useState } from 'react';
import './TiltCard.css';

/**
 * TiltCard — wraps content in a card that tilts in 3D toward the mouse.
 * - <TiltCard>{children}</TiltCard> renders a plain div when reduced motion is preferred.
 * - className is forwarded to the tilt element (use it for layout classes like h-full).
 * - style is forwarded too.
 * The child supplies its own visuals (background, padding, shadow) — TiltCard only
 * adds perspective, tilt, and a moving shine.
 */
const TiltCard = ({ children, className = '', style, maxTilt = 10 }) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * maxTilt * 2,
      ry: (px - 0.5) * maxTilt * 2,
      mx: px * 100,
      my: py * 100,
      active: true
    });
  };

  const onLeave = () => setTilt((t) => ({ ...t, rx: 0, ry: 0, active: false }));

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="tilt-inner"
        style={{
          transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
          transition: tilt.active ? 'transform 0.06s linear' : 'transform 0.5s ease'
        }}
      >
        {children}
        <span
          className="tilt-shine"
          style={{
            opacity: tilt.active ? 1 : 0,
            background: `radial-gradient(420px circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.35), transparent 45%)`
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default TiltCard;
