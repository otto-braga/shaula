#!/bin/bash

rm -rf .env
rm -rf .env.example
mv .env.deploy .env

rm -rf .git
rm -rf .github
rm -rf .gitattributes
rm -rf .gitignore

rm -rf .docker
rm -rf .dockerignore
rm -rf docker-compose.yml
rm -rf Dockerfile

rm -rf .meilisearch-data
rm -rf artisan
