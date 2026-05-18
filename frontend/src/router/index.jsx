import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store';

// Layout
import { AppLayout } from '../components/layout/AppLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Student Pages
import StudentHomePage from '../pages/student/HomePage';
import RestaurantDetailPage from '../pages/student/RestaurantDetailPage';
import CartPage from '../pages/student/CartPage';
import OrdersPage from '../pages/student/OrdersPage';
import OrderDetailPage from '../pages/student/OrderDetailPage';
import OrderSuccessPage from '../pages/student/OrderSuccessPage';
import NotificationsPage from '../pages/student/NotificationsPage';
import RatingPage from '../pages/student/RatingPage';
import ProfilePage from '../pages/student/ProfilePage';

// Vendor Pages
import VendorDashboardPage from '../pages/vendor/DashboardPage';
import VendorOrdersPage from '../pages/vendor/OrdersPage';
import VendorMenuPage from '../pages/vendor/MenuPage';
import VendorStatsPage from '../pages/vendor/StatsPage';
import VendorProfilePage from '../pages/vendor/ProfilePage';
import VendorSetupPage from '../pages/vendor/SetupPage';
import { VendorShell, VendorAppLayout } from '../components/vendor/VendorShell';

// Delivery Pages
import DeliveryDashboardPage from '../pages/delivery/DashboardPage';
import DeliveryHistoryPage from '../pages/delivery/HistoryPage';
import DeliveryProfilePage from '../pages/delivery/ProfilePage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/DashboardPage';
import AdminRestaurantsPage from '../pages/admin/RestaurantsPage';
import AdminOrdersPage from '../pages/admin/OrdersPage';
import AdminUsersPage from '../pages/admin/UsersPage';
import AdminDeliveryPage from '../pages/admin/DeliveryPage';
import AdminFinancialPage from '../pages/admin/FinancialPage';

// Protected Route Component
function ProtectedRoute({ children, requiredRoles = [] }) {
  const { isAuthenticated, role } = useAuth();
  
  // Fallback check: if Zustand hasn't hydrated yet, check localStorage directly
  const tokenInStorage = localStorage.getItem('yoonema_token');
  let storedRole = null;
  try {
    const authDataInStorage = localStorage.getItem('yoonema_auth');
    if (authDataInStorage) {
      const parsed = JSON.parse(authDataInStorage);
      storedRole = parsed.state?.role;
    }
  } catch (e) {
    // ignore parse errors
  }
  
  const isAuthenticatedFallback = !!(tokenInStorage || storedRole);
  const finalIsAuthenticated = isAuthenticated || isAuthenticatedFallback;
  const finalRole = role || storedRole;

  if (!finalIsAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(finalRole)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default function AppRouter() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Redirect root based on role */}
        <Route
          path="/"
          element={
            (() => {
              // Check localStorage as fallback in case Zustand hasn't hydrated yet
              const tokenInStorage = localStorage.getItem('yoonema_token');
              let storedRole = null;
              try {
                const authDataInStorage = localStorage.getItem('yoonema_auth');
                if (authDataInStorage) {
                  const parsed = JSON.parse(authDataInStorage);
                  storedRole = parsed.state?.role;
                }
              } catch (e) {
                // ignore parse errors
              }
              
              const isAuth = isAuthenticated || !!tokenInStorage;
              const finalRole = role || storedRole;

              if (isAuth) {
                if (finalRole === 'student') {
                  return <Navigate to="/home" />;
                } else if (finalRole === 'vendor') {
                  return <Navigate to="/vendor" />;
                } else if (finalRole === 'delivery') {
                  return <Navigate to="/delivery" />;
                } else if (finalRole === 'admin') {
                  return <Navigate to="/admin" />;
                }
              }
              
              return <Navigate to="/login" />;
            })()
          }
        />

        {/* Student Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute requiredRoles={['student']}>
              <StudentHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/:id"
          element={
            <ProtectedRoute requiredRoles={['student']}>
              <RestaurantDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute requiredRoles={['student']}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute requiredRoles={['student']}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute requiredRoles={['student']}>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id/success"
          element={
            <ProtectedRoute requiredRoles={['student']}>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId/rate"
          element={
            <ProtectedRoute requiredRoles={['student']}>
              <RatingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Vendor Routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute requiredRoles={['vendor']}>
              <VendorShell />
            </ProtectedRoute>
          }
        >
          <Route path="setup" element={<VendorSetupPage />} />
          <Route element={<VendorAppLayout />}>
            <Route index element={<VendorDashboardPage />} />
            <Route path="orders" element={<VendorOrdersPage />} />
            <Route path="menu" element={<VendorMenuPage />} />
            <Route path="stats" element={<VendorStatsPage />} />
            <Route path="profile" element={<VendorProfilePage />} />
          </Route>
        </Route>

        {/* Delivery Routes */}
        <Route
          path="/delivery"
          element={
            <ProtectedRoute requiredRoles={['delivery']}>
              <DeliveryDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/history"
          element={
            <ProtectedRoute requiredRoles={['delivery']}>
              <DeliveryHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/profile"
          element={
            <ProtectedRoute requiredRoles={['delivery']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/restaurants"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminRestaurantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/delivery"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminDeliveryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/finance"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminFinancialPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
