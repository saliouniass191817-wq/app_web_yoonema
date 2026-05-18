import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { vendorAPI } from '../../api';
import VendorPaymentsTab from '../../components/vendor/VendorPaymentsTab';

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

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Statistiques</h1>

        <div className="flex gap-2 mb-6">
          <Button variant={tab === 'stats' ? 'primary' : 'outline'} onClick={() => setTab('stats')}>
            Vue générale
          </Button>
          <Button variant={tab === 'payments' ? 'primary' : 'outline'} onClick={() => setTab('payments')}>
            Mes paiements
          </Button>
        </div>

        {/* Period Selector */}
        {tab === 'stats' && <div className="flex gap-2 mb-8">
          {['today', 'week', 'month'].map((p) => (
            <Button
              key={p}
              variant={period === p ? 'primary' : 'outline'}
              onClick={() => setPeriod(p)}
            >
              {p === 'today'
                ? 'Aujourd\'hui'
                : p === 'week'
                ? 'Cette semaine'
              : 'Ce mois'}
            </Button>
          ))}
        </div>}

        {loading ? (
          <p>Chargement...</p>
        ) : tab === 'payments' ? (
          <VendorPaymentsTab payments={stats?.payments} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardBody>
                  <p className="text-gray-600 text-sm mb-2">Commandes</p>
                  <p className="text-3xl font-bold">
                    {stats?.total_orders || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-gray-600 text-sm mb-2">Revenus</p>
                  <p className="text-3xl font-bold text-orange-500">
                    {stats?.total_revenue?.toLocaleString('fr-FR')} F
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-gray-600 text-sm mb-2">Panier moyen</p>
                  <p className="text-3xl font-bold">
                    {stats?.average_order?.toLocaleString('fr-FR')} F
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-gray-600 text-sm mb-2">Note</p>
                  <p className="text-3xl font-bold">
                    {stats?.average_rating?.toFixed(1) || 0}★
                  </p>
                </CardBody>
              </Card>
            </div>

            {/* Charts placeholder */}
            <Card>
              <CardBody>
                <h2 className="font-semibold text-lg mb-4">Graphiques détaillés</h2>
                <p className="text-gray-600">
                  Les graphiques détaillés seront implémentés avec une librairie de charting.
                </p>
              </CardBody>
            </Card>
          </>
        )}
    </div>
  );
}
