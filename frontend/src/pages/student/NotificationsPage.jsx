import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Commande confirmée',
      message: 'Votre commande #123456 a été confirmée',
      type: 'success',
      timestamp: new Date(),
      read: false,
    },
    {
      id: 2,
      title: 'Livraison en cours',
      message: 'Votre livreur est en route',
      type: 'info',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error',
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>

        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-2xl mb-2">🔔</p>
            <p>Aucune notification</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={notification.read ? 'opacity-60' : ''}
              >
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Badge variant={typeMap[notification.type]}>
                          {notification.read ? 'Lu' : 'Nouveau'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {notification.timestamp.toLocaleString('fr-FR')}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
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
