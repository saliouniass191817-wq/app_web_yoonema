# Yoonema - Development Guide

## Project Overview

Yoonema is a campus food delivery platform with a Laravel backend API and React frontend application. The system supports 4 user roles: Students, Vendors (Restaurants), Delivery Personnel, and Administrators.

## Architecture Overview

```
┌─────────────────────┐         ┌──────────────────────┐
│   React Frontend    │◄────────►│   Laravel Backend    │
│   (React 18/Vite)   │  Axios   │   (Laravel 11 API)   │
└─────────────────────┘         └──────────────────────┘
         │                               │
         │                               │
    Zustand State            PostgreSQL Database
    Management               Supabase Realtime
```

## Getting Started

### Prerequisites
- PHP 8.2+ with composer
- Node.js 18+ with npm
- PostgreSQL/MySQL
- Git

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd yoonema

# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev
```

## Code Structure

### Backend (`/backend`)

#### Controllers Location: `app/Http/Controllers/Api/`
- `AuthController` - Authentication logic
- `StudentController` - Student operations
- `VendorController` - Vendor operations
- `DeliveryController` - Delivery operations
- `AdminController` - Admin operations

**Example Controller:**
```php
<?php
namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('student_id', $request->user)
            ->latest()
            ->paginate(20);
        
        return OrderResource::collection($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|uuid|exists:restaurants,id',
            'items' => 'required|array',
        ]);

        $order = Order::create($validated);
        return new OrderResource($order);
    }
}
```

#### Models Location: `app/Models/`
- User, Restaurant, MenuItem, Order, Review, Notification

**Model Relationships:**
```php
// User -> Orders (has many)
// Restaurant -> MenuItems (has many)
// Order -> Items (JSON or pivot table)
// User -> Reviews (has many)
```

#### Middleware Location: `app/Http/Middleware/`
- `SupabaseAuth` - Validate JWT tokens
- `RoleMiddleware` - Check user roles

**Usage in Routes:**
```php
Route::middleware(['auth:supabase', 'role:student'])
    ->get('/orders', [OrderController::class, 'index']);
```

### Frontend (`/frontend/src`)

#### File Organization

```
src/
├── api/           # API configuration & endpoints
├── components/    # React components
├── hooks/         # Custom hooks
├── pages/         # Page components
├── store/         # Zustand stores
├── lib/           # Utilities & helpers
└── router/        # React Router config
```

#### Component Patterns

**Functional Component:**
```jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function MyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // API call
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        {/* Content */}
      </Card>
    </div>
  );
}
```

#### Using Hooks

```jsx
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNotifications } from '../hooks/useNotifications';

export default function Component() {
  const { user, logout } = useAuth();
  const { items, addItem } = useCart();
  const { success, error } = useNotifications();

  const handleAddToCart = (item) => {
    addItem(item);
    success('Added to cart');
  };

  return <div>{/* Component JSX */}</div>;
}
```

#### State Management with Zustand

```jsx
import { useAuthStore } from '../store';

// Get values
const user = useAuthStore((state) => state.user);

// Set values
const { setAuth } = useAuthStore();
setAuth(user, token, role);
```

## Common Development Tasks

### Adding a New API Endpoint

**1. Create backend route:**
```php
// routes/api.php
Route::get('/students/dashboard', [StudentController::class, 'dashboard']);
```

**2. Create controller method:**
```php
public function dashboard(Request $request)
{
    $stats = [
        'total_orders' => Order::where('student_id', $request->user)->count(),
        'pending_orders' => Order::where('student_id', $request->user)
            ->whereIn('status', ['pending', 'preparing'])
            ->count(),
    ];
    
    return response()->json(['success' => true, 'data' => $stats]);
}
```

**3. Add API client method:**
```javascript
// frontend/src/api/index.js
export const studentAPI = {
  getDashboard: () => api.get('/students/dashboard'),
};
```

**4. Use in component:**
```jsx
const { data } = await studentAPI.getDashboard();
setStats(data);
```

### Adding a New Page

**1. Create page file:**
```jsx
// frontend/src/pages/student/MyNewPage.jsx
import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';

