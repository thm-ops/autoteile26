import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';
import type { Product } from './product/product.entity';

/**
 * Trusted product catalogue used as the server-side price source for the
 * PayPal instant buy. The ids mirror the web mock so the "Buy now" button
 * resolves to a real product record. Prices are stored as decimal EUR strings.
 */
const seedProducts: Partial<Product>[] = [
  {
    id: 'a0000000-0000-4000-8000-000000000001',
    sku: 'SKU-0001',
    name: 'Sommerreifen Premium',
    description:
      'Hochwertige Sommerreifen mit optimaler Bodenhaftung und Bremsverhalten.',
    price: '89.99',
    currency: 'EUR',
    stockQuantity: 100,
    isActive: true,
  },
  {
    id: 'a0000000-0000-4000-8000-000000000002',
    sku: 'SKU-0002',
    name: 'Bremsscheiben Set',
    description: 'Komplettes Bremsscheiben-Set für Vorder- und Hinterachse',
    price: '124.50',
    currency: 'EUR',
    stockQuantity: 100,
    isActive: true,
  },
  {
    id: 'a0000000-0000-4000-8000-000000000003',
    sku: 'SKU-0003',
    name: 'Autobatterie 12V 72Ah',
    description: 'Zuverlässige Starterbatterie mit 5 Jahren Garantie',
    price: '79.95',
    currency: 'EUR',
    stockQuantity: 100,
    isActive: true,
  },
  {
    id: 'a0000000-0000-4000-8000-000000000004',
    sku: 'SKU-0004',
    name: 'Ölfilter Universal',
    description: 'Hochwertiger Ölfilter für optimale Motorleistung',
    price: '12.99',
    currency: 'EUR',
    stockQuantity: 100,
    isActive: true,
  },
  {
    id: 'a0000000-0000-4000-8000-000000000005',
    sku: 'SKU-0005',
    name: 'Zündkerzen Set (4-Stück)',
    description: 'Langlebige Zündkerzen für zuverlässige Zündung',
    price: '34.90',
    currency: 'EUR',
    stockQuantity: 100,
    isActive: true,
  },
  {
    id: 'a0000000-0000-4000-8000-000000000006',
    sku: 'SKU-0006',
    name: 'Luftfilter Sport',
    description: 'Sportluftfilter für verbesserte Motorleistung',
    price: '28.75',
    currency: 'EUR',
    stockQuantity: 100,
    isActive: true,
  },
];

/**
 * Seeds the database with an initial admin user and the trusted product
 * catalogue. Existing records (by sku / email) are left untouched.
 * @returns Promise<void>
 */
async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const productService = app.get(ProductService);

  for (const product of seedProducts) {
    const existing = await productService.findBySku(product.sku!);
    if (!existing) {
      await productService.create(product);
      console.log(`Seeded product ${product.sku}.`);
    } else {
      console.log(`Product ${product.sku} already exists.`);
    }
  }

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

void seed();
