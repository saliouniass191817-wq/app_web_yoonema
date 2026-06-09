import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Icon } from '../../components/ui/Icon';
import { adminAPI } from '../../api';

const formatPrice = (amount) => {
  if (!amount && amount !== 0) return '—';
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}k FCFA`;
  return `${amount.toLocaleString('fr-FR')} FCFA`;
};

const ACTIONS = [
  { label: 'Gérer les utilisateurs', icon: 'users', path: '/admin/users' },
  { label: 'Valider les restaurants', icon: 'store', path: '/admin/restaurants' },
  { label: 'Voir toutes les commandes', icon: 'bag', path: '/admin/orders' },
  { label: 'Gérer les paiements', icon: 'wallet', path: '/admin/finance' },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
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
      setStats(response?.data?.data ?? response?.data ?? null);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  const tasks = [
    { icon: 'store', label: 'restaurants à valider', value: stats?.pending_tasks?.restaurants ?? stats?.restaurants?.pending ?? 0 },
    { icon: 'x', label: 'rapports de problèmes', value: stats?.pending_tasks?.issues ?? 0 },
    { icon: 'phone', label: "messages d'utilisateurs", value: stats?.pending_tasks?.messages ?? 0 },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Administration</h1>

        {error && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm text-danger-700">
            <span>{error}</span>
            <button onClick={loadStats} className="font-semibold underline">Réessayer</button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="users" tone="brand" label="Utilisateurs" loading={loading}
            value={(stats?.users?.total ?? 0).toLocaleString('fr-FR')}
            hint={stats?.users?.growth ? `+${stats.users.growth}% ce mois` : undefined} />
          <StatCard icon="store" tone="info" label="Restaurants" loading={loading}
            value={stats?.restaurants?.total ?? 0}
            hint={`${stats?.restaurants?.pending ?? 0} en attente`} />
          <StatCard icon="bag" tone="warning" label="Commandes" loading={loading}
            value={(stats?.orders?.total ?? 0).toLocaleString('fr-FR')}
            hint={stats?.orders?.growth ? `+${stats.orders.growth}% ce mois` : undefined} />
          <StatCard icon="wallet" tone="success" label="Revenus" loading={loading}
            value={formatPrice(stats?.revenue?.total)}
            hint={stats?.revenue?.growth ? `+${stats.revenue.growth}% ce mois` : undefined} />
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <h2 className="mb-4 text-lg font-bold text-gray-900">Actions administratives</h2>
              <div className="space-y-2">
                {ACTIONS.map((a) => (
                  <button
                    key={a.path}
                    onClick={() => navigate(a.path)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:border-orange-300 hover:bg-orange-50"
                  >
                    <Icon name={a.icon} size={18} className="text-gray-400 group-hover:text-orange-600" />
                    <span className="flex-1">{a.label}</span>
                    <Icon name="chevronRight" size={16} className="text-gray-300 group-hover:text-orange-500" />
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="mb-4 text-lg font-bold text-gray-900">Tâches en attente</h2>
              <div className="space-y-2.5">
                {tasks.map((t) => (
                  <div key={t.label} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-gray-500 ring-1 ring-gray-200">
                      <Icon name={t.icon} size={16} />
                    </span>
                    <span className="text-sm text-gray-600">
                      <span className="font-bold text-gray-900">{t.value}</span> {t.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
