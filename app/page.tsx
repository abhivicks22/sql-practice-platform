"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Header } from "@/components/sql-navigator/header"
import { LeftPanel } from "@/components/sql-navigator/left-panel"
import { RightPanel } from "@/components/sql-navigator/right-panel"
import { WelcomeView } from "@/components/sql-navigator/welcome-view"
import { ThemeSelectionView } from "@/components/sql-navigator/theme-selection-view"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { questions } from "@/lib/sql-data"
import { useTheme } from "@/contexts/theme-context"
import type { ThemeId } from "@/contexts/theme-context"

const ONBOARDED_KEY = "sql-navigator-onboarded"
type FlowStep = "welcome" | "theme" | "app"

const THEME_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]

/** Optional theme image from public/themes/{id}.jpg or public/pics/{id}.jpg - makes the background livelier when present */
function ThemeBackgroundImage() {
  const { theme } = useTheme()
  const [visible, setVisible] = useState(false)
  const [attempt, setAttempt] = useState({ path: "themes", ext: 0 })

  const path = attempt.path === "themes" ? "/themes" : "/pics"
  const ext = THEME_IMAGE_EXTENSIONS[attempt.ext]
  const src = `${path}/${theme}${ext}`

  useEffect(() => {
    setVisible(false)
    setAttempt({ path: "themes", ext: 0 })
  }, [theme])

  const handleError = () => {
    if (attempt.ext < THEME_IMAGE_EXTENSIONS.length - 1) {
      setAttempt((a) => ({ ...a, ext: a.ext + 1 }))
    } else if (attempt.path === "themes") {
      setAttempt({ path: "pics", ext: 0 })
    } else {
      setVisible(false)
    }
  }

  return (
    <>
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: visible ? 0.35 : 0, pointerEvents: "none" }}
        onLoad={() => setVisible(true)}
        onError={handleError}
      />
      {visible && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, hsl(var(--background) / 0.4) 100%)",
          }}
        />
      )}
    </>
  )
}

function AmbientBackground() {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <ThemeBackgroundImage />
      <div className="absolute inset-0 bg-gradient-to-b from-background/88 via-background/82 to-background/95" />

      {/* Base orbs – all themes */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[hsl(var(--cyan)_/_0.04)] blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[hsl(var(--cyan)_/_0.03)] blur-[100px]"
        style={{ animationDelay: "1s", animationDuration: "4s" }}
      />
      <div
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[hsl(var(--cyan)_/_0.02)] blur-[80px]"
        style={{ animationDelay: "2s", animationDuration: "6s" }}
      />

      {/* Sliding pattern – diagonal stripes, theme color, no green/yellow */}
      <div
        className="absolute inset-0 opacity-[0.06] animate-[slide-stripes_20s_linear_infinite]"
        style={{
          backgroundImage: "repeating-linear-gradient(115deg, transparent 0px, transparent 2px, hsl(var(--primary) / 0.35) 2px, hsl(var(--primary) / 0.35) 4px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Universal: tech grid + scan line */}
      {theme === "universal" && (
        <>
          <div className="absolute inset-0 opacity-[0.04] bg-[length:60px_60px] bg-[linear-gradient(hsl(var(--cyan)_/_0.4)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--cyan)_/_0.4)_1px,transparent_1px)]" />
          <div className="absolute inset-0 opacity-[0.02] bg-[repeating-linear-gradient(0deg,transparent_0_2px,hsl(var(--cyan)_/_0.15)_2px_4px)]" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(var(--cyan)_/_0.06),transparent)]" />
        </>
      )}

      {/* Black Hole: starfield + deep vignette */}
      {theme === "black-hole" && (
        <>
          <Starfield count={80} />
          <div className="absolute inset-0 opacity-80 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_40%,hsl(265_50%_2%_/_0.9))]" />
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[hsl(275_60%_8%_/_0.5)] to-transparent" />
        </>
      )}

      {/* Avatar Pandora: teal/cyan blobs (no green) */}
      {theme === "avatar-pandora" && (
        <>
          <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[hsl(187_70%_45%_/_0.06)] blur-[100px] animate-pulse" style={{ animationDelay: "0.5s", animationDuration: "5s" }} />
          <div className="absolute bottom-[25%] left-[5%] w-[350px] h-[350px] rounded-full bg-[hsl(185_60%_50%_/_0.05)] blur-[90px] animate-pulse" style={{ animationDelay: "2s", animationDuration: "7s" }} />
          <div className="absolute top-[60%] left-[40%] w-[200px] h-[200px] rounded-full bg-[hsl(188_80%_50%_/_0.04)] blur-[60px] animate-pulse" style={{ animationDelay: "1s", animationDuration: "4s" }} />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_70%_70%_at_30%_20%,hsl(187_60%_50%_/_0.08),transparent)]" />
        </>
      )}

      {/* Comet: coral/orange streaks (no yellow) */}
      {theme === "comet" && (
        <>
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(105deg,transparent_0%,hsl(var(--cyan)_/_0.2)_25%,transparent_50%,hsl(var(--cyan)_/_0.15)_75%,transparent_100%)] bg-[length:200%_100%] animate-[comet-streak_25s_linear_infinite]" />
          <div className="absolute top-0 right-0 w-[80%] h-[60%] bg-[radial-gradient(ellipse_80%_80%_at_100%_0%,hsl(18_90%_55%_/_0.08),transparent)]" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[radial-gradient(ellipse_60%_60%_at_0%_100%,hsl(20_85%_50%_/_0.06),transparent)]" />
        </>
      )}
    </div>
  )
}

