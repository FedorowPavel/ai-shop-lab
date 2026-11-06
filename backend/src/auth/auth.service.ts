import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { DatabaseService } from '../db/database.service';

type UserRow = {
  id: string;
  login: string;
  password_hash: string;
};

@Injectable()
export class AuthService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  async login(login: string, password: string): Promise<{ id: string; login: string }> {
    const normalizedLogin = login.trim();
    if (!normalizedLogin || !password.trim()) {
      throw new BadRequestException('Введите логин и пароль');
    }

    const found = await this.db.query<UserRow>(
      'SELECT id, login, password_hash FROM users WHERE login = $1',
      [normalizedLogin],
    );
    const user = found.rows[0];
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return { id: user.id, login: user.login };
  }

  async findById(id: string): Promise<{ login: string } | null> {
    const found = await this.db.query<{ login: string }>(
      'SELECT login FROM users WHERE id = $1',
      [id],
    );
    return found.rows[0] ?? null;
  }
}
