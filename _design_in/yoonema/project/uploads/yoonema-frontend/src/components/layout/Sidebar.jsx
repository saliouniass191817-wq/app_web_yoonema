import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '../ui/Icon';

const NAV = {
  student: [
    { label: 'Accueil', icon: 'home', path: '/home' },
    { label: 'Mes commandes', icon: 'bag', path: '/orders' },
    { label: 'Notifications', icon: 'bell', path: '/notifications' },
    { label: 'Profil', icon: 'user', path: '/profile' },
  ],
  vendor: [
    { label: 'Tableau de bord', icon: 'grid', path: '/vendor' },
    { label: 'Mes commandes', icon: 'utensils', path: '/vendor/orders' },
    { label: 'Menu', icon: 'list', path: '/vendor/menu' },
    { label: 'Statistiques', icon: 'chart', path: '/vendor/stats' },
    { label: 'Profil', icon: 'user', path: '/vendor/profile' },
  ],
  delivery: [
    { label: 'Accueil', icon: 'home', path: '/delivery' },
    { label: 'Historique', icon: 'receipt', path: '/delivery/history' },
    { label: 'Profil', icon: 'user', path: '/delivery/profile' },
  ],
  admin: [
    { label: 'Tableau de bord', icon: 'grid', path: '/admin' },
    { label: 'Restaurants', icon: 'store', path: '/admin/restaurants' },
    { label: 'Utilisateurs', icon: 'users', path: '/admin/users' },
    { label: 'Commandes', icon: 'bag', path: '/admin/orders' },
    { label: 'Livreurs', icon: 'bike', path: '/admin/delivery' },
  ],
};

const ROLE_ROOTS = ['/home', '/vendor', '/delivery', '/admin'];
const ROLE_LABELS = { student: 'Étudiant', vendor: 'Vendeur', delivery: 'Livreur', admin: 'Admin' };

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, role, logout } = useAuth();

  const items = NAV[role] || [];

  const isActive = (path) =>
    pathname === path || (!ROLE_ROOTS.includes(path) && pathname.startsWith(path + '/'));

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500 text-white shadow-brand-sm">
          <Icon name="utensils" size={20} strokeWidth={2} />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-gray-900">Yoonema</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-current={active ? 'page' : undefined}
              className={
                `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ` +
                (active
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
              }
            >
              <Icon
                name={item.icon}
                size={20}
                strokeWidth={active ? 2 : 1.75}
                className={active ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-gray-200/70 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-100 text-sm font-bold uppercase text-orange-700">
            {(user?.name || '?').charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{user?.name || 'Utilisateur'}</p>
            <p className="truncate text-xs text-gray-500">{ROLE_LABELS[role] || ''}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-danger-50 hover:text-danger-600"
        >
          <Icon name="logout" size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
