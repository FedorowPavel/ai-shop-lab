'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiUrl } from '../lib/auth';

export default function HomePage() {
  const [login, setLogin] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl('/auth/me'), { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }
        const body = (await response.json()) as { login: string };
        return body.login;
      })
      .then((name) => {
        if (!cancelled) {
          setLogin(name);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLogin(null);
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    await fetch(apiUrl('/auth/logout'), { method: 'POST', credentials: 'include' });
    setLogin(null);
  }

  return (
    <main>
      <h1>Магазин</h1>
      {!ready ? <p>Загрузка…</p> : null}
      {ready && login ? (
        <>
          <p>Вошёл: {login}</p>
          <button type="button" onClick={logout}>
            Выйти
          </button>
        </>
      ) : null}
      {ready && !login ? (
        <p>
          <Link href="/login">Войти</Link>
        </p>
      ) : null}
    </main>
  );
}
