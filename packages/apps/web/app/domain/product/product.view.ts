/**
 * API response data transfer object.
 */
export type ProductView = {
    /** Unique identifier of the product */
    id: string;
    /** name of the product */
    name: string;
    /** description of the product */
    description: string;
    /** image of the product */
    image?: string;
    /** text describing the image for screenreaders */
    imageAlt?: string;
    /** price of the product in cents */
    price: number;
};
