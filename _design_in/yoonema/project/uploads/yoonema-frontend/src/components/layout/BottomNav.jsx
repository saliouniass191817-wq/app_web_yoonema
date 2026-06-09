import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '../ui/Icon';

const NAV = {
  student: [
    { label: 'Accueil', icon: 'home', path: '/home' },
    { label: 'Commandes', icon: 'bag', path: '/orders' },
    { label: 'Alertes', icon: 'bell', path: '/notifications' },
    { label: 'Profil', icon: 'user', path: '/profile' },
  ],
  vendor: [
    { label: 'Bord', icon: 'grid', path: '/vendor' },
    { label: 'Commandes', icon: 'utensils', path: '/vendor/orders' },
    { label: 'Menu', icon: 'list', path: '/vendor/menu' },
    { label: 'Profil', icon: 'user', path: '/vendor/profile' },
  ],
  delivery: [
    { label: 'Accueil', icon: 'home', path: '/delivery' },
    { label: 'Historique', icon: 'receipt', path: '/delivery/history' },
    { label: 'Profil', icon: 'user', path: '/delivery/profile' },
  ],
  admin: [
    { label: 'Bord', icon: 'grid', path: '/admin' },
    { label: 'Restos', icon: 'store', path: '/admin/restaurants' },
    { label: 'Users', icon: 'users', path: '/admin/users' },
    { label: 'Commandes', icon: 'bag', path: '/admin/orders' },
  ],
};

const ROLE_ROOTS = ['/home', '/vendor', '/delivery', '/admin'];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role } = useAuth();

  const items = NAV[role] || NAV.student;
  const isActive = (path) =>
    pathname === path || (!ROLE_ROOTS.includes(path) && pathname.startsWith(path + '/'));

  return (
    <div className="safe-bottom flex justify-around px-1.5 pt-1.5 pb-1">
      {items.map((item) => {
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            aria-current={active ? 'page' : undefined}
            className="relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors"
          >
            {active && <span className="absolute top-0 h-1 w-8 rounded-full bg-orange-500" />}
            <Icon
              name={item.icon}
              size={22}
              strokeWidth={active ? 2.1 : 1.75}
              className={active ? 'text-orange-600' : 'text-gray-400'}
            />
            <span className={`text-[11px] font-medium ${active ? 'text-orange-600' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default BottomNav;
