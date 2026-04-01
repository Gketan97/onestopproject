// src/hooks/useTheme.js
// Theme system — reads/writes 'osc_theme' localStorage key
// Applies data-theme to <html> on mount and toggle
// Respects prefers-color-scheme as initial default

import React, { useState, useEffect, useCallback, useContext } from 'react';

export const ThemeContext = React.createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

function getInitialTheme() {
  try {
    const stored = localStorage.getItem('osc_theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch (_) {}
  // No stored preference — respect system setting
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply to <html> immediately on mount + whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('osc_theme', theme); } catch (_) {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}

// Provider — wrap App in main.jsx
export function ThemeProvider({ children }) {
  const value = useTheme();
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer hook
export function useThemeContext() {
  return useContext(ThemeContext);
}