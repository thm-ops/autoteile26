import { Body, Controller, Param, Post, UsePipes } from '@nestjs/common';
import { createOrderDto } from '@autoteile26/shared';
import type { CreateOrderDto } from '@autoteile26/shared';
import { ZodValidationPipe } from '../validation/ZodValidationPipe';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('orders')
  @UsePipes(new ZodValidationPipe(createOrderDto))
  createOrder(@Body() body: CreateOrderDto) {
    return this.paymentService.createOrderForProduct(body.productId);
  }

  @Post('orders/:orderId/capture')
  captureOrder(@Param('orderId') orderId: string) {
    return this.paymentService.captureOrder(orderId);
  }
}
