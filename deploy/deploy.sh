#!/bin/bash

# Move to the script's directory
cd "$(dirname "$0")"

rm -rf deployment
cp -a .. deployment/
cd deployment # Move to the deployment directory





rm docker-compose.yml
cp ../docker-compose.yml.deploy docker-compose.yml

rm -rf .env
cp ../.env.deploy-test .env

distrobox-host-exec docker compose down -v




rm -rf node_modules

composer install --no-dev --prefer-dist
composer remove laravel/scout
composer remove meilisearch/meilisearch-php
composer update --no-dev --prefer-dist

pnpm install --prod
pnpm build

rm -rf install.sh

rm -rf .editorconfig
rm -rf .prettierignore
rm -rf .prettierrc

rm -rf .meilisearch-data
rm -rf meilisearch-index.sh
rm -rf supervisord.log
rm -rf supervisord.pid

rm -rf node_modules

# rm -rf components.json composer.lock eslint.config.js package.json package-lock.json phpunit.xml pnpm-lock.yaml tailwind.config.js tsconfig.json vite.config.ts

# rm -rf deploy-1-optimize.sh
# rm -rf deploy-2-migrate.sh
# rm -rf deploy-3-upload.sh
rm -rf deploy.sh

rm -rf app/Providers/AppServiceProvider.php
cp ../AppServiceProvider.php.deploy app/Providers/AppServiceProvider.php

rm -rf config/filesystems.php
cp ../filesystems.php.deploy config/filesystems.php

cp ../index.php.deploy index.php

rm -rf .docker/nginx/nginx.conf
cp ../nginx.conf.deploy .docker/nginx/nginx.conf

rm public/storage
rm public/index.php
cp -a public/. .
rm -rf public
mkdir public
mkdir public/build
cp -a build/. public/build/

# cd public
# ln -s ../storage/app/public storage
# cd ..

# cd storage # Move to the storage directory inside deployment
# ln -s app/public/files files
# cd .. # Move to the deployment directory

rm -rf .git
rm -rf .github
rm -rf .gitattributes
rm -rf .gitignore

rm -rf .meilisearch-data

# rm -rf .env
# rm -rf .env.example
# cp ../.env.deploy .env
# rm -rf .docker
# rm -rf .dockerignore
# rm -rf docker-compose.yml
# rm -rf Dockerfile

# php artisan optimize:clear
# php artisan optimize

# php artisan optimize:clear
php artisan config:clear
php artisan event:clear
php artisan route:clear
php artisan view:clear
# php artisan optimize
# php artisan config:cache
# php artisan event:cache
# php artisan route:cache
# php artisan view:cache

distrobox-host-exec docker compose up -d --force-recreate
