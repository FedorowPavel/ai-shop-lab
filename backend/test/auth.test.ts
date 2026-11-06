import 'dotenv/config';

process.env.DATABASE_URL ??= 'postgresql://shop:shop@localhost:5432/shop';
process.env.COOKIE_SECRET ??= 'test-cookie-secret';

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/db/database.service';
import { MigrationService } from '../src/db/migration.service';

describe('login', () => {
  let app: INestApplication;

  before(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.use(cookieParser(process.env.COOKIE_SECRET));
    await app.init();
  });

  after(async () => {
    await app.close();
  });

  it('повтор миграции оставляет одного admin, пароль в ячейке — хеш', async () => {
    const migrations = app.get(MigrationService);
    await migrations.applyPending();

    const db = app.get(DatabaseService);
    const rows = await db.query<{ login: string; password_hash: string }>(
      'SELECT login, password_hash FROM users',
    );
    assert.equal(rows.rowCount, 1);
    assert.equal(rows.rows[0]?.login, 'admin');
    assert.notEqual(rows.rows[0]?.password_hash, '1234');
    assert.equal(await bcrypt.compare('1234', rows.rows[0]?.password_hash ?? ''), true);

    await assert.rejects(
      () => db.query("INSERT INTO users (login, password_hash) VALUES ('admin', 'second')"),
      (error: { code?: string }) => error.code === '23505',
    );
  });

  it('пускает admin/1234 и не ставит сессию на неверный пароль', async () => {
    const agent = request.agent(app.getHttpServer());
    const ok = await agent.post('/auth/login').send({ login: 'admin', password: '1234' });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.login, 'admin');

    const me = await agent.get('/auth/me');
    assert.equal(me.status, 200);
    assert.equal(me.body.login, 'admin');

    const bad = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: 'admin', password: '0000' });
    assert.equal(bad.status, 401);
    assert.equal(bad.headers['set-cookie'], undefined);

    const empty = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: ' ', password: ' ' });
    assert.equal(empty.status, 400);

    await agent.post('/auth/logout');
    const afterLogout = await agent.get('/auth/me');
    assert.equal(afterLogout.status, 401);
  });
});
