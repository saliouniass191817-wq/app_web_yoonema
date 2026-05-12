import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
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
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Gestion des livreurs</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="grid gap-4">
            {deliveryPersons.slice(0, 5).map((person) => (
              <Card key={person.id}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Livreur</h3>
                      <p className="text-gray-600 text-sm">{person.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Disponible</Badge>
                      <Button size="sm" variant="outline">Détails</Button>
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
