import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Order, OrderStatus } from './order.entity';

/**
 * Allowed order state transitions based on the Order-States Wiki.
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.ORDER_PLACED]: [OrderStatus.ORDER_SUCCESSFUL, OrderStatus.ORDER_CANCELLED],
  [OrderStatus.ORDER_SUCCESSFUL]: [OrderStatus.IN_PREPARATION],
  [OrderStatus.IN_PREPARATION]: [OrderStatus.ORDER_SHIPPED, OrderStatus.ORDER_CANCELLED],
  [OrderStatus.ORDER_SHIPPED]: [OrderStatus.IN_TRANSIT],
  [OrderStatus.IN_TRANSIT]: [OrderStatus.ORDER_DELIVERED],
  [OrderStatus.ORDER_DELIVERED]: [OrderStatus.AWAIT_RETURN],
  [OrderStatus.AWAIT_RETURN]: [OrderStatus.RETURNED],
  [OrderStatus.ORDER_CANCELLED]: [],
  [OrderStatus.RETURNED]: [],
};

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Gets a PayPal access token.
   * @returns The PayPal access token string.
   */
  private async getPaypalAccessToken(): Promise<string> {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    const baseUrl = this.configService.get<string>('PAYPAL_BASE_URL');
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await axios.post(
      `${baseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data.access_token;
  }

  /**
   * Creates a new order and a PayPal payment link.
   * @param cart - The cart object containing items and totalPrice.
   * @returns The created Order entity with paypalOrderId.
   */
  async createOrder(cart: { items: object; totalPrice: string }): Promise<{ order: Order; paypalLink: string | undefined }> {
    const accessToken = await this.getPaypalAccessToken();
    const baseUrl = this.configService.get<string>('PAYPAL_BASE_URL');

    const paypalResponse = await axios.post(
      `${baseUrl}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: cart.totalPrice,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

const order = this.orderRepository.create({
  items: cart.items,
  totalPrice: cart.totalPrice,
  paypalOrderId: paypalResponse.data.id,
  status: OrderStatus.ORDER_PLACED,
});

const savedOrder = await this.orderRepository.save(order);

const paypalLink = paypalResponse.data.links.find(
  (link: any) => link.rel === 'payer-action',
)?.href;

return {
  order: savedOrder,
  paypalLink,
};
  }

  /**
   * Captures a PayPal payment and updates order status.
   * @param id - The UUID of the order.
   * @returns The updated Order entity.
   * @throws NotFoundException if the order is not found.
   */
  async captureOrder(id: string): Promise<Order> {
    const order = await this.getOrder(id);
    const accessToken = await this.getPaypalAccessToken();
    const baseUrl = this.configService.get<string>('PAYPAL_BASE_URL');

    const response = await axios.post(
      `${baseUrl}/v2/checkout/orders/${order.paypalOrderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    order.paypalCaptureId = response.data.purchase_units[0].payments.captures[0].id;
    await this.orderRepository.save(order);

    return this.orderTransition(id, OrderStatus.ORDER_SUCCESSFUL);
  }

  /**
   * Returns all orders, optionally filtered by status.
   * @param filter - Optional filter object with status field.
   * @returns Array of Order entities.
   */
  async getOrders(filter?: { status?: OrderStatus }): Promise<Order[]> {
    if (filter?.status) {
      return this.orderRepository.find({ where: { status: filter.status } });
    }
    return this.orderRepository.find();
  }

  /**
   * Returns a single order by ID.
   * @param id - The UUID of the order.
   * @returns The Order entity.
   * @throws NotFoundException if the order is not found.
   */
  async getOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  /**
   * Transitions an order to a new status.
   * @param id - The UUID of the order.
   * @param newStatus - The new status to transition to.
   * @returns The updated Order entity.
   * @throws NotFoundException if the order is not found.
   * @throws BadRequestException if the transition is not allowed.
   */
  async orderTransition(id: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.getOrder(id);
    const allowed = ALLOWED_TRANSITIONS[order.status];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Transition from ${order.status} to ${newStatus} is not allowed.`,
      );
    }

    order.status = newStatus;
    return this.orderRepository.save(order);
  }

  /**
   * Refunds a captured PayPal payment.
   * @param id - The UUID of the order.
   * @param message - The reason for the refund.
   * @returns The updated Order entity.
   * @throws NotFoundException if the order is not found.
   */
  async refundOrder(id: string, message: string): Promise<Order> {
    const order = await this.getOrder(id);
    const accessToken = await this.getPaypalAccessToken();
    const baseUrl = this.configService.get<string>('PAYPAL_BASE_URL');

    await axios.post(
      `${baseUrl}/v2/payments/captures/${order.paypalCaptureId}/refund`,
      { note_to_payer: message },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return this.orderTransition(id, OrderStatus.RETURNED);
  }

  /**
   * Voids (cancels) an order.
   * @param id - The UUID of the order.
   * @param message - The reason for voiding.
   * @returns The updated Order entity.
   * @throws NotFoundException if the order is not found.
   */
  async voidOrder(id: string, message: string): Promise<Order> {
    const order = await this.getOrder(id);
    order.comment = message;
    await this.orderRepository.save(order);
    return this.orderTransition(id, OrderStatus.ORDER_CANCELLED);
  }

  /**
   * Adds a comment to an order.
   * @param id - The UUID of the order.
   * @param comment - The comment to add.
   * @returns The updated Order entity.
   * @throws NotFoundException if the order is not found.
   */
  async addCommentToOrder(id: string, comment: string): Promise<Order> {
    const order = await this.getOrder(id);
    order.comment = comment;
    return this.orderRepository.save(order);
  }
}