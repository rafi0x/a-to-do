import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app/app.module';
import { ENV } from './ENV';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  app.use(urlencoded({ extended: true }));
  app.use(
    json({
      limit: "10mb",
    }),
  );

  await app.listen(ENV.port ?? 3000);
  console.log(`\n\nApplication is running on: ${await app.getUrl()}`);
}
bootstrap();
