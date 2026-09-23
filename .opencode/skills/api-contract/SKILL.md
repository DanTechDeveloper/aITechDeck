# api-contract — Sanctum Bearer ↔ axios sync

Keep `backend` Sanctum token API and `mobile` axios client in sync when adding or changing an endpoint. Load this skill whenever touching `routes/api.php`, `App/Http/Controllers/Api/*`, `app/Models/User.php`, `mobile/api/*`, `mobile/config/api.ts`, or `expo-secure-store` token wiring.

## When to use
- New endpoint (`POST /api/*`, `GET /api/*`), new validation rule, or change to `register`/`login`/`user`/`logout` shape.
- Changing auth middleware (`auth:sanctum`), token name/scopes, or `currentAccessToken()->delete()` behavior.
- Updating `API_URL` selection (LAN/WEB/EMULATOR) or `EXPO_PUBLIC_API_URL` override.

## Workflow

### 1. Backend contract
- Add/edit route in `routes/api.php:7` — public vs `Route::middleware('auth:sanctum')->group(...)`.
- In `App/Http/Controllers/Api/*` — validate inline (`$request->validate([...])` with `Rules\Password::defaults()` where relevant), use `Hash::make`/`Hash::check`, return `response()->json([...], 201|200)` with `{user, token}` or `{message}`. For protected routes use `$request->user()` / `currentAccessToken()`.
- Verify `bootstrap/app.php:16` still prepends `EnsureFrontendRequestsAreStateful` to `api` and `bootstrap/app.php:27` renders JSON for `api/*`.
- Check `config/cors.php:23` (`['*']` dev, `supports_credentials false` for Bearer) — note to tighten in production, don't switch to cookie unless `SANCTUM_STATEFUL_DOMAINS` + `FRONTEND_URL` updated.
- Run `php artisan route:list` to confirm path is `api/...` (Expo expects `/api` prefix from `config/api.ts:5`).

### 2. Mobile contract
- Update `mobile/config/api.ts:5` only if base path/host changes; otherwise keep `LAN_API`/`WEB_API`/`EMULATOR_API` constants. Prefer `EXPO_PUBLIC_API_URL` override for device/emulator.
- Add/adjust wrapper in `mobile/api/*.ts` mirroring backend shape (`api/auth.ts:14` pattern): typed request/response, `api.post`/`get`, call `setToken`/`clearToken` where token lifecycle changes.
- If token storage changes, stay in `api/client.ts:8` — axios instance `baseURL: API_URL`, `Accept: application/json`, `timeout: 10000`, interceptor reads `auth_token` via `SecureStore.getItemAsync` / `localStorage.getItem`. Keep `TOKEN_KEY = 'auth_token'`.
- Surface errors as `e.response?.data?.message || e.message` (see `App.tsx:34`).

### 3. Tests — resolve session vs token drift
- Existing `tests/Feature/Auth/*` use `post('/register')` + `assertAuthenticated` (Breeze session). API contract uses `postJson('/api/register', ...)` → `assertStatus(201)` + `assertJsonStructure(['user','token'])` and `actingAs($user)` with Sanctum token / `getJson('/api/user')` with `Authorization: Bearer`.
- Duplicate coverage is intentional until Breeze tests are retired — add `tests/Feature/Api/AuthApiTest.php` for Bearer flow rather than editing Breeze tests in place unless explicitly requested.

### 4. Verify
```sh
cd backend && composer run test && ./vendor/bin/pint --test
cd mobile && npx tsc --noEmit && npx expo-doctor
# manual: test on web (WEB_API) and device/emulator (LAN_API or EXPO_PUBLIC_API_URL override)
php artisan route:list | grep api
```

## Pitfalls
- Forgetting `Accept: application/json` causes HTML redirects — already default in `api/client.ts:11`.
- Hardcoded `192.168.0.112` in `backend/.env:5` and `mobile/config/api.ts:5` — update both or use `EXPO_PUBLIC_API_URL`.
- `personal_access_tokens` migration `2026_09_22_005443_*` must be present — `php artisan migrate:fresh --seed` recreates it.
- `npx expo install <pkg>` required for native deps (`expo-secure-store`); plain `npm i` may install incompatible version.

## References
- Canonical stack & verification: `AGENTS.md`
- Planning & approval gate: `.opencode/commands/pm.md`
- Verification runner: `.opencode/commands/verify.md`
