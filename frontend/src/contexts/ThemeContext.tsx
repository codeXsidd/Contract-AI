import React, { createContext, useContext, useState, useEffect } from 'react'

export type ThemeMode = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: ThemeMode
  effectiveTheme: 'dark' | 'light'
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  effectiveTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme_mode') as ThemeMode) || 'system'
  })

  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    localStorage.setItem('theme_mode', theme)

    const computeEffective = (): 'dark' | 'light' => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return theme
    }

    const eff = computeEffective()
    setEffectiveTheme(eff)

    if (eff === 'light') {
      document.documentElement.classList.add('light-mode')
    } else {
      document.documentElement.classList.remove('light-mode')
    }

    // Listen to system OS theme changes when mode is 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newEff = e.matches ? 'dark' : 'light'
        setEffectiveTheme(newEff)
        if (newEff === 'light') {
          document.documentElement.classList.add('light-mode')
        } else {
          document.documentElement.classList.remove('light-mode')
        }
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [theme])

  const setTheme = (mode: ThemeMode) => setThemeState(mode)
  const toggleTheme = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
