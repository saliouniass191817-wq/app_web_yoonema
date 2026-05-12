FROM php:8.2-cli

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    zip unzip libzip-dev libonig-dev libpng-dev libjpeg-dev libpq-dev && \
    docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts

COPY . .

RUN composer run-script post-autoload-dump

RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache || true

EXPOSE 8000

# Use the platform-provided $PORT if present (Railway sets $PORT).
# Fall back to 8000 when $PORT is not set (local/dev).
CMD ["sh", "-lc", "php -S 0.0.0.0:${PORT:-8000} -t public"]
