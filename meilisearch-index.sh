docker compose exec supervisor php artisan queue:restart
docker compose exec supervisor php artisan scout:sync-index-settings
docker compose exec supervisor php artisan scout:import "App\Models\Artwork"
docker compose exec supervisor php artisan scout:import "App\Models\Person"
docker compose exec supervisor php artisan scout:import "App\Models\Review"
docker compose exec supervisor php artisan scout:import "App\Models\HistoryArticle"