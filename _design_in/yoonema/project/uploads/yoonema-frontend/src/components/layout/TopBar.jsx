import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { notificationAPI } from '../../api';
import { supabase } from '../../lib/supabase';
import { Icon } from '../ui/Icon';

const profilePaths = {
  student: '/profile',
  vendor: '/vendor/profile',
  delivery: '/delivery/profile',
  admin: '/admin/profile',
};

const ROLE_LABELS = { student: 'Étudiant', vendor: 'Vendeur', delivery: 'Livreur', admin: 'Admin' };

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
  } catch {
    fallbackUser = null;
  }
  const displayUser = user ?? fallbackUser;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!displayUser?.id || displayUser.role !== 'student') return undefined;

    const loadUnread = async () => {
      try {
        const response = await notificationAPI.getUnreadCount();
        setUnreadCount(response.data?.count ?? 0);
      } catch {
        setUnreadCount(0);
      }
    };

    loadUnread();

    const channel = supabase
      .channel(`notifications-${displayUser.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${displayUser.id}` },
        loadUnread
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [displayUser?.id, displayUser?.role]);

  const profilePath = profilePaths[displayUser?.role] || '/profile';
  const firstName = (displayUser?.name || '').split(' ')[0];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200/70 bg-white/85 px-4 py-3 backdrop-blur-md md:px-6">
      {/* Mobile brand */}
      <div className="flex items-center gap-2 md:hidden">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-500 text-white">
          <Icon name="utensils" size={18} strokeWidth={2} />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-gray-900">Yoonema</span>
      </div>

      {/* Desktop greeting */}
      <div className="hidden md:block">
        {firstName && (
          <p className="text-sm text-gray-500">
            Bonjour, <span className="font-semibold text-gray-900">{firstName}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {displayUser?.role === 'student' && (
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative grid h-10 w-10 place-items-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Notifications"
          >
            <Icon name="bell" size={21} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-danger-500 px-1 text-[10px] font-bold leading-4 text-white ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate(profilePath)}
          className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-gray-100 sm:pr-3"
          aria-label="Profil"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 text-sm font-bold uppercase text-orange-700">
            {(displayUser?.name || '?').charAt(0)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-4 text-gray-900">{displayUser?.name}</span>
            <span className="block text-xs text-gray-500">{ROLE_LABELS[displayUser?.role] || ''}</span>
          </span>
        </button>
      </div>
    </header>
  );
}

export default TopBar;
