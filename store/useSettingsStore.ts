import { create } from "zustand";
import { AppSettings, AISettings, ProfileSettings, WorkspaceSettings, NotificationSettings } from "@/types";
import { initialAppSettings } from "@/services/mockData";

interface SettingsState {
  settings: AppSettings;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  updateProfile: (profile: Partial<ProfileSettings>) => void;
  updateWorkspace: (workspace: Partial<WorkspaceSettings>) => void;
  updateNotifications: (notifications: Partial<NotificationSettings>) => void;
  updateAISettings: (ai: Partial<AISettings>) => void;
}

const SETTINGS_KEY = "supportai_settings";
const THEME_KEY = "supportai_theme";

export const useSettingsStore = create<SettingsState>((set, get) => {
  let initialSettings = initialAppSettings;
  let initialTheme: "light" | "dark" | "system" = "dark";

  if (typeof window !== "undefined") {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) initialSettings = JSON.parse(storedSettings);
      const storedTheme = localStorage.getItem(THEME_KEY) as "light" | "dark" | "system";
      if (storedTheme) initialTheme = storedTheme;
    } catch {
      // keep fallback
    }
  }

  const persistSettings = (newSettings: AppSettings) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      } catch (err) {
        console.error("Failed to save settings", err);
      }
    }
  };

  return {
    settings: initialSettings,
    theme: initialTheme,

    setTheme: (theme) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(THEME_KEY, theme);
        const root = document.documentElement;
        if (theme === "dark") {
          root.classList.add("dark");
        } else if (theme === "light") {
          root.classList.remove("dark");
        } else {
          // system
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          if (prefersDark) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      }
      set({ theme });
    },

    updateProfile: (patch) => {
      const current = get().settings;
      const updated: AppSettings = {
        ...current,
        profile: { ...current.profile, ...patch },
      };
      persistSettings(updated);
      set({ settings: updated });
    },

    updateWorkspace: (patch) => {
      const current = get().settings;
      const updated: AppSettings = {
        ...current,
        workspace: { ...current.workspace, ...patch },
      };
      persistSettings(updated);
      set({ settings: updated });
    },

    updateNotifications: (patch) => {
      const current = get().settings;
      const updated: AppSettings = {
        ...current,
        notifications: { ...current.notifications, ...patch },
      };
      persistSettings(updated);
      set({ settings: updated });
    },

    updateAISettings: (patch) => {
      const current = get().settings;
      const updated: AppSettings = {
        ...current,
        ai: { ...current.ai, ...patch },
      };
      persistSettings(updated);
      set({ settings: updated });
    },
  };
});
