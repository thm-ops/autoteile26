import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { CartComponentVariant } from '../../types/cartComponentVariant';

type CartEmptyStateProps = {
  variant?: CartComponentVariant;
  onCloseDrawer?: () => void;
};

/**
 * Empty Cart component for Cart Page and Cart Drawer to display an empty cart state.
 * This component is only displayed when the cart is empty.
 * @param {string} variant (optional, default: 'page') - The variant of the cart summary. Can be 'page' or 'drawer'.
 * @param {function} onCloseDrawer (optional, default: undefined) - Callback function that will be executed when the drawer is closed.
 * @returns {JSX.Element} Empty Cart component.
 */
export default function CartEmptyState({ variant = 'page', onCloseDrawer }: CartEmptyStateProps) {
  const isDrawer = variant === 'drawer';

  const title = 'Dein Warenkorb ist leer';
  const description =
    'Derzeit hast du keine Artikel im Warenkorb. Besuche den Shop, um Artikel hinzuzufügen.';
  const buttonText = 'Zurück zum Shop';

  // Empty Cart UI for Drawer
  if (isDrawer) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
        <ShoppingBag className="w-12 h-12 text-slate-300" />
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-center">{description}</p>
        <button
          onClick={onCloseDrawer}
          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2 mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {buttonText}
        </button>
      </div>
    );
  }

  // Empty Cart UI for Page
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-12 h-12 text-slate-400" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
      <p className="text-slate-600 mb-8 max-w-md">{description}</p>
      <Link
        href="/"
        className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        {buttonText}
      </Link>
    </div>
  );
}
