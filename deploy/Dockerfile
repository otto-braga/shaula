# --
# Estágio 1: Build dos assets com Node.js
# --
FROM node:trixie-slim AS assets-builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 


# --
# Estágio 2: Imagem final para a aplicação Laravel (PHP-FPM)
# --
FROM php:8.2-fpm AS php

# Instala as dependências do sistema
RUN apt-get update -y && apt-get install -y \
    curl \
    libpq-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev

# Instala as extensões PHP 
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create a new user
ARG user=www-data
# ARG uid=1000
RUN useradd -G www-data,root -d /home/$user $user
RUN chown -R $user:$user /home/$user

# Set working directory
WORKDIR /var/www

# Copia o código da aplicação e os assets compilados do estágio anterior
COPY --chown=$user:$user . /var/www/
COPY --from=assets-builder --chown=$user:$user /app/public /var/www/public

RUN composer install --no-dev --optimize-autoloader
RUN chmod -R 775 /var/www/storage /var/www/bootstrap

# Set the user for the container
USER $user

# Expõe a porta e inicia o servidor
EXPOSE 9000
CMD ["php-fpm"]
