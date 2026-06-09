import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { deliveryAPI } from '../../api';
import { useNotifications } from '../../hooks/useNotifications';
import { EmptyState } from '../../components/ui/EmptyState';

export default function DeliveryDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const { success, error } = useNotifications();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await deliveryAPI.getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      await deliveryAPI.toggleAvailability(!isAvailable);
      setIsAvailable(!isAvailable);
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      const res = await deliveryAPI.acceptOrder(orderId);
      if (res.success) {
        success('Commande acceptée');
        loadOrders();
      }
    } catch (err) {
      console.error(err);
      error(err?.message || "Erreur lors de l'acceptation");
    }
  };

  const handleDelivered = async (orderId) => {
    try {
      const res = await deliveryAPI.completeDelivery(orderId);
      if (res.success) {
        success('Commande livrée');
        loadOrders();
      }
    } catch (err) {
      console.error(err);
      error(err?.message || 'Erreur lors de la livraison');
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Mes livraisons</h1>
          <button
            onClick={handleToggleAvailability}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isAvailable
                ? 'bg-success-50 text-success-700 ring-1 ring-success-100'
                : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-success-500' : 'bg-gray-400'}`} />
            {isAvailable ? 'Disponible' : 'Indisponible'}
          </button>
        </div>

        {!isAvailable && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700">
            <Icon name="clock" size={18} className="mt-0.5 shrink-0" />
            <span>Tu es hors-ligne. Active ta disponibilité pour recevoir des courses.</span>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Chargement…</p>
        ) : orders.length === 0 ? (
          <EmptyState
            icon="bike"
            title="Aucune course disponible"
            subtitle={isAvailable ? 'Tu seras notifié dès qu’une commande est prête.' : 'Active ta disponibilité pour recevoir des courses.'}
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900">Commande #{order.id.slice(0, 8)}</h3>
                    <p className="mt-0.5 truncate text-sm text-gray-500">{order.restaurant_name}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <p className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                  <Icon name="mapPin" size={16} className="shrink-0 text-gray-400" />
                  <span className="truncate">{order.delivery_address}</span>
                </p>

                <div className="flex flex-wrap gap-2">
                  {order.status === 'confirmed' && (
                    <Button size="sm" onClick={() => handleAccept(order.id)}>
                      <Icon name="check" size={16} strokeWidth={2.2} />
                      Accepter la course
                    </Button>
                  )}
                  {order.status === 'delivering' && (
                    <Button size="sm" variant="success" onClick={() => handleDelivered(order.id)}>
                      <Icon name="check" size={16} strokeWidth={2.2} />
                      Marquer livrée
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