export default function MyNewPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4">
        {/* Page content */}
      </div>
    </AppLayout>
  );
}
```

**2. Add route:**
```jsx
// frontend/src/router/index.jsx
<Route
  path="/my-new-page"
  element={
    <ProtectedRoute requiredRoles={['student']}>
      <MyNewPage />
    </ProtectedRoute>
  }
/>
```

### Adding a New Component

**1. Create component:**
```jsx
// frontend/src/components/shared/MyComponent.jsx
import React from 'react';
import { Card } from '../ui/Card';

export function MyComponent({ data, onAction }) {
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
}
```

**2. Use in page:**
```jsx
import { MyComponent } from '../../components/shared/MyComponent';

export default function Page() {
  return (
    <MyComponent 
      data={data} 
      onAction={handleAction} 
    />
  );
}
```

## Database Schema

### Key Tables

**users**
```sql
id (UUID)
name (string)
email (string, unique)
password (hashed)
role (enum: student|vendor|delivery|admin)
phone (string)
address (text)
is_active (boolean)
created_at
```

**restaurants**
```sql
id (UUID)
name (string)
owner_id (FK to users)
address (string)
is_approved (boolean)
is_open (boolean)
rating (float)
delivery_fee (decimal)
delivery_time (integer)
created_at
```

**orders**
```sql
id (UUID)
student_id (FK to users)
restaurant_id (FK to restaurants)
delivery_person_id (FK to users, nullable)
items (JSON)
status (enum)
total_amount (decimal)
delivery_fee (decimal)
created_at
```

## Testing

### Manual Testing Checklist

- [ ] Can register as each role
- [ ] Can login with correct credentials
- [ ] Logout clears auth state
- [ ] Can browse restaurants
- [ ] Can add items to cart
- [ ] Can place order
- [ ] Can track order status
- [ ] Can view order history
- [ ] Vendor can manage menu
- [ ] Admin can approve restaurants

### API Testing with cURL

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'

# Get restaurants
curl http://localhost:8000/api/v1/restaurants \
  -H "Authorization: Bearer <token>"
```

## Performance Tips

### Backend
- Use eager loading: `Order::with('restaurant', 'user')->get()`
- Index frequently queried columns
- Cache expensive queries
- Use pagination for large datasets
- Minimize N+1 queries

### Frontend
- Use React.memo for expensive components
- Lazy load routes with React.lazy
- Optimize images
- Debounce API calls
- Cache API responses with Zustand

## Debugging

### Backend
```php
// Enable query logging
DB::enableQueryLog();
// Your code
dd(DB::getQueryLog());

// Log to file
Log::info('Message', ['data' => $data]);
```

### Frontend
```javascript
// Check Redux state
console.log(useAuthStore.getState());

// Network debugging
// Open DevTools > Network tab
```

## Useful Commands

### Backend
```bash
php artisan tinker              # Interactive shell
php artisan migrate --fresh     # Reset database
php artisan db:seed             # Seed data
php artisan cache:clear         # Clear cache
php artisan route:list          # Show all routes
```

### Frontend
```bash
npm run dev                      # Start dev server
npm run build                    # Build for production
npm run preview                  # Preview build
npm run lint                     # Run linter
```

## Common Issues & Solutions

### Issue: CORS Errors
**Solution:** Check CORS configuration in `config/cors.php`

### Issue: API Token Expired
**Solution:** Token refresh should be automatic via axios interceptor

### Issue: Component not rendering
**Solution:** Check if component is exported correctly and imported properly

### Issue: State not updating
**Solution:** Zustand doesn't trigger re-renders with mutations; use the setter functions

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description"

# Push and create PR
git push origin feature/feature-name
```

## Code Standards

- Use functional components with hooks
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use TypeScript for large projects (optional)
- Follow Tailwind CSS conventions

## Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Zustand Documentation](https://zustand-demo.vercel.app)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)

---

**For more help**: Create an issue in the repository or contact the development team.
