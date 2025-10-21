"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  accentColor: string
  toggleTheme: () => void
  setAccentColor: (color: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [accentColor, setAccentColorState] = useState("#3B82F6") // blue-500

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    const savedColor = localStorage.getItem("accentColor")

    if (savedTheme) setTheme(savedTheme)
    if (savedColor) setAccentColorState(savedColor)
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(theme)
    document.documentElement.style.setProperty("--accent-color", accentColor)
  }, [theme, accentColor])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  const setAccentColor = (color: string) => {
    setAccentColorState(color)
    localStorage.setItem("accentColor", color)
  }

  return (
    <ThemeContext.Provider value={{ theme, accentColor, toggleTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
