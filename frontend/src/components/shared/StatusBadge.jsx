import React from 'react';
import { Badge } from '../ui/Badge';

export function StatusBadge({ status }) {
  const statusMap = {
    pending: { label: 'En attente', color: 'warning' },
    confirmed: { label: 'Confirmée', color: 'info' },
    preparing: { label: 'En préparation', color: 'info' },
    ready: { label: 'Prête', color: 'success' },
    delivering: { label: 'En livraison', color: 'info' },
    delivered: { label: 'Livrée', color: 'success' },
    cancelled: { label: 'Annulée', color: 'error' },
  };

  const mapping = statusMap[status] || { label: status, color: 'default' };

  return <Badge variant={mapping.color}>{mapping.label}</Badge>;
}
