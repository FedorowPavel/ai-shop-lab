import { describe, expect, it } from 'vitest';
import { loginFieldError } from './auth';

describe('loginFieldError', () => {
  it('просит заполнить пустые поля', () => {
    expect(loginFieldError('', '')).toBe('Введите логин и пароль');
    expect(loginFieldError('admin', '   ')).toBe('Введите логин и пароль');
  });

  it('пропускает заполненную форму', () => {
    expect(loginFieldError('admin', '1234')).toBeNull();
  });
});
