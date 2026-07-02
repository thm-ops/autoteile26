import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ConfigModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}