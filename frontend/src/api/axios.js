import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('yoonema_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('yoonema_token');
      localStorage.removeItem('yoonema_user');
      window.location.href = '/login';
    }

    if (error.response?.status === 429) {
      return Promise.reject({
        success: false,
        message: 'Trop de requêtes. Veuillez patienter quelques secondes.',
      });
    }

    if (!error.response) {
      return Promise.reject({
        success: false,
        message: 'Serveur backend inaccessible.',
      });
    }

    return Promise.reject(error.response.data || {
      success: false,
      message: 'Erreur inconnue.',
    });
  }
);

export default api;
