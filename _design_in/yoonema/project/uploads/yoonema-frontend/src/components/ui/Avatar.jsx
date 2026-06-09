import React from 'react';
import { Icon } from './Icon';

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

const iconSize = { sm: 16, md: 22, lg: 28, xl: 34 };

export function Avatar({ src, alt = '', name, size = 'md', className = '' }) {
  const base = `${sizes[size]} rounded-full object-cover ${className}`;

  if (src) {
    return <img src={src} alt={alt} className={base} />;
  }

  const initial = (name || alt || '').trim().charAt(0);

  return (
    <span
      className={`${sizes[size]} grid place-items-center rounded-full bg-orange-100 font-bold uppercase text-orange-700 ${className}`}
      aria-label={alt || name || 'Avatar'}
    >
      {initial ? initial : <Icon name="user" size={iconSize[size]} />}
    </span>
  );
}

export default Avatar;
