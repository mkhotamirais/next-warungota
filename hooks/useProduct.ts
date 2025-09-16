import { create } from "zustand";

interface ProductState {
  successMsg: string | null;
  setSuccessMsg: (successMsg: string | null) => void;
  errorMsg: string | null;
  setErrorMsg: (errorMsg: string | null) => void;
  errors: Record<string, { errors: string[] }> | undefined;
  setErrors: (errors: Record<string, { errors: string[] }> | undefined) => void;
}

export const useProduct = create<ProductState>((set) => ({
  successMsg: null,
  setSuccessMsg: (successMsg) => set({ successMsg }),
  errorMsg: null,
  setErrorMsg: (errorMsg) => set({ errorMsg }),
  errors: undefined,
  setErrors: (errors) => set({ errors }),
}));
