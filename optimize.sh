#!/bin/bash

composer install --no-dev --prefer-dist
composer remove laravel/scout
composer remove meilisearch/meilisearch-php
composer update --no-dev --prefer-dist

pnpm install --prod
pnpm build

php artisan optimize:clear
php artisan optimize

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
