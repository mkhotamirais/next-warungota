import { create } from "zustand";

interface AuthMsgState {
  errorSignupMsg: string | null;
  setErrorSignupMsg: (errorSignupMsg: string) => void;
  errorSigninMsg: string | null;
  setErrorSigninMsg: (errorSigninMsg: string) => void;
}

export const useAuthMsg = create<AuthMsgState>((set) => ({
  errorSignupMsg: null,
  setErrorSignupMsg: (errorSignupMsg: string) => set({ errorSignupMsg }),
  errorSigninMsg: null,
  setErrorSigninMsg: (errorSigninMsg: string) => set({ errorSigninMsg }),
}));
