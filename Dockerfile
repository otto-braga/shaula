FROM php:8.3-fpm AS php

# Install system dependencies
RUN apt-get update -y
RUN apt-get install -y \
    git \
    curl \
    libpq-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    fish

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    opcache \
    zip \
    && pecl install redis \
    && docker-php-ext-enable redis

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create a new user
ARG user
ARG uid
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user
RUN chown -R $user:$user /home/$user

# Set working directory
WORKDIR /var/www
COPY --chown=$user . /var/www/
COPY . /var/www

# Set permissions for laravel logs
RUN mkdir -p /var/www/storage
RUN chmod -R 775 /var/www/storage

# Set permissions for laravel to write and cache
RUN mkdir -p /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/bootstrap

# Set the user for the container
USER $user

# Expose ports
ARG app_port
EXPOSE $app_port

# Start php-fpm server
CMD ["php-fpm"]
