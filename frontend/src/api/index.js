import api from './axios';

export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  registerStudent: (data) =>
    api.post('/auth/register/student', data),

  registerVendor: (data) =>
    api.post('/auth/register/vendor', data),

  registerDelivery: (data) =>
    api.post('/auth/register/delivery', data),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get('/auth/me'),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token, password, password_confirmation) =>
    api.post('/auth/reset-password', {
      token,
      password,
      password_confirmation,
    }),
};

export const restaurantAPI = {
  getAll: (filters = {}) =>
    api.get('/restaurants', { params: filters }),

  getById: (id) =>
    api.get(`/restaurants/${id}`),

  getMenu: (id) =>
    api.get(`/restaurants/${id}/menu`),

  getAvailableDeliveryPersons: () =>
    api.get('/delivery-persons'),
};

export const orderAPI = {
  create: (data) =>
    api.post('/orders', data),

  getAll: (filters = {}) =>
    api.get('/orders', { params: filters }),

  getById: (id) =>
    api.get(`/orders/${id}`),

  cancel: (id, reason) =>
    api.post(`/orders/${id}/cancel`, { reason }),
};

export const reviewAPI = {
  create: (data) =>
    api.post('/reviews', data),
};

export const vendorAPI = {
  getRestaurant: () =>
    api.get('/vendor/restaurant'),

  updateRestaurant: (data) =>
    api.put('/vendor/restaurant', data),

  getMenu: () =>
    api.get('/vendor/menu'),

  createMenuItem: (data) =>
    api.post('/vendor/menu', data),

  updateMenuItem: (id, data) =>
    api.put(`/vendor/menu/${id}`, data),

  deleteMenuItem: (id) =>
    api.delete(`/vendor/menu/${id}`),

  getOrders: (filters = {}) =>
    api.get('/vendor/orders', { params: filters }),

  updateOrderStatus: (id, status) =>
    api.put(`/vendor/orders/${id}/status`, { status }),

  refuseOrder: (id, reason) =>
    api.post(`/vendor/orders/${id}/refuse`, { reason }),

  getStats: (period = 'today') =>
    api.get('/vendor/stats', { params: { period } }),
};

export const deliveryAPI = {
  getOrders: () =>
    api.get('/delivery/orders'),

  acceptOrder: (id) =>
    api.put(`/delivery/orders/${id}/accept`),

  refuseOrder: (id, reason) =>
    api.post(`/delivery/orders/${id}/refuse`, { reason }),

  completeDelivery: (id) =>
    api.put(`/delivery/orders/${id}/delivered`),

  getHistory: (filters = {}) =>
    api.get('/delivery/history', { params: filters }),

  toggleAvailability: (is_available) =>
    api.put('/delivery/availability', { is_available }),
};

export const adminAPI = {
  getStats: () =>
    api.get('/admin/stats'),

  getRestaurants: (filters = {}) =>
    api.get('/admin/restaurants', { params: filters }),

  approveRestaurant: (id) =>
    api.put(`/admin/restaurants/${id}/approve`),

  rejectRestaurant: (id, reason) =>
    api.put(`/admin/restaurants/${id}/reject`, { reason }),

  getUsers: (filters = {}) =>
    api.get('/admin/users', { params: filters }),

  toggleUserStatus: (id) =>
    api.put(`/admin/users/${id}/toggle`),

  getOrders: (filters = {}) =>
    api.get('/admin/orders', { params: filters }),

  getNotifications: (filters = {}) =>
    api.get('/admin/notifications', { params: filters }),
};
