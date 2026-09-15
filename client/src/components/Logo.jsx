import React from 'react';

const Logo = ({ className, white = false }) => (
  <img 
    src={white ? "/logo-white.png" : "/logo.png"} 
    alt="THERAKids Logo" 
    className={className} 
  />
);

export default Logo;
