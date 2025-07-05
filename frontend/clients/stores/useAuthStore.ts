import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

interface IUser {
  _id?: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: "user" | "admin";
  isActive?: boolean;
  createdAt?: Date;
}

interface IAuthStore {
  tokens: ITokens | null;
  setTokens: (tokens: ITokens) => void;
  clearTokens: () => void;

  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;

  // 👇 Đây là phần quan trọng bạn bị thiếu
  hydrated: boolean;
  setHydrated: () => void;
}
export const useAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      (set) => ({
        tokens: null,
        setTokens: (tokens) => set((state) => ({ ...state, tokens })),
        clearTokens: () => set((state) => ({ ...state, tokens: null })),

        user: null,
        setUser: (user) => set((state) => ({ ...state, user })),
        clearUser: () => set((state) => ({ ...state, user: null })),

        hydrated: false,
        setHydrated: () => set({ hydrated: true }),
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(); // ✅ gọi khi dữ liệu từ localStorage đã được nạp
        },
      }
    )
  )
);
