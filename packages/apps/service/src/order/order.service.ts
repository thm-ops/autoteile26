import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Order, OrderState, PaymentState } from './order.entity';

/**
 * Allowed order state transitions based on the Order-States Wiki.
 */
const ALLOWED_ORDER_TRANSITIONS: Record<OrderState, OrderState[]> = {
  [OrderState.Created]: [OrderState.Confirmed, OrderState.Cancelled],
  [OrderState.Confirmed]: [OrderState.InShipment, OrderState.Cancelled],
  [OrderState.InShipment]: [OrderState.Delivered, OrderState.Cancelled],
  [OrderState.Delivered]: [OrderState.ReturnRequested, OrderState.Closed],
  [OrderState.ReturnRequested]: [OrderState.Returned, OrderState.Closed],
  [OrderState.Returned]: [OrderState.Closed],
  [OrderState.Cancelled]: [],
  [OrderState.Closed]: [],
};

/**
 * Allowed payment state transitions.
 */
const ALLOWED_PAYMENT_TRANSITIONS: Record<PaymentState, PaymentState[]> = {
  [PaymentState.Created]: [PaymentState.PayerActionRequired, PaymentState.Failed],
  [PaymentState.PayerActionRequired]: [PaymentState.Authorized, PaymentState.Failed],
  [PaymentState.Authorized]: [PaymentState.Captured, PaymentState.Failed],
  [PaymentState.Captured]: [PaymentState.Refunded, PaymentState.PartiallyRefunded],
  [PaymentState.Refunded]: [],
  [PaymentState.PartiallyRefunded]: [PaymentState.Refunded],
  [PaymentState.Failed]: [],
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
   * @returns The created Order entity with paypalOrderId and paypalLink.
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
      orderState: OrderState.Created,
      paymentState: PaymentState.PayerActionRequired,
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
   * Captures a PayPal payment and updates order and payment states.
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
    order.paymentState = PaymentState.Captured;
    order.orderState = OrderState.Confirmed;
    return this.orderRepository.save(order);
  }

  /**
   * Returns all orders, optionally filtered by order state.
   * @param filter - Optional filter object with orderState field.
   * @returns Array of Order entities.
   */
  async getOrders(filter?: { orderState?: OrderState }): Promise<Order[]> {
    if (filter?.orderState) {
      return this.orderRepository.find({ where: { orderState: filter.orderState } });
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
   * Transitions an order to a new order state.
   * @param id - The UUID of the order.
   * @param newOrderState - The new order state to transition to.
   * @returns The updated Order entity.
   * @throws NotFoundException if the order is not found.
   * @throws BadRequestException if the transition is not allowed.
   */
  async orderTransition(id: string, newOrderState: OrderState): Promise<Order> {
    const order = await this.getOrder(id);
    const allowed = ALLOWED_ORDER_TRANSITIONS[order.orderState];

    if (!allowed.includes(newOrderState)) {
      throw new BadRequestException(
        `Transition from ${order.orderState} to ${newOrderState} is not allowed.`,
      );
    }

    order.orderState = newOrderState;
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

    order.paymentState = PaymentState.Refunded;
    order.orderState = OrderState.Returned;
    return this.orderRepository.save(order);
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
    order.paymentState = PaymentState.Failed;
    await this.orderRepository.save(order);
    return this.orderTransition(id, OrderState.Cancelled);
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