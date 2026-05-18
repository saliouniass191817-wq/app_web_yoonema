import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { adminAPI } from '../../api';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../../components/ui/Button';


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
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Gestion des utilisateurs</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={user.is_active ? 'success' : 'error'}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Badge>{user.role}</Badge>
                      <Button size="sm" onClick={() => handleToggle(user.id)}>
                        Basculer
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
