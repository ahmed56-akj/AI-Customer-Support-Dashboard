import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (fullName: string, email: string, password: string, companyName: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (patch: Partial<User>) => void;
}

const DEFAULT_USER: User = {
  id: "AGT-101",
  name: "Alex Vance",
  email: "alex.vance@supportai.io",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "admin",
  company: "SupportAI Global",
};

export const useAuthStore = create<AuthState>((set, get) => {
  // Check local storage during init
  let initialUser: User | null = DEFAULT_USER;
  let initialAuth = true;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("supportai_user");
      if (stored) {
        initialUser = JSON.parse(stored);
        initialAuth = true;
      }
    } catch {
      // keep default
    }
  }

  return {
    user: initialUser,
    isAuthenticated: initialAuth,
    isLoading: false,
    error: null,

    login: async (email, password, rememberMe = true) => {
      set({ isLoading: true, error: null });
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Validation
      if (!email.includes("@")) {
        set({ isLoading: false, error: "Please enter a valid email address." });
        return false;
      }
      if (password.length < 6) {
        set({ isLoading: false, error: "Password must be at least 6 characters." });
        return false;
      }

      const loggedUser: User = {
        id: "AGT-101",
        name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Alex Vance",
        email,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "admin",
        company: "SupportAI Global",
      };

      if (typeof window !== "undefined" && rememberMe) {
        localStorage.setItem("supportai_user", JSON.stringify(loggedUser));
      }

      set({ user: loggedUser, isAuthenticated: true, isLoading: false, error: null });
      return true;
    },

    register: async (fullName, email, password, companyName) => {
      set({ isLoading: true, error: null });
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!fullName.trim() || !email.includes("@") || password.length < 6) {
        set({ isLoading: false, error: "Please provide valid registration details." });
        return false;
      }

      const newUser: User = {
        id: "AGT-" + Math.floor(100 + Math.random() * 900),
        name: fullName,
        email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
        role: "admin",
        company: companyName,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("supportai_user", JSON.stringify(newUser));
      }

      set({ user: newUser, isAuthenticated: true, isLoading: false, error: null });
      return true;
    },

    resetPassword: async (email) => {
      set({ isLoading: true, error: null });
      await new Promise((resolve) => setTimeout(resolve, 700));

      if (!email.includes("@")) {
        set({ isLoading: false, error: "Please provide a valid registered email." });
        return false;
      }

      set({ isLoading: false, error: null });
      return true;
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("supportai_user");
      }
      set({ user: null, isAuthenticated: false, error: null });
    },

    updateCurrentUser: (patch) => {
      const current = get().user;
      if (!current) return;
      const updated = { ...current, ...patch };
      if (typeof window !== "undefined") {
        localStorage.setItem("supportai_user", JSON.stringify(updated));
      }
      set({ user: updated });
    },
  };
});
