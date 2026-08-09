import React from 'react';
import './badge.css';

function Badge({ children, variant = 'default', className = '', ...props }) {
  const baseClass = 'badge';
  const variantClass = `badge--${variant}`;

  return (
    <span 
      className={`${baseClass} ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
