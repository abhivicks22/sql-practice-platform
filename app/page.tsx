"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/sql-navigator/header"
import { LeftPanel } from "@/components/sql-navigator/left-panel"
import { RightPanel } from "@/components/sql-navigator/right-panel"
import { WelcomeView } from "@/components/sql-navigator/welcome-view"
import { ThemeSelectionView } from "@/components/sql-navigator/theme-selection-view"
import { AnimatedBackground } from "@/components/sql-navigator/animated-background"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { questions } from "@/lib/sql-data"

const ONBOARDED_KEY = "sql-navigator-onboarded"
type FlowStep = "welcome" | "theme" | "app"

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
        <AnimatedBackground />
        <WelcomeView onGetStarted={() => setFlowStep("theme")} />
      </div>
    )
  }

  if (flowStep === "theme") {
    return (
      <div className="h-screen flex flex-col">
        <AnimatedBackground />
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
        <AnimatedBackground />
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
      <AnimatedBackground />

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
