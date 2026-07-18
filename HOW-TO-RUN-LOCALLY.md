# How to Run Locally

This guide explains how to set up and run the `shaula` project on your local development machine using Docker.

## Prerequisites

Make sure you have the following installed on your machine:
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)
- [Node.js and NPM](https://nodejs.org/) (Version 20+ is recommended for frontend asset compilation)

---

## Step-by-Step Setup

### 1. Configure the Environment
The project relies on environment variables defined in a `.env` file. Copy the example file to get started:
```bash
cp .env.example .env
```
> **Note:** The default values in `.env.example` are pre-configured to work out of the box with the local Docker containers (such as MySQL, Redis, and Meilisearch). You typically don't need to change anything unless you have port conflicts.

### 2. Run the Installation Script
We have prepared a dedicated installation script for local development. It will safely build your containers, install PHP dependencies, run database migrations, seed the database, and generate the application key without interfering with the production configuration.

```bash
# Make the script executable if it isn't already
chmod +x install.sh

# Run the setup script
./install.sh
```

### 3. Install NPM Dependencies & Start the Vite Server
The frontend uses React and Tailwind CSS built with Vite. Since the PHP container does not include Node.js, you must install and run the Vite development server directly on your host machine.

```bash
# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
> Keep this terminal tab open while you are developing. Vite will hot-reload your assets automatically as you make changes.

### 4. Access the Application
Once the `install.sh` script is complete and your Vite server is running, you can access the application in your browser.

- **Main Application:** `http://localhost:8000` *(Default `APP_PORT` is 8000, check your `.env` if this doesn't work)*
- **phpMyAdmin:** `http://localhost:8080` *(Default `PMA_PORT` is 8080)*

---

## Useful Commands During Development

Since the application runs inside Docker containers, backend commands need to be executed against the `app` container using the local compose file.

### Running Artisan Commands
To run Laravel artisan commands (like creating controllers or models), prefix them with the docker compose command:
```bash
docker compose -f docker-compose.local.yml exec app php artisan make:controller UserController
```

### Running Composer Commands
To install new PHP packages:
```bash
docker compose -f docker-compose.local.yml exec app composer require guzzlehttp/guzzle
```

### Stopping the Project
To simply stop the containers without destroying data:
```bash
docker compose -f docker-compose.local.yml stop
```

To stop and **completely remove** containers, networks, and volumes (this will erase your local database!):
```bash
docker compose -f docker-compose.local.yml down -v
```
