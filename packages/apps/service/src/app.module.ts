import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configDatabase from './config/config.database';

@Module({
  imports: [
    HealthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          username: configService.get('database.username') ?? 'postgres',
          password: configService.get('database.password')!,
          database: configService.get('database.database') ?? 'postgres',
          port: configService.get('database.port') ?? 5432,
          host: configService.get('database.host')!,
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: true,
        };
      },
    }),
    ConfigModule.forRoot({
      load: [configDatabase],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
