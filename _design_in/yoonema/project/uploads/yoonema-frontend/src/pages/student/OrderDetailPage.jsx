import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { StatusBadge } from '../../components/shared/StatusBadge';
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
        <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
          <div className="mt-6 h-40 animate-pulse rounded-2xl bg-gray-100" />
          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
        <button
          onClick={() => navigate('/orders')}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <Icon name="chevronRight" size={16} className="rotate-180" />
          Mes commandes
        </button>

        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
            Commande #{order.id.slice(0, 8)}
          </h1>
          <StatusBadge status={order.status} />
        </div>

        {/* Status Timeline */}
        <Card className="mb-6">
          <CardBody>
            <OrderTimeline
              status={order.status}
              deliveryTime={order.restaurant?.delivery_time}
              deliveryPerson={order.delivery_person}
            />
          </CardBody>
        </Card>

        {order.status === 'pending' && (
          <div className="mb-6">
            <CancellationTimer
              orderCreatedAt={order.created_at}
              windowMinutes={5}
              onExpire={() => setOrder((current) => ({ ...current }))}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Details */}
          <div className="space-y-6 md:col-span-2">
            <Card>
              <CardBody>
                <h2 className="mb-3 text-base font-bold text-gray-900">Restaurant</h2>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-orange-600">
                    <Icon name="store" size={22} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{order.restaurant_name}</p>
                    <p className="text-sm text-gray-500">{order.created_at && formatDate(order.created_at)}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="mb-3 text-base font-bold text-gray-900">Articles</h2>
                <div className="divide-y divide-gray-100">
                  {Array.isArray(order.items) && order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5">
                      <span className="text-gray-700">
                        <span className="font-medium text-gray-900">{item.quantity || 1}×</span> {item.name || 'Article'}
                      </span>
                      <span className="font-semibold text-gray-900">{formatCurrency((item.price || 0) * (item.quantity || 1))}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="md:sticky md:top-24">
              <CardBody>
                <h2 className="mb-4 text-base font-bold text-gray-900">Résumé</h2>

                <div className="mb-4 space-y-2 border-b border-gray-200/70 pb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.total_amount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.delivery_fee || 0)}</span>
                  </div>
                </div>

                <div className="mb-4 flex items-baseline justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-orange-600">
                    {formatCurrency((order.total_amount || 0) + (order.delivery_fee || 0))}
                  </span>
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-sm">
                  <Icon name="mapPin" size={16} className="mt-0.5 shrink-0 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">Adresse de livraison</p>
                    <p className="text-gray-500">{order.delivery_address}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
