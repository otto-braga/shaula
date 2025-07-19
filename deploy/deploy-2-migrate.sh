#!/bin/bash

# Move to the script's directory
cd "$(dirname "$0")"

cd deployment # Move to the deployment directory

rm -rf .env
cp ../.env.deploy-test .env

docker compose up -d --force-recreate

echo
echo Waiting 15 seconds for the database to be ready...
echo
sleep 15

docker compose exec app php artisan migrate:fresh --seed

cd deploy # Move back to the current directory of the script

