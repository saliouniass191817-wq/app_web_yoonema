# Yoonema — Agent Guide

## Quick start

```bash
# Backend (Laravel 11 API)
cd backend && composer install && copy .env.example .env
php artisan key:generate && php artisan migrate --seed && php artisan serve

# Frontend (React 18 + Vite + Tailwind) — separate terminal
cd frontend && copy .env.example .env && npm install && npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |

**Test accounts** (all `password123`):
`admin@test.com` `student@test.com` `vendor@test.com` `delivery@test.com`

## Architecture

- **Monorepo** — `backend/` (Laravel 11, PHP 8.2+) + `frontend/` (React 18, Vite 5, Tailwind 3)
- **Auth**: Laravel Sanctum SPA (session cookie), not JWT despite docs mentioning Supabase JWT — the running code uses Sanctum. Axios sends CSRF cookie before every mutation (`frontend/src/api/axios.js:20`).
- **API prefix**: `/api/v1` (defined in `backend/routes/api.php`)
- **4 roles**: `student`, `vendor`, `delivery`, `admin` — enforced by `RoleMiddleware` via `role:xxx` route middleware
- **DB**: MySQL, UUID primary keys, 14 migration files
- **State**: Zustand (`frontend/src/store/authStore.js` only; cart store is inlined in same file)
- **Realtime**: Supabase Realtime via `frontend/src/hooks/useRealtime.js`
- **Payments**: CinetPay integration (`backend/app/Services/PaymentService.php`)
- **Order state machine**: `OrderStateMachineService.php` — validates all transitions (pending→confirmed→delivering→delivered, etc.)
- **Business config**: `config/yoonema.php` — 9% commission, order limits, delivery fees (500 XOF student / 300 driver / 200 platform)
- **Locale**: French UI, XOF currency (`formatCurrency` in `utils.js`), timezone `Africa/Dakar`
- **No JS test suite** exists — only PHPUnit (`php artisan test`)

## Directory ownership

| Directory | Purpose |
|-----------|---------|
| `backend/app/Http/Controllers/Api/{Auth,Student,Vendor,Delivery,Admin}/` | API controllers by role |
| `backend/app/Models/` | Eloquent models (6: User, Restaurant, MenuItem, Order, Review, Notification) |
| `backend/app/Services/` | Business logic (OrderService, PaymentService, SupabaseSyncService, etc.) |
| `backend/app/Http/Middleware/` | RoleMiddleware, OrderLimitsMiddleware, SupabaseAuth |
| `backend/database/migrations/` | Schema (18 migrations) |
| `backend/config/yoonema.php` | App-specific business rules |
| `frontend/src/pages/{role}/` | Page components per role |
| `frontend/src/components/{ui,layout,shared,vendor,student}/` | Reusable components |
| `frontend/src/hooks/` | 7 hooks (useAuth, useCart, useRealtime, useOrderRealtime, etc.) |
| `frontend/src/api/` | Axios instance + typed endpoint wrappers |
| `frontend/src/router/index.jsx` | React Router config |

## Known quirks

- **Frontend router mismatch**: `App.jsx` uses `RouterProvider` + `import router from './router'`, but `router/index.jsx` exports an `<AppRouter>` component (uses `<BrowserRouter>` + `<Routes>`), not a `createBrowserRouter` object. The app works via `<RouterProvider>` but incorrectly treats the component as a router object. Fix: align to one pattern.
- **Cart store import**: `useCart.js` imports `useCartStore` from `./store/authStore` — there's no dedicated cart store file, the import path is wrong.
- **Sanctum SPA**: The frontend does NOT send `Authorization: Bearer` tokens. Auth is entirely cookie-based via Sanctum's `EnsureFrontendRequestsAreStateful` middleware. CSRF cookie is fetched before mutating requests.
- **All user IDs are UUIDs**: Generated with `Str::uuid()` in controllers/seeder, not auto-increment.
- **No TypeScript**: Frontend is plain JSX, no TS despite `typescript` being a devDependency.
- **No PWA plugin**: `vite-plugin-pwa` is not installed despite docs mentioning PWA support.

## Commands

```bash
# Backend
php artisan serve                    # Dev server on :8000
composer run dev                     # Runs server + queue + logs + Vite concurrently
php artisan migrate --seed           # Fresh migrate + seed
php artisan test                     # PHPUnit (Unit + Feature)
php artisan route:list               # Show all routes
php artisan tinker                   # Interactive shell
php artisan cache:clear              # Clear cache

# Frontend
npm run dev                          # Vite dev on :5173 (--host 0.0.0.0)
npm run build                        # Production build → dist/
npm run lint                         # ESLint (.jsx,.js)
npm run preview                      # Preview production build

# Docker
docker-compose up -d                 # MySQL + backend + frontend (ports 3306,8000,5175)
```

## Env files

| File | Purpose |
|------|---------|
| `backend/.env` | DB connection, Supabase creds, CinetPay keys, Sanctum domains |
| `frontend/.env` | `VITE_API_URL=http://127.0.0.1:8000/api/v1` + Supabase keys |

Key backend env vars: `DB_HOST`, `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_JWT_SECRET`, `CINETPAY_API_KEY`, `CINECOIN_SITE_ID`, `SANCTUM_STATEFUL_DOMAINS`, `FRONTEND_URL`.

## Testing

- Only backend PHPUnit exists: `php artisan test`
- Tests in `tests/Unit/` and `tests/Feature/`
- No frontend test framework or test files
- Seeder creates `student@test.com`, `vendor@test.com`, `delivery@test.com`, `admin@test.com` (all `password123`)
- Seed creates one vendor with 3 restaurants (all owned by same vendor user), each with 3 menu items
