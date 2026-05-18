import React from 'react';
import { Badge } from '../ui/Badge';

export function StatusBadge({ status }) {
  const statusMap = {
    pending: { label: 'En attente', color: 'warning' },
    confirmed: { label: 'Confirmée', color: 'info' },
    delivering: { label: 'En livraison', color: 'info' },
    delivered: { label: 'Livrée', color: 'success' },
    refused: { label: 'Refusée', color: 'error' },
    cancelled: { label: 'Annulée', color: 'error' },
    expired: { label: 'Expirée', color: 'error' },
  };

  const mapping = statusMap[status] || { label: status, color: 'default' };

  return <Badge variant={mapping.color}>{mapping.label}</Badge>;
}
