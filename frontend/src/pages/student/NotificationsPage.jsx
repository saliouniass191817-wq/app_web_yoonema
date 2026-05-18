import React, { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
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
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>

        {notifications.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="Aucune notification"
            subtitle="Les nouvelles informations sur vos commandes apparaîtront ici."
            actionLabel="Retour"
            onAction={() => window.history.back()}
          />
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.is_read ? 'opacity-60' : ''}>
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Badge variant={notification.is_read ? 'default' : 'info'}>
                          {notification.is_read ? 'Lu' : 'Nouveau'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.body}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(notification.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-sm font-medium text-orange-500 hover:text-orange-600"
                      >
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
