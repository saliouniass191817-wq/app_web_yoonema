import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { OrderCard } from '../../components/shared/OrderCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { orderAPI } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Mes commandes</h1>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon="bag"
            title="Aucune commande"
            subtitle="Tu n’as pas encore passé de commande."
            actionLabel="Découvrir les restaurants"
            onAction={() => navigate('/home')}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => navigate(`/orders/${order.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
