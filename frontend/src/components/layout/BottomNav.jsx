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
    <nav className="bottomnav" style={{ position: 'static' }}>
      {items.map((item) => {
        const active = isActive(item.path);
        return (
          <button key={item.path} className={`nav-item ${active ? 'on' : ''}`} onClick={() => navigate(item.path)} aria-current={active ? 'page' : undefined}>
            <span className="nav-pill" />
            <Icon name={item.icon} size={23} stroke={active ? 2.2 : 1.9} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
