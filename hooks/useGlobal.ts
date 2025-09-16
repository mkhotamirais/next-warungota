import { create } from "zustand";

interface GlobalState {
  openLayer: boolean;
  setOpenLayer: (openLayer: boolean) => void;
  openMoreBlogOption: string | null;
  setOpenMoreBlogOption: (openMoreBlogOption: string | null) => void;
  openMoreProductOption: string | null;
  setOpenMoreProductOption: (openMoreProductOption: string | null) => void;
}

export const useGlobal = create<GlobalState>((set) => ({
  openLayer: false,
  setOpenLayer: (openLayer) => set(() => ({ openLayer })),
  openMoreBlogOption: null,
  setOpenMoreBlogOption: (openMoreBlogOption) => set(() => ({ openMoreBlogOption })),
  openMoreProductOption: null,
  setOpenMoreProductOption: (openMoreProductOption) => set(() => ({ openMoreProductOption })),
}));
