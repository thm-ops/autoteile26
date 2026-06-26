import { Lock } from "lucide-react";

/**
 * Alert component to display when the cart is locked for checkout.
 * Used in both the cart page and the cart drawer.
 * @returns {JSX.Element} The alert component.
 */
export default function CheckoutLockedAlert() {
  return (
    <div className="mb-6 bg-amber-50 border border-amber-600 rounded-lg p-4 flex items-start gap-3">
      <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800">
        Dein Warenkorb ist aktuell für den Bezahlvorgang gesperrt. 
        Bitte schließe die Zahlung ab, um Änderungen vorzunehmen.
      </p>
    </div>
  );
}
