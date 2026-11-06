import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.close();
}

main();
