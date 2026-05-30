import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HealthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          username: configService.get(
            isProd ? 'POSTGRES_USER_PROD' : 'POSTGRES_USER',
          )!,
          password: configService.get(
            isProd ? 'POSTGRES_PASSWORD_PROD' : 'POSTGRES_PASSWORD',
          )!,
          database: configService.get(
            isProd ? 'POSTGRES_DB_PROD' : 'POSTGRES_DB',
          )!,
          port: configService.get(
            isProd ? 'POSTGRES_PORT_PROD' : 'POSTGRES_DB_PORT',
          )!,
          host: configService.get(
            isProd ? 'POSTGRES_HOST_PROD' : 'POSTGRES_HOST',
          )!,
          synchronize: !isProd,
          logging: true,
        };
      },
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
