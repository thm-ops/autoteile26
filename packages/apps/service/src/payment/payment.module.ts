import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [ProductModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
