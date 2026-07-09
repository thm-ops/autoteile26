import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
/**
 * Seeds the database with an initial admin user.
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from environment variables.
 * If the admin user already exists, no action is taken.
 * @returns Promise<void>
 */
async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@autoteile26.de';
  const adminPassword = process.env.ADMIN_PASSWORD!;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD is not set in .env!');
    await app.close();
    return;
  }

  const existingUser = await userService.validateUser(
    adminEmail,
    adminPassword,
  );

  if (!existingUser) {
    await userService.createUser(adminEmail, adminPassword);
    console.log('Admin user created successfully.');
  } else {
    console.log('Admin user already exists.');
  }

  await app.close();
}

seed();
