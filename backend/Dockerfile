FROM php:8.3-cli

# Install system dependencies
RUN apt-get update -y && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    nodejs \
    npm

# Install PHP extensions for PostgreSQL and Zip
RUN docker-php-ext-install pdo pdo_pgsql zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Install Node dependencies and build Vue assets
RUN npm install
RUN npm run build

# Expose the port Render assigns
EXPOSE 8000

# Start the Laravel development server (suitable for POC)
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000
