---
name: shaula-architecture
description: "Context, domain modeling, coding conventions, and container execution rules for the Shaula cultural catalog & archive project."
---

# Shaula: Architecture & Development Guidelines

This skill provides full contextual knowledge, domain conventions, and execution guidelines for developing on the **Shaula** cultural catalog and archival platform.

---

## 1. Technology Stack

- **Backend:** PHP 8.2+, Laravel 12.x
- **Frontend:** React 19, Inertia.js 2.x, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), Radix UI
- **Database:** MySQL 8.0 (strict mode, UTF-8 mb4)
- **Cache, Session & Queue:** Redis (Alpine)
- **Search Engine:** Meilisearch (integrated via Laravel Scout)
- **Queue Worker:** Supervisor container running background workers on the `scout` Redis queue
- **Web Server:** Nginx (Alpine) reverse-proxying to PHP-FPM
- **Asset Bundler:** Vite 6 with `laravel-vite-plugin` and `@tailwindcss/vite`
- **Client Routing:** Ziggy JS via `route('name', ...)`

---

## 2. Container Architecture & Execution Rules (CRITICAL)

The project runs on a multi-container Docker Compose architecture:

| Service | Container Name | Role & Networking |
| :--- | :--- | :--- |
| `app` | `shaula-app` | PHP 8.2-FPM running the Laravel application (`/var/www`). |
| `nginx` | `shaula-nginx` | Web server listening on port `8000`, routing PHP requests to `app:9000`. |
| `mysql` | `shaula-mysql` | MySQL 8.0 on forward port `3306`. |
| `redis` | `shaula-redis` | Redis Alpine on port `6379`. |
| `meilisearch`| `shaula-meilisearch` | Search engine on port `7700`. Internal host: `http://meilisearch:7700`. |
| `supervisor` | `shaula-supervisor` | Queue worker executing `artisan queue:work redis --queue=scout --daemon`. |
| `phpmyadmin` | `shaula-phpmyadmin` | Database management UI on port `8080`. |

### Execution Rules:

1. **Always Specify Local Compose File:**
   ```bash
   # CORRECT for local development:
   docker compose -f docker-compose.local.yml <command>
   
   # AVOID: Running plain `docker compose` without `-f` targets `docker-compose.yml` 
   # (which mounts production SSL certificates from /etc/letsencrypt and binds port 443).
   ```

2. **Artisan & Composer Commands:**
   ALL `php artisan` and `composer` commands **MUST** run inside the `app` container:
   ```bash
   docker compose -f docker-compose.local.yml exec app php artisan <command>
   docker compose -f docker-compose.local.yml exec app composer <command>
   ```

3. **Node & NPM Commands:**
   Because the PHP container does not include Node.js, run frontend commands (`npm ci`, `npm run dev`, `npm run build`) on the **host machine**.

4. **File Storage & Uploads:**
   The application uses `FILESYSTEM_DISK=public`. All uploaded media must be stored to the public disk so Nginx can serve files directly from `/var/www/public/storage/`.

5. **Permission Management:**
   Maintain UID `1000` (`danilo`) ownership on storage and cache directories to avoid host permission locks:
   ```bash
   docker compose -f docker-compose.local.yml exec app chmod -R 775 storage bootstrap/cache
   ```

---

## 3. Domain Model & Polymorphic Architecture

Shaula is an archive and catalog of regional culture, visual arts, and history.

### Core Domain Entities:
- **`Artwork` (`App\Models\Artwork`):** Artworks, paintings, sculptures, installations.
- **`Person` (`App\Models\Person`):** Artists, authors, critics, curators, historians.
- **`Exhibit` (`App\Models\Exhibit`):** Exhibitions and cultural showcases.
- **`Review` (`App\Models\Review`):** Critical reviews, essays, commentary.
- **`HistoryArticle` (`App\Models\HistoryArticle`):** Historical articles and essays.
- **`Source` (`App\Models\Source`):** Bibliographic sources, citations, references.
- **`Period` (`App\Models\Period`):** Historical and artistic periods.

### Taxonomy & Supporting Entities:
- `Category`, `City`, `Activity`, `Award`, `Language`, `Gender`, `Role`, `User`.

### Polymorphic Relations Pattern:
Entities are interconnected through standardized polymorphic pivot tables:
- `categorizables`: links `Category` to any model (`Artwork`, `Review`, `HistoryArticle`, etc.).
- `periodizables`: links `Period` to models (`Artwork`, `Person`, `Exhibit`, `HistoryArticle`).
- `sourceables`: links `Source` citations to any model.
- `personables`: links `Person` with a specific `Activity` to models (e.g. associating an artist or curator to an artwork/exhibit).
- `awardables`: links `Award` to models.
- `files`: polymorphic media management via `fileable_type` and `fileable_id`.

