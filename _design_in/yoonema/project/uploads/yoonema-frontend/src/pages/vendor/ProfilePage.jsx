import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Icon } from '../../components/ui/Icon';

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
      setUser(formData);
      success('Profil mis à jour');
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Mon profil</h1>

      <Card className="mb-5">
        <CardBody>
          <div className="mb-6 flex items-center gap-4">
            <Avatar src={user?.avatar_url} name={user?.name} alt={user?.name} size="lg" />
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-gray-900">{user?.name}</h2>
              <span className="mt-1 inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-100">
                Vendeur
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Nom complet" name="name" value={formData.name || ''} onChange={handleChange} />
              <Input label="Email" type="email" name="email" value={formData.email || ''} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Téléphone" name="phone" value={formData.phone || ''} onChange={handleChange} />
              <Input label="Rôle" name="role" value={formData.role || ''} disabled />
            </div>
            <Input label="Adresse" name="address" value={formData.address || ''} onChange={handleChange} />

            <Button type="submit" loading={loading}>Enregistrer</Button>
          </form>
        </CardBody>
      </Card>

      <Button variant="ghost" className="w-full text-danger-600 hover:bg-danger-50" onClick={logout}>
        <Icon name="logout" size={18} />
        Déconnexion
      </Button>
    </div>
  );
}
