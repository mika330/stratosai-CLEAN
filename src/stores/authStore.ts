import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  verified: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup";
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthModalOpen: false,
      authModalMode: "login",
      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        set({
          user: {
            id: "current_user",
            name: email.split("@")[0],
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            verified: true,
          },
          isLoading: false,
          isAuthModalOpen: false,
        });
        return true;
      },
      signup: async (name: string, email: string, _password: string) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        set({
          user: {
            id: "current_user",
            name,
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            verified: false,
          },
          isLoading: false,
          isAuthModalOpen: false,
        });
        return true;
      },
      logout: () => set({ user: null }),
      openAuthModal: (mode = "login") => set({ isAuthModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
