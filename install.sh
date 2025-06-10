#!/bin/bash

echo
echo Stopping and removing existing containers, if any...
echo
docker compose down -v

echo
echo Uploading containers...
echo
docker compose up --build --no-deps --force-recreate -d --remove-orphans

echo
echo Clearing config...
echo
docker compose exec app php artisan config:clear

echo
echo Installing scout, predis, and meilisearch...
echo
docker compose exec app composer require laravel/scout predis/predis meilisearch/meilisearch-php http-interop/http-factory-guzzle

echo
echo Installing scout driver...
echo
docker compose exec app php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"

echo
echo Generating key...
echo
docker compose exec app php artisan key:generate

echo
echo Generating storage link...
echo
rm -rf public/storage
docker compose exec app php artisan storage:link

echo
echo Information of new containers:
echo
docker ps

echo
echo Waiting 15 seconds for the database to be ready...
echo
sleep 15
docker compose exec app php artisan migrate
docker compose exec app php artisan db:seed
echo

echo Setting up Scout...
echo
docker compose exec supervisor php artisan scout:sync-index-settings
docker compose exec supervisor php artisan scout:import "App\Models\Artwork"
docker compose exec supervisor php artisan scout:import "App\Models\Person"
docker compose exec supervisor php artisan scout:import "App\Models\Review"
docker compose exec supervisor php artisan scout:import "App\Models\HistoryArticle"

echo
echo Starting...
echo
docker compose up -d --force-recreate
