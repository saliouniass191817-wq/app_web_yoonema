import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const { success, error: showError } = useNotifications();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call update API
      setUser(formData);
      success('Profil mis à jour');
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Mon Profil</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nom"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Téléphone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
              />
              <Input
                label="Rôle"
                name="role"
                value={formData.role || ''}
                disabled
              />
            </div>

            <Input
              label="Adresse"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
            />

            <div className="flex gap-3">
              <Button type="submit" loading={loading}>
                Enregistrer
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={logout}
              >
                Déconnexion
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
