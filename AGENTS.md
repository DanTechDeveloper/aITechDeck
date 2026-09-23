# aITechDeck — Agent Guide

Single git repo at the workspace root (branch `master`, remote `origin` = `https://github.com/DanTechDeveloper/aITechDeck.git`). No root `package.json`. Three top-level dirs:

- `backend/` — Laravel 13 (PHP ^8.3) API, Sanctum Bearer tokens.
- `mobile/` — Expo SDK 57, React 19.2 / RN 0.86, plain `App.tsx` entry (no `src/app`, no Expo Router).
- `.opencode/` — commands (`pm`, `setup`, `verify`), skills (`api-contract`, `DESIGN.md`). Run opencode from workspace root; `opencode.json` wires `AGENTS.md` files + commands as instructions.

## Backend (`backend/`)

**Stack:** Laravel `^13.17`, sanctum `^4.0`, breeze `^2.4` (boilerplate only), pint, phpunit `^12.5`. DB is **SQLite** (`database/database.sqlite`); `phpunit.xml` overrides to `:memory:` — tests need no external DB. XAMPP MySQL is commented out in `.env`.

**Entrypoints:** `bootstrap/app.php` (routing + `EnsureFrontendRequestsAreStateful` prepended to `api`), `routes/api.php`, `app/Http/Controllers/Api/{AuthController,QuizController}.php`.

**Routes** (`routes/api.php`): `/register` `/login` public; `/user` `/logout` under `auth:sanctum`. Quizzes group (`auth:sanctum`, prefix `/quizzes`): `/categories`, `POST /result`, `/struggles`, `DELETE /struggles/{question}`, then **`GET /{difficulty}` LAST** — the wildcard must come after the literal routes or it swallows them (fixed bug, keep order).

**CORS:** `config/cors.php` — `allowed_origins ['*']`, `supports_credentials false` (Bearer token). Tighten for production.

**Commands** (from `backend/`):
```sh
composer run setup   # install + .env + key:generate + migrate + npm build
composer run test    # config:clear + php artisan test
php artisan test --filter=Name
php artisan migrate --force            # apply new migrations to dev DB
php artisan migrate:fresh --seed
./vendor/bin/pint                      # formatter; verify with ./vendor/bin/pint --test
php artisan serve --host=0.0.0.0 --port=8000   # APP_URL=http://192.168.0.112:8000 in .env
```

## Feature: mistakes / mastery loop (non-obvious semantics)

- `struggles` table = **boolean mastery flag** per `(user_id, question_id)` (unique pair). Row **exists = flagged/struggling**; row **deleted = mastered**. `selected_index` holds the user's last wrong pick (0-based, matches seeder `position`).
- Mastery is achieved two ways, same flag, same effect: answer correctly in a quiz (`POST /quizzes/result` deletes the row) OR Study flashcards "Got it" (`DELETE /quizzes/struggles/{question}` deletes it). A wrong quiz answer upserts a row again — mastery is reversible.
- `QuizController::quizzes()` shuffles the question order server-side on **every** request (per category+difficulty). `answerIndex` is the 0-based seeded option position — never trust the client's correctness claim.
- `GET /quizzes/struggles` returns all flagged questions with `category`, `difficulty` (lowercase `easy|medium|hard`), `options`, `answerIndex`, `selectedIndex` — the data source for both History and Study screens.
- API tests live in `tests/Feature/StruggleApiTest.php` + `QuizApiTest.php`: `RefreshDatabase` + `$this->seed()` + `Sanctum::actingAs($user)` (Bearer, NOT Breeze session asserts).

## Mobile (`mobile/`)

**Stack:** expo `~57.0.24`, `expo-secure-store`, `axios`, `react-native-web`. Entry `index.ts:1` → `App.tsx:1`.

**API wiring:** `config/api.ts` hardcodes `LAN_API=http://192.168.0.112:8000/api`, `WEB_API=http://localhost:8000/api`, `EMULATOR_API=http://10.0.2.2:8000/api`; web picks `WEB_API`, else `LAN_API`. Override via `EXPO_PUBLIC_API_URL`. `api/client.ts` — axios `Bearer` interceptor; token in `expo-secure-store` (native) / `localStorage` (web). `api/quiz.ts` holds quiz/struggle wrappers — keep it in sync with the routes above (see `api-contract` skill).

**Screens / flows:**
- `HomeScreen` — guest vs authenticated states; `getUser()` 401 → guest banner; "Log out" clears token and `replace('Auth')`.
- `QuizScreen` — chip setup (category+difficulty) → shuffled questions → **no correctness feedback during questions** (only the end result screen). Submits all answers via `POST /result` on the last question. Perfect score hides "Retake quiz"/"Review mistakes".
- `HistoryScreen` + `StudyScreen` — both use the same chip scope-select (category + difficulty). History = read-only list of flagged mistakes; Study = interactive flashcards per scope. Study is honest-gated: user must pick an answer and get it right before "Got it" appears (self-declared mastery disabled); wrong → "Still learning". Sessions shuffle locally (`Math.random`, biased — fine here).
- **401 pattern everywhere:** `clearToken()` then `navigation.replace('Auth')` — don't only show an error.

**Commands** (from `mobile/`):
```sh
npm start              # expo start
npx tsc --noEmit       # typecheck (strict, expo/tsconfig.base)
npx expo-doctor
npx expo install <pkg> # ALWAYS for native deps — SDK-compatible versions only
```
**CNG:** no `ios/`/`android/` dirs — configure native in `app.json`, never hand-edit generated dirs.

## UI rules (strict, user-enforced)

Follow `.opencode/skills/DESIGN.md` for every UI change: reuse `theme/tokens.ts` + `components/ui/*` (`Card`, `AppButton`, `ScreenContainer`); no decorative gradients/glassmorphism/emojis/animations; handle loading/error/empty states; don't introduce new design patterns without product reason. Don't redesign unrelated screens.

## Cross-cutting Gotchas

- **Hardcoded LAN IP `192.168.0.112`** in `backend/.env` + `mobile/config/api.ts` — breaks on network change/CI. Prefer `EXPO_PUBLIC_API_URL` override and update `APP_URL` together.
- **Backend `AGENTS.md`/`CLAUDE.md`** are unmodified Laravel Boost boilerplate — ignore; real auth is Sanctum Bearer in `routes/api.php`.
- **Mobile `AGENTS.md`** previously claimed Expo Router — verified absent (deleted). Do not create `src/app/` or `_layout.tsx`.
- **No root test/lint runner** — verify per-package (commands below).
- `.env` files are gitignored; copy from `.env.example`.
- API work → load `api-contract` skill and run `php artisan route:list | grep api` to confirm the path + order.

## Verification Order

```sh
# backend
cd backend && composer run test && ./vendor/bin/pint --test
# mobile
cd mobile && npx tsc --noEmit && npx expo-doctor
```
`/verify` in `.opencode/commands/verify.md` runs the same gates and stops at first failure. Use `/pm` (planning gate) before non-trivial changes.