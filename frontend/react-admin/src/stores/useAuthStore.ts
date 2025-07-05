import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

interface IUser {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  active: boolean;
  roles: string;
}

type TAuthStore = {
  tokens: ITokens | null;
  user: IUser | null;
  hasHydrated: boolean;
  setTokens: (tokens: ITokens) => void;
  clearTokens: () => void;
  setUser: (user: IUser | null) => void;
};

export const useAuthStore = create<TAuthStore>()(
  devtools(
    persist(
      (set) => ({
        tokens: null,
        user: null,
        hasHydrated: false, // 👈 trạng thái đã hydrate chưa
        setTokens: (tokens: ITokens) => set({ tokens }),
        clearTokens: () => set({ tokens: null, user: null }),
        setUser: (user: IUser | null) => set({ user }),
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => () => {
          useAuthStore.setState({ hasHydrated: true }); // 👈 gắn cờ đã hydrate
        },
      }
    )
  )
);
