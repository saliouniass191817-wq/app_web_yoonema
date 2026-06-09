import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { vendorAPI } from '../../api';
import { useNotifications } from '../../hooks/useNotifications';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/utils';

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotifications();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await vendorAPI.updateOrderStatus(orderId, status);
      if (res.success) {
        success('Statut mis à jour');
        loadOrders();
      }
    } catch (err) {
      console.error(err);
      error(err?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleRefuse = async (orderId) => {
    const reason = window.prompt('Raison du refus');
    if (!reason || reason.trim() === '') return;
    try {
      const res = await vendorAPI.refuseOrder(orderId, reason);
      if (res.success) {
        success('Commande refusée');
        loadOrders();
      }
    } catch (err) {
      console.error(err);
      error(err?.message || 'Erreur lors du refus');
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Commandes</h1>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState icon="utensils" title="Aucune commande" subtitle="Les nouvelles commandes payées apparaîtront ici." />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const amount = (order.total_amount || 0) + (order.delivery_fee_student || order.delivery_fee || 0);
            return (
              <Card key={order.id} className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900">Commande #{order.id.slice(0, 8)}</h3>
                    <p className="mt-0.5 flex items-center gap-2 text-sm text-gray-500">
                      <Icon name="mapPin" size={14} className="text-gray-400" />
                      <span className="truncate">{order.delivery_address}</span>
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="flex items-center justify-between border-t border-gray-200/70 pt-3">
                  <span className="text-sm text-gray-500">
                    {Array.isArray(order.items) ? order.items.length : 0} article(s) · <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
                  </span>

                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="danger" onClick={() => handleRefuse(order.id)}>
                        <Icon name="x" size={16} strokeWidth={2.2} />
                        Refuser
                      </Button>
                      <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'confirmed')}>
                        <Icon name="check" size={16} strokeWidth={2.2} />
                        Confirmer
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
