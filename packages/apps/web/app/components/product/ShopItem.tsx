'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/app/utils/formatPrice';
import { ProductView } from '@/app/domain/product';
import { useCartStore } from '@/app/domain/cart/cart.store';
import { ShoppingCart } from 'lucide-react';

type ShopItemProps = {
  product: ProductView;
};

export default function ShopItem({ product }: ShopItemProps) {
  const { id, name, description, price, image, imageAlt } = product;

  const formattedPrice = formatPrice(price);
  const addItem = useCartStore((state) => state.addItem);
  const isCheckoutLocked = useCartStore((state) => state.isCheckoutLocked);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-card">
      <Image
        src={image || 'https://placehold.co/600x400'}
        width={600}
        height={400}
        alt={imageAlt || 'Placeholder Image'}
        unoptimized={true}
      />
      <div className="px-6 py-4">
        <p className="font-bold text-xl mb-2">{name}</p>
        <p className="text-foreground text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <p className="font-bold text-lg">{formattedPrice}</p>
      </div>
      <div className="px-6 pb-4 flex gap-2 flex-wrap">
        <Link
          href={`/products/${id}`}
          className="bg-slate-200 text-slate-800 p-3 rounded-2xl inline-flex items-center justify-center hover:bg-slate-300 transition-colors flex-1 text-center font-medium"
        >
          Details ansehen
        </Link>
        <button
          onClick={() => addItem(product)}
          disabled={isCheckoutLocked}
          className="bg-blue-600 text-white p-3 rounded-2xl inline-flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors flex-1 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          In den Warenkorb
        </button>
      </div>
    </div>
  );
}
