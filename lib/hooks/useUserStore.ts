import { create } from "zustand";
import { IUser } from "../types";

interface IUserStore {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isMounted: boolean;
  setIsMounted: (isMounted: boolean) => void;
  users: IUser[];
  setUsers: (users: IUser[]) => void;
  pendingUsers: boolean;
  setPendingUsers: (pending: boolean) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isMounted: false,
  setIsMounted: (isMounted) => set({ isMounted }),
  users: [],
  setUsers: (users: IUser[]) => set({ users }),
  pendingUsers: false,
  setPendingUsers: (pendingUsers: boolean) => set({ pendingUsers }),
}));
