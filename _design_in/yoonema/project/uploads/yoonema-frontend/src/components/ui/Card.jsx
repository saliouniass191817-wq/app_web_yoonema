import React from 'react';

export function Card({ children, className = '', interactive = false, ...props }) {
  return (
    <div
      className={
        `bg-white rounded-2xl border border-gray-200/80 shadow-card ${
          interactive
            ? 'transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-card-hover'
            : ''
        } ${className}`
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-b border-gray-200/70 md:px-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-5 py-5 md:px-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-t border-gray-200/70 md:px-6 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
