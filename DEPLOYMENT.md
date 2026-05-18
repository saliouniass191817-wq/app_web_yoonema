# Yoonema - Deployment Guide

## Pre-Deployment Checklist

### Backend
- [ ] All `.env` variables are properly set
- [ ] Database is migrated and seeded
- [ ] JWT secret is configured
- [ ] Supabase credentials are added
- [ ] File permissions are set correctly
- [ ] Caching is configured
- [ ] API rate limiting is enabled

### Frontend
- [ ] API URL points to production backend
- [ ] Supabase credentials for production
- [ ] Build process tested locally
- [ ] All routes are protected properly
- [ ] Error boundaries are in place
- [ ] Analytics/tracking configured

## Deployment Steps

### Option 1: Deploy on Vercel (Frontend) + Heroku/Railway (Backend)

#### Backend Deployment (Railway/Heroku)

1. **Create account on Railway.app**
2. **Connect your GitHub repository**
3. **Create PostgreSQL database**
4. **Set environment variables:**
   ```
   APP_ENV=production
   APP_DEBUG=false
   DB_CONNECTION=pgsql
   DB_HOST=<railway-db-host>
   DB_PORT=5432
   DB_DATABASE=yoonema
   DB_USERNAME=postgres
   DB_PASSWORD=<generated>
   JWT_SECRET=<generate-with-php-artisan>
   SUPABASE_URL=<your-url>
   SUPABASE_KEY=<your-key>
   ```
5. **Deploy** - Railway will auto-deploy on push

#### Frontend Deployment (Vercel)

1. **Create account on Vercel.com**
2. **Connect your GitHub repository**
3. **Set environment variables in Vercel dashboard:**
   ```
   VITE_API_URL=https://your-api.railway.app/api/v1
   VITE_SUPABASE_URL=<your-url>
   VITE_SUPABASE_ANON_KEY=<your-key>
   ```
4. **Deploy** - Vercel auto-deploys on push to main

### Option 2: Docker Deployment

#### Create Dockerfile (Backend)

```dockerfile
FROM php:8.2-fpm

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

COPY composer.json composer.lock ./
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader

COPY . .

RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
```

#### Create Dockerfile (Frontend)

```dockerfile
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: yoonema
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    environment:
      DB_CONNECTION: pgsql
      DB_HOST: postgres
      DB_PORT: 5432
      DB_DATABASE: yoonema
      DB_USERNAME: postgres
      DB_PASSWORD: postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Option 3: Traditional VPS Deployment (DigitalOcean/Linode)

#### Backend Setup

```bash
# SSH into VPS
ssh root@your-server-ip

# Install dependencies
apt update && apt install -y php8.2 composer postgresql nginx

# Clone repository
cd /var/www
git clone <your-repo-url> yoonema

# Setup Laravel
cd yoonema/backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
php artisan migrate --force

# Configure Nginx
cat > /etc/nginx/sites-available/yoonema << EOF
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/yoonema/backend/public;
    index index.php;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/yoonema /etc/nginx/sites-enabled/
systemctl restart nginx
```

#### Frontend Setup

```bash
# Install Node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Build frontend
cd /var/www/yoonema/frontend
npm ci
npm run build

# Serve with nginx
cat > /etc/nginx/sites-available/yoonema-frontend << EOF
server {
    listen 3000;
    server_name yourdomain.com;

    root /var/www/yoonema/frontend/dist;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }
}
EOF
```

## Environment Variables

### Backend (.env)
```
APP_NAME=Yoonema
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=pgsql
DB_HOST=<db-host>
DB_PORT=5432
DB_DATABASE=yoonema
DB_USERNAME=<db-user>
DB_PASSWORD=<db-password>

CACHE_DRIVER=redis
SESSION_DRIVER=cookie
QUEUE_DRIVER=database

JWT_SECRET=<your-jwt-secret>

SUPABASE_URL=<supabase-url>
SUPABASE_KEY=<supabase-key>

MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<email>
MAIL_PASSWORD=<app-password>
```

### Frontend (.env.production)
```
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
```

## Database Backup

```bash
# PostgreSQL Backup
pg_dump -U postgres yoonema > backup.sql

# Restore
psql -U postgres yoonema < backup.sql
```

## SSL Certificate Setup

Using Let's Encrypt with Nginx:

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

## Monitoring

### Application Health Check
```bash
# Backend
curl https://api.yourdomain.com/api/v1/health

# Frontend
curl https://yourdomain.com
```

### Logs
```bash
# Backend logs
tail -f /var/www/yoonema/backend/storage/logs/laravel.log

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          ssh -i ${{ secrets.DEPLOY_KEY }} user@server << 'EOF'
          cd /var/www/yoonema/backend
          git pull origin main
          composer install
          php artisan migrate --force
          EOF

      - name: Deploy Frontend
        run: |
          ssh -i ${{ secrets.DEPLOY_KEY }} user@server << 'EOF'
          cd /var/www/yoonema/frontend
          git pull origin main
          npm ci
          npm run build
          EOF
```

## Performance Optimization

### Backend
- Enable OPCache
- Use Redis for caching
- Enable query optimization
- Setup database indexing
- Enable gzip compression

### Frontend
- Code splitting with React.lazy
- Image optimization
- CSS/JS minification (Vite handles this)
- CDN for static assets
- Service Worker caching

## Security Hardening

- Enable HTTPS/SSL
- Set CORS headers properly
- Implement rate limiting
- Use environment variables for secrets
- Enable firewall
- Regular security updates
- SQL injection prevention (use prepared statements)
- XSS protection (React handles this)
- CSRF tokens in forms

## Troubleshooting

### Backend Won't Start
```bash
php artisan migrate --force
php artisan config:cache
php artisan route:cache
```

### Frontend Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Error
- Check DB credentials
- Verify network connectivity
- Check firewall rules

### API 404 Errors
- Verify API routes are registered
- Check CORS configuration
- Verify base URL is correct

## Support & Maintenance

- Set up automated backups (daily)
- Monitor error logs
- Regular security updates
- Performance monitoring
- User feedback collection
- Bug tracking system

---

**Last Updated**: May 2026
**Version**: 1.0.0
