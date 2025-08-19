import { create } from "zustand";

interface BlogState {
  successMsg: string | null;
  setSuccessMsg: (successMsg: string | null) => void;
  errorMsg: string | null;
  setErrorMsg: (errorMsg: string | null) => void;
  errors: Record<string, { errors: string[] }> | undefined;
  setErrors: (errors: Record<string, { errors: string[] }> | undefined) => void;
}

export const useBlog = create<BlogState>((set) => ({
  successMsg: null,
  setSuccessMsg: (successMsg) => set({ successMsg }),
  errorMsg: null,
  setErrorMsg: (errorMsg) => set({ errorMsg }),
  errors: undefined,
  setErrors: (errors) => set({ errors }),
}));
