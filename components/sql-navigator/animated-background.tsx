"use client"

import { useTheme, type ThemeId } from "@/contexts/theme-context"
import { useEffect, useRef } from "react"

// ─── Starfield Canvas (for Starship Console theme) ───
function StarfieldCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationId: number

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener("resize", resize)

        // Create stars
        const stars: { x: number; y: number; size: number; speed: number; opacity: number; twinkleSpeed: number }[] = []
        for (let i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.8 + 0.3,
                speed: Math.random() * 0.15 + 0.02,
                opacity: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.008 + 0.002,
            })
        }

        let time = 0
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            time += 1

            for (const star of stars) {
                star.y += star.speed
                if (star.y > canvas.height) {
                    star.y = 0
                    star.x = Math.random() * canvas.width
                }

                const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(200, 220, 255, ${star.opacity * twinkle})`
                ctx.fill()
            }

            animationId = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none" }}
        />
    )
}

// ─── Theme-specific backgrounds ───

function NeonPulseBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
            {/* Animated gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(135deg, hsl(280 30% 6%) 0%, hsl(240 20% 4%) 30%, hsl(200 25% 5%) 60%, hsl(320 25% 5%) 100%)",
                    backgroundSize: "400% 400%",
                    animation: "neon-gradient-shift 15s ease infinite",
                }}
            />
            {/* Floating particles */}
            <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-pink-500/20 blur-sm" style={{ animation: "orb-float-1 8s ease-in-out infinite" }} />
            <div className="absolute top-[60%] right-[15%] w-1.5 h-1.5 rounded-full bg-cyan-400/20 blur-sm" style={{ animation: "orb-float-2 10s ease-in-out infinite" }} />
            <div className="absolute bottom-[25%] left-[40%] w-1 h-1 rounded-full bg-pink-400/25 blur-sm" style={{ animation: "orb-float-3 12s ease-in-out infinite" }} />
            <div className="absolute top-[40%] right-[35%] w-1.5 h-1.5 rounded-full bg-blue-400/15 blur-sm" style={{ animation: "orb-float-1 14s ease-in-out infinite" }} />
            <div className="absolute bottom-[10%] right-[60%] w-1 h-1 rounded-full bg-cyan-300/20 blur-sm" style={{ animation: "orb-float-2 9s ease-in-out infinite" }} />
        </div>
    )
}

function StarshipBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
            {/* Deep space base */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse at 50% 0%, hsl(220 30% 8%) 0%, hsl(220 30% 4%) 50%, hsl(220 30% 2%) 100%)",
                }}
            />
            {/* Canvas starfield */}
            <StarfieldCanvas />
            {/* Warm ambient glow (subtle) */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-3xl"
                style={{ backgroundColor: "hsl(38 95% 52% / 0.03)" }}
            />
        </div>
    )
}

function AuroraFlowBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
            {/* Base */}
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(145deg, hsl(225 40% 4%) 0%, hsl(240 30% 5%) 50%, hsl(220 35% 4%) 100%)",
                }}
            />
            {/* Flowing aurora mesh */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: "linear-gradient(135deg, hsl(160 85% 45% / 0.08), hsl(263 85% 65% / 0.06), hsl(190 80% 50% / 0.05), hsl(280 70% 55% / 0.07))",
                    backgroundSize: "300% 300%",
                    animation: "aurora-shift 20s ease infinite",
                }}
            />
            {/* Floating orbs */}
            <div
                className="absolute top-[20%] left-[15%] w-80 h-80 rounded-full blur-3xl"
                style={{
                    backgroundColor: "hsl(160 85% 45% / 0.04)",
                    animation: "orb-float-1 18s ease-in-out infinite",
                }}
            />
            <div
                className="absolute top-[50%] right-[10%] w-64 h-64 rounded-full blur-3xl"
                style={{
                    backgroundColor: "hsl(263 85% 65% / 0.04)",
                    animation: "orb-float-2 22s ease-in-out infinite",
                }}
            />
            <div
                className="absolute bottom-[15%] left-[40%] w-72 h-72 rounded-full blur-3xl"
                style={{
                    backgroundColor: "hsl(190 80% 50% / 0.03)",
                    animation: "orb-float-3 16s ease-in-out infinite",
                }}
            />
        </div>
    )
}

// ─── Main component ───

const BACKGROUNDS: Record<ThemeId, React.FC> = {
    "neon-pulse": NeonPulseBackground,
    starship: StarshipBackground,
    "aurora-flow": AuroraFlowBackground,
}

export function AnimatedBackground() {
    const { theme } = useTheme()
    const Background = BACKGROUNDS[theme]

    return (
        <div className="fixed inset-0 -z-10">
            <Background />
        </div>
    )
}
