"use client";

import React, { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize theme class
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) root.classList.add("dark");
      else root.classList.remove("dark");
    }
  }, [theme]);

  if (!mounted) {
    return (
      <div className={cn("h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900", className)} />
    );
  }

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <button
      onClick={cycleTheme}
      title={`Current theme: ${theme}. Click to change.`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" && <Moon className="h-4 w-4 text-indigo-400" />}
      {theme === "light" && <Sun className="h-4 w-4 text-amber-500" />}
      {theme === "system" && <Monitor className="h-4 w-4 text-slate-400" />}
    </button>
  );
}
