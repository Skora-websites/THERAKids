import React, { useEffect, useRef } from 'react';
import './TiltCard.css';

/**
 * TiltCard — wraps content in a card that tilts 3D toward the mouse.
 * - <TiltCard>{children}</TiltCard> renders as a static wrapper under reduced motion (CSS).
 * - className is forwarded to the tilt element (use it for layout classes like h-full).
 * - style is forwarded too.
 * The child supplies its own visuals (background, padding, shadow) — TiltCard only
 * adds perspective, tilt, and a moving shine.
 *
 * Pointer moves are rAF-throttled and written straight to the DOM. No React state
 * update per mousemove — heavy children (gradient cards, inline SVGs) used to be
 * re-rendered ~120x/second, which made the hover animation stutter and glitch.
 */
const TiltCard = ({ children, className = '', style, maxTilt = 10 }) => {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const shineRef = useRef(null);
  const frameRef = useRef(0);
  const posRef = useRef({ rx: 0, ry: 0, mx: 50, my: 50 });

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  // Flush the latest pointer position to the DOM on the next animation frame.
  const paint = () => {
    frameRef.current = 0;
    const { rx, ry, mx, my } = posRef.current;
    if (innerRef.current) {
      innerRef.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    }
    if (shineRef.current) {
      shineRef.current.style.background = `radial-gradient(420px circle at ${mx}% ${my}%, rgba(255,255,255,0.35), transparent 45%)`;
    }
  };

  const schedule = () => {
    if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);
  };

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    posRef.current = {
      rx: (0.5 - py) * maxTilt * 2,
      ry: (px - 0.5) * maxTilt * 2,
      mx: px * 100,
      my: py * 100
    };
    schedule();
  };

  const onEnter = () => {
    if (innerRef.current) innerRef.current.style.transition = 'transform 0.06s linear';
    if (shineRef.current) shineRef.current.style.opacity = '1';
  };

  const onLeave = () => {
    posRef.current = { ...posRef.current, rx: 0, ry: 0 };
    if (innerRef.current) innerRef.current.style.transition = 'transform 0.5s ease';
    if (shineRef.current) shineRef.current.style.opacity = '0';
    schedule();
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      style={style}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div ref={innerRef} className="tilt-inner">
        {children}
        <span ref={shineRef} className="tilt-shine" aria-hidden="true" />
      </div>
    </div>
  );
};

export default TiltCard;
