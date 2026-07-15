import * as z from "zod"

const productShape = {
    sku: z.string().min(1).max(255),
    name: z.string().min(1).max(255),
    description: z.string().max(10_000).nullable().optional(),
    brand: z.string().max(255).nullable().optional(),
    manufacturerPartNumber: z.string().max(255).nullable().optional(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a decimal string, e.g. "19.99"'),
    currency: z.string().length(3).optional(),
    stockQuantity: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
}

export const createProductDto = z.object(productShape).strict()
export type CreateProductDto = z.infer<typeof createProductDto>

export const updateProductDto = z.object(productShape).partial().strict()
export type UpdateProductDto = z.infer<typeof updateProductDto>
