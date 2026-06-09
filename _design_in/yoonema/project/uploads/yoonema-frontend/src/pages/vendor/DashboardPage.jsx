import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Icon } from '../../components/ui/Icon';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { vendorAPI } from '../../api';
import { useVendorRealtime } from '../../hooks/useVendorRealtime';
import { useVendorRestaurant } from '../../context/VendorRestaurantContext';
import { formatCurrency } from '../../lib/utils';

const QUICK_ACTIONS = [
  { label: 'Gérer le menu', icon: 'list', path: '/vendor/menu' },
  { label: 'Voir les commandes', icon: 'utensils', path: '/vendor/orders' },
  { label: 'Statistiques détaillées', icon: 'chart', path: '/vendor/stats' },
];

export default function VendorDashboardPage() {
  const navigate = useNavigate();
  const { restaurant } = useVendorRestaurant();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getStats('today');
      setStats(response.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useVendorRealtime(restaurant?.id, () => {
    loadStats();
  });

  const totalOrders = stats?.total_orders ?? 0;
  const totalRevenue = stats?.total_revenue ?? 0;
  const averageRating = stats?.average_rating ?? 0;
  const pendingPayments = stats?.payments?.pending_amount ?? 0;

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Tableau de bord</h1>

      {restaurant && !restaurant.is_approved && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700">
          <Icon name="clock" size={18} className="mt-0.5 shrink-0" />
          <span>Votre restaurant est en attente de validation par l’administrateur.</span>
        </div>
      )}

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="bag" tone="brand" label="Commandes" value={totalOrders} loading={loading} />
        <StatCard icon="wallet" tone="success" label="Revenus livrés" value={formatCurrency(totalRevenue)} loading={loading} />
        <StatCard icon="star" tone="warning" label="Note moyenne" value={`${Number(averageRating).toFixed(1)} ★`} loading={loading} />
        <StatCard icon="clock" tone="info" label="Paiements en attente" value={formatCurrency(pendingPayments)} loading={loading} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="mb-4 text-lg font-bold text-gray-900">Actions rapides</h2>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((a) => (
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
            <h2 className="mb-4 text-lg font-bold text-gray-900">Répartition des commandes</h2>
            {stats?.orders && Object.keys(stats.orders).length > 0 ? (
              <div className="space-y-2.5">
                {Object.entries(stats.orders).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <StatusBadge status={status} />
                    <span className="text-sm font-bold tabular-nums text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">Aucune commande pour le moment.</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
