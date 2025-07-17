#!/bin/bash

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
echo Waiting 15 seconds for the database to be ready...
echo
sleep 15
php artisan migrate
php artisan db:seed
echo

echo
echo Optimizing application...
echo
php artisan optimize
