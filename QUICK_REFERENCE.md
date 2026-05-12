# Yoonema Quick Reference

## 📋 Project Overview
Full-stack food delivery platform with React frontend and Laravel backend supporting 4 user roles.

## 🚀 Quick Start

```bash
# Backend
cd backend && composer install && php artisan migrate --seed && php artisan serve

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## 👥 User Roles

| Role | Features | Entry Point |
|------|----------|-------------|
| **Student** | Browse restaurants, order food, track orders | `/home` |
| **Vendor** | Manage restaurant/menu, view orders, stats | `/vendor` |
| **Delivery** | View orders, accept delivery, track | `/delivery` |
| **Admin** | Approve vendors, manage users, view stats | `/admin` |

## 🔑 Test Login Credentials

```
Email: student@example.com    / Password: password123
Email: vendor@example.com     / Password: password123  
Email: delivery@example.com   / Password: password123
Email: admin@example.com      / Password: password123
```

## 📂 Project Structure

```
frontend/src/
├── api/              # API client & endpoints
├── components/       # UI, Shared, Layout components
├── hooks/            # Custom React hooks
├── pages/            # Page components (student/vendor/delivery/admin)
├── store/            # Zustand state management
├── lib/              # Utilities & helpers
└── router/           # React Router configuration

backend/app/
├── Http/             # Controllers, Middleware, Requests, Resources
├── Models/           # Eloquent models
├── Services/         # Business logic
└── Providers/        # Service providers
```

## 🛠️ Common Tasks

### Add New Page
```jsx
// 1. Create file: src/pages/student/NewPage.jsx
// 2. Add route in src/router/index.jsx
// 3. Use AppLayout wrapper
```

### Add New Component
```jsx
// 1. Create src/components/shared/NewComponent.jsx
// 2. Export function
// 3. Import and use
```

### Add New API Endpoint

**Backend:**
```php
// routes/api.php
Route::get('/new-endpoint', [Controller::class, 'method']);
```

**Frontend:**
```javascript
// src/api/index.js
export const api_name = {
  method: () => api.get('/new-endpoint'),
};
```

### Call API in Component
```jsx
import { useAuth } from '../hooks/useAuth';
import { apiName } from '../api';

const { user } = useAuth();
const data = await apiName.method();
```

## 🎨 Tailwind Classes Quick Reference

```jsx
// Spacing: p-4 (padding), m-2 (margin), gap-2 (flex gap)
// Grid: grid grid-cols-2 (responsive: md:grid-cols-3)
// Flex: flex justify-between items-center
// Colors: bg-orange-500, text-gray-700, border-orange-200
// Responsive: hidden md:block (hidden on mobile)
// Text: text-sm, font-bold, text-center
```

## 🔗 API Endpoints Summary

### Auth
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `GET /auth/me`

### Student
- `GET /restaurants` (with filters)
- `GET /restaurants/{id}`
- `GET /menu/{restaurantId}`
- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `POST /orders/{id}/cancel`

### Vendor
- `POST /vendor/restaurant`
- `PUT /vendor/restaurant`
- `POST /vendor/menu`
- `PUT /vendor/menu/{id}`
- `DELETE /vendor/menu/{id}`
- `GET /vendor/orders`
- `PUT /vendor/orders/{id}/status`

### Delivery
- `GET /delivery/available`
- `POST /delivery/accept/{orderId}`
- `PUT /delivery/complete/{orderId}`
- `GET /delivery/history`
- `PUT /delivery/availability`

### Admin
- `GET /admin/stats`
- `GET /admin/restaurants`
- `PUT /admin/restaurants/{id}/approve`
- `GET /admin/users`
- `PUT /admin/users/{id}/status`

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.3 | UI framework |
| React Router | 6.22 | Routing |
| Zustand | 4.4 | State management |
| Axios | 1.6 | HTTP client |
| Tailwind CSS | 3.4 | Styling |
| Supabase JS | 2.38 | Real-time DB |
| Vite | 5.0 | Build tool |

## 🔐 Authentication Flow

```
1. User enters credentials
2. Frontend sends POST /auth/login
3. Backend validates and returns JWT token
4. Frontend stores token in localStorage
5. Axios automatically adds token to requests
6. Backend validates token in middleware
7. Routes check user role
```

## 💾 State Management Examples

```javascript
// Auth Store
const { user, token, role, setAuth, logout } = useAuthStore();

