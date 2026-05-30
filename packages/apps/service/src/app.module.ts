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
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        username: configService.get('POSTGRES_USER')!,
        password: configService.get('POSTGRES_PASSWORD')!,
        database: configService.get('POSTGRES_DB')!,
        port: configService.get('POSTGRES_PORT')!,
        host: configService.get('POSTGRES_HOST')!,
        synchronize: configService.get('NODE_ENV')! === 'development',
        logging: true,
      }),
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
