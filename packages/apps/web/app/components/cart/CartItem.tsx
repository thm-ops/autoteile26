import Image from 'next/image';
import { CartItem as CartItemType, useCartStore } from '@/app/domain/cart/cart.store';
import { formatPrice } from '@/app/utils/formatPrice';
import CartItemControls from './CartItemControls';

type CartItemProps = {
  item: CartItemType;
  readonly?: boolean;
};

export default function CartItem({ item, readonly = false }: CartItemProps) {
  const isCheckoutLocked = useCartStore((state) => state.isCheckoutLocked);

  const formattedCalculatedPrice = formatPrice(item.price * item.quantity);

  const isReadOnly = readonly || isCheckoutLocked;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-200">
      {/* Thumbnail */}
      <div className="relative w-16 h-16 shrink-0 bg-slate-100 rounded-md overflow-hidden">
        <Image
          src={item.image || 'https://placehold.co/100x100'}
          alt={item.imageAlt || item.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Item details and quantity controls */}
      <div className="flex-1 min-w-0">
        {/* Item details */}
        <h4 className="text-sm font-medium text-slate-900 truncate">{item.name}</h4>
        <p className="text-sm font-medium text-slate-900 mt-1">{formattedCalculatedPrice}</p>
        {/* Quantity controls */}
        <CartItemControls itemId={item.id} quantity={item.quantity} isReadOnly={isReadOnly} />
      </div>
    </div>
  );
}
