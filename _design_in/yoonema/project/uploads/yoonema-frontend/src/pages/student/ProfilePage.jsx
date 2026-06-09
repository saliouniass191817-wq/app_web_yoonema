import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Icon } from '../../components/ui/Icon';
import { useAuth } from '../../hooks/useAuth';

const ROLE_LABELS = { student: 'Étudiant', vendor: 'Vendeur', delivery: 'Livreur', admin: 'Admin' };

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

  const infoRows = [
    { icon: 'user', label: 'Email', value: user?.email },
    { icon: 'phone', label: 'Téléphone', value: user?.phone || 'Non défini' },
    { icon: 'mapPin', label: 'Adresse', value: user?.address || 'Non définie' },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Mon profil</h1>

        <Card className="mb-5">
          <CardBody>
            <div className="mb-6 flex items-center gap-4">
              <Avatar src={user?.avatar_url} name={user?.name} alt={user?.name} size="lg" />
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-gray-900">{user?.name}</h2>
                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-100">
                  {ROLE_LABELS[user?.role] || user?.role}
                </span>
              </div>
            </div>

            {!isEditing ? (
              <div className="space-y-1">
                {infoRows.map((row) => (
                  <div key={row.label} className="flex items-center gap-3 rounded-xl px-1 py-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gray-100 text-gray-500">
                      <Icon name={row.icon} size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">{row.label}</p>
                      <p className="truncate font-medium text-gray-900">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <Input label="Nom complet" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <Input label="Email" type="email" value={formData.email} disabled />
                <Input label="Téléphone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <Input label="Adresse" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Modifier le profil</Button>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(false)}>Enregistrer</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                </>
              )}
            </div>
          </CardBody>
        </Card>

        <Button variant="ghost" className="w-full text-danger-600 hover:bg-danger-50" onClick={handleLogout}>
          <Icon name="logout" size={18} />
          Déconnexion
        </Button>
      </div>
    </AppLayout>
  );
}
