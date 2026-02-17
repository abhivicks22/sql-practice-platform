"use client"

import { Play, Pause, Send, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileActionBarProps {
    onRun: () => void
    onEvaluate: () => void
    isRunning: boolean
    isEvaluating: boolean
    timerRunning: boolean
    timerElapsed: number
    onTimerStart?: () => void
    onTimerPause?: () => void
    onTimerReset?: () => void
}

export function MobileActionBar({
    onRun,
    onEvaluate,
    isRunning,
    isEvaluating,
    timerRunning,
    timerElapsed,
    onTimerStart,
    onTimerPause,
    onTimerReset,
}: MobileActionBarProps) {

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 pb-safe bg-background/90 backdrop-blur-xl border-t border-border/50 flex items-center justify-between gap-3 shadow-2xl animate-in slide-in-from-bottom-full duration-300">

            {/* Loading Overlay when busy */}
            {(isRunning || isEvaluating) && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-border/30 overflow-hidden">
                    <div className="absolute inset-0 bg-theme animate-progress-indeterminate origin-left" />
                </div>
            )}

            {/* Timer Control */}
            <div className="flex items-center gap-2 pl-1 bg-card/50 rounded-lg p-1.5 border border-border/50">
                <span className="font-digital text-lg text-theme min-w-[60px] text-center tracking-widest">
                    {formatTime(timerElapsed)}
                </span>
                <div className="flex gap-1 border-l border-border/30 pl-2">
                    <button
                        onClick={timerRunning ? onTimerPause : onTimerStart}
                        className="p-1.5 rounded-md hover:bg-secondary/80 text-foreground transition-colors"
                    >
                        {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={onTimerReset}
                        className="p-1.5 rounded-md hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onEvaluate}
                    disabled={isRunning || isEvaluating}
                    className="p-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 border border-border/50"
                    title="Evaluate"
                >
                    <Send className="h-5 w-5" />
                </button>

                <button
                    onClick={onRun}
                    disabled={isRunning || isEvaluating}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(var(--primary))] text-primary-foreground font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                    <Play className="h-5 w-5 fill-current" />
                    RUN
                </button>
            </div>
        </div>
    )
}
