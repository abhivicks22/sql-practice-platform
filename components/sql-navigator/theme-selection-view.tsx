"use client"

import { useTheme, THEMES, type ThemeId } from "@/contexts/theme-context"
import { ArrowLeft, Check } from "lucide-react"

const THEME_PREVIEW: Record<ThemeId, { gradient: string; label: string }> = {
  universal: {
    gradient: "from-cyan/30 via-cyan/10 to-transparent",
    label: "Clean, precise, mission control",
  },
  "black-hole": {
    gradient: "from-violet-500/30 via-purple-500/10 to-transparent",
    label: "Deep space, focused",
  },
  "avatar-pandora": {
    gradient: "from-emerald-500/30 via-teal-500/10 to-transparent",
    label: "Bioluminescent, alive",
  },
  comet: {
    gradient: "from-amber-500/30 via-orange-500/10 to-transparent",
    label: "Warm streak, energy",
  },
}

export function ThemeSelectionView({
  onBack,
  onContinue,
}: {
  onBack: () => void
  onContinue: () => void
}) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed inset-0 flex flex-col z-20 animate-in fade-in-0 slide-in-from-right-4 duration-500">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2 text-center">
          Choose your experience
        </h2>
        <p className="text-muted-foreground text-sm mb-10 text-center max-w-sm">
          Pick a theme. You can change it anytime in the app.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {THEMES.map((t, i) => {
            const isSelected = theme === t.id
            const preview = THEME_PREVIEW[t.id]
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`
                  relative flex flex-col items-start p-5 rounded-xl border-2 text-left transition-all duration-300
                  animate-in fade-in-0 slide-in-from-bottom-2
                  ${isSelected
                    ? "border-cyan bg-cyan/10 shadow-lg shadow-cyan/10"
                    : "border-border/50 bg-card/60 hover:border-cyan/40 hover:bg-card/80"
                  }
                `}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
              >
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${preview.gradient} opacity-60 pointer-events-none`}
                />
                <div className="relative flex w-full items-center justify-between">
                  <span className="text-base font-semibold text-foreground">{t.label}</span>
                  {isSelected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
                <span className="relative mt-1 text-xs text-muted-foreground">
                  {preview.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-10 w-full max-w-2xl">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-cyan/30 hover:bg-cyan/5 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 px-6 py-3 rounded-xl text-base font-semibold bg-cyan text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-background transition-all shadow-lg shadow-cyan/20"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
