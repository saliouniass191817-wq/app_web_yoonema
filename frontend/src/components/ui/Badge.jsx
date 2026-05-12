import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-200 text-gray-900',
    success: 'bg-green-100 text-green-900',
    error: 'bg-red-100 text-red-900',
    warning: 'bg-yellow-100 text-yellow-900',
    info: 'bg-blue-100 text-blue-900',
    orange: 'bg-orange-100 text-orange-900',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
