# --
# Estágio 1: Build dos assets com Node.js
# --
FROM node:trixie-slim AS assets-builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Debug: Listar o que foi buildado
RUN echo "=== ASSETS BUILDADOS ===" && ls -la /app/public/ && echo "=== BUILD FOLDER ===" && ls -la /app/public/build/ 2>/dev/null || echo "Build folder não encontrado"


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
    libzip-dev \
    supervisor

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

# Set working directory
WORKDIR /var/www

COPY --chown=www-data:www-data . /var/www/

# Armazena os assets buildados em um local temporário
COPY --from=assets-builder --chown=www-data:www-data /app/public /tmp/built-assets

RUN composer require league/flysystem-aws-s3-v3 "^3.0" --with-all-dependencies
RUN composer install --no-dev --optimize-autoloader

RUN chmod -R 775 /var/www/storage /var/www/bootstrap

RUN sed -i 's/listen = 127.0.0.1:9000/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf

# Script simples para sincronizar assets
RUN echo '#!/bin/bash\n\
# Verifica se os assets buildados precisam ser copiados\n\
if [ ! -f /var/www/public/build/manifest.json ]; then\n\
    echo "Copiando assets buildados para o volume compartilhado..."\n\
    cp -r /tmp/built-assets/* /var/www/public/\n\
    chown -R www-data:www-data /var/www/public\n\
    echo "Assets sincronizados com sucesso!"\n\
fi\n\
\n\
# Executa o comando original (PHP-FPM)\n\
exec "$@"' > /usr/local/bin/sync-assets.sh

RUN chmod +x /usr/local/bin/sync-assets.sh

# Set the user for the container
USER www-data

# Expõe a porta e inicia o servidor
EXPOSE 9000
ENTRYPOINT ["/usr/local/bin/sync-assets.sh"]
CMD ["php-fpm"]