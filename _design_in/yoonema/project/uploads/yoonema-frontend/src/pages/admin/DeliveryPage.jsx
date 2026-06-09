import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { deliveryAPI } from '../../api';

export default function AdminDeliveryPage() {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeliveryPersons();
  }, []);

  const loadDeliveryPersons = async () => {
    try {
      setLoading(true);
      const response = await deliveryAPI.getHistory();
      setDeliveryPersons(response.data || []);
    } catch (err) {
      console.error('Failed to load delivery persons:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Livreurs</h1>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}
          </div>
        ) : deliveryPersons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-gray-500">
            Aucun livreur pour le moment.
          </div>
        ) : (
          <div className="space-y-2.5">
            {deliveryPersons.slice(0, 20).map((person) => (
              <Card key={person.id} className="flex items-center gap-4 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                  <Icon name="bike" size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900">{person.name || 'Livreur'}</h3>
                  <p className="truncate font-mono text-xs text-gray-400">{person.id}</p>
                </div>
                <Badge variant="success" dot>Disponible</Badge>
                <Button size="sm" variant="outline">Détails</Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
