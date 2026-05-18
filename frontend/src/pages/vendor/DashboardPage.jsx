import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { vendorAPI } from '../../api';
import { useVendorRealtime } from '../../hooks/useVendorRealtime';
import { useVendorRestaurant } from '../../context/VendorRestaurantContext';
import { formatCurrency } from '../../lib/utils';

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
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

      {restaurant && !restaurant.is_approved && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Votre restaurant est en attente de validation par l’administrateur.
        </div>
      )}

      {loading ? (
          <p className="text-gray-600">Chargement...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardBody>
                  <p className="text-gray-600 text-sm mb-2">Commandes</p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-gray-600 text-sm mb-2">Revenus livrés</p>
                  <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-gray-600 text-sm mb-2">Note</p>
                  <p className="text-3xl font-bold">{Number(averageRating).toFixed(1)}★</p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-gray-600 text-sm mb-2">Paiements en attente</p>
                  <p className="text-3xl font-bold">{formatCurrency(pendingPayments)}</p>
                </CardBody>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardBody>
                  <h2 className="font-semibold text-lg mb-4">Actions rapides</h2>
                  <div className="space-y-2">
                    <Button className="w-full text-left" onClick={() => navigate('/vendor/menu')}>
                      📋 Gérer le menu
                    </Button>
                    <Button variant="outline" className="w-full text-left" onClick={() => navigate('/vendor/orders')}>
                      📦 Voir les commandes
                    </Button>
                    <Button variant="outline" className="w-full text-left" onClick={() => navigate('/vendor/stats')}>
                      📊 Statistiques détaillées
                    </Button>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h2 className="font-semibold text-lg mb-4">Répartition des commandes</h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    {stats?.orders && Object.keys(stats.orders).length > 0 ? (
                      Object.entries(stats.orders).map(([status, count]) => (
                        <div key={status} className="flex justify-between">
                          <span>{status}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Aucune commande pour le moment.</p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </>
        )}
    </div>
  );
}
