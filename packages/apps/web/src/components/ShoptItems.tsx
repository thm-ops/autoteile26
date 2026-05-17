import {products} from "@/mock/products";
import ShopItem from "@/src/components/ShopItem";

export default function ShopItems() {
    return (
        <div
            className={"grid grid-cols- sm:grid-cols-2 md:grid-cols-3 gap-5"}
        >
            {products.map(product => (
                <ShopItem
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    )
}
