/**
 * API response data transfer object.
 */
export type ProductView = {
    /** Unique identifier of the product */
    id: string;
    name: string;
    description: string;
    image?: string;
    price: number;
};
