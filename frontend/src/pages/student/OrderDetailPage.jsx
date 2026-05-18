import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import { orderAPI } from '../../api';
import CancellationTimer from '../../components/student/CancellationTimer';
import OrderTimeline from '../../components/student/OrderTimeline';
import { useOrderRealtime } from '../../hooks/useOrderRealtime';
import { useNotifications } from '../../hooks/useNotifications';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotifications();

  useEffect(() => {
    loadOrder();
  }, [id]);

  useOrderRealtime(id, (updatedOrder) => {
    setOrder((current) => ({ ...current, ...updatedOrder }));
    success('Le statut de votre commande a changé.');
  });

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getById(id);
      setOrder(response.data);
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await orderAPI.cancel(order.id, 'Annulation par l’étudiant');
      setOrder(response.data);
      success('Commande annulée.');
    } catch (err) {
      error(err?.message || 'Annulation impossible.');
    }
  };

  if (loading || !order) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <p>Chargement...</p>
        </div>
      </AppLayout>
    );
  }

  const statusMap = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    delivering: 'En livraison',
    delivered: 'Livrée',
    refused: 'Refusée',
    cancelled: 'Annulée',
    expired: 'Expirée',
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Commande #{order.id.slice(0, 8)}</h1>
          <Badge variant={order.status === 'delivered' ? 'success' : 'info'}>
            {statusMap[order.status] || order.status}
          </Badge>
        </div>

        {/* Status Timeline */}
        <Card className="mb-8">
          <CardBody>
            <OrderTimeline
              status={order.status}
              deliveryTime={order.restaurant?.delivery_time}
              deliveryPerson={order.delivery_person}
            />
          </CardBody>
        </Card>

        {order.status === 'pending' && (
          <div className="mb-8">
            <CancellationTimer
              orderCreatedAt={order.created_at}
              windowMinutes={5}
              onExpire={() => setOrder((current) => ({ ...current }))}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Order Details */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardBody>
                <h2 className="font-semibold text-lg mb-4">Restaurant</h2>
                <p className="text-lg font-semibold">{order.restaurant_name}</p>
                <p className="text-gray-600">{order.created_at && formatDate(order.created_at)}</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="font-semibold text-lg mb-4">Articles</h2>
                <div className="space-y-2">
                  {Array.isArray(order.items) && order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between pb-2 border-b border-gray-100 last:border-0">
                      <span>{item.name || 'Article'} x {item.quantity || 1}</span>
                      <span>{formatCurrency((item.price || 0) * (item.quantity || 1))}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-24">
              <CardBody>
                <h2 className="font-semibold text-lg mb-4">Résumé</h2>

                <div className="space-y-2 pb-4 border-b border-gray-200 mb-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatCurrency(order.total_amount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{formatCurrency(order.delivery_fee || 0)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold text-lg mb-4">
                  <span>Total</span>
                  <span className="text-orange-500">
                    {formatCurrency((order.total_amount || 0) + (order.delivery_fee || 0))}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Adresse</p>
                    <p>{order.delivery_address}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate('/orders')}
                >
                  Retour
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
