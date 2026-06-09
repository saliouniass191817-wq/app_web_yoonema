import { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { authAPI } from '../api';

export function useAuth() {
  const { user, token, role, setAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      if (response.data?.user && response.data?.token) {
        const user = response.data.user;
        const token = response.data.token;
        const role = response.data.user.role;

        setAuth(user, token, role);

        // Keep the single-token key for axios interceptor
        localStorage.setItem('yoonema_token', token);

        // Persist the zustand `yoonema_auth` entry as well to avoid
        // a rehydration race where the persisted state (null) can
        // overwrite the just-set auth state and cause an immediate
        // redirect back to `/login`.
        try {
          localStorage.setItem(
            'yoonema_auth',
            JSON.stringify({ state: { user, token, role } })
          );
        } catch (e) {
          // ignore storage errors
        }

        return response.data;
      }
    } catch (err) {
      const message = err.message || 'Erreur de connexion';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout_ = () => {
    logout();
    localStorage.removeItem('yoonema_token');
    localStorage.removeItem('yoonema_auth');
  };

  const fetchMe = async () => {
    try {
      const response = await authAPI.me();
      const user = response?.data?.user ?? response?.data;
      if (user?.id) {
        setAuth(user, token, user.role);
      }
    } catch (err) {
      // Only logout if it's an auth error (has success: false from API)
      // Network errors and other issues should not trigger logout
      if (err && typeof err === 'object' && err.success === false) {
        console.error('Auth token invalid, logging out:', err);
        logout_();
      }
      // Silently ignore other errors - don't logout on network issues
    }
  };

  return {
    user,
    token,
    role,
    loading,
    error,
    isAuthenticated: !!token,
    login: loginUser,
    logout: logout_,
    fetchMe,
  };
}

export function useRequireAuth(roles = []) {
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
    if (roles.length > 0 && !roles.includes(role)) {
      window.location.href = '/';
    }
  }, [isAuthenticated, role]);

  return { isAuthenticated, role };
}
