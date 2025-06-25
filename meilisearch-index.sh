docker compose restart supervisor
docker compose exec supervisor php artisan queue:restart
docker compose exec supervisor php artisan scout:sync-index-settings

docker compose exec supervisor php artisan scout:flush "App\Models\Artwork"
docker compose exec supervisor php artisan scout:import "App\Models\Artwork"

docker compose exec supervisor php artisan scout:flush "App\Models\Person"
docker compose exec supervisor php artisan scout:import "App\Models\Person"

docker compose exec supervisor php artisan scout:flush "App\Models\Review"
docker compose exec supervisor php artisan scout:import "App\Models\Review"

docker compose exec supervisor php artisan scout:flush "App\Models\HistoryArticle"
docker compose exec supervisor php artisan scout:import "App\Models\HistoryArticle"

docker compose exec supervisor php artisan scout:flush "App\Models\Source"
docker compose exec supervisor php artisan scout:import "App\Models\Source"

# docker compose exec supervisor php artisan scout:flush "App\Models\Activity"
# docker compose exec supervisor php artisan scout:import "App\Models\Activity"