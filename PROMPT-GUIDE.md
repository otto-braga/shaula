# Local Development Guide (PROMPT-GUIDE.md)

This guide documents the complete and verified process for running the **Shaula** project locally for development, avoiding known configuration pitfalls and ensuring zero disruptions to the production deployment pipeline.

---

## 1. Architecture Overview

- **Backend Framework:** Laravel 12.x (PHP 8.2+)
- **Frontend Stack:** Inertia.js v2 + React 19, TypeScript, Tailwind CSS v4, Radix UI
- **Database:** MySQL 8.0
- **Cache & Queue:** Redis (Alpine)
- **Search Engine:** Meilisearch + Laravel Scout
- **Queue Worker:** Supervisor container running `php artisan queue:work redis --queue=scout --daemon`
- **Web Server:** Nginx (Alpine) reverse-proxying to PHP-FPM
- **Database GUI:** phpMyAdmin

---

## 2. Prerequisites

1. **Docker & Docker Compose** (Compose v2 supported)
2. **Node.js (v20 LTS recommended)** & **npm** (version 10+) installed on your host machine (WSL or Linux).
   - *Note:* If Node is not installed on your host, you can install Node 20 LTS into your user space without `sudo`:
     ```bash
     mkdir -p ~/.local/lib/nodejs
     curl -fsSL https://nodejs.org/dist/v20.18.0/node-v20.18.0-linux-x64.tar.xz | tar -xJ -C ~/.local/lib/nodejs/
     ln -sfn ~/.local/lib/nodejs/node-v20.18.0-linux-x64/bin/node ~/.local/bin/node
     ln -sfn ~/.local/lib/nodejs/node-v20.18.0-linux-x64/bin/npm ~/.local/bin/npm
     ln -sfn ~/.local/lib/nodejs/node-v20.18.0-linux-x64/bin/npx ~/.local/bin/npx
     node -v && npm -v
     ```

---

## 3. Environment Configuration (`.env`)

Create the `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

Ensure your `.env` contains the required Meilisearch and user mappings (these are critical for Docker inter-container communication):

```dotenv
SYS_USER=danilo
SYS_UID=1000

APP_ENV=local
APP_PORT=8000
APP_DEBUG=true

PMA_PORT=8080

REDIS_HOST=redis
REDIS_PORT=6379

SCOUT_DRIVER=meilisearch
MEILISEARCH_PORT=7700
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_KEY=meilisearch_key

APP_NAME=shaula
VITE_APP_NAME="${APP_NAME}"
APP_URL=http://localhost:${APP_PORT}
APP_KEY=base64:gt1HRK7aQV6JV7XWW9MBbSnAvudM+7iRrUk7BREGR8o=

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
FORWARD_DB_PORT=3306
DB_DATABASE=base
DB_USERNAME=db-user
DB_PASSWORD=db-pass
```

> **Important Notes:**
> - `SCOUT_DRIVER=meilisearch` is required because Laravel Scout defaults to `algolia` if omitted.
> - `MEILISEARCH_HOST=http://meilisearch:7700` is required because `localhost` refers to the container itself; within the Docker network, Meilisearch runs on host `meilisearch`.
> - Check your user ID with `id -u` and adjust `SYS_UID` if different from `1000`.

---

## 4. Step-by-Step Local Setup

### Step 1: Start Docker Services
Always use `-f docker-compose.local.yml` for local development (the base `docker-compose.yml` is reserved for production with SSL/certbot mounts):

```bash
docker compose -f docker-compose.local.yml up -d --build
```

Verify that all 7 containers are healthy and running:
```bash
docker compose -f docker-compose.local.yml ps
```

### Step 2: Install Composer Dependencies
Run `composer install` inside the `app` container:

```bash
docker compose -f docker-compose.local.yml exec app composer install
```

### Step 3: Generate Key and Storage Symlink

```bash
docker compose -f docker-compose.local.yml exec app php artisan key:generate
docker compose -f docker-compose.local.yml exec app php artisan storage:link
```

### Step 4: Run Migrations and Seeders
Wait a few seconds for MySQL to initialize, then execute:

```bash
docker compose -f docker-compose.local.yml exec app php artisan migrate --seed
```

### Step 5: Sync Meilisearch Index Settings

```bash
docker compose -f docker-compose.local.yml exec supervisor php artisan queue:restart
docker compose -f docker-compose.local.yml exec supervisor php artisan scout:sync-index-settings
```

### Step 6: Install Frontend Dependencies & Start Vite
Run these commands on your host machine in the project root:

```bash
# Install NPM packages matching package-lock.json
npm ci

# Start the Vite development server with Hot Module Replacement (HMR)
npm run dev
```

Leave this terminal running while developing.

---

## 5. Local Access & Endpoints

| Service | URL | Notes |
| :--- | :--- | :--- |
| **Web Application** | [http://localhost:8000](http://localhost:8000) | Public catalog and search pages |
| **Admin Login** | [http://localhost:8000/login](http://localhost:8000/login) | Admin management dashboard |
| **Vite Dev Server (HMR)**| [http://localhost:5173](http://localhost:5173) | Frontend asset hot reload |
| **phpMyAdmin** | [http://localhost:8080](http://localhost:8080) | User: `db-user` / Pass: `db-pass` |
| **Meilisearch API** | [http://localhost:7700](http://localhost:7700) | Master Key: `meilisearch_key` |

### Seeded Credentials (`DatabaseSeeder.php`)

| Role | Username / Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Developer** | `dev` | `Shaula@DEV#00` | Full Developer & System Admin |
| **Coordination** | `coordenacao-1` | `Shaula@UFRN#COORD` | Content Administration |
| **Editor** | `edicao-1` | `Shaula@EDIT#DEART` | Editorial & Cataloging |

---

## 6. Daily Development Commands

```bash
# Run Artisan commands
docker compose -f docker-compose.local.yml exec app php artisan <command>

# Run Pint (PHP code style fixer)
docker compose -f docker-compose.local.yml exec app ./vendor/bin/pint

# Run PHPUnit tests
docker compose -f docker-compose.local.yml exec app php artisan test

# Check queue worker logs (Supervisor)
docker compose -f docker-compose.local.yml logs -f supervisor

# Stop containers without losing database data
docker compose -f docker-compose.local.yml stop

# Restart containers
docker compose -f docker-compose.local.yml start

# Full reset: destroy containers, networks, and database volume
docker compose -f docker-compose.local.yml down -v
```

---

## 7. Production & CI/CD Safety Guidelines

- **Deploy Branch:** The project deploys to production whenever `main` branch is pushed (via `.github/workflows/deploy.yml`).
- **Never Commit `.env`:** Keep your local credentials and local Docker network values strictly in `.env` (which is gitignored).
- **Frontend Dependencies:** Always use `npm ci` for installations to keep `package-lock.json` synchronized with the CI deployment runner.
- **Compose Files:** Always specify `-f docker-compose.local.yml` for local commands. Never overwrite `docker-compose.yml`, which is tailored for the production server environment.
