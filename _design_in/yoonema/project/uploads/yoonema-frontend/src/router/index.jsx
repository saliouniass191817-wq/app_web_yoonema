import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Vendor layout/shell (small, kept eager for nested routes)
import { VendorShell, VendorAppLayout } from '../components/vendor/VendorShell';

// Pages are lazy-loaded so each role only downloads its own bundle.
// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));

// Student Pages
const StudentHomePage = lazy(() => import('../pages/student/HomePage'));
const RestaurantDetailPage = lazy(() => import('../pages/student/RestaurantDetailPage'));
const CartPage = lazy(() => import('../pages/student/CartPage'));
const OrdersPage = lazy(() => import('../pages/student/OrdersPage'));
const OrderDetailPage = lazy(() => import('../pages/student/OrderDetailPage'));
const OrderSuccessPage = lazy(() => import('../pages/student/OrderSuccessPage'));
const NotificationsPage = lazy(() => import('../pages/student/NotificationsPage'));
const RatingPage = lazy(() => import('../pages/student/RatingPage'));
const ProfilePage = lazy(() => import('../pages/student/ProfilePage'));

// Vendor Pages
const VendorDashboardPage = lazy(() => import('../pages/vendor/DashboardPage'));
const VendorOrdersPage = lazy(() => import('../pages/vendor/OrdersPage'));
const VendorMenuPage = lazy(() => import('../pages/vendor/MenuPage'));
const VendorStatsPage = lazy(() => import('../pages/vendor/StatsPage'));
const VendorProfilePage = lazy(() => import('../pages/vendor/ProfilePage'));
const VendorSetupPage = lazy(() => import('../pages/vendor/SetupPage'));

// Delivery Pages
const DeliveryDashboardPage = lazy(() => import('../pages/delivery/DashboardPage'));
const DeliveryHistoryPage = lazy(() => import('../pages/delivery/HistoryPage'));
const DeliveryProfilePage = lazy(() => import('../pages/delivery/ProfilePage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const AdminRestaurantsPage = lazy(() => import('../pages/admin/RestaurantsPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/OrdersPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/UsersPage'));
const AdminDeliveryPage = lazy(() => import('../pages/admin/DeliveryPage'));
const AdminFinancialPage = lazy(() => import('../pages/admin/FinancialPage'));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Chargement…
    </div>
  );
}

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
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </Router>
  );
}
