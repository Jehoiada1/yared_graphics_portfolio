import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";
const THEME_PREFERENCE_KEY = "themePreferenceSet";

const parseTheme = (value: string | null): Theme | undefined => {
  if (value === "light" || value === "dark") {
    return value;
  }
  return undefined;
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (switchable) {
      const hasPreference = localStorage.getItem(THEME_PREFERENCE_KEY) === "true";
      const storedTheme = parseTheme(localStorage.getItem(THEME_STORAGE_KEY));
      if (hasPreference && storedTheme) {
        return storedTheme;
      }
      return defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme, switchable]);

  const toggleTheme = switchable
    ? () => {
        setTheme(prev => {
          const nextTheme = prev === "light" ? "dark" : "light";
          localStorage.setItem(THEME_PREFERENCE_KEY, "true");
          return nextTheme;
        });
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
