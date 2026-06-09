import { create } from 'zustand';
import { notificationAPI } from '../api';

let toastId = 0;

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  toasts: [],
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });

    try {
      const response = await notificationAPI.getAll();
      set({ notifications: response?.data ?? [], error: null });
    } catch (err) {
      set({ error: err?.message ?? 'Erreur de chargement des notifications.' });
    } finally {
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      set({ unreadCount: Number(response?.data?.count) || 0 });
    } catch {
      set({ unreadCount: 0 });
    }
  },

  markRead: async (id) => {
    await notificationAPI.markRead(id);
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllRead: async () => {
    await notificationAPI.markAllRead();
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, is_read: true })),
      unreadCount: 0,
    }));
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications.filter((item) => item.id !== notification.id)],
      unreadCount: notification.is_read ? state.unreadCount : state.unreadCount + 1,
    }));
  },

  pushToast: (message, type = 'info') => {
    const toast = { id: `toast-${Date.now()}-${toastId += 1}`, message, type };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    return toast.id;
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },

  reset: () => set({ notifications: [], unreadCount: 0, toasts: [], loading: false, error: null }),
}));

export { useNotificationStore };
export default useNotificationStore;
