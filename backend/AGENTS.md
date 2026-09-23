# Backend — Laravel 13 API

See root `../AGENTS.md` for workspace overview and mobile details.

**Do NOT follow the old Laravel Boost instructions below** — they were unmodified boilerplate. Real auth is Sanctum Bearer tokens in `routes/api.php:7`, not Breeze sessions.

- Stack: `laravel/framework ^13.17`, `laravel/sanctum ^4.0`, PHP ^8.3, SQLite dev (`database/database.sqlite`), `:memory:` for tests (`phpunit.xml:26`).
- Entrypoints: `bootstrap/app.php:7`, `routes/api.php`, `app/Http/Controllers/Api/AuthController.php`.
- CORS: `config/cors.php:19` — `['*']` + `supports_credentials false` (dev only).

```sh
composer run setup   # first time
composer run dev     # pail + queue + vite
composer run test    # config:clear + php artisan test
php artisan test --filter=Name
./vendor/bin/pint
php artisan serve --host=0.0.0.0 --port=8000  # APP_URL is 192.168.0.112:8000 — update on LAN change
```
