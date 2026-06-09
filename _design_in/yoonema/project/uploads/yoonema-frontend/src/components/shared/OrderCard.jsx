import React from 'react';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '../../lib/utils';

export function OrderCard({ order, onClick }) {
  const itemCount = Array.isArray(order.items) ? order.items.length : 0;
  const amount = (order.total_amount || 0) + (order.delivery_fee_student || order.delivery_fee || 0);

  return (
    <Card interactive onClick={onClick} className="cursor-pointer p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-gray-900">{order.restaurant_name}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{formatDate(order.created_at)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-1.5 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <Icon name="mapPin" size={15} className="shrink-0 text-gray-400" />
          <span className="truncate">{order.delivery_address}</span>
        </p>
        <p className="flex items-center gap-2">
          <Icon name="bag" size={15} className="shrink-0 text-gray-400" />
          {itemCount} article{itemCount > 1 ? 's' : ''}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200/70 pt-3">
        <span className="text-sm text-gray-500">Total</span>
        <span className="text-base font-extrabold text-gray-900">{formatCurrency(amount)}</span>
      </div>
    </Card>
  );
}

export default OrderCard;
