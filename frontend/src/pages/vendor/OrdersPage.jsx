import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { vendorAPI } from '../../api';
import { useNotifications } from '../../hooks/useNotifications';

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

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <p>Chargement...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Commandes</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p>Aucune commande</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardBody>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Commande #{order.id.slice(0, 8)}</h3>
                      <p className="text-gray-600 text-sm">Client: {order.student_id}</p>
                    </div>
                    <Badge variant={order.status === 'delivered' ? 'success' : 'info'}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'confirmed')}>✓ Confirmer</Button>
                        <Button size="sm" variant="danger" onClick={() => handleRefuse(order.id)}>✕ Refuser</Button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'preparing')}>👨‍🍳 Préparation</Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'ready')}>✓ Prête</Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
