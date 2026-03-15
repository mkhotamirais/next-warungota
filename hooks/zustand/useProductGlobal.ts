import { create } from "zustand";

interface Props {
  isEditProdCat: string | null;
  setIsEditProdCat: (isEditProdCat: string | null) => void;
}

export const useProductGlobal = create<Props>((set) => ({
  isEditProdCat: null,
  setIsEditProdCat: (isEditProdCat) => set({ isEditProdCat }),
}));
