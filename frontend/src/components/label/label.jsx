import React from 'react';
import './label.css';

const Label = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={`label ${className}`.trim()}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = 'Label';

export default Label;
