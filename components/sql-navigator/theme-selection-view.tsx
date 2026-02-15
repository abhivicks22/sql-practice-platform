"use client"

import Image from "next/image"
import { useTheme, THEMES, type ThemeId } from "@/contexts/theme-context"
import { ArrowLeft, Check, Sparkles, Globe, Moon, Leaf, Flame } from "lucide-react"

const THEME_PREVIEW: Record<ThemeId, { label: string; icon: React.ElementType }> = {
  universal: { label: "Clean, precise, mission control", icon: Globe },
  "black-hole": { label: "Deep space, focused", icon: Moon },
  "avatar-pandora": { label: "Teal bioluminescent, alive", icon: Leaf },
  comet: { label: "Coral streak, energy", icon: Flame },
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
          <Sparkles className="h-5 w-5 text-cyan" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center">
            Choose your experience
          </h2>
        </div>
        <p className="text-muted-foreground text-sm mb-8 text-center max-w-sm">
          Pick a theme. You can change it anytime in the app.
        </p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
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
                  relative flex flex-col items-stretch overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 min-h-[140px]
                  animate-in fade-in-0 slide-in-from-bottom-2
                  ${isSelected
                    ? "border-cyan shadow-lg shadow-cyan/15 scale-[1.02] ring-2 ring-cyan/30"
                    : "border-border/50 hover:border-cyan/40 hover:scale-[1.01]"
                  }
                `}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
              >
                {/* Your pic as card background */}
                <div className="absolute inset-0">
                  <Image
                    src={`/pics/${t.id}.jpg`}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/30" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-cyan/5" />
                  )}
                </div>
                <div className="relative flex flex-col flex-1 p-5 justify-between">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/60 backdrop-blur border border-border/50">
                      <Icon className="h-4 w-4 text-cyan" />
                    </span>
                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan text-primary-foreground shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="block text-base font-semibold text-foreground">{t.label}</span>
                    <span className="text-xs text-muted-foreground">{preview.label}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-10 w-full max-w-2xl">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-cyan/30 hover:bg-cyan/5 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 px-6 py-3 rounded-xl text-base font-semibold bg-cyan text-primary-foreground hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-background transition-all shadow-lg shadow-cyan/20 active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
