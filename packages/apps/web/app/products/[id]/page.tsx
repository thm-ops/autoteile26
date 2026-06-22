import { notFound } from "next/navigation";
import { products } from "@/mock/products"
import ProductDetails from "@/app/components/product/ProductDetails";

type productPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductPage({params}: productPageProps) {
    const { id } = await params;

    const product = products.find((product) => product.id === id);

    if (!product) {
        notFound();
    }

    return <ProductDetails product={product} />;
}