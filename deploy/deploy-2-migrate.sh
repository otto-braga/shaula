#!/bin/bash

cd .. # Move to the project root

docker compose down -v

cd deploy/deployment # Move to the deployment directory

docker compose up -d --force-recreate

docker compose exec app php artisan migrate:fresh --seed

docker compose down -v

cd ../.. # Move to the project root

docker compose up -d --force-recreate

cd deploy # Move back to the current directory of the script

