# Yoonema — Free Tier Deployment (Vercel + Railway + Supabase)

This guide prepares the repository for deploying the frontend on Vercel (free) and the backend + DB on Railway (free credits). Supabase provides Auth, Realtime and Storage on the free tier.

Overview
- Frontend: Vercel (connect GitHub repo, set envs in Vercel dashboard)
- Backend: Railway (create a project, add MySQL, set environment variables and run migrations)
- Database: Railway MySQL (managed)
- Auth / Realtime / Storage: Supabase (free tier)

Files added to repo
- `backend/.env.railway.example` — example backend env for Railway (placeholders to replace)
- `frontend/.env.production.example` — example frontend env for Vercel

Environment variables (summary)

Backend (.env on Railway)
  APP_ENV=production
  APP_DEBUG=false
  APP_URL=https://your-backend.railway.app
  FRONTEND_URL=https://your-frontend.vercel.app

  DB_CONNECTION=mysql
  DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD (from Railway)

  SUPABASE_URL, SUPABASE_KEY, SUPABASE_JWT_SECRET (from Supabase)
  JWT_SECRET (if used by app)

Frontend (`.env.production` on Vercel)
  VITE_API_URL=https://your-backend.railway.app/api/v1
  VITE_SUPABASE_URL=https://xxx.supabase.co
  VITE_SUPABASE_ANON_KEY=<anon-key>

Step-by-step (high level)

1) Create Supabase project
   - Create project on https://app.supabase.com
   - Copy `SUPABASE_URL`, `SUPABASE_ANON_KEY` and the `service_role` key (if backend needs elevated access)
   - In Supabase Settings → API, generate/locate the JWT secret if your backend validates Supabase JWTs.

2) Railway: create backend project + MySQL
   - Create account on https://railway.app
   - Create a new Project → Add a MySQL plugin (Railway provides connection credentials)
   - In the Railway project, set the environment variables from `backend/.env.railway.example` using values from the MySQL plugin and Supabase
   - For Laravel, you can run migrations from the Railway console or via an SSH/Run command:
     ```bash
     php artisan migrate --force
     php artisan db:seed --force
     ```
   - Optionally run `php artisan config:cache` and `php artisan route:cache` after setting envs.

3) Vercel: deploy frontend
   - Create account on https://vercel.com and connect your GitHub repository
   - In Project Settings → Environment Variables, add `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - Deploy (Vercel auto-deploys on push)

4) Backend deploy on Railway
   - Link your GitHub repo to Railway (or deploy via Docker in Railway)
   - Ensure Railway build command installs composer deps and caches optimized autoloader
   - Set the same environment variables in Railway project settings
   - Trigger a deploy, then run migrations via Railway console or CLI

5) Test smoke flows
   - `GET https://your-backend.railway.app/api/v1/health` (implement if not present)
   - Sign in with Supabase-backed auth via frontend, place an order, verify vendor/delivery notifications

Notes and tips
- Keep secrets out of the repo. Use Vercel/Railway secret managers. Do not commit `.env` files.
- Railway `run` console is convenient for running artisan commands post-deploy.
- If your backend validates Supabase JWTs, ensure `SUPABASE_JWT_SECRET` (from Supabase) is set in Railway and your `config/services.php` reads it.
- For file uploads, configure Supabase Storage and set `SUPABASE_URL` + `SUPABASE_KEY` in backend to allow server-side signed uploads if needed.

Common pitfalls
- Missing `SUPABASE_JWT_SECRET` or wrong JWT secret → backend rejects tokens
- Wrong `VITE_API_URL` → CORS / 404 errors from SPA
- Not running migrations → 500 / table not found errors

If you want, I can:
- Prepare a ready-to-paste checklist of Railway and Vercel environment variables with exact keys to copy
- Add a small GitHub Actions workflow that runs tests/build and notifies you on deploy
- Walk through connecting the repo to Vercel and Railway interactively

Optional production Dockerfile
- For a more robust single-container production image (nginx + php-fpm), the repo includes `backend/Dockerfile.prod` and supporting files under `.docker/`.
- Use `backend/Dockerfile.prod` when you want nginx + php-fpm under `supervisord` (recommended for production on providers that accept single containers). Railway can build this Dockerfile instead of the simple `backend/Dockerfile`.

Build example (locally):
```bash
docker build -t yoonema-backend:prod -f backend/Dockerfile.prod backend
docker run -e APP_KEY="$(php -r "echo 'base64:'.base64_encode(random_bytes(32));")" -e DB_HOST=host.docker.internal -e DB_DATABASE=yourdb -e DB_USERNAME=user -e DB_PASSWORD=pass -p 8080:80 yoonema-backend:prod
```

When to use which Dockerfile
- `backend/Dockerfile` — quick image using PHP built-in server (fine for small staging or debugging). Keep `docker-entrypoint.sh` (already present) so Laravel can generate `APP_KEY` and run migrations.
- `backend/Dockerfile.prod` — production-oriented: nginx + php-fpm + supervisord, better for handling concurrent requests and serving static assets.
