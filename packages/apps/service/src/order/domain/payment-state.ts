/** Describes the payment lifecycle of an order.
 * Order-specific states are tracked in {@link OrderState}.*/
export enum PaymentState {
  /** Payment process was created.*/
  Created = 'CREATED',
  /** Payer must complete an external payment step (e.g. approval of payment).*/
  PayerActionRequired = 'PAYER_ACTION_REQUIRED',
  /** Payer approved the payment but the funds have not been captured yet.*/
  Authorized = 'AUTHORIZED',
  /** The payment amount was captured.*/
  Captured = 'CAPTURED',
  /** The captured amount was fully refunded.*/
  Refunded = 'REFUNDED',
  /** The captured amount was partially refunded.*/
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
  /** Payment could not be completed successfully.*/
  Failed = 'FAILED',
}
