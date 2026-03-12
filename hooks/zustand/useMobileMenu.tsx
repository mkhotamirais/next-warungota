import { create } from "zustand";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useMobileMenu = create<Props>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));
