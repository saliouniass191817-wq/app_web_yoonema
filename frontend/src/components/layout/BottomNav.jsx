import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function BottomNav() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const navItems = {
    student: [
      { label: 'Accueil', icon: '🏠', path: '/home' },
      { label: 'Commandes', icon: '📦', path: '/orders' },
      { label: 'Notifications', icon: '🔔', path: '/notifications' },
      { label: 'Profil', icon: '👤', path: '/profile' },
    ],
    vendor: [
      { label: 'Tableau de bord', icon: '📊', path: '/vendor' },
      { label: 'Commandes', icon: '🍽️', path: '/vendor/orders' },
      { label: 'Menu', icon: '📋', path: '/vendor/menu' },
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
    ],
  };

  const items = navItems[role] || navItems.student;

  return (
    <div className="flex justify-around px-2 py-2">
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs text-gray-700 font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
