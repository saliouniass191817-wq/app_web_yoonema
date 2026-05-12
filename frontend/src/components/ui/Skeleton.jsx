import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <Skeleton className="h-48 w-full mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
