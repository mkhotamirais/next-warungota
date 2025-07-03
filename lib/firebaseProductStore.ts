import { create } from "zustand";
import { IProduct } from "./types";

interface FirebaseProductState {
  products: IProduct[];
  setProducts: (product: IProduct[]) => void;
  pending: boolean;
  setPending: (pending: boolean) => void;
  product: IProduct | null;
  setProduct: (product: IProduct | null) => void;
  pendingProduct: boolean;
  setPendingProduct: (pendingProduct: boolean) => void;
}

export const useFirebaseProductStore = create<FirebaseProductState>((set) => ({
  products: [],
  setProducts: (product) => set({ products: product }),
  pending: true,
  setPending: (pending) => set({ pending }),
  product: null,
  setProduct: (product) => set({ product }),
  pendingProduct: false,
  setPendingProduct: (pendingProduct) => set({ pendingProduct }),
}));
