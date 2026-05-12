import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function TopBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  let fallbackUser = null;
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('yoonema_auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        fallbackUser = parsed?.state?.user || parsed?.user || null;
      }
    }
  } catch (e) {
    fallbackUser = null;
  }
  const displayUser = user || fallbackUser;
  const [isDesktop, setIsDesktop] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.innerWidth >= 768;
    } catch { return false; }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(!!e.matches);
    try {
      mq.addEventListener('change', handler);
    } catch {
      mq.addListener(handler);
    }
    setIsDesktop(!!mq.matches);
    return () => {
      try { mq.removeEventListener('change', handler); } catch { mq.removeListener(handler); }
    };
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900">Yoonema</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Main nav for md+ screens */}
        {displayUser && (
          <div
            className="items-center gap-2 flex-shrink-0 flex-wrap"
            style={{ display: isDesktop ? 'flex' : 'none' }}
          >
            {displayUser.role === 'student' && [
              { label: 'Accueil', path: '/home', icon: '🏠' },
              { label: 'Commandes', path: '/orders', icon: '📦' },
              { label: 'Notifications', path: '/notifications', icon: '🔔' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {displayUser.role === 'vendor' && [
              { label: 'Tableau de bord', path: '/vendor', icon: '📊' },
              { label: 'Commandes', path: '/vendor/orders', icon: '🍽️' },
              { label: 'Menu', path: '/vendor/menu', icon: '📋' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {displayUser.role === 'delivery' && [
              { label: 'Accueil', path: '/delivery', icon: '🏠' },
              { label: 'Historique', path: '/delivery/history', icon: '📜' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {displayUser.role === 'admin' && [
              { label: 'Tableau de bord', path: '/admin', icon: '📊' },
              { label: 'Restaurants', path: '/admin/restaurants', icon: '🍴' },
              { label: 'Utilisateurs', path: '/admin/users', icon: '👥' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

          </div>
        )}

        {displayUser && (
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{displayUser.name}</p>
            <p className="text-xs text-gray-600">
              {displayUser.role === 'student' && 'Étudiant'}
              {displayUser.role === 'vendor' && 'Vendeur'}
              {displayUser.role === 'delivery' && 'Livreur'}
              {displayUser.role === 'admin' && 'Admin'}
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
        >
          👤
        </button>
      </div>
    </div>
  );
}
