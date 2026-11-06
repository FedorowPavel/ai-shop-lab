'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl, loginFieldError } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const fieldError = loginFieldError(login, password);
    if (fieldError) {
      setError(fieldError);
      return;
    }

    const response = await fetch(apiUrl('/auth/login'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? 'Неверный логин или пароль');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <main>
      <h1>Вход</h1>
      <form onSubmit={onSubmit}>
        <label>
          Логин
          <input value={login} onChange={(event) => setLogin(event.target.value)} autoComplete="username" />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit">Войти</button>
      </form>
    </main>
  );
}
