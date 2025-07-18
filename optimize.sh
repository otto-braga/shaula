#!/bin/bash

composer install --no-dev --prefer-dist
composer remove laravel/scout
composer remove meilisearch/meilisearch-php
composer update --no-dev --prefer-dist

pnpm install --prod
pnpm build

php artisan optimize:clear
php artisan optimize

rm -rf .docker
rm -rf .git
rm -rf .github
rm -rf .meilisearch-data
rm -rf node_modules
rm -rf .dockerignore
rm -rf .editorconfig
rm -rf .env
rm -rf .env.example
rm -rf .gitattributes
rm -rf .gitignore
rm -rf .prettierignore
rm -rf .prettierrc
rm -rf docker-compose.yml
rm -rf Dockerfile
rm -rf install.sh
rm -rf meilisearch-index.sh
rm -rf supervisord.log
rm -rf supervisord.pid
