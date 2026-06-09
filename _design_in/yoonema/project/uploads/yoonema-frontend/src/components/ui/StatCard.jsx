import React from 'react';
import { Icon } from './Icon';

const tones = {
  brand: 'bg-orange-50 text-orange-600',
  success: 'bg-success-50 text-success-600',
  info: 'bg-info-50 text-info-600',
  warning: 'bg-warning-50 text-warning-600',
  gray: 'bg-gray-100 text-gray-600',
};

export function StatCard({ icon, label, value, hint, tone = 'brand', loading = false }) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && (
          <span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone] || tones.brand}`}>
            <Icon name={icon} size={18} strokeWidth={2} />
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
        {loading ? <span className="inline-block h-7 w-16 animate-pulse rounded bg-gray-100" /> : value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export default StatCard;
