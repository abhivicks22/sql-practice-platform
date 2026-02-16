"use client"

import { createContext, useContext, useEffect, useState } from "react"

export const THEMES = [
  { id: "neon-pulse", label: "Neon Pulse" },
  { id: "starship", label: "Starship Console" },
  { id: "aurora-flow", label: "Aurora Flow" },
] as const

export type ThemeId = (typeof THEMES)[number]["id"]

const STORAGE_KEY = "sql-navigator-theme"

const ThemeContext = createContext<{
  theme: ThemeId
  setTheme: (id: ThemeId) => void
}>({ theme: "neon-pulse", setTheme: () => { } })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("neon-pulse")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null
      if (stored && THEMES.some((t) => t.id === stored)) {
        setThemeState(stored)
      }
    } catch {
      // ignore
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute("data-theme", theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme, mounted])

  const setTheme = (id: ThemeId) => setThemeState(id)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
