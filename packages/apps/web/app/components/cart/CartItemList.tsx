import CartItem from './CartItem';
import { useCartStore } from '@/app/domain/cart/cart.store';
import { CartComponentVariant } from '../../types/cartComponentVariant';

type CartItemListProps = {
  variant?: CartComponentVariant;
};

/**
 * Cart Item List component to display all items in the cart.
 * Used in both Cart Page and Cart Drawer.
 * @param {string} variant (optional, default: 'page') - The variant of the list. Can be 'page' or 'drawer'.
 * @returns {JSX.Element} Cart Item List component.
 */
export default function CartItemList({ variant = 'page' }: CartItemListProps) {
  const items = useCartStore((state) => state.items);
  const isCheckoutLocked = useCartStore((state) => state.isCheckoutLocked);

  const isDrawer = variant === 'drawer';

  // UI for Drawer
  if (isDrawer) {
    return (
      <div className="flex flex-col">
        {items.map((item) => (
          <CartItem key={item.id} item={item} readonly={isCheckoutLocked} />
        ))}
      </div>
    );
  }

  // UI for Page
  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6">
          {items.map((item) => (
            <CartItem key={item.id} item={item} readonly={isCheckoutLocked} />
          ))}
        </div>
      </div>
    </div>
  );
}
