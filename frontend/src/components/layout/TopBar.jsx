import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { notificationAPI } from '../../api';
import { supabase } from '../../lib/supabase';

const profilePaths = {
  student: '/profile',
  vendor: '/vendor/profile',
  delivery: '/delivery/profile',
  admin: '/admin/profile',
};

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

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 md:hidden">
        <h2 className="text-xl font-bold text-gray-900">Yoonema</h2>
      </div>

      <div className="hidden md:block flex-1" />

      <div className="flex items-center gap-3 md:gap-4">
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

        {displayUser?.role === 'student' && (
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Notifications"
          >
            <span className="text-lg">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate(profilePath)}
          className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
          aria-label="Profil"
        >
          👤
        </button>
      </div>
    </div>
  );
}
