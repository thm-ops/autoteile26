import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductView } from "../product/product.view";

export interface CartItem extends ProductView {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  isCheckoutLocked: boolean;

  // Actions
  addItem: (product: ProductView) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setCheckoutLocked: (isLocked: boolean) => void;
}

/**
 * Creates the cart store that provides actions to modify the cart.
 * The cart is persisted to local storage to maintain its state across page reloads.
 * The items are persisted when user is in checkout process.
 *
 * @returns The cart store.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,
      isCheckoutLocked: false,

      toggleDrawer: () => {
        set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
      },

      setDrawerOpen: (isOpen) => {
        set({ isDrawerOpen: isOpen });
      },

      addItem: (product) => {
        set((state) => {
          // When checkout is locked the state cannot be modified.
          if (state.isCheckoutLocked) return state;

          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );
          if (existingItem) {
            // If item exists, increment quantity
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          // If item does not exist, add it to the cart
          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          if (state.isCheckoutLocked) return state;
          return {
            items: state.items.filter((item) => item.id !== productId),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (state.isCheckoutLocked) return state;
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== productId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item,
            ),
          };
        });
      },

      clearCart: () => {
        set((state) => {
          if (state.isCheckoutLocked) return state;
          return { items: [] };
        });
      },

      // Lock checkout to prevent cart modifications during payment
      setCheckoutLocked: (isLocked) => {
        set({ isCheckoutLocked: isLocked });
      },
    }),
    {
      name: "cart-storage",
      // persists only cart items, not UI state
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// Selectors
export const selectTotalItems = (state: CartState) =>
  state.items.reduce((acc, item) => acc + item.quantity, 0);

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
