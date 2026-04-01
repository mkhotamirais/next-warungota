import { create } from "zustand";

interface MenuBarState {
  openGlobalBar: boolean;
  setOpenGlobalBar: (open: boolean) => void;
  openAppwriteBar: boolean;
  setOpenAppwriteBar: (open: boolean) => void;
}

export const useMenuBar = create<MenuBarState>((set) => ({
  openGlobalBar: false,
  setOpenGlobalBar: (open) => set({ openGlobalBar: open }),
  openAppwriteBar: false,
  setOpenAppwriteBar: (open) => set({ openAppwriteBar: open }),
}));
