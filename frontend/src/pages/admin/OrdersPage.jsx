import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { adminAPI } from '../../api';

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
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Gestion des commandes</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">Aucune commande</p>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 10).map((order) => (
              <Card key={order.id}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                      <p className="text-gray-600 text-sm">{order.restaurant_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{order.total_amount} FCFA</p>
                      <p className="text-gray-600 text-sm">{order.status}</p>
                    </div>
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
