import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import configDatabase from './config/config.database';
import { User } from './user/user.entity';
import { Product } from './product/product.entity';
import { Tag } from './tag/tag.entity';

@Module({
  imports: [
    HealthModule,
    // Prefer a service-local file; use the monorepo root file for local workspace runs.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '.env'),
        resolve(process.cwd(), '../../../.env'),
      ],
      load: [configDatabase],
    }),
    UserModule,
    AuthModule,
    ProductModule,
    TagModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          username: configService.get('database.username') ?? 'postgres',
          password: configService.get('database.password')!,
          database: configService.get('database.database') ?? 'postgres',
          port: configService.get('database.port') ?? 5432,
          host: configService.get('database.host')!,
          synchronize: false,
          logging: true,
          entities: [User, Product, Tag],
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
