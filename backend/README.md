# Backend

NestJS. При старте применяет SQL из `migrations/`.

```bash
cp ../.env.example .env
npm install
npm run migrate
npm start
```

API: `http://localhost:3001`

- `POST /auth/login` — тело `{ "login", "password" }`, при успехе cookie `session`
- `POST /auth/logout` — снимает cookie
- `GET /auth/me` — `{ "login" }` или 401

Проверки: `npm test` и `npm run typecheck`. Для тестов нужен запущенный Postgres (`docker compose up -d` в корне).
