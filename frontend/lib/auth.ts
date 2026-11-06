export function loginFieldError(login: string, password: string): string | null {
  if (!login.trim() || !password.trim()) {
    return 'Введите логин и пароль';
  }
  return null;
}

export function apiUrl(path: string): string {
  return `/api${path}`;
}
