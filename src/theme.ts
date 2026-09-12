export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'static-viewers-theme'

export function getInitialTheme(): ThemeMode {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  } catch {
    // A blocked storage API should not prevent the viewers from rendering.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Theme persistence is a convenience rather than a runtime requirement.
  }
}
