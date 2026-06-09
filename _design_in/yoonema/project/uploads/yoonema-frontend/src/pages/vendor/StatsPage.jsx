import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Icon } from '../../components/ui/Icon';
import { vendorAPI } from '../../api';
import VendorPaymentsTab from '../../components/vendor/VendorPaymentsTab';
import { formatCurrency } from '../../lib/utils';

const PERIODS = [
  { key: 'today', label: "Aujourd'hui" },
  { key: 'week', label: 'Cette semaine' },
  { key: 'month', label: 'Ce mois' },
];

export default function VendorStatsPage() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('today');
  const [tab, setTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getStats(period);
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const SegBtn = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
        active ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Statistiques</h1>

      <div className="mb-6 inline-flex rounded-xl bg-gray-100 p-1">
        <SegBtn active={tab === 'stats'} onClick={() => setTab('stats')}>Vue générale</SegBtn>
        <SegBtn active={tab === 'payments'} onClick={() => setTab('payments')}>Mes paiements</SegBtn>
      </div>

      {tab === 'stats' && (
        <div className="mb-6 flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                period === p.key
                  ? 'bg-orange-500 text-white shadow-brand-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {tab === 'payments' ? (
        <VendorPaymentsTab payments={stats?.payments} />
      ) : (
        <>
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon="bag" tone="brand" label="Commandes" value={stats?.total_orders || 0} loading={loading} />
            <StatCard icon="wallet" tone="success" label="Revenus" value={formatCurrency(stats?.total_revenue || 0)} loading={loading} />
            <StatCard icon="receipt" tone="info" label="Panier moyen" value={formatCurrency(stats?.average_order || 0)} loading={loading} />
            <StatCard icon="star" tone="warning" label="Note moyenne" value={`${(stats?.average_rating || 0).toFixed(1)} ★`} loading={loading} />
          </div>

          <Card>
            <CardBody className="flex flex-col items-center justify-center py-12 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gray-100 text-gray-400">
                <Icon name="chart" size={24} />
              </span>
              <p className="mt-3 font-semibold text-gray-900">Graphiques détaillés</p>
              <p className="mt-1 text-sm text-gray-500">À venir : courbes de ventes et tendances par période.</p>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
