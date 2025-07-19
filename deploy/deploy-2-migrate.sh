#!/bin/bash

# Move to the script's directory
cd "$(dirname "$0")"

cd .. # Move to the project root

docker compose down -v

docker stop $(docker ps -a -q)
docker compose rm -sfv

cd deploy/deployment # Move to the deployment directory

docker compose up -d --force-recreate

echo
echo Waiting 15 seconds for the database to be ready...
echo
sleep 15

docker compose exec app php artisan migrate:fresh --seed

docker compose down -v

cd ../.. # Move to the project root

docker compose up -d --force-recreate

cd deploy # Move back to the current directory of the script

