import { useNotificationStore } from '../store';
import { useCallback } from 'react';

export function useNotifications() {
  const { notifications, addNotification, removeNotification, clear } =
    useNotificationStore();

  const notify = useCallback((message, type = 'info', duration = 3000) => {
    const id = addNotification({ message, type });

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [addNotification, removeNotification]);

  const success = useCallback(
    (message, duration = 3000) =>
      notify(message, 'success', duration),
    [notify]
  );

  const error = useCallback(
    (message, duration = 5000) =>
      notify(message, 'error', duration),
    [notify]
  );

  const warning = useCallback(
    (message, duration = 4000) =>
      notify(message, 'warning', duration),
    [notify]
  );

  return {
    notifications,
    notify,
    success,
    error,
    warning,
    removeNotification,
    clear,
  };
}
