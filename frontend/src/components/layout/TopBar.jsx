import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { notificationAPI } from '../../api';
import { supabase } from '../../lib/supabase';
import { Icon } from '../ui/Icon';

const profilePaths = { student: '/profile', vendor: '/vendor/profile', delivery: '/delivery/profile', admin: '/admin/profile' };

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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${displayUser.id}` }, loadUnread)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [displayUser?.id, displayUser?.role]);

  const profilePath = profilePaths[displayUser?.role] || '/profile';
  const firstName = (displayUser?.name || '').split(' ')[0];

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="avatar" onClick={() => navigate(profilePath)} aria-label="Profil">
          {(displayUser?.name || '?').charAt(0)}
        </button>
        <div style={{ flex: 1, lineHeight: 1.15 }}>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 600 }}>Bonjour 👋</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{firstName || 'Bienvenue'}</div>
        </div>
        {displayUser?.role === 'student' && (
          <button className="icon-btn" onClick={() => navigate('/notifications')} aria-label="Notifications">
            <Icon name="bell" size={20} />
            {unreadCount > 0 && <span className="dot-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>
        )}
      </div>
    </div>
  );
}

export default TopBar;
