# --
# Estágio 1: Build dos assets com Node.js
# --
FROM node:trixie-slim AS assets-builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Debug: verificar se o build funcionou
RUN echo "=== VERIFICANDO BUILD ===" && \
    ls -la /app/public/ && \
    echo "=== PASTA BUILD ===" && \
    ls -la /app/public/build/ 2>/dev/null || echo "ERRO: Pasta build não foi criada!"

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

# SEMPRE guarda os assets buildados, mesmo se já existirem no volume
COPY --from=assets-builder --chown=www-data:www-data /app/public /opt/assets-backup

# Debug: verificar se foi copiado
RUN ls -la /opt/assets-backup/ && ls -la /opt/assets-backup/build/ 2>/dev/null || echo "Build folder não encontrado no backup"

RUN composer require league/flysystem-aws-s3-v3 "^3.0" --with-all-dependencies
RUN composer install --no-dev --optimize-autoloader

RUN chmod -R 775 /var/www/storage /var/www/bootstrap

RUN sed -i 's/listen = 127.0.0.1:9000/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf

# Script robusto para sincronizar assets
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "=== Verificando assets ==="\n\
\n\
# SEMPRE sincroniza os assets (garante que estão atualizados)\n\
echo "Sincronizando assets da imagem..."\n\
\n\
# Garante que o diretório existe\n\
mkdir -p /var/www/public\n\
\n\
# Copia SEMPRE os assets buildados da imagem\n\
if [ -d "/opt/assets-backup/build" ]; then\n\
    # Remove assets antigos e copia novos\n\
    rm -rf /var/www/public/build\n\
    cp -r /opt/assets-backup/build /var/www/public/\n\
    echo "Assets atualizados com sucesso!"\n\
else\n\
    echo "AVISO: Assets buildados não encontrados em /opt/assets-backup/build"\n\
fi\n\
\n\
# Copia outros assets importantes\n\
for file in favicon.ico robots.txt; do\n\
    if [ -f "/opt/assets-backup/$file" ]; then\n\
        cp "/opt/assets-backup/$file" "/var/www/public/"\n\
    fi\n\
done\n\
\n\
# Ajusta permissões\n\
chown -R www-data:www-data /var/www/public\n\
\n\
echo "Sincronização concluída!"\n\
echo "=== Iniciando PHP-FPM ==="\n\
exec "$@"' > /usr/local/bin/sync-assets.sh

RUN chmod +x /usr/local/bin/sync-assets.sh

# Set the user for the container
USER www-data

# Expõe a porta e inicia o servidor
EXPOSE 9000
ENTRYPOINT ["/usr/local/bin/sync-assets.sh"]
CMD ["php-fpm"]