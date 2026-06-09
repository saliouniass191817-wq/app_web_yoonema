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
    <div className="side" style={{ height: '100%' }}>
      <div className="side-logo">
        <span className="mark"><Icon name="utensils" size={20} /></span>
        <b>Yoonema</b>
      </div>

      <div className="side-label">Menu</div>
      <nav className="side-nav">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`side-item ${active ? 'on' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon name={item.icon} size={19} stroke={active ? 2.2 : 1.9} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="side-user">
        <span className="ava">{(user?.name || '?').charAt(0)}</span>
        <div className="meta">
          <b>{user?.name || 'Utilisateur'}</b>
          <small>{ROLE_LABELS[role] || ''}</small>
        </div>
        <button className="out" onClick={logout} aria-label="Déconnexion" title="Déconnexion">
          <Icon name="power" size={18} />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
