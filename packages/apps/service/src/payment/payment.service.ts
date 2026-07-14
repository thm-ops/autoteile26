import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductService } from '../product/product.service';

interface PayPalConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
}

interface PayPalTokenResponse {
  access_token: string;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units?: {
    payments?: {
      captures?: { id: string; status: string }[];
    };
  }[];
}

/**
 * Server-side PayPal integration for the single-product instant buy.
 *
 * The order amount is always derived from the trusted product record in the
 * database — the client only supplies a product id. The PayPal client secret
 * never leaves the backend. This keeps card data with PayPal (SAQ-A scope) and
 * makes the captured amount tamper-proof.
 */
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly productService: ProductService,
  ) {}

  /**
   * Creates a PayPal order for a single product. The price and currency are
   * read from the database, not from the request.
   */
  async createOrderForProduct(
    productId: string,
  ): Promise<{ id: string; status: string }> {
    const product = await this.productService.findOne(productId);

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    const config = this.getConfig();
    const accessToken = await this.getAccessToken(config);

    const response = await fetch(`${config.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: product.id,
            amount: {
              currency_code: product.currency.trim(),
              value: this.formatAmount(product.price),
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      this.logger.error(`PayPal create order failed: ${details}`);
      throw new BadGatewayException('Failed to create PayPal order');
    }

    const order = (await response.json()) as PayPalOrderResponse;
    return { id: order.id, status: order.status };
  }

  /**
   * Captures a previously created PayPal order server-side and verifies that
   * the capture actually completed.
   */
  async captureOrder(orderId: string): Promise<{ id: string; status: string }> {
    const config = this.getConfig();
    const accessToken = await this.getAccessToken(config);

    const response = await fetch(
      `${config.baseUrl}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const details = await response.text();
      this.logger.error(`PayPal capture failed: ${details}`);
      throw new BadGatewayException('Failed to capture PayPal order');
    }

    const capture = (await response.json()) as PayPalCaptureResponse;
    const captureStatus =
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.status;

    if (capture.status !== 'COMPLETED' || captureStatus !== 'COMPLETED') {
      this.logger.error(
        `PayPal capture not completed: order=${capture.status} capture=${captureStatus}`,
      );
      throw new BadGatewayException('PayPal payment was not completed');
    }

    return { id: capture.id, status: capture.status };

  /**
   * Exchanges the client credentials for a short-lived access token.
   */
  private async getAccessToken(config: PayPalConfig): Promise<string> {
    const basicAuth = Buffer.from(
      `${config.clientId}:${config.clientSecret}`,
    ).toString('base64');

    const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const details = await response.text();
      this.logger.error(`PayPal token request failed: ${details}`);
      throw new BadGatewayException('Failed to authenticate with PayPal');
    }

    const token = (await response.json()) as PayPalTokenResponse;
    return token.access_token;
  }

  /**
   * Reads and validates the PayPal configuration from the environment.
   */
  private getConfig(): PayPalConfig {
    const baseUrl = this.configService.get<string>('paypal.baseUrl');
    const clientId = this.configService.get<string>('paypal.clientId');
    const clientSecret = this.configService.get<string>('paypal.clientSecret');

    if (!baseUrl || !clientId || !clientSecret) {
      throw new InternalServerErrorException(
        'PayPal is not configured (PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET).',
      );
    }

    return { baseUrl, clientId, clientSecret };
  }

  /**
   * Normalises a stored price string into the two-decimal string PayPal
   * expects (e.g. "89.9" -> "89.90").
   */
  private formatAmount(price: string): string {
    const amount = Number(price);

    if (!Number.isFinite(amount) || amount < 0) {
      throw new InternalServerErrorException(
        `Invalid product price: "${price}"`,
      );
    }

    return amount.toFixed(2);
  }
}
