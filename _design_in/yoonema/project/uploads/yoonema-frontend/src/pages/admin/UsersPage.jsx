import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { adminAPI } from '../../api';
import { useNotifications } from '../../hooks/useNotifications';

const ROLE_LABELS = { student: 'Étudiant', vendor: 'Vendeur', delivery: 'Livreur', admin: 'Admin' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotifications();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await adminAPI.toggleUserStatus(id);
      if (res.success) {
        success('Statut utilisateur mis à jour');
        loadUsers();
      }
    } catch (err) {
      console.error(err);
      error(err?.message || 'Erreur lors de la mise à jour');
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Utilisateurs</h1>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}
          </div>
        ) : (
          <div className="space-y-2.5">
            {users.map((user) => (
              <Card key={user.id} className="flex items-center gap-4 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-100 text-base font-bold uppercase text-orange-700">
                  {(user.name || '?').charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-gray-900">{user.name}</h3>
                  <p className="truncate text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="hidden sm:block">
                  <Badge>{ROLE_LABELS[user.role] || user.role}</Badge>
                </div>
                <Badge variant={user.is_active ? 'success' : 'error'} dot>
                  {user.is_active ? 'Actif' : 'Inactif'}
                </Badge>
                <Button size="sm" variant={user.is_active ? 'secondary' : 'primary'} onClick={() => handleToggle(user.id)}>
                  {user.is_active ? 'Désactiver' : 'Activer'}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
