import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const WaveDivider = () => {
  const wave1Ref = useRef(null);
  const wave2Ref = useRef(null);
  const wave3Ref = useRef(null);

  useEffect(() => {
    // Continuous flowing animation for waves using GSAP
    // We translate the paths horizontally. The paths need to be wide enough to seamlessly loop.
    
    gsap.to(wave1Ref.current, {
      x: "-50%", // Assuming SVG paths are 200% wide for looping
      ease: "none",
      duration: 15,
      repeat: -1
    });

    gsap.to(wave2Ref.current, {
      x: "-50%",
      ease: "none",
      duration: 20,
      repeat: -1
    });

    gsap.to(wave3Ref.current, {
      x: "-50%",
      ease: "none",
      duration: 25,
      repeat: -1
    });
  }, []);

  return (
    <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, position: 'relative' }}>
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        style={{ width: '200%', height: '120px', transform: 'rotate(180deg)' }}
      >
        {/* Layer 3 - Lightest / Slowest */}
        <path 
          ref={wave3Ref}
          d="M0,40 C150,80 300,0 450,40 C600,80 750,0 900,40 C1050,80 1200,40 1200,40 L1200,120 L0,120 Z M1200,40 C1350,80 1500,0 1650,40 C1800,80 1950,0 2100,40 C2250,80 2400,40 2400,40 L2400,120 L1200,120 Z"
          fill="var(--color-surface-container)" 
        />
        {/* Layer 2 - Medium */}
        <path 
          ref={wave2Ref}
          d="M0,60 C200,10 400,110 600,60 C800,10 1000,110 1200,60 L1200,120 L0,120 Z M1200,60 C1400,10 1600,110 1800,60 C2000,10 2200,110 2400,60 L2400,120 L1200,120 Z"
          fill="var(--color-surface-container-high)" 
        />
        {/* Layer 1 - Darkest / Fastest */}
        <path 
          ref={wave1Ref}
          d="M0,80 C150,120 350,20 600,80 C850,140 1050,20 1200,80 L1200,120 L0,120 Z M1200,80 C1350,120 1550,20 1800,80 C2050,140 2250,20 2400,80 L2400,120 L1200,120 Z"
          fill="var(--color-surface-tint)" 
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
