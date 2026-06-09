import React from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

export function EmptyState({ icon = 'search', title, subtitle, actionLabel, onAction }) {
  // Accept either an Icon name ("bike", "bag"…) or a legacy emoji string.
  const isIconName = typeof icon === 'string' && /^[a-zA-Z]+$/.test(icon);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-orange-50 text-orange-500">
        {isIconName ? <Icon name={icon} size={28} /> : <span className="text-3xl">{icon}</span>}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {subtitle && <p className="mt-1.5 max-w-sm text-sm text-gray-500">{subtitle}</p>}
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
