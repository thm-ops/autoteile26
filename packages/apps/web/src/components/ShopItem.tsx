import Image from "next/image";
import {formatPrice} from "@/src/utils/formatPrice";
import {ProductView} from "@/src/domain/product"

export default function ShopItem({
                                     product: {
                                         name,
                                         description,
                                         price,
                                         image
                                     }
                                 }: ShopItemProps) {
    const formattedPrice = formatPrice(price);

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-card">
            <Image
                src={image || "https://placehold.co/600x400"}
                width={600}
                height={400}
                alt={"Placeholder Image"}
                unoptimized={true}
            />
            <div className="px-6 py-4">
                <p className="font-bold text-xl mb-2">{name}</p>
                <p className="text-foreground text-base">
                    {description}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <p>{formattedPrice}</p>
            </div>
        </div>
    )
}
