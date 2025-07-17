#!/bin/bash

echo
echo Clearing optimization...
echo
docker compose exec app php artisan optimize:clear

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

echo
echo Optimizing application...
echo
docker compose exec app php artisan optimize
