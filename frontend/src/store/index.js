import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI } from '../api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      loading: false,
      initialized: false,
      error: null,

      setAuth: (user, token, role) => {
        set({ user, token, role });
        try {
          if (token) localStorage.setItem('yoonema_token', token);
          localStorage.setItem('yoonema_auth', JSON.stringify({ state: { user, token, role } }));
        } catch (e) {}
      },

      logout: () => {
        set({ user: null, token: null, role: null });
        try {
          localStorage.removeItem('yoonema_token');
          localStorage.removeItem('yoonema_auth');
        } catch (e) {}
      },

      setUser: (user) => set({ user }),

      initialize: async () => {
        if (get().initialized) return;
        set({ loading: true, error: null });

        try {
          const token = get().token || localStorage.getItem('yoonema_token');
          if (token) {
            // axios interceptor reads localStorage token, but ensure it's set
            try { localStorage.setItem('yoonema_token', token); } catch (e) {}
            const response = await authAPI.me();
            const user = response?.data?.user ?? response?.data;
            if (user?.id) {
              set({ user, initialized: true, error: null });
              return;
            }
          }
          set({ user: null, initialized: true, error: null });
        } catch (err) {
          set({ user: null, initialized: true, error: null });
        } finally {
          set({ loading: false });
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          const response = await authAPI.login(email, password);
          const user = response?.data?.user ?? response?.data;
          const token = response?.data?.token ?? null;
          set({ user, token, initialized: true, error: null });
          try {
            if (token) localStorage.setItem('yoonema_token', token);
            localStorage.setItem('yoonema_auth', JSON.stringify({ state: { user, token, role: user?.role } }));
          } catch (e) {}

          return {
            success: true,
            user,
            message: response?.message ?? 'Connexion reussie.',
          };
        } catch (err) {
          const message = err?.message ?? 'Erreur de connexion.';
          set({ user: null, error: message });
          return { success: false, user: null, message, errors: err?.errors ?? null };
        } finally {
          set({ loading: false });
        }
      },

      register: async (type, data) => {
        set({ loading: true, error: null });

        try {
          const registerByType = {
            student: authAPI.registerStudent,
            vendor: authAPI.registerVendor,
            delivery: authAPI.registerDelivery,
          };

          const register = registerByType[type];

          if (!register) throw new Error('Type de compte invalide.');

          const response = await register(data);
          const user = response?.data?.user ?? response?.data;
          const token = response?.data?.token ?? null;
          set({ user, token, initialized: true, error: null });
          try {
            if (token) localStorage.setItem('yoonema_token', token);
            localStorage.setItem('yoonema_auth', JSON.stringify({ state: { user, token, role: user?.role } }));
          } catch (e) {}

          return {
            success: true,
            user,
            message: response?.message ?? 'Compte cree avec succes.',
          };
        } catch (err) {
          const message = err?.message ?? "Erreur d'inscription.";
          set({ error: message });
          return { success: false, user: null, message, errors: err?.errors ?? null };
        } finally {
          set({ loading: false });
        }
      },

      logoutAction: async () => {
        set({ loading: true, error: null });

        try {
          await authAPI.logout();
        } catch {
          // ignore
        } finally {
          set({ user: null, token: null, role: null, loading: false, initialized: true, error: null });
          try {
            localStorage.removeItem('yoonema_token');
            localStorage.removeItem('yoonema_auth');
          } catch (e) {}
        }
      },

      roleRedirect: () => {
        return get().user?.role === 'student'
          ? '/home'
          : get().user?.role === 'vendor'
          ? '/vendor'
          : get().user?.role === 'delivery'
          ? '/delivery'
          : get().user?.role === 'admin'
          ? '/admin'
          : '/login';
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'yoonema_auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token, role: state.role }),
    }
  )
);

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      restaurantId: null,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
          ),
        })),

      setRestaurant: (restaurantId) => set({ restaurantId }),

      clear: () => set({ items: [], restaurantId: null }),

      getTotal: () => {
        const state = useCartStore.getState();
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const state = useCartStore.getState();
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'yoonema_cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, restaurantId: state.restaurantId }),
    }
  )
);

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { id: Date.now(), ...notification },
        ...state.notifications,
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clear: () => set({ notifications: [] }),
}));
