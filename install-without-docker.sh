#!/bin/bash

echo
echo Installing dependencies...
echo
composer install --no-interaction --optimize-autoloader --no-dev

echo
echo Clearing optimization...
echo
php artisan optimize:clear

echo
echo Generating key...
echo
php artisan key:generate

echo
echo Generating storage link...
echo
rm -rf public/storage
php artisan storage:link

echo
echo Optimizing application...
echo
php artisan optimize
