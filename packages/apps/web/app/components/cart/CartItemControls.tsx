import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/app/domain/cart/cart.store';

type CartItemControlsProps = {
  itemId: string;
  quantity: number;
  isReadOnly?: boolean;
};

/**
 * Cart item controls component to increase or decrease the quantity of a cartitem. This component has also a remove button.
 * If isReadOnly is true, the component will only display the quantity of the cartitem.
 * @param {string} itemId - The id of the cartitem to update.
 * @param {number} quantity - The current quantity of the cartitem.
 * @param {boolean} isReadOnly - If true, the component will not display the quantity controls.
 * @returns {JSX.Element} A component to increase, decrease the quantity or remove a cartitem.
 */
export default function CartItemControls({
  itemId,
  quantity,
  isReadOnly = false,
}: CartItemControlsProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // UI for Locked mode
  if (isReadOnly) {
    return <p className="text-sm text-slate-500 mt-1">Quantity: {quantity}</p>;
  }

  // Normal UI with controls
  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="flex items-center border border-slate-200 rounded-md bg-white">
        <button
          type="button"
          onClick={() => updateQuantity(itemId, quantity - 1)}
          className="p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center text-sm font-medium text-slate-900">{quantity}</span>
        <button
          type="button"
          onClick={() => updateQuantity(itemId, quantity + 1)}
          className="p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => removeItem(itemId)}
        className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
