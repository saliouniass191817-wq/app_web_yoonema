import React from 'react';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';

export function OrderCard({ order, onClick }) {
  const statusMap = {
    pending: { label: 'En attente', color: 'warning' },
    confirmed: { label: 'Confirmée', color: 'info' },
    preparing: { label: 'En préparation', color: 'info' },
    ready: { label: 'Prête', color: 'success' },
    delivering: { label: 'En livraison', color: 'info' },
    delivered: { label: 'Livrée', color: 'success' },
    cancelled: { label: 'Annulée', color: 'error' },
  };

  const status = statusMap[order.status] || { label: order.status, color: 'default' };

  return (
    <Card
      onClick={onClick}
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
    >
      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{order.restaurant_name}</h3>
            <p className="text-gray-600 text-sm">{formatDate(order.created_at)}</p>
          </div>
          <Badge variant={status.color}>{status.label}</Badge>
        </div>

        <div className="space-y-2 mb-3">
          <p className="text-gray-700">
            Livraison: <span className="font-semibold">{order.delivery_address}</span>
          </p>
          <p className="text-gray-700">
            Montant: <span className="font-semibold text-orange-500">
              {formatCurrency(order.total_amount + (order.delivery_fee || 0))}
            </span>
          </p>
        </div>

        <p className="text-gray-600 text-sm">
          {Array.isArray(order.items) ? order.items.length : 0} article(s)
        </p>
      </CardBody>
    </Card>
  );
}
