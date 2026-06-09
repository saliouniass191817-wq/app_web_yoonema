import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { adminAPI } from '../../api';
import { formatCurrency } from '../../lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Commandes</h1>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-gray-500">
            Aucune commande.
          </div>
        ) : (
          <div className="space-y-2.5">
            {orders.map((order) => {
              const amount = (order.total_amount || 0) + (order.delivery_fee_student || order.delivery_fee || 0);
              return (
                <Card key={order.id} className="flex items-center gap-4 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gray-100 text-gray-500">
                    <Icon name="bag" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-900">{order.restaurant_name}</h3>
                    <p className="font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                  <span className="shrink-0 font-bold text-gray-900">{formatCurrency(amount)}</span>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
