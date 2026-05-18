import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Mon profil</h1>

        <Card className="mb-6">
          <CardBody>
            <div className="flex items-center gap-4 mb-6">
              <Avatar src={user?.avatar_url} size="lg" alt={user?.name} />
              <div>
                <h2 className="text-2xl font-semibold">{user?.name}</h2>
                <p className="text-gray-600">{user?.role}</p>
              </div>
            </div>

            {!isEditing ? (
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Téléphone</p>
                  <p className="font-semibold">{user?.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Adresse</p>
                  <p className="font-semibold">{user?.address || 'Non définie'}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <Input
                  label="Nom Complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  disabled
                />
                <Input
                  label="Téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="Adresse"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            )}

            <div className="flex gap-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Modifier le profil
                </Button>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(false)}>
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                </>
              )}
            </div>
          </CardBody>
        </Card>

        <Button
          variant="danger"
          className="w-full"
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      </div>
    </AppLayout>
  );
}
