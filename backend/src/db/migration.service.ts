import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { DatabaseService } from './database.service';

@Injectable()
export class MigrationService implements OnModuleInit {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  async onModuleInit(): Promise<void> {
    await this.applyPending();
  }

  async applyPending(): Promise<string[]> {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const dir = path.join(process.cwd(), 'migrations');
    const files = (await readdir(dir)).filter((name) => name.endsWith('.sql')).sort();
    const applied: string[] = [];

    for (const filename of files) {
      const already = await this.db.query<{ filename: string }>(
        'SELECT filename FROM schema_migrations WHERE filename = $1',
        [filename],
      );
      if (already.rowCount) {
        continue;
      }

      const sql = await readFile(path.join(dir, filename), 'utf8');
      await this.db.withTransaction(async (query) => {
        await query(sql);
        await query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename]);
      });
      applied.push(filename);
    }

    return applied;
  }
}
