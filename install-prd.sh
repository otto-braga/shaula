#!/bin/bash

echo "======================================"
echo "    Starting Production Deployment    "
echo "======================================"

# 1. Ensure .env exists
if [ ! -f .env ]; then
    echo "⚠️ .env file not found! Please create one before running this script."
    exit 1
fi

# 2. Start containers (without destroying volumes)
echo "[1/7] Starting containers..."
docker compose up -d --build

# 3. Wait for MySQL to be ready
echo "[2/7] Waiting for database to be ready..."
until docker compose exec mysql bash -c "mysqladmin ping -h localhost -u root -p\${MYSQL_ROOT_PASSWORD} --silent" 2>/dev/null; do
    sleep 2
done
echo "Database is ready."

# 4. Install PHP Dependencies (Optimized for Production)
echo "[3/7] Installing PHP dependencies..."
docker compose exec app composer install --no-dev --optimize-autoloader --no-interaction

# 5. Install Node Dependencies and Build Assets
echo "[4/7] Building frontend assets..."
docker compose exec app npm install
docker compose exec app npm run build

# 6. Caching and Storage
echo "[5/7] Caching configurations and linking storage..."
docker compose exec app php artisan storage:link
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
docker compose exec app php artisan event:cache

# 7. Database Migrations (Force in production)
echo "[6/7] Running database migrations..."
docker compose exec app php artisan migrate --force
# Note: In production, you typically don't run seeds on every deploy unless intended.
# docker compose exec app php artisan db:seed --force

echo "[7/7] Restarting queue workers (if any)..."
docker compose exec app php artisan queue:restart

echo "======================================"
echo "   Deployment Completed Successfully  "
echo "======================================"
