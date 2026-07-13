    ---

    name: arquitetura-shaula

    description: Context and execution rules for the Shaula project's architecture, technology stack, and Docker container environment.

    ---



    # Project Stack & Architecture: Shaula



    ## 🛠️ Technology Stack

    - **Backend:** PHP 8.2+, Laravel 12.0

    - **Frontend:** React 19, Inertia.js 2.0, Tailwind CSS 4, Radix UI, TypeScript

    - **Database:** MySQL 8.0

    - **Cache/Session/Queue:** Redis

    - **Search Engine:** Meilisearch (integrated via Laravel Scout)

    - **Build Tool / Bundler:** Vite

    - **Routing Helper:** Ziggy



    ## 🐳 Container Architecture (Docker Compose)

    The project runs on a robust, multi-container Docker setup:

    - `app`: The core PHP-FPM container where the Laravel application runs. The working directory is `/var/www` mapped to the project root.

    - `nginx`: The web server (Alpine-based) that proxies PHP requests to `app:9000` and serves static files from `/var/www/public`.

    - `mysql`: Database container running MySQL 8.0.

    - `redis`: In-memory data structure store for cache and queue management.

    - `meilisearch`: Container dedicated to lightning-fast search capabilities.

    - `supervisor`: A dedicated container running `supervisord` to automatically process background jobs and Laravel queues using the same codebase.

    - `phpmyadmin`: Web-based database management interface linked to MySQL.



    ## ⚠️ Execution Rules & Guidelines



    1. **Artisan & Composer Commands (CRITICAL):**

       ALL `php artisan` and `composer` commands **MUST** be executed inside the `app` container. Do not run these on the host machine.

       - *Example:* `docker compose exec app php artisan migrate`

       - *Example:* `docker compose exec app composer require package/name`



    2. **Node/NPM Commands:**

       Since there is no dedicated Node.js container in the `docker-compose.yml`, frontend build commands like `npm install`, `npm run dev`, and `npm run build` should be executed on the host machine.



    3. **Background Jobs & Queues:**

       The `supervisor` container automatically manages and runs queue workers in the background. You do not need to manually run `php artisan queue:work` unless you are actively debugging a specific job.



    4. **Nginx Configuration:**

       Nginx is configured to serve from the `public/` directory and limits client body size to 500M. Any modifications made to `.docker/nginx/nginx.conf` require a restart of the `nginx` container to take

    5. **File Permissions & Ownership:**
       
       When generating or modifying files inside the app container, ensure they respect the host user permissions (UID 1000 / admin) to avoid root-owned permission locks on the host machine.

    6. **File Storage:**
       
       The environment is configured with FILESYSTEM_DISK=public. When writing code for file uploads, always ensure they are stored directly to the public disk so Nginx can serve them seamlessly.

  effect (`docker compose restart nginx`).