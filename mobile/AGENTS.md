# Mobile — Expo SDK 57

See root `../AGENTS.md` for workspace overview and backend details.

**Stack:** `expo ~57.0.24`, React 19.2, RN 0.86, `expo-secure-store`, `axios`. No `expo-router` — entry is `index.ts:1` → `App.tsx:1`. Do not create `src/app/` or `_layout.tsx`.

- API: `config/api.ts:5` — `Platform.OS === 'web'` → `localhost:8000/api`, else `192.168.0.112:8000/api`. Override via `EXPO_PUBLIC_API_URL`. Client `api/client.ts:8` adds Bearer token (SecureStore / localStorage).
- Auth helpers: `api/auth.ts` → `/register`, `/login`, `/logout`, `/user`.

```sh
npm start              # expo start
npx tsc --noEmit       # typecheck (strict, expo/tsconfig.base)
npx expo-doctor
npx expo install <pkg> # ALWAYS for native deps
```
CNG: no `ios/`/`android/` — configure native in `app.json:24`.
