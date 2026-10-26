"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  setTheme: (theme: Theme) => void;
  theme: Theme;
  toggleTheme: () => void;
};

const STORAGE_KEY = "crewsync-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const ThemeContext = createContext<ThemeContextValue | null>(null);
const listeners = new Set<() => void>();
const getServerThemeSnapshot = (): Theme => "light";

function notifyThemeChange() {
  listeners.forEach((listener) => listener());
}

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "light";

  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function subscribeTheme(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia(DARK_QUERY);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;

    applyTheme(readStoredTheme() ?? getSystemTheme());
    notifyThemeChange();
  };

  const handleSystemChange = () => {
    if (readStoredTheme() !== null) return;

    applyTheme(getSystemTheme());
    notifyThemeChange();
  };

  window.addEventListener("storage", handleStorage);
  media.addEventListener("change", handleSystemChange);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
    media.removeEventListener("change", handleSystemChange);
  };
}

function setThemePreference(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Theme can still be changed for the current session.
  }

  applyTheme(theme);
  notifyThemeChange();
}

function toggleThemePreference() {
  setThemePreference(
    getThemeSnapshot() === "dark" ? "light" : "dark",
  );
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      setTheme: setThemePreference,
      theme,
      toggleTheme: toggleThemePreference,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return value;
}