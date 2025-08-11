"use client";

import { useThemeContext } from "@/components/providers/ThemeProvider";

/**
 * useTheme
 * Custom hook for consuming the theme context
 * Provides:
 * - theme: current theme value ('light', 'dark', 'system')
 * - setTheme: function to manually set a theme
 * - toggleTheme: helper to switch between light and dark modes
 */
export function useTheme() {
  const { theme, setTheme } = useThemeContext();

  /**
   * Toggle theme between 'dark' && 'light'
   * - Ignores 'system' mode && switches directly between light/dark
   */
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return { theme, setTheme, toggleTheme };
}
