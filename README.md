# aITechDeck

Quiz app for tech topics — answer questions, review what you missed, and study your mistakes until you master them.

Two apps in one repo:

| Directory   | What it is                                                        |
| ----------- | ----------------------------------------------------------------- |
| `backend/`  | Laravel 13 API (Sanctum Bearer-token auth), SQLite                |
| `mobile/`   | Expo SDK 57 app (React Native + `react-native-web`), single `App.tsx` entry |

## Features

- **Quizzes** — pick a category (`History of Computing`, `Cybersecurity`, `Web Development`, `Computer Networks`) and difficulty (`Easy`/`Medium`/`Hard`). Questions are fetched shuffled; you get your score and correct answers at the end.
- **Review mistakes** — every wrong answer is flagged server-side; view the list per category/difficulty.
- **Study flashcards** — work through your flagged questions; you must answer correctly before marking one "Got it". Mastering a question (or answering it right in a quiz) clears it from your list.

## Architecture notes

- Auth: `/register` `/login` public; `/user` `/logout` Bearer-protected.
- The `struggles` table is a **mastery flag** per `(user, question)`: a row exists while you're still getting it wrong, it's removed once mastered.
- API routes live in `routes/api.php`; the `GET /quizzes/{difficulty}` wildcard must stay registered **after** `/result`, `/struggles`, and `DELETE /struggles/{question}`.

## Getting started

Prereqs: PHP ^8.3 + Composer, Node (Expo SDK 57).

**Backend:**
```sh
cd backend
composer run setup        # install deps + .env + key + migrate
php artisan db:seed       # load quiz content (categories + questions)
php artisan serve --host=0.0.0.0 --port=8000
```

**Mobile:**
```sh
cd mobile
npm install
npm start                 # Expo — press w for web, or scan the QR with Expo Go
```

On a physical device, the app talks to `http://192.168.0.112:8000/api` by default. If your LAN IP differs, set `EXPO_PUBLIC_API_URL=http://<your-ip>:8000/api` (and match `APP_URL` in `backend/.env`).

## Tests & checks

```sh
cd backend && composer run test && ./vendor/bin/pint --test   # PHP tests + format
cd mobile && npx tsc --noEmit && npx expo-doctor              # typecheck + Expo sanity
```

## Repo layout

```
backend/   Laravel API (controllers, routes, migrations, seeders)
mobile/    Expo app (screens/, api/, navigation/, components/, theme/)
.opencode/ OpenCode commands & skills (planning, verify, api-contract, design rules)
```