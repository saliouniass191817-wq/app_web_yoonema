import api from './axios';

export const notificationAPI = {
  getAll: () => api.get('/notifications'),

  getUnreadCount: () => api.get('/notifications/unread-count'),

  markRead: (id) => api.put(`/notifications/${id}/read`),

  markAllRead: () => api.put('/notifications/read-all'),
};

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

  initiatePayment: (id, payment_method) =>
    api.post(`/orders/${id}/initiate-payment`, { payment_method }),

  paymentStatus: (id) =>
    api.get(`/orders/${id}/payment-status`),
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

  getPayments: () =>
    api.get('/vendor/payments'),
};

export const deliveryAPI = {
  getOrders: () =>
    api.get('/delivery/orders'),

  acceptOrder: (id) =>
    api.post(`/delivery/orders/${id}/accept`),

  completeDelivery: (id) =>
    api.post(`/delivery/orders/${id}/delivered`),

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

  getFinance: () =>
    api.get('/admin/finance'),

  markPayoutProcessed: (id, payout_reference = null) =>
    api.put(`/admin/finance/payouts/${id}/processed`, { payout_reference }),
};
