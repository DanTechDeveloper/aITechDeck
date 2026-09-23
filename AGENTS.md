# aITechDeck — Agent Guide

Monorepo with a single git repo at the workspace root (branch `master`, no remote). Two independent apps + shared opencode config:

- `backend/` — Laravel 13 (PHP ^8.3) API, Sanctum Bearer tokens.
- `mobile/` — Expo SDK 57, React 19.2 / RN 0.86, plain `App.tsx` entry (no `src/app`, no Expo Router).
- `.opencode/` — commands (`pm.md` plan gate, `verify.md` gates, `setup.md`) + skills (`DESIGN.md`, `api-contract/SKILL.md`) + empty `opencode-swarm.json` (`{"agents": {}}`).
- `opencode.json` at root — wires `AGENTS.md` + `.opencode/commands/*` + ponytail plugin. **Run opencode from workspace root** so both apps are in scope.

## Backend (`backend/`)

**Stack:** `laravel/framework ^13.17`, `laravel/sanctum ^4.0`, `laravel/breeze ^2.4`, `laravel/pint`, `phpunit ^12.5`. DB is **SQLite** (`database/database.sqlite` via absolute path in `.env`); `phpunit.xml` overrides to `:memory:` for tests. MySQL via XAMPP is commented out in `.env` — uncomment and switch `DB_CONNECTION` if needed.

**Entrypoints:** `bootstrap/app.php:7` (routing + `EnsureFrontendRequestsAreStateful` prepended to `api`), `routes/api.php:7` (`/register`, `/login` public; `/user`, `/logout` under `auth:sanctum`), `app/Http/Controllers/Api/AuthController.php:11`.

**CORS:** `config/cors.php:19` — `allowed_origins ['*']`, `supports_credentials false` (Bearer token, not cookies). Tighten for production.

**Commands** (run from `backend/`):
```sh
composer run setup   # install + copy .env + key:generate + migrate + npm build
composer run dev     # php artisan dev (pail + queue + vite)
composer run test    # config:clear + php artisan test
php artisan test --filter=Name          # single test
php artisan migrate --force
php artisan migrate:fresh --seed
./vendor/bin/pint                        # formatter (laravel/pint)
php artisan config:clear
php -v; composer -V                      # prereqs
```
Serve: `php artisan serve --host=0.0.0.0 --port=8000` (`.env` expects `APP_URL=http://192.168.0.112:8000`). Update `APP_URL`, `FRONTEND_URL`, `EXPO_DEV_URL` if LAN IP changes.

**Env:** `.env` is gitignored; copy from `.env.example`. Tests use `DB_CONNECTION=sqlite` + `DB_DATABASE=:memory:` from `phpunit.xml:26` — no external DB needed.

## Mobile (`mobile/`)

**Stack:** `expo ~57.0.24`, React 19.2, RN 0.86, `expo-secure-store`, `axios`, `react-native-web`. UI via `@gluestack-ui/themed` — `GluestackUIProvider` wraps everything in `components/layout/AppLayout.tsx:8`. No `expo-router`, no `src/app` — old `mobile/AGENTS.md` claiming Expo Router is stale. Entry is `index.ts:1` → `App.tsx:1` (`registerRootComponent`).

**API wiring:** `config/api.ts:5` hardcodes `LAN_API=http://192.168.0.112:8000/api`, `WEB_API=http://localhost:8000/api`, `EMULATOR_API=http://10.0.2.2:8000/api`. `Platform.OS === 'web'` picks `WEB_API`, otherwise `LAN_API`. Override with `EXPO_PUBLIC_API_URL` (see `.env.example`). `api/client.ts:8` — axios instance with `Bearer` interceptor; token stored via `expo-secure-store` on native, `localStorage` on web.

**Auth:** `api/auth.ts:14` — `register`, `login`, `logout`, `getUser` against `/register`, `/login`, `/logout`, `/user`.

**Commands** (run from `mobile/`):
```sh
npm start              # expo start
npm run android / ios / web
npx tsc --noEmit       # typecheck (extends expo/tsconfig.base, strict)
npx expo-doctor        # diagnose deps/config
npx expo install <pkg> # ALWAYS use for native deps — resolves SDK-compatible versions
npx expo install --fix # fix version mismatches
```
No `ios/`/`android/` dirs — Continuous Native Generation via `app.json:24` (`expo-secure-store` plugin). Configure native in `app.json`, never hand-edit generated dirs. After adding native code: `npx expo run:ios` / `run:android` or `eas build --profile development`.

**Env:** `EXPO_PUBLIC_API_URL` in `.env` (gitignored). Template in `mobile/.env.example`.

## Cross-cutting Gotchas

- **Hardcoded LAN IP `192.168.0.112`** appears in `backend/.env:5`, `mobile/config/api.ts:5`, `mobile/.env.example:1`. Breaks on network change or CI — prefer `EXPO_PUBLIC_API_URL` override and update `APP_URL` together.
- **Backend `AGENTS.md`/`CLAUDE.md`** are unmodified Laravel Boost boilerplate (install `laravel/boost`) — ignore; real auth is Sanctum Bearer in `routes/api.php`, not Breeze session flow.
- **Mobile `AGENTS.md`** previously described Expo Router — verified absent. Do not create `src/app/` or `_layout.tsx`.
- **Git:** single repo at **workspace root** (`aITechDeck/.git`, branch `master`, no remote — one commit "Initial commit: merge backend + mobile into monorepo"). Factory-fresh `vendor/`, `node_modules/` are not committed. Old `mobile/.git` no longer exists — commit everything from the root.
- **Root `package.json`:** only hosts an opencode helper dep (`@karnak19/ocpt`) + stray nav duplicates; NOT used by either app. Each app has its own manifest — don't `npm install` at root expecting app deps.
- **No root test/lint runner** — verify per-package (`backend: composer run test` + `./vendor/bin/pint`; `mobile: npx tsc --noEmit`) or run `.opencode/commands/verify.md` which chains both.

## Verification Order

```sh
# backend
cd backend && composer run test && ./vendor/bin/pint --test
# mobile
cd mobile && npx tsc --noEmit && npx expo-doctor
```
