import React, { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { notificationAPI } from '../../api';
import { supabase } from '../../lib/supabase';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data || []);
    } catch {
      setNotifications([]);
    }
  }, [user?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!user?.id) return undefined;

    const channel = supabase
      .channel(`notifications-page-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => loadNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, loadNotifications]);

  const handleMarkAsRead = async (id) => {
    await notificationAPI.markRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Notifications</h1>

        {notifications.length === 0 ? (
          <EmptyState
            icon="bell"
            title="Aucune notification"
            subtitle="Les mises à jour de tes commandes apparaîtront ici."
            actionLabel="Retour"
            onAction={() => window.history.back()}
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 ${notification.is_read ? '' : 'bg-orange-50/40 ring-1 ring-orange-100'}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                      notification.is_read ? 'bg-gray-100 text-gray-400' : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    <Icon name="bell" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      {!notification.is_read && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-600">{notification.body}</p>
                    <p className="mt-1.5 text-xs text-gray-400">
                      {new Date(notification.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="shrink-0 text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                      Marquer lu
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
