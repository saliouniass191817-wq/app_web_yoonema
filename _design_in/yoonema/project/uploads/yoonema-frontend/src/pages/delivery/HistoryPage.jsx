import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Icon } from '../../components/ui/Icon';
import { formatCurrency, formatDate } from '../../lib/utils';
import { deliveryAPI } from '../../api';
import { EmptyState } from '../../components/ui/EmptyState';

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
      <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Historique des livraisons</h1>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />)}
          </div>
        ) : deliveries.length === 0 ? (
          <EmptyState
            icon="receipt"
            title="Aucune livraison effectuée"
            subtitle="Ton historique se remplira après tes premières courses."
          />
        ) : (
          <div className="space-y-3">
            {deliveries.map((delivery) => (
              <Card key={delivery.id} className="flex items-center gap-4 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-success-50 text-success-600">
                  <Icon name="check" size={22} strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-gray-900">{delivery.restaurant_name}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-gray-500">
                    <Icon name="mapPin" size={14} className="shrink-0 text-gray-400" />
                    {delivery.delivery_address}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {formatDate(delivery.completed_at || delivery.created_at)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge variant="success" dot>Livrée</Badge>
                  <p className="mt-1.5 font-bold text-gray-900">{formatCurrency(delivery.earnings || 0)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
