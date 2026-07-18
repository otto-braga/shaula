#!/bin/bash

# Ensure .env exists
if [ ! -f .env ]; then
    echo "⚠️ .env file not found! Please create one (cp .env.example .env) before running this script."
    exit 1
fi

echo
echo Stopping and removing existing containers, if any...
echo
docker compose -f docker-compose.local.yml down -v

echo
echo Uploading containers...
echo
docker compose -f docker-compose.local.yml up --build --no-deps --force-recreate -d --remove-orphans

echo
echo Clearing config...
echo
docker compose -f docker-compose.local.yml exec app php artisan config:clear

echo
echo Installing scout, predis, and meilisearch...
echo
docker compose -f docker-compose.local.yml exec app composer require laravel/scout predis/predis meilisearch/meilisearch-php http-interop/http-factory-guzzle

echo
echo Installing scout driver...
echo
docker compose -f docker-compose.local.yml exec app php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"

echo
echo Generating key...
echo
docker compose -f docker-compose.local.yml exec app php artisan key:generate

echo
echo Generating storage link...
echo
rm -rf public/storage
docker compose -f docker-compose.local.yml exec app php artisan storage:link

echo
echo Information of new containers:
echo
docker ps

echo
echo Waiting 15 seconds for the database to be ready...
echo
sleep 15
docker compose -f docker-compose.local.yml exec app php artisan migrate
docker compose -f docker-compose.local.yml exec app php artisan db:seed
echo

echo
echo Starting...
echo
docker compose -f docker-compose.local.yml up -d --force-recreate
