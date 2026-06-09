import React from 'react';

export function Card({ children, className = '', interactive = false, style, ...props }) {
  return (
    <div
      className={`card ${interactive ? 'transition-transform duration-300 ease-out-expo hover:-translate-y-1' : ''} ${className}`}
      style={interactive ? { transition: 'transform .3s, box-shadow .3s', ...style } : style}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 md:px-6 ${className}`} style={{ borderBottom: '1px solid var(--hairline-2)' }}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-5 py-5 md:px-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 md:px-6 ${className}`} style={{ borderTop: '1px solid var(--hairline-2)' }}>
      {children}
    </div>
  );
}

export default Card;
