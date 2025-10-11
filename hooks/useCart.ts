import { create } from "zustand";

interface CartState {
  cartQty: number;
  setCartQty: (cartQty: number) => void;
  pending: boolean;
  setPending: (pending: boolean) => void;
  pendingSave: string | null;
  setPendingSave: (id: string | null) => void;
  pendingCheckout: string | null;
  setPendingCheckout: (id: string | null) => void;
  pendingCheck: string | null;
  setPendingCheck: (pendingCheck: string | null) => void;
}

export const useCart = create<CartState>((set) => ({
  cartQty: 0,
  setCartQty: (cartQty: number) => set({ cartQty }),
  pending: false,
  setPending: (pending: boolean) => set({ pending }),
  pendingSave: null,
  setPendingSave: (id) => set({ pendingSave: id }),
  pendingCheckout: null,
  setPendingCheckout: (id) => set({ pendingCheckout: id }),
  pendingCheck: null,
  setPendingCheck: (pendingCheck) => set({ pendingCheck }),
}));
