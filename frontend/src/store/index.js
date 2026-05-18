import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,

      setAuth: (user, token, role) =>
        set({ user, token, role }),

      logout: () =>
        set({ user: null, token: null, role: null }),

      setUser: (user) =>
        set({ user }),
    }),
    {
      name: 'yoonema_auth',
      storage: localStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
      }),
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

      setRestaurant: (restaurantId) =>
        set({ restaurantId }),

      clear: () =>
        set({ items: [], restaurantId: null }),

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

  clear: () =>
    set({ notifications: [] }),
}));
