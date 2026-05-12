import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { deliveryAPI } from '../../api';
import { useNotifications } from '../../hooks/useNotifications';

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
      error(err?.message || 'Erreur lors de l\'acceptation');
    }
  };

  const handleRefuse = async (orderId) => {
    try {
      const res = await deliveryAPI.refuseOrder(orderId);
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
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Mes livraisons</h1>
          <Button
            variant={isAvailable ? 'success' : 'outline'}
            onClick={handleToggleAvailability}
          >
            {isAvailable ? '🟢 Disponible' : '🔴 Indisponible'}
          </Button>
        </div>

        {!isAvailable && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardBody>
              <p className="text-yellow-900">Vous êtes actuellement indisponible. Mettez-vous en ligne pour recevoir des commandes.</p>
            </CardBody>
          </Card>
        )}

        <div className="space-y-4">
          {loading ? (
            <p>Chargement...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p className="text-2xl mb-2">📦</p>
              <p>Aucune commande disponible</p>
              {isAvailable && <p className="text-sm">Vous serez notifié quand une commande arrivera</p>}
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardBody>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Commande #{order.id.slice(0, 8)}</h3>
                      <p className="text-gray-600">{order.restaurant_name}</p>
                    </div>
                    <Badge variant="info">{order.status}</Badge>
                  </div>

                  <p className="text-gray-700 mb-4">
                    📍 {order.delivery_address}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => handleAccept(order.id)}>✓ Accepter</Button>
                    <Button size="sm" variant="danger" onClick={() => handleRefuse(order.id)}>✕ Refuser</Button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
