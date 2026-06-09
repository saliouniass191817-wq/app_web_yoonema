import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Icon } from '../../components/ui/Icon';
import { adminAPI } from '../../api';
import { useNotifications } from '../../hooks/useNotifications';

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotifications();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRestaurants();
      setRestaurants(response.data || []);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await adminAPI.approveRestaurant(id);
      if (res.success) {
        success('Restaurant approuvé');
        loadRestaurants();
      }
    } catch (err) {
      console.error(err);
      error(err?.message || 'Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Raison du rejet');
    if (!reason || reason.trim() === '') return;
    try {
      const res = await adminAPI.rejectRestaurant(id, reason);
      if (res.success) {
        success('Restaurant rejeté');
        loadRestaurants();
      }
    } catch (err) {
      console.error(err);
      error(err?.message || 'Erreur lors du rejet');
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Restaurants</h1>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-gray-500">
            Aucun restaurant pour le moment.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200/70 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3 font-semibold">Restaurant</th>
                    <th className="px-5 py-3 font-semibold">Adresse</th>
                    <th className="px-5 py-3 font-semibold">Statut</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {restaurants.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-gray-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-600">
                            <Icon name="store" size={18} />
                          </span>
                          <span className="font-semibold text-gray-900">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{r.address || '—'}</td>
                      <td className="px-5 py-3">
                        <Badge variant={r.is_approved ? 'success' : 'warning'} dot>
                          {r.is_approved ? 'Approuvé' : 'En attente'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        {!r.is_approved ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="danger" onClick={() => handleReject(r.id)}>Rejeter</Button>
                            <Button size="sm" onClick={() => handleApprove(r.id)}>Approuver</Button>
                          </div>
                        ) : (
                          <p className="text-right text-xs text-gray-400">—</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
