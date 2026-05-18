import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
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
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Gestion des restaurants</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : restaurants.length === 0 ? (
          <p className="text-gray-600">Aucun restaurant</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Restaurant</th>
                  <th className="text-left py-3 px-4">Propriétaire</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{r.name}</td>
                    <td className="py-3 px-4">{r.owner_id}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          r.is_approved
                            ? 'success'
                            : 'warning'
                        }
                      >
                        {r.is_approved ? 'Approuvé' : 'En attente'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {!r.is_approved && (
                        <div className="flex flex-wrap gap-1">
                          <Button size="sm" onClick={() => handleApprove(r.id)}>✓ Approuver</Button>
                          <Button size="sm" variant="danger" onClick={() => handleReject(r.id)}>✕ Rejeter</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
