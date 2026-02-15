"use client"

import { useState, useRef, useEffect } from "react"
import { Database, ChevronDown, Palette, Home } from "lucide-react"
import { categories, difficulties } from "@/lib/sql-data"
import { useTheme, THEMES } from "@/contexts/theme-context"

interface HeaderProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedDifficulty: string
  onDifficultyChange: (difficulty: string) => void
  /** When set, shows a "Start over" button that returns to the welcome flow */
  onStartOver?: () => void
}

const difficultyColors: Record<string, { active: string; inactive: string }> = {
  All: {
    active: "bg-cyan/15 text-cyan border-cyan/30 glow-border",
    inactive: "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border-transparent",
  },
  Easy: {
    active: "bg-cyan/15 text-cyan border-cyan/30",
    inactive: "text-muted-foreground hover:text-cyan hover:bg-cyan/10 border-transparent",
  },
  Medium: {
    active: "bg-orange-500/15 text-orange-400 border-orange-400/30",
    inactive: "text-muted-foreground hover:text-orange-400 hover:bg-orange-500/10 border-transparent",
  },
  Hard: {
    active: "bg-red-500/15 text-red-400 border-red-400/30",
    inactive: "text-muted-foreground hover:text-red-400 hover:bg-red-500/10 border-transparent",
  },
  "Extreme Hard": {
    active: "bg-purple-500/15 text-purple-400 border-purple-400/30",
    inactive: "text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10 border-transparent",
  },
}

export function Header({
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  onStartOver,
}: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [patternOpen, setPatternOpen] = useState(false)
  const [diffOpen, setDiffOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const patternRef = useRef<HTMLDivElement>(null)
  const diffRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (patternRef.current && !patternRef.current.contains(target)) setPatternOpen(false)
      if (diffRef.current && !diffRef.current.contains(target)) setDiffOpen(false)
      if (themeRef.current && !themeRef.current.contains(target)) setThemeOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <header className="glass-panel-strong px-6 py-3 flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" aria-hidden />
      {/* Top row: branding + theme */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Database className="h-7 w-7 text-cyan" />
            <div className="absolute -inset-1 bg-cyan/20 rounded-full blur-md -z-10" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground glow-text">
            SQL Navigator
          </h1>
          <span className="text-xs font-mono text-muted-foreground ml-1 hidden sm:inline">
            v2.0
          </span>
        </div>
        <nav className="flex items-center gap-2">
          {onStartOver && (
            <button
              type="button"
              onClick={onStartOver}
              className="btn-space flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all"
              title="Start over (back to welcome)"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Start over</span>
            </button>
          )}
          <div className="relative" ref={themeRef} aria-label="Theme">
          <button
            type="button"
            onClick={() => setThemeOpen((o) => !o)}
            className="btn-space flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all"
          >
            <Palette className="h-3.5 w-3.5 text-cyan" />
            Theme
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${themeOpen ? "rotate-180" : ""}`} />
          </button>
          {themeOpen && (
            <div className="absolute right-0 top-full mt-1 py-1 min-w-[160px] rounded-md border border-border/50 bg-background shadow-lg z-[100]">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id)
                    setThemeOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                    theme === t.id
                      ? "bg-cyan/15 text-cyan"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
          </div>
        </nav>
      </div>

      {/* Bottom row: Pattern drill-down + Difficulty tabs */}
      <div className="flex items-center justify-between gap-4">
        {/* Pattern: one tab with dropdown (options from categories in sql-data) */}
        <nav className="relative" ref={patternRef} aria-label="SQL Pattern">
          <button
            type="button"
            onClick={() => setPatternOpen((o) => !o)}
            className="btn-space flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all rounded-md bg-cyan/15 text-cyan border-cyan/30"
          >
            {selectedCategory}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${patternOpen ? "rotate-180" : ""}`} />
          </button>
          {patternOpen && (
            <div className="absolute left-0 top-full mt-1 py-1 min-w-[140px] rounded-md border border-border/50 bg-background shadow-lg z-[100]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onCategoryChange(cat)
                    setPatternOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-cyan/15 text-cyan"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Difficulty: drill-down like Pattern */}
        <nav className="relative shrink-0" ref={diffRef} aria-label="Difficulty">
          <button
            type="button"
            onClick={() => setDiffOpen((o) => !o)}
            className={`btn-space flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all rounded-md ${
              difficultyColors[selectedDifficulty]?.active ?? "bg-cyan/15 text-cyan border-cyan/30"
            }`}
          >
            {selectedDifficulty}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${diffOpen ? "rotate-180" : ""}`} />
          </button>
          {diffOpen && (
            <div className="absolute right-0 top-full mt-1 py-1 min-w-[120px] rounded-md border border-border/50 bg-background shadow-lg z-[100]">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    onDifficultyChange(diff)
                    setDiffOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? difficultyColors[diff]?.active ?? "bg-cyan/15 text-cyan"
                      : difficultyColors[diff]?.inactive ?? "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
