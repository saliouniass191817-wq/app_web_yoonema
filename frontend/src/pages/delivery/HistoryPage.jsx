import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import { deliveryAPI } from '../../api';

export default function DeliveryHistoryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await deliveryAPI.getHistory();
      setDeliveries(response.data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Historique des livraisons</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-2xl mb-2">📦</p>
            <p>Aucune livraison effectuée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <Card key={delivery.id}>
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {delivery.restaurant_name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        📍 {delivery.delivery_address}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatDate(delivery.completed_at || delivery.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="success">Livrée</Badge>
                      <p className="font-semibold text-orange-500 mt-2">
                        {formatCurrency(delivery.earnings || 0)}
                      </p>
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
