import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  app.enableCors({
    origin: baseUrl,
    credentials: true,
  });

  await app.listen(process.env.SERVICE_PORT ?? 3001);
}
void bootstrap();
