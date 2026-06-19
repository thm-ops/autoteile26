'use client';

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore, selectTotalItems } from "@/app/domain/cart/cart.store";
import { useMounted } from "@/app/hooks/useMounted";

export default function Header() {
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const totalItems = useCartStore(selectTotalItems);
  
  const mounted = useMounted();

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Link to the Startingpage */}
        <Link href="/" className="text-xl font-bold text-slate-900 hover:opacity-80 transition-opacity">
          MeinShop
        </Link>

        {/* Navigation & shopping cart */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Startseite
          </Link>
          
          {/* shopping cart */}
          <button 
            type="button" 
            onClick={toggleDrawer}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
            aria-label="Warenkorb"
          >
            <ShoppingCart className="w-6 h-6" />
            {mounted && totalItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-600 rounded-full transform translate-x-1/4 -translate-y-1/4">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}