function Starfield({ count }: { count: number }) {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; duration: number; delay: number }[]>([])
  useEffect(() => {
    setStars(
      Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.25,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2,
      }))
    )
  }, [count])
  return (
    <div className="absolute inset-0">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

const PARTICLE_HSL: Record<ThemeId, { h: number; s: number; l: number }> = {
  universal: { h: 188, s: 95, l: 60 },
  "black-hole": { h: 270, s: 60, l: 55 },
  "avatar-pandora": { h: 187, s: 80, l: 50 },
  comet: { h: 18, s: 92, l: 55 },
}

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const { h, s, l } = PARTICLE_HSL[theme]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const particles: {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      pulseSpeed: number
      pulseOffset: number
    }[] = []

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      })
    }

    let animFrame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const time = Date.now() * 0.001

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const pulse = Math.sin(time * p.pulseSpeed * 10 + p.pulseOffset) * 0.5 + 0.5
        const currentOpacity = p.opacity * (0.5 + pulse * 0.5)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${currentOpacity})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${h}, ${s}%, ${Math.min(100, l - 10)}%, ${currentOpacity * 0.15})`
        ctx.fill()
      }

      animFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animFrame)
    }
  }, [h, s, l])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-[5]"
    />
  )
}

export default function SQLNavigatorPage() {
  const [flowStep, setFlowStep] = useState<FlowStep>("welcome")
  const [selectedCategory, setSelectedCategory] = useState("All Patterns")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    try {
      if (typeof window === "undefined") return
      const onboarded = localStorage.getItem(ONBOARDED_KEY)
      if (onboarded === "true") setFlowStep("app")
    } catch {
      // ignore
    }
  }, [])

  const handleOnboarded = () => {
    try {
      localStorage.setItem(ONBOARDED_KEY, "true")
    } catch {
      // ignore
    }
    setFlowStep("app")
  }

  const handleStartOver = () => {
    try {
      localStorage.removeItem(ONBOARDED_KEY)
    } catch {
      // ignore
    }
    setFlowStep("welcome")
  }

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchCategory =
        selectedCategory === "All Patterns" || q.category === selectedCategory
      const matchDifficulty =
        selectedDifficulty === "All" || q.difficulty === selectedDifficulty
      return matchCategory && matchDifficulty
    })
  }, [selectedCategory, selectedDifficulty])

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0]

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentIndex(0)
  }

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty)
    setCurrentIndex(0)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(filteredQuestions.length - 1, prev + 1)
    )
  }

  if (flowStep === "welcome") {
    return (
      <div className="h-screen flex flex-col">
        <AmbientBackground />
        <FloatingParticles />
        <WelcomeView onGetStarted={() => setFlowStep("theme")} />
      </div>
    )
  }

  if (flowStep === "theme") {
    return (
      <div className="h-screen flex flex-col">
        <AmbientBackground />
        <FloatingParticles />
        <ThemeSelectionView
          onBack={() => setFlowStep("welcome")}
          onContinue={handleOnboarded}
        />
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="h-screen flex flex-col sql-app" data-step="app">
        <AmbientBackground />
        <FloatingParticles />
        <div className="relative z-50 shrink-0 p-2 pb-0">
          <Header
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={handleDifficultyChange}
            onStartOver={handleStartOver}
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-panel p-8 text-center">
            <p className="text-muted-foreground text-sm font-mono">
              No questions match the current filters.
            </p>
            <p className="text-muted-foreground/60 text-xs mt-2">
              Try changing the pattern or difficulty tab.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col sql-app" data-step="app">
      <AmbientBackground />
      <FloatingParticles />

      {/* Header - z-10 so Pattern dropdown appears above main content */}
      <div className="relative z-50 shrink-0 p-2 pb-0">
        <Header
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={handleDifficultyChange}
          onStartOver={handleStartOver}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2 min-h-0">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full rounded-lg"
        >
          {/* Left Panel - Mission Briefing */}
          <ResizablePanel defaultSize={45} minSize={30}>
            <div className="h-full glass-panel overflow-hidden">
              <LeftPanel
                question={currentQuestion}
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasPrevious={currentIndex > 0}
                hasNext={currentIndex < filteredQuestions.length - 1}
                currentIndex={currentIndex}
                totalQuestions={filteredQuestions.length}
              />
            </div>
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle className="mx-1 w-[3px] rounded-full bg-border/50 hover:bg-cyan/30 transition-colors data-[resize-handle-state=drag]:bg-cyan/50" />

          {/* Right Panel - The Engine */}
          <ResizablePanel defaultSize={55} minSize={30}>
            <div className="h-full glass-panel overflow-hidden">
              <RightPanel starterCode={currentQuestion.starterCode} questionId={currentQuestion.id} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
