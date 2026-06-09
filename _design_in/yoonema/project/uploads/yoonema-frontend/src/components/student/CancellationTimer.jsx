import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/Button';

export default function CancellationTimer({ orderCreatedAt, windowMinutes = 5, onExpire, onCancel }) {
  const expiresAt = useMemo(() => new Date(new Date(orderCreatedAt).getTime() + windowMinutes * 60 * 1000), [orderCreatedAt, windowMinutes]);
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt.getTime() - Date.now()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = Math.max(0, expiresAt.getTime() - Date.now());
      setRemaining(next);

      if (next <= 0) {
        window.clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt, onExpire]);

  if (remaining <= 0) {
    return null;
  }

  const total = windowMinutes * 60 * 1000;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
  const percent = Math.max(0, Math.min(100, (remaining / total) * 100));

  return (
    <div className="rounded-lg border border-red-100 bg-red-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-red-700">Annulation possible encore {minutes}:{seconds}</p>
        <Button size="sm" variant="danger" onClick={onCancel}>
          Annuler la commande
        </Button>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-red-100">
        <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
