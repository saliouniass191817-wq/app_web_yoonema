import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { adminAPI } from '../../api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
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
        <h1 className="text-3xl font-bold mb-8">Tableau de bord Admin</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Utilisateurs</p>
              <p className="text-3xl font-bold">1,234</p>
              <p className="text-green-500 text-xs mt-2">↑ 12% ce mois</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Restaurants</p>
              <p className="text-3xl font-bold">45</p>
              <p className="text-green-500 text-xs mt-2">5 en attente</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Commandes</p>
              <p className="text-3xl font-bold">3,456</p>
              <p className="text-green-500 text-xs mt-2">↑ 8% ce mois</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Revenus</p>
              <p className="text-3xl font-bold">2.5M FCFA</p>
              <p className="text-green-500 text-xs mt-2">↑ 15% ce mois</p>
            </CardBody>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">Actions administratives</h2>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">👥 Gérer les utilisateurs</button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">🍴 Valider les restaurants</button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">📦 Voir toutes les commandes</button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">💰 Gérer les paiements</button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">Tâches en attente</h2>
              <div className="space-y-2 text-sm">
                <p>📋 5 restaurants à valider</p>
                <p>⚠️ 2 rapports de problèmes</p>
                <p>📞 3 messages d'utilisateurs</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
