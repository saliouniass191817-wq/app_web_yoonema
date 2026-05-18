#!/bin/sh
set -e

echo "[entrypoint-prod] starting"

if [ ! -f /app/.env ]; then
  if [ -f /app/.env.example ]; then
    cp /app/.env.example /app/.env
    echo "[entrypoint-prod] .env created from .env.example"
  else
    echo "[entrypoint-prod] Warning: no .env or .env.example found"
  fi
fi

if [ -n "$APP_KEY" ]; then
  if grep -q '^APP_KEY=' /app/.env 2>/dev/null; then
    sed -i "s/^APP_KEY=.*/APP_KEY=${APP_KEY}/" /app/.env
  else
    printf "\nAPP_KEY=${APP_KEY}\n" >> /app/.env
  fi
  echo "[entrypoint-prod] APP_KEY set from environment"
fi

# Generate APP_KEY if not present
if ! grep -q '^APP_KEY=base64:' /app/.env 2>/dev/null; then
  echo "[entrypoint-prod] Generating APP_KEY..."
  php artisan key:generate --ansi --force || true
fi

# Ensure permissions
chown -R www-data:www-data /app/storage /app/bootstrap/cache || true
chmod -R 775 /app/storage /app/bootstrap/cache || true

# Try migrations (best-effort)
if [ -n "$DB_HOST" ]; then
  echo "[entrypoint-prod] Attempting migrations against ${DB_HOST}:${DB_PORT:-3306}"
  retries=8
  until php artisan migrate --force; do
    retries=$((retries-1))
    if [ $retries -le 0 ]; then
      echo "[entrypoint-prod] Migrations failed after retries; continuing startup"
      break
    fi
    echo "[entrypoint-prod] Migrate failed, retrying in 3s... ($retries left)"
    sleep 3
  done
fi

# Try seeding (best-effort)
if [ -n "$DB_HOST" ]; then
  echo "[entrypoint-prod] Attempting to seed database"
  php artisan db:seed --force || true
fi

echo "[entrypoint-prod] starting supervisord"
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
