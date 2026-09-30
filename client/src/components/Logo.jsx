import React from 'react';

const Logo = ({ className, white = false }) => (
  <img 
    src={white ? "/logo-white.png" : "/logo.png"} 
    alt="TheraKids Child Development Center logo - pediatric therapy services in Noida" 
    className={className} 
  />
);

export default Logo;
