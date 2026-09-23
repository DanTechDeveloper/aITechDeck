---

description: Run the full local verification suite (backend PHP + mobile typecheck) — stops at first failure
---

# /verify

Run every locally-runnable gate in order. Stop at first failure; fix before continuing.

```sh
# backend — SQLite :memory: (phpunit.xml:26), no external DB needed
cd backend && composer run test
cd backend && ./vendor/bin/pint --test

# mobile — strict typecheck + Expo config diagnose
cd mobile && npx tsc --noEmit
cd mobile && npx expo-doctor
```

If you changed `routes/api.php` or `AuthController`, also:

```sh
cd backend && php artisan route:list | grep api
```

Notes:
- `composer run test` is `config:clear` + `php artisan test` (see `backend/composer.json:49`, `AGENTS.md`). It does not run mobile checks — always run `tsc --noEmit`.
- `verify.md` previously referenced `my-app/`/`vitest`/`Caddyfile`/`IndexesExistTest` — none exist in this repo; corrected.
- `backend/tests/Feature/Auth/*` still hits Breeze session routes (`/register`, `assertAuthenticated`); new Bearer API tests should target `/api/*` with `postJson`/`assertJsonStructure` (see `skills/api-contract/SKILL.md`).
- Hardcoded LAN IP `192.168.0.112` (`backend/.env:5`, `mobile/config/api.ts:5`) only matters for device testing — `EXPO_PUBLIC_API_URL` override avoids editing code.

See `AGENTS.md` for canonical stack & env, `.opencode/commands/pm.md` for planning gate, `.opencode/skills/api-contract/SKILL.md` for API change checklist.
