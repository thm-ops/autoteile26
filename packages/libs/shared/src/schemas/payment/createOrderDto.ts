import * as z from "zod"

/**
 * Request body for creating a server-side PayPal order.
 * Only the product identifier is accepted from the client — the price is
 * always resolved server-side from the trusted product record, never sent
 * by the browser.
 */
export const createOrderDto = z.object({
    productId: z.uuid()
})

export type CreateOrderDto = z.infer<typeof createOrderDto>