### Model Traits (`app/Traits/`):
Every major model inherits from core traits:
- **`HasUuid`:** Automatically generates UUID v4 on record creation. Used as the route identifier in admin panels (`{model:uuid}`).
- **`HasSlug`:** Automatically generates unique slugs from title/name for public SEO-friendly routes (`{model:slug}`).
- **`HasFiles` / `HasFile`:** Helpers for querying and attaching polymorphic file records.
- **`Fetchable` / `HasFetching`:** Standardized filtering, ordering, and JSON formatting for asynchronous frontend dropdowns and selector components.

---

## 4. Routing & Controller Patterns

Shaula enforces strict routing conventions defined in `routes/web.php`:

### 1. Public Routes (`Route::name('public.')->group(...)`):
- Named with prefix `public.` (e.g., `public.home`, `public.artworks.show`, `public.people.index`).
- URIs follow Portuguese naming conventions (`/obras`, `/pessoas`, `/critica`, `/historia/artigos`).
- Route model binding uses the **`slug`** attribute:
  ```php
  Route::get('/obras/{artwork:slug}', [ArtworkPublicController::class, 'show'])->name('artworks.show');
  Route::get('/pessoas/{person:slug}', [PersonPublicController::class, 'show'])->name('people.show');
  ```

### 2. Admin Routes (`prefix => 'admin'`):
- Protected by `['auth', 'verified']` middleware.
- Route model binding uses the **`uuid`** attribute:
  ```php
  Route::get('usuarios/{user:uuid}/editar', [UserController::class, 'edit'])->name('users.edit');
  Route::delete('categorias/{category:uuid}/delete', [CategoryController::class, 'destroy'])->name('categories.destroy');
  ```

### 3. Multi-Tab Entity Editing Pattern:
Large archive entities (`Artwork`, `Person`, `Exhibit`, `Review`, `HistoryArticle`, `Period`) use dedicated sub-endpoints and controller traits to update isolated facets of the model:
- `editImages` / `updateImages` (via `UpdatesImages` trait)
- `editContent` / `updateContent` (via `UpdatesContent` trait)
- `editPeople` / `updatePeople` (via `UpdatesPeople` trait)
- `editSources` / `updateSources`
- Authorship synchronization (via `SyncsAuthors` trait)

Always follow this modular controller pattern when adding new attributes or tabs to entities.

### 4. Controller Best Practices:
- Keep controllers thin.
- Authorize actions using gates or policies: `Gate::authorize('view', Artwork::class);`
- Validate with dedicated FormRequests (e.g., `ArtworkEditRequest`, `FetchRequest`).
- Return Inertia responses wrapping API Resources:
  ```php
  return Inertia::render('admin/artwork/index', [
      'artworks' => ArtworkResource::collection($artworks),
  ]);
  ```

---

## 5. Frontend Architecture & Conventions

- **Inertia Pages Directory (`resources/js/pages/`):**
  - Public pages: `welcome.tsx`, `about/`, `search.tsx`, `artwork/show.tsx`, `person/show.tsx`, `review/`, etc.
  - Admin pages: `resources/js/pages/admin/` (matching entity names like `admin/artwork/index.tsx`, `admin/artwork/edit.tsx`).
- **Styling:** Tailwind CSS v4 using `@tailwindcss/vite`. Avoid adding legacy `tailwind.config.js` plugins; use modern Tailwind 4 `@theme` and CSS custom properties in `resources/css/app.css`.
- **Client Routing:** Always use Ziggy helper `route('public.artworks.show', { artwork: artwork.slug })`.
- **UI Components:** Built on Radix UI primitives (`resources/js/components/ui/`), Lucide React icons, TinyMCE for rich text formatting, and React FilePond for uploads.

---

## 6. Search Architecture (Scout & Meilisearch)

- Scout index configuration is defined in `config/search.php` and `config/scout.php`.
- Filterable and sortable attributes are pre-configured for `artworks`, `people`, `reviews`, `history_articles`, `sources`, and `periods`.
- Background indexing is routed to Redis on queue `scout`, handled by the `supervisor` container.
- *Note:* In certain models, the `Searchable` trait may be commented out in production. When enabling or syncing search indexes, ensure `SCOUT_DRIVER=meilisearch` and `MEILISEARCH_HOST=http://meilisearch:7700` are configured in `.env`.

---

## 7. Production & CI/CD Safety Guardrails

- **Continuous Deployment:** Any commit pushed to the `main` branch triggers `.github/workflows/deploy.yml` which deploys directly to production via SSH and rsync.
- **Lockfile Integrity:** Never modify `package.json` without updating `package-lock.json` consistently. CI executes `npm ci` which will fail if dependencies desynchronize.
- **Environment Isolation:** Never commit `.env` or hardcode sensitive credentials. Local Docker values (ports, test database credentials) must remain in local `.env` only.
- **Compose Files Separation:** Preserve `docker-compose.yml` for production server environments; all local adjustments belong in `docker-compose.local.yml`.
