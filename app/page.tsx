"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Header } from "@/components/sql-navigator/header"
import { LeftPanel } from "@/components/sql-navigator/left-panel"
import { RightPanel } from "@/components/sql-navigator/right-panel"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { questions, categories } from "@/lib/sql-data"

function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {/* Bioluminescent orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan/[0.03] blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan/[0.025] blur-[100px]"
        style={{ animationDelay: "1s", animationDuration: "4s" }}
      />
      <div
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan/[0.015] blur-[80px]"
        style={{ animationDelay: "2s", animationDuration: "6s" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(188 95% 43% / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(188 95% 43% / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scan line effect */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(188 95% 43% / 0.1) 2px, hsl(188 95% 43% / 0.1) 4px)",
        }}
      />
    </div>
  )
}

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
        ctx.fillStyle = `hsla(188, 95%, 60%, ${currentOpacity})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(188, 95%, 50%, ${currentOpacity * 0.15})`
        ctx.fill()
      }

      animFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-[5]"
    />
  )
}

export default function SQLNavigatorPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Patterns")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mastered, setMastered] = useState(14)

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

  if (!currentQuestion) {
    return (
      <div className="h-screen flex flex-col">
        <AmbientBackground />
        <FloatingParticles />
        <div className="shrink-0 p-2 pb-0">
          <Header
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={handleDifficultyChange}
            mastered={mastered}
            total={questions.length}
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
    <div className="h-screen flex flex-col">
      <AmbientBackground />
      <FloatingParticles />

      {/* Header */}
      <div className="shrink-0 p-2 pb-0">
        <Header
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={handleDifficultyChange}
          mastered={mastered}
          total={questions.length}
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
              <RightPanel starterCode={currentQuestion.starterCode} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
