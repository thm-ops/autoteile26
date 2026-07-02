import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from './order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Creates a new order with a PayPal payment link.
   * @param body - The cart object containing items and totalPrice.
   * @returns The created Order entity.
   */
  @Post()
  async createOrder(@Body() body: { items: object; totalPrice: string }) {
    return this.orderService.createOrder(body);
  }

  /**
   * Captures a PayPal payment for an order.
   * @param id - The UUID of the order.
   * @returns The updated Order entity.
   */
  @Post(':id/capture')
  async captureOrder(@Param('id') id: string) {
    return this.orderService.captureOrder(id);
  }

  /**
   * Returns all orders, optionally filtered by status.
   * @param status - Optional status filter.
   * @returns Array of Order entities.
   */
  @Get()
  async getOrders(@Query('status') status?: OrderStatus) {
    return this.orderService.getOrders(status ? { status } : undefined);
  }

  /**
   * Returns a single order by ID.
   * @param id - The UUID of the order.
   * @returns The Order entity.
   */
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  /**
   * Transitions an order to a new status.
   * @param id - The UUID of the order.
   * @param body - The new status.
   * @returns The updated Order entity.
   */
  @Post(':id/transition')
  async orderTransition(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ) {
    return this.orderService.orderTransition(id, body.status);
  }

  /**
   * Refunds a captured PayPal payment.
   * @param id - The UUID of the order.
   * @param body - The reason for the refund.
   * @returns The updated Order entity.
   */
  @Post(':id/refund')
  async refundOrder(
    @Param('id') id: string,
    @Body() body: { message: string },
  ) {
    return this.orderService.refundOrder(id, body.message);
  }

  /**
   * Voids (cancels) an order.
   * @param id - The UUID of the order.
   * @param body - The reason for voiding.
   * @returns The updated Order entity.
   */
  @Post(':id/void')
  async voidOrder(
    @Param('id') id: string,
    @Body() body: { message: string },
  ) {
    return this.orderService.voidOrder(id, body.message);
  }

  /**
   * Adds a comment to an order.
   * @param id - The UUID of the order.
   * @param body - The comment to add.
   * @returns The updated Order entity.
   */
  @Post(':id/comment')
  async addCommentToOrder(
    @Param('id') id: string,
    @Body() body: { comment: string },
  ) {
    return this.orderService.addCommentToOrder(id, body.comment);
  }
}