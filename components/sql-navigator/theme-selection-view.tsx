"use client"

import { useTheme, THEMES, type ThemeId } from "@/contexts/theme-context"
import { ArrowLeft, Check, Sparkles, Zap, Rocket, Waves } from "lucide-react"

const THEME_PREVIEW: Record<ThemeId, { label: string; description: string; icon: React.ElementType; gradient: string }> = {
  "neon-pulse": {
    label: "Cyberpunk vibes",
    description: "Glowing magenta and electric blue on deep black",
    icon: Zap,
    gradient: "from-pink-500/30 via-purple-600/20 to-cyan-400/30",
  },
  starship: {
    label: "Mission control",
    description: "Amber gold and cyan on space black with starfield",
    icon: Rocket,
    gradient: "from-amber-500/30 via-orange-600/20 to-cyan-400/30",
  },
  "aurora-flow": {
    label: "Fluid elegance",
    description: "Emerald green and purple with flowing aurora mesh",
    icon: Waves,
    gradient: "from-emerald-500/30 via-teal-600/20 to-purple-500/30",
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
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-theme" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center">
            Choose your experience
          </h2>
        </div>
        <p className="text-muted-foreground text-sm mb-8 text-center max-w-sm">
          Pick a theme. You can change it anytime in the header.
        </p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl">
          {THEMES.map((t, i) => {
            const isSelected = theme === t.id
            const preview = THEME_PREVIEW[t.id]
            const Icon = preview.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`
                  relative flex flex-col items-stretch overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 min-h-[180px]
                  animate-in fade-in-0 slide-in-from-bottom-2
                  ${isSelected
                    ? "border-theme shadow-lg scale-[1.02] ring-2 ring-[hsl(var(--primary)_/_0.3)]"
                    : "border-border/50 hover:border-theme hover:scale-[1.01]"
                  }
                `}
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
              >
                {/* Gradient preview background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${preview.gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/30" />
                {isSelected && (
                  <div className="absolute inset-0 bg-[hsl(var(--primary)_/_0.05)]" />
                )}

                <div className="relative flex flex-col flex-1 p-5 justify-between">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 backdrop-blur border border-border/50">
                      <Icon className="h-5 w-5 text-theme" />
                    </span>
                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-primary-foreground shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="block text-base font-bold text-foreground">{t.label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5 block">{preview.label}</span>
                    <span className="text-[10px] text-muted-foreground/70 mt-1 block">{preview.description}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-10 w-full max-w-3xl">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-theme hover:bg-theme-subtle transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 px-6 py-3 rounded-xl text-base font-semibold bg-[hsl(var(--primary))] text-primary-foreground hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2 focus:ring-offset-background transition-all shadow-lg active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
