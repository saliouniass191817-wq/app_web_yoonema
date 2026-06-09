import React from 'react';

export function Badge({ children, variant = 'default', dot = false, className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 ring-gray-200',
    success: 'bg-success-50 text-success-700 ring-success-100',
    error:   'bg-danger-50 text-danger-700 ring-danger-100',
    warning: 'bg-warning-50 text-warning-700 ring-warning-100',
    info:    'bg-info-50 text-info-700 ring-info-100',
    orange:  'bg-orange-50 text-orange-700 ring-orange-100',
  };

  const dotColors = {
    default: 'bg-gray-400',
    success: 'bg-success-500',
    error: 'bg-danger-500',
    warning: 'bg-warning-500',
    info: 'bg-info-500',
    orange: 'bg-orange-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${variants[variant] || variants.default} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />}
      {children}
    </span>
  );
}

export default Badge;
