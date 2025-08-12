#!/bin/bash

# Move to the script's directory
cd "$(dirname "$0")"

cd deployment # Move to the deployment directory

rm -rf .env
rm -rf .env.example
cp ../.env.deploy .env
rm -rf .docker
rm -rf .dockerignore
rm -rf docker-compose.yml
rm -rf Dockerfile
