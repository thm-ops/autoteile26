'use client';

import { X, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCartStore, selectTotalItems } from '@/app/domain/cart/cart.store';
import CartItemList from './CartItemList';
import CartEmptyState from './CartEmptyState';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isDrawerOpen);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const items = useCartStore((state) => state.items);
  const setCheckoutLocked = useCartStore((state) => state.setCheckoutLocked);
  
  const totalItems = useCartStore(selectTotalItems);

  // Prevent hydration mismatch for persisted state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckoutClick = () => {
    // TODO: Implement Paypal Payment Process here
    // Lock cart and prevent modifications during payment
    setCheckoutLocked(true);
  };

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity"
          onClick={toggleDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Warenkorb ({totalItems} Artikel)
          </h2>
          <button
            onClick={toggleDrawer}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {items.length === 0 ? (
            <CartEmptyState variant="drawer" onCloseDrawer={toggleDrawer} />
          ) : (
            <CartItemList variant="drawer" />
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <CartSummary variant="drawer" onCheckout={handleCheckoutClick} onCloseDrawer={toggleDrawer} />
        )}
      </div>
    </>
  );
}
