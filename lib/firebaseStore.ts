import { User } from "firebase/auth";
import { create } from "zustand";
// import { Post } from "./types";

interface FirebaseState {
  user: User | null;
  setUser: (user: User | null) => void;
  isMounted: boolean;
  setIsMounted: (isMounted: boolean) => void;
  //   posts: Post[];
  //   setPosts: (posts: Post[]) => void;
}

export const useFirebaseStore = create<FirebaseState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isMounted: false,
  setIsMounted: (isMounted) => set({ isMounted }),
  //   posts: [],
  //   setPosts: (posts) => set({ posts }),
}));
