import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { adminAPI } from '../../api';

// helpers
const formatPrice = (amount) => {
  if (!amount && amount !== 0) return '—';
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}k FCFA`;
  return `${amount.toLocaleString('fr-FR')} FCFA`;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminAPI.getStats();

      // compatibilité backend flexible
      setStats(response?.data?.data ?? response?.data ?? null);

    } catch (err) {
      console.error('Failed to load stats:', err);
      setError("Impossible de charger les statistiques");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        <h1 className="text-3xl font-bold mb-8">
          Tableau de bord Admin
        </h1>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
            <button
              onClick={loadStats}
              className="ml-4 underline text-sm"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Utilisateurs</p>
              <p className="text-3xl font-bold">
                {loading ? '...' : (stats?.users?.total ?? 0).toLocaleString('fr-FR')}
              </p>
              <p className="text-green-500 text-xs mt-2">
                {stats?.users?.growth ? `↑ ${stats.users.growth}% ce mois` : '—'}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Restaurants</p>
              <p className="text-3xl font-bold">
                {loading ? '...' : (stats?.restaurants?.total ?? 0)}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {stats?.restaurants?.pending ?? 0} en attente
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Commandes</p>
              <p className="text-3xl font-bold">
                {loading ? '...' : (stats?.orders?.total ?? 0).toLocaleString('fr-FR')}
              </p>
              <p className="text-green-500 text-xs mt-2">
                {stats?.orders?.growth ? `↑ ${stats.orders.growth}% ce mois` : '—'}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm mb-2">Revenus</p>
              <p className="text-3xl font-bold">
                {loading ? '...' : formatPrice(stats?.revenue?.total)}
              </p>
              <p className="text-green-500 text-xs mt-2">
                {stats?.revenue?.growth ? `↑ ${stats.revenue.growth}% ce mois` : '—'}
              </p>
            </CardBody>
          </Card>

        </div>

        {/* ACTIONS */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">
                Actions administratives
              </h2>

              <div className="space-y-2">

                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
                  👥 Gérer les utilisateurs
                </button>

                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
                  🍴 Valider les restaurants
                </button>

                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
                  📦 Voir toutes les commandes
                </button>

                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
                  💰 Gérer les paiements
                </button>

              </div>
            </CardBody>
          </Card>

          {/* TASKS */}
          <Card>
            <CardBody>
              <h2 className="font-semibold text-lg mb-4">
                Tâches en attente
              </h2>

              <div className="space-y-2 text-sm">

                <p>
                  📋 {stats?.pending_tasks?.restaurants ?? 0} restaurants à valider
                </p>

                <p>
                  ⚠️ {stats?.pending_tasks?.issues ?? 0} rapports de problèmes
                </p>

                <p>
                  📞 {stats?.pending_tasks?.messages ?? 0} messages d'utilisateurs
                </p>

              </div>
            </CardBody>
          </Card>

        </div>

      </div>
    </AppLayout>
  );
}