# ai-shop-lab

Учебный интернет-магазин одежды. Оркестратор ставит задачу и проверяет результат. Агент пишет код, гоняет тесты и открывает PR.

## Цикл

1. «создай задачу 001-login» — файл в `tasks/`, без кода.
2. «создай issue» — создать GitHub issue из файла задачи через подключённый GitHub MCP, инструмент `issue_write` (method `create`, owner `FedorowPavel`, repo `ai-shop-lab`). Не использовать `gh issue create`.
3. «подтверждаю» — ветка `feature/task-001` от `master`, реализация, тесты, typecheck, push, PR в `master`.

Правило сессии: `.cursor/rules/workflow.mdc`. Навыки: `implement-task`, `review-code`, `deploy-check`, `update-docs`.

## Стек

Next.js (App Router), NestJS, PostgreSQL 16 + pgvector (`docker compose up -d`). Секреты — по образцу `.env.example`.

Каталог: обувь, джинсы, шорты, майки, рубашки, пуховки, ветровки. Картинки — Pexels API. RAG — этап 2 (`docs/rag-notes.md`).

## Документы

- `docs/architecture.md` — границы модулей
- `docs/db-schema.md` — схема и почему она такая
- `docs/adr/` — решения, которые не хочется переоткрывать
