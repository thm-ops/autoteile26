import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useCartStore, selectTotalPrice } from '@/app/domain/cart/cart.store';
import { formatPrice } from '@/app/utils/formatPrice';
import CheckoutLockedAlert from './CheckoutLockedAlert';
import { CartComponentVariant } from '../../types/cartComponentVariant';

type CartSummaryProps = {
  onCheckout: () => void;
  variant?: CartComponentVariant;
  onCloseDrawer?: () => void;
};

/**
 * Cart Summary component to display the total price and checkout button.
 * Used in both Cart Page and Cart Drawer.
 *
 * @param {function} onCheckout - Callback function that will be executed when the checkout button is clicked.
 * @param {string} variant (optional, default: 'page') - The variant of the cart summary. Can be 'page' or 'drawer'.
 * @param {function} onCloseDrawer (optional, default: undefined) - Callback function that will be executed when the drawer is closed.
 *
 * @returns {JSX.Element} The Cart Summary component.
 */
export default function CartSummary({
  onCheckout,
  variant = 'page',
  onCloseDrawer,
}: CartSummaryProps) {
  const totalPrice = useCartStore(selectTotalPrice);
  const isCheckoutLocked = useCartStore((state) => state.isCheckoutLocked);

  const isDrawer = variant === 'drawer';

  // Inner content of the cart summary
  const innerContent = (
    <>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-slate-600">
          <span>Zwischensumme</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Versandkosten</span>
          <span>Kostenlos</span>
        </div>
        <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-lg text-slate-900">
          <span>Gesamtsumme</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Alert if checkout is locked */}
      {isCheckoutLocked && <CheckoutLockedAlert />}

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isCheckoutLocked}
        className={`w-full bg-blue-600 text-white font-semibold ${isDrawer ? 'py-3' : 'py-4'} px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDrawer ? 'mb-3' : 'mb-4'} flex items-center justify-center gap-2`}
      >
        {isCheckoutLocked ? 'Bezahlung läuft...' : 'Mit PayPal bezahlen'}
      </button>

      {/* Secure payment information */}
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Sichere Zahlung. Die MwSt. ist im Preis enthalten.</span>
      </p>

      {/* Link to cart page if variant is drawer */}
      {isDrawer && (
        <Link
          href="/cart"
          onClick={onCloseDrawer}
          className="block w-full text-center text-blue-600 font-medium hover:text-blue-700 py-2 mt-2"
        >
          Warenkorb-Seite ansehen
        </Link>
      )}
    </>
  );

  // UI for Drawer (without Heading)
  if (isDrawer) {
    return <div className="border-t border-slate-200 p-8 bg-slate-50">{innerContent}</div>;
  }

  // UI for Page (with Heading)
  return (
    <div className="w-full lg:w-96">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Zusammenfassung</h2>
        {innerContent}
      </div>
    </div>
  );
}
