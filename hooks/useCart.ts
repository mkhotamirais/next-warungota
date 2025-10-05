// useCart.tsx
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const getInitialSelectedItems = () => {
  if (typeof window !== "undefined") {
    const storedItems = localStorage.getItem("cart-storage");
    if (storedItems) {
      try {
        const data = JSON.parse(storedItems);
        // Pastikan data yang diambil adalah array string
        if (data && data.state && Array.isArray(data.state.selectedItems)) {
          return data.state.selectedItems;
        }
      } catch (error) {
        console.error("Failed to parse localStorage data", error);
      }
    }
  }
  return [];
};

interface CartState {
  cartQty: number;
  setCartQty: (cartQty: number) => void;
  pending: boolean;
  setPending: (pending: boolean) => void;
  pendingCheckout: boolean;
  setPendingCheckout: (pendingCheckout: boolean) => void;
  selectedItems: string[];
  setSelectedItems: (selectedItems: string[]) => void;
  toggleItem: (itemId: string) => void;
  selectItem: (itemId: string) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cartQty: 0,
      setCartQty: (cartQty: number) => set({ cartQty }),
      pending: false,
      setPending: (pending: boolean) => set({ pending }),
      pendingCheckout: false,
      setPendingCheckout: (pendingCheckout: boolean) => set({ pendingCheckout }),
      selectedItems: getInitialSelectedItems(),
      setSelectedItems: (selectedItems: string[]) => set({ selectedItems }),
      toggleItem: (
        productId // Ganti itemId menjadi productId
      ) =>
        set((state) => {
          const isSelected = state.selectedItems.includes(productId);
          const newSelectedItems = isSelected
            ? state.selectedItems.filter((id) => id !== productId)
            : [...state.selectedItems, productId];

          // Simpan ke localStorage
          localStorage.setItem("cart-storage", JSON.stringify({ state: { selectedItems: newSelectedItems } }));

          return { selectedItems: newSelectedItems };
        }),

      selectItem: (
        productId // Ganti itemId menjadi productId
      ) =>
        set((state) => {
          if (!state.selectedItems.includes(productId)) {
            const newSelectedItems = [...state.selectedItems, productId];

            // Simpan ke localStorage
            localStorage.setItem("cart-storage", JSON.stringify({ state: { selectedItems: newSelectedItems } }));

            return { selectedItems: newSelectedItems };
          }
          return state;
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedItems: state.selectedItems }),
    }
  )
);
