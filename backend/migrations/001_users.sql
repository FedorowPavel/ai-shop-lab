-- Учётка для входа. Пароль в ячейке не хранится: password_hash — bcrypt пароля 1234.
-- UNIQUE (login) создаёт уникальный индекс users_login_unique.
-- При одной строке он почти не ускоряет поиск. Он нужен, чтобы второй admin не вставился.

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  login text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_login_unique UNIQUE (login)
);

INSERT INTO users (login, password_hash)
VALUES (
  'admin',
  '$2b$10$fxYz4Qlk7AF/pS/O8tm.5eaYKGupvZE3NCes9RNamUthtZJi47NOy'
)
ON CONFLICT (login) DO NOTHING;
