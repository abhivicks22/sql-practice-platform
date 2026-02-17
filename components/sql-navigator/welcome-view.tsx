"use client"

import Image from "next/image"

export function WelcomeView({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="fixed inset-0 z-20 animate-in fade-in-0 duration-500 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-4">
        {/* Full-bleed background using your pic */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/pics/universal.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background/92" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_30%,transparent_40%,hsl(var(--background)_/_0.6)_100%)]" />
        </div>
        {/* Decorative corner accents */}
        <div className="absolute top-6 left-6 w-20 h-20 border-l-2 border-t-2 border-theme rounded-tl-xl" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-theme rounded-br-xl" />
        {/* Content card */}
        <div className="relative text-center max-w-lg px-8 py-10 animate-in zoom-in-95 duration-500 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-theme border border-theme bg-theme-subtle mb-6">
            SQL Practice
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground glow-text mb-3">
            Welcome to SQL
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[hsl(var(--primary)_/_0.5)] to-transparent mx-auto mb-6" />
          <p className="text-muted-foreground text-lg font-reading mb-8">
            Practice real-world queries. Run code. Get feedback.
          </p>
          <button
            type="button"
            onClick={onGetStarted}
            className="px-8 py-3.5 rounded-xl text-base font-semibold bg-[hsl(var(--primary))] text-primary-foreground hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2 focus:ring-offset-background transition-all shadow-lg active:scale-[0.98]"
          >
            Choose your experience
          </button>
        </div>
      </div>
    </div>
  )
}
