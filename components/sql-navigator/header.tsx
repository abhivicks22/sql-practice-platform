"use client"

import { useState, useRef, useEffect } from "react"
import { Database, ChevronDown } from "lucide-react"
import { categories, difficulties } from "@/lib/sql-data"

interface HeaderProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedDifficulty: string
  onDifficultyChange: (difficulty: string) => void
}

const difficultyColors: Record<string, { active: string; inactive: string }> = {
  All: {
    active: "bg-cyan/15 text-cyan border-cyan/30 glow-border",
    inactive: "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border-transparent",
  },
  Easy: {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-400/30",
    inactive: "text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 border-transparent",
  },
  Medium: {
    active: "bg-amber-500/15 text-amber-400 border-amber-400/30",
    inactive: "text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10 border-transparent",
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
}: HeaderProps) {
  const [patternOpen, setPatternOpen] = useState(false)
  const patternRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (patternRef.current && !patternRef.current.contains(e.target as Node)) {
        setPatternOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <header className="glass-panel-strong px-6 py-3 flex flex-col gap-3">
      {/* Top row: branding */}
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
      </div>

      {/* Bottom row: Pattern drill-down + Difficulty tabs */}
      <div className="flex items-center justify-between gap-4">
        {/* Pattern: one tab with dropdown (options from categories in sql-data) */}
        <nav className="relative" ref={patternRef} aria-label="SQL Pattern">
          <button
            type="button"
            onClick={() => setPatternOpen((o) => !o)}
            className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all border rounded-md bg-cyan/15 text-cyan border-cyan/30"
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

        {/* Difficulty tabs */}
        <nav className="flex items-center gap-1 shrink-0" aria-label="Difficulty filter">
          {difficulties.map((diff) => {
            const isActive = selectedDifficulty === diff
            const colors = difficultyColors[diff]
            return (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all border rounded-md ${
                  isActive ? colors.active : colors.inactive
                }`}
              >
                {diff}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
