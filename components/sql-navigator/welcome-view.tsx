"use client"

export function WelcomeView({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-20 animate-in fade-in-0 duration-500">
      <div className="text-center max-w-md px-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground glow-text mb-4">
          Welcome to SQL
        </h1>
        <p className="text-muted-foreground text-lg mb-10 font-reading">
          Practice real-world queries. Run code. Get feedback.
        </p>
        <button
          type="button"
          onClick={onGetStarted}
          className="px-8 py-3.5 rounded-xl text-base font-semibold bg-cyan text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-background transition-all shadow-lg shadow-cyan/20"
        >
          Choose your experience
        </button>
      </div>
    </div>
  )
}
