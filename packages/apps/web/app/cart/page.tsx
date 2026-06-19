'use client';

import { useCartStore, selectTotalItems } from '@/app/domain/cart/cart.store';
import { useMounted } from '@/app/hooks/useMounted';
import CartItemList from '@/app/components/cart/CartItemList';
import CartEmptyState from '@/app/components/cart/CartEmptyState';
import CartSummary from '@/app/components/cart/CartSummary';

/**
 * The Shopping Cart Page component that displays the cart items and the cart summary.
 * @returns {JSX.Element} The Shopping Cart Page component.
 */
export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const setCheckoutLocked = useCartStore((state) => state.setCheckoutLocked);
  
  const totalItems = useCartStore(selectTotalItems);

  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Lade Warenkorb...</p>
      </div>
    );
  }

  const handleCheckoutClick = () => {
    // Lock the cart for the upcoming payment process
    setCheckoutLocked(true);
    // TODO: Initialize PayPal session here
  };

  // Handle empty cart
  if (items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Warenkorb ({totalItems} Artikel)</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <CartItemList />
        <CartSummary onCheckout={handleCheckoutClick} />
      </div>
    </div>
  );
}
