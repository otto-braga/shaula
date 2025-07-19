#!/bin/bash

rm -rf deploy
cp -a . deploy/
cd deploy

composer install --no-dev --prefer-dist
composer remove laravel/scout
composer remove meilisearch/meilisearch-php
composer update --no-dev --prefer-dist

pnpm install --prod
pnpm build

# php artisan optimize:clear
php artisan config:clear
php artisan event:clear
php artisan route:clear
php artisan view:clear
# php artisan optimize
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

# rm -rf .env
# rm -rf .env.example

# rm -rf .git
# rm -rf .github
# rm -rf .gitattributes
# rm -rf .gitignore

# rm -rf .docker
# rm -rf .dockerignore
# rm -rf docker-compose.yml
# rm -rf Dockerfile

rm -rf install.sh

rm -rf .editorconfig
rm -rf .prettierignore
rm -rf .prettierrc

rm -rf .meilisearch-data
rm -rf meilisearch-index.sh
rm -rf supervisord.log
rm -rf supervisord.pid

rm -rf node_modules

rm -rf components.json composer.lock eslint.config.js package.json package-lock.json phpunit.xml pnpm-lock.yaml tailwind.config.js tsconfig.json vite.config.ts

mv index.php.deploy index.php

rm -rf .docker/nginx/nginx.conf
mv .docker/nginx/nginx.conf.deploy .docker/nginx/nginx.conf
rm -rf .docker/nginx/nginx.conf.deploy

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

cd storage
ln -s app/public/files files
cd ..
