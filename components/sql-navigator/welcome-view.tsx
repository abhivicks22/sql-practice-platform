"use client"

export function WelcomeView({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-20 animate-in fade-in-0 duration-500">
      {/* Lively gradient orbs behind content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan/8 blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      <div className="relative text-center max-w-md px-6 animate-in zoom-in-95 duration-500" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground glow-text mb-4">
          Welcome to SQL
        </h1>
        <p className="text-muted-foreground text-lg mb-10 font-reading">
          Practice real-world queries. Run code. Get feedback.
        </p>
        <button
          type="button"
          onClick={onGetStarted}
          className="px-8 py-3.5 rounded-xl text-base font-semibold bg-cyan text-primary-foreground hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-background transition-all shadow-lg shadow-cyan/20 active:scale-[0.98]"
        >
          Choose your experience
        </button>
      </div>
    </div>
  )
}
