import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { vendorAPI } from '../../api';

export default function VendorDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getStats('today');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Commandes</p>
              <p className="text-3xl font-bold">12</p>
              <p className="text-green-500 text-xs mt-2">↑ 5% ce mois</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Revenus</p>
              <p className="text-3xl font-bold">45k FCFA</p>
              <p className="text-green-500 text-xs mt-2">↑ 12% ce mois</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Note</p>
              <p className="text-3xl font-bold">4.8★</p>
              <p className="text-green-500 text-xs mt-2">Excellent</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Temps moyen</p>
              <p className="text-3xl font-bold">28 min</p>
              <p className="text-green-500 text-xs mt-2">↓ 2% ce mois</p>
            </CardBody>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">Actions rapides</h2>
              <div className="space-y-2">
                <Button className="w-full text-left">📋 Gérer le menu</Button>
                <Button variant="outline" className="w-full text-left">📦 Voir les commandes</Button>
                <Button variant="outline" className="w-full text-left">📊 Statistiques détaillées</Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">Statut du restaurant</h2>
              <div className="flex items-center justify-between mb-4">
                <span>Ouvert</span>
                <input type="checkbox" defaultChecked className="w-6 h-6" />
              </div>
              <p className="text-gray-600 text-sm">Votre restaurant est actuellement ouvert</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
