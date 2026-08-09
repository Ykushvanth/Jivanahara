import React from 'react';
import './button.css';

function Button({ 
  children, 
  variant = 'default', 
  size = 'default',
  className = '',
  asChild = false,
  ...props 
}) {
  const baseClass = 'button';
  const variantClass = `button--${variant}`;
  const sizeClass = `button--${size}`;
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${baseClass} ${variantClass} ${sizeClass} ${className} ${children.props.className || ''}`.trim(),
      ...props
    });
  }

  return (
    <button 
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
