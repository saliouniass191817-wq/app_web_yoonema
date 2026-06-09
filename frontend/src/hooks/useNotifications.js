import { useNotificationStore } from '../store/notificationStore';
import { useCallback } from 'react';

export function useNotifications() {
  const { toasts = [], pushToast, removeToast, reset } = useNotificationStore();

  const notify = useCallback((message, type = 'info', duration = 3000) => {
    const id = pushToast(message, type);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [pushToast, removeToast]);

  const success = useCallback((message, duration = 3000) => notify(message, 'success', duration), [notify]);
  const error = useCallback((message, duration = 5000) => notify(message, 'error', duration), [notify]);
  const warning = useCallback((message, duration = 4000) => notify(message, 'warning', duration), [notify]);

  return {
    notifications: toasts,
    notify,
    success,
    error,
    warning,
    removeNotification: removeToast,
    clear: reset,
  };
}
