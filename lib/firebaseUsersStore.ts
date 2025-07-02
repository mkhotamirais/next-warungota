import { create } from "zustand";
import { IUser } from "./types";

interface IFirebaseUserStore {
  users: IUser[];
  setUsers: (users: IUser[]) => void;
  pending: boolean;
  setPending: (pending: boolean) => void;
}

export const useFirebaseUserStore = create<IFirebaseUserStore>((set) => ({
  users: [],
  setUsers: (users: IUser[]) => set({ users }),
  pending: false,
  setPending: (pending: boolean) => set({ pending }),
}));
