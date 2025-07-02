import { create } from "zustand";
import { IProduct } from "./types";

interface FirebaseProductState {
  products: IProduct[];
  setProducts: (product: IProduct[]) => void;
  pending: boolean;
  setPending: (pending: boolean) => void;
}

export const useFirebaseProductStore = create<FirebaseProductState>((set) => ({
  products: [],
  setProducts: (product) => set({ products: product }),
  pending: false,
  setPending: (pending) => set({ pending }),
}));
