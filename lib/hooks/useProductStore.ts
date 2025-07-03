import { create } from "zustand";
import { IProduct } from "../types";

interface IProductStore {
  products: IProduct[];
  setProducts: (product: IProduct[]) => void;
  pendingProducts: boolean;
  setPendingProducts: (pending: boolean) => void;
  product: IProduct | null;
  setProduct: (product: IProduct | null) => void;
  pendingProduct: boolean;
  setPendingProduct: (pendingProduct: boolean) => void;
}

export const useProductStore = create<IProductStore>((set) => ({
  products: [],
  setProducts: (product) => set({ products: product }),
  pendingProducts: true,
  setPendingProducts: (pendingProducts) => set({ pendingProducts }),
  product: null,
  setProduct: (product) => set({ product }),
  pendingProduct: false,
  setPendingProduct: (pendingProduct) => set({ pendingProduct }),
}));
