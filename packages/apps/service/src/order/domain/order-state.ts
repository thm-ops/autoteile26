/** Describes the internal state of an order.
 * Payment-specific states are tracked separately in {@link PaymentState}.*/
export enum OrderState {
  /** Order was created but payment has not been confirmed yet.*/
  Created = 'CREATED',
  /** Payment was confirmed. */
  Confirmed = 'CONFIRMED',
  /** Order is currency being shipped.*/
  InShipment = 'IN_SHIPMENT',
  /** Order was delivered. */
  Delivered = 'DELIVERED',
  /** Customer requested to return one or more items.*/
  ReturnRequested = 'RETURN_REQUESTED',
  /** Returned items were received.*/
  Returned = 'RETURNED',
  /** Order was canceled */
  Cancelled = 'CANCELLED',
  /** Order is completed. No further actions.*/
  Closed = 'CLOSED',
}
