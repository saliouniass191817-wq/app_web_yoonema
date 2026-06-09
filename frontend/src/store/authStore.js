import { create } from 'zustand';
import { authAPI } from '../api';

const roleRedirects = {
  student: '/home',
  vendor: '/vendor',
  delivery: '/delivery',
  admin: '/admin',
};

const extractUser = (response) => response?.data?.user ?? null;

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  initialize: async () => {
    if (get().initialized) return;

    set({ loading: true, error: null });

    try {
      const response = await authAPI.me();
      set({ user: extractUser(response), initialized: true, error: null });
    } catch {
      set({ user: null, initialized: true, error: null });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await authAPI.login(email, password);
      const user = extractUser(response);
      set({ user, initialized: true, error: null });

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

      if (!register) {
        throw new Error('Type de compte invalide.');
      }

      const response = await register(data);
      const user = extractUser(response);
      set({ user, initialized: true, error: null });

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

  logout: async () => {
    set({ loading: true, error: null });

    try {
      await authAPI.logout();
    } catch {
      // The local session state must be cleared even if the server is unreachable.
    } finally {
      set({ user: null, loading: false, initialized: true, error: null });
    }
  },

  roleRedirect: () => roleRedirects[get().user?.role] ?? '/login',
  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
}));

export { useAuthStore };
export default useAuthStore;
