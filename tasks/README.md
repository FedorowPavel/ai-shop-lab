# Задачи

Один файл — одна задача: `NNN-kebab-name.md` (пример: `001-login.md`). Каркас файла — `_template.md`.

Команды оркестратора:

1. «создай задачу 001-login» — появляется файл, код не пишется.
2. «создай issue» — создать GitHub issue из файла задачи через подключённый GitHub MCP, инструмент `issue_write` (method `create`, owner `FedorowPavel`, repo `ai-shop-lab`). Не использовать `gh issue create`.
3. «подтверждаю» — ветка `feature/task-001`, код, тесты, push, PR в `master`.