// Cart Store  
const { items, addItem, removeItem, total } = useCartStore();

// Notifications
const { success, error } = useNotifications();
notify('Message', 'type', duration);
```

## 🧪 Testing Flows

```
Student Flow:
1. Login as student → /home
2. Click restaurant → /restaurant/{id}
3. Add items to cart
4. Go to /cart → checkout
5. View /orders → track status

Vendor Flow:
1. Login as vendor → /vendor
2. Manage menu at /vendor/menu
3. View orders at /vendor/orders
4. Update order status

Admin Flow:
1. Login as admin → /admin
2. Approve restaurants
3. Manage users
```

## 🐛 Debugging Tips

```javascript
// Check auth state
console.log(useAuthStore.getState());

// Check cart state
console.log(useCartStore.getState());

// Check API response
import { api } from './api/axios';
api.get('/endpoint').then(r => console.log(r.data));

// View logs
// Backend: storage/logs/laravel.log
// Browser: DevTools Console & Network tabs
```

## 📱 Responsive Breakpoints (Tailwind)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Usage: `md:grid-cols-3 lg:grid-cols-4`

## 🚀 Deployment Commands

```bash
# Build frontend
npm run build

# Build backend (production)
composer install --no-dev --optimize-autoloader

# Database migration (production)
php artisan migrate --force

# Clear cache
php artisan config:cache
php artisan route:cache
```

## 📚 File Locations Reference

| Purpose | Location |
|---------|----------|
| Pages | `src/pages/{role}/` |
| Components | `src/components/{ui\|shared\|layout}/` |
| Hooks | `src/hooks/useXxx.js` |
| Stores | `src/store/index.js` |
| API | `src/api/index.js` |
| Routes | `src/router/index.jsx` |
| Styles | `src/styles/` |
| Utils | `src/lib/utils.js` |

## 🎯 Common Component Props

```jsx
// Button
<Button variant="primary" size="lg" loading={false}>Text</Button>

// Input
<Input label="Email" error="Invalid" required />

// Card
<Card>
  <CardHeader title="Title" />
  <CardBody>Content</CardBody>
  <CardFooter>Action buttons</CardFooter>
</Card>

// Modal
<Modal open={isOpen} onClose={handleClose}>
  Content
</Modal>

// Badge
<Badge variant="success">Delivered</Badge>
```

## ✅ Pre-Launch Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Database migrated with seeded data
- [ ] `.env` files configured
- [ ] Can login with test credentials
- [ ] Can browse restaurants
- [ ] Can place order
- [ ] Can track order status
- [ ] Mobile responsive works
- [ ] No console errors

## 📞 Quick Support

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process or use different port |
| Database error | Run `php artisan migrate --seed` |
| Modules not found | Run `npm install` or `composer install` |
| Token expired | Refresh page or logout/login |
| API 404 | Check route is registered and API running |
| CORS error | Check backend CORS config |

## 🌟 Pro Tips

1. Use Redux DevTools for Zustand: `zustand/middleware/devtools`
2. Add TypeScript for type safety
3. Use React Query for better API management
4. Implement error boundaries for robustness
5. Add loading skeletons for better UX
6. Use environment variables for all configs
7. Keep components small and focused
8. Use Git branches for features

---

**Keep this handy during development! For detailed info, see README.md, DEVELOPMENT.md, or DEPLOYMENT.md**
