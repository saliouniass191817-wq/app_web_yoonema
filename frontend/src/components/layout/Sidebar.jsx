import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function Sidebar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const navItems = {
    student: [
      { label: 'Accueil', icon: '🏠', path: '/home' },
      { label: 'Mes commandes', icon: '📦', path: '/orders' },
      { label: 'Notifications', icon: '🔔', path: '/notifications' },
      { label: 'Profil', icon: '👤', path: '/profile' },
    ],
    vendor: [
      { label: 'Tableau de bord', icon: '📊', path: '/vendor' },
      { label: 'Mes commandes', icon: '🍽️', path: '/vendor/orders' },
      { label: 'Menu', icon: '📋', path: '/vendor/menu' },
      { label: 'Statistiques', icon: '📈', path: '/vendor/stats' },
      { label: 'Profil', icon: '👤', path: '/vendor/profile' },
    ],
    delivery: [
      { label: 'Accueil', icon: '🏠', path: '/delivery' },
      { label: 'Historique', icon: '📜', path: '/delivery/history' },
      { label: 'Profil', icon: '👤', path: '/delivery/profile' },
    ],
    admin: [
      { label: 'Tableau de bord', icon: '📊', path: '/admin' },
      { label: 'Restaurants', icon: '🍴', path: '/admin/restaurants' },
      { label: 'Utilisateurs', icon: '👥', path: '/admin/users' },
      { label: 'Commandes', icon: '📦', path: '/admin/orders' },
      { label: 'Livreurs', icon: '🚴', path: '/admin/delivery' },
    ],
  };

  const items = navItems[role] || [];

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-orange-500">Yoonema</h1>
        <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <Button
        onClick={logout}
        variant="outline"
        className="w-full"
      >
        Déconnexion
      </Button>
    </div>
  );
}
