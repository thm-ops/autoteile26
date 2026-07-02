import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import configDatabase from './config/config.database';
import { User } from './user/user.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';

@Module({
  imports: [
    HealthModule,
    OrderModule,
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
          entities: [User, Order],
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
