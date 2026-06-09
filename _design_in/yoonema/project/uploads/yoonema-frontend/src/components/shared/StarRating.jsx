import React from 'react';

export function StarRating({ rating = 0, onRate = null, size = 'md' }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate?.(star)}
          className={`${sizeMap[size]} transition-transform hover:scale-110`}
          disabled={!onRate}
        >
          {star <= rating ? (
            <span className="text-yellow-500 text-2xl">★</span>
          ) : (
            <span className="text-gray-300 text-2xl">★</span>
          )}
        </button>
      ))}
    </div>
  );
}
