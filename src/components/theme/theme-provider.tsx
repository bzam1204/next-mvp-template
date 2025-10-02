'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isReady: boolean;
}

const STORAGE_KEY = 'ipt-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isReady, setIsReady] = useState(false);
  const [hasExplicitPreference, setHasExplicitPreference] = useState(false);

  useEffect(() => {
    const storedTheme = readStoredTheme();

    if (storedTheme) {
      setThemeState(storedTheme);
      setHasExplicitPreference(true);
      setIsReady(true);
      return;
    }

    const systemTheme = resolveSystemTheme();
    setThemeState(systemTheme);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme, isReady]);

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') {
      return;
    }

    if (hasExplicitPreference) {
      window.localStorage.setItem(STORAGE_KEY, theme);
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [theme, hasExplicitPreference, isReady]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      if (hasExplicitPreference) {
        return;
      }

      setThemeState(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handlePreferenceChange);

    return () => mediaQuery.removeEventListener('change', handlePreferenceChange);
  }, [hasExplicitPreference]);

  const applyTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    setHasExplicitPreference(true);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }, [applyTheme, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme: applyTheme, toggleTheme, isReady }),
    [applyTheme, theme, toggleTheme, isReady],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
