'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-storage')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, setTheme]);

  return <>{children}</>;
}
