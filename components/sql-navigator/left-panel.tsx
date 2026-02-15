"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lightbulb,
  Brain,
  AlertTriangle,
  Table,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Sparkles,
  Loader2,
} from "lucide-react"
import type { Question, Difficulty } from "@/lib/sql-data"
import type { EdgeCase } from "@/lib/sql-data"
import { ReadableText } from "./readable-text"

interface LeftPanelProps {
  question: Question
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
  currentIndex: number
  totalQuestions: number
}

const difficultyColors: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/15 text-red-400 border-red-500/30",
  "Extreme Hard": "bg-purple-500/15 text-purple-400 border-purple-500/30",
}

const tabs = [
  { id: "problem", label: "Problem", icon: BookOpen },
  { id: "solutions", label: "Solutions", icon: Lightbulb },
  { id: "intelligence", label: "Intelligence", icon: Brain },
  { id: "edge-cases", label: "Edge Cases", icon: AlertTriangle },
] as const

type TabId = (typeof tabs)[number]["id"]

export function LeftPanel({
  question,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  currentIndex,
  totalQuestions,
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("problem")
  const [openSolution, setOpenSolution] = useState<number | null>(0)
  const [edgeCaseChecks, setEdgeCaseChecks] = useState<boolean[]>(
    question.edgeCases.map((ec) => ec.checked)
  )
  const [geminiLoading, setGeminiLoading] = useState(false)
  const [geminiError, setGeminiError] = useState<string | null>(null)
  const [geminiResult, setGeminiResult] = useState<{
    businessImpact: string
    optimizationTips: string[]
    edgeCases: EdgeCase[]
  } | null>(null)

  // Reset state when question changes
  useEffect(() => {
    setActiveTab("problem")
    setOpenSolution(0)
    setEdgeCaseChecks(question.edgeCases.map((ec) => ec.checked))
    setGeminiResult(null)
    setGeminiError(null)
  }, [question])

  const generateWithGemini = useCallback(async () => {
    setGeminiLoading(true)
    setGeminiError(null)
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: question.title,
          problem: question.problem,
          category: question.category,
          schema: question.schema,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGeminiError(data.error || "Request failed")
        return
      }
      setGeminiResult({
        businessImpact: data.businessImpact ?? "",
        optimizationTips: data.optimizationTips ?? [],
        edgeCases: data.edgeCases ?? [],
      })
      setEdgeCaseChecks((data.edgeCases ?? []).map(() => false))
    } catch {
      setGeminiError("Network error")
    } finally {
      setGeminiLoading(false)
    }
  }, [question.title, question.problem, question.category, question.schema])

  const displayedBusinessImpact = geminiResult?.businessImpact ?? question.businessImpact
  const displayedOptimizationTips = geminiResult?.optimizationTips ?? question.optimizationTips
  const displayedEdgeCases = geminiResult?.edgeCases ?? question.edgeCases

  const toggleEdgeCase = (index: number) => {
    setEdgeCaseChecks((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="btn-space flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>
        <span className="text-xs font-mono text-muted-foreground">
          {currentIndex + 1} / {totalQuestions}
        </span>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="btn-space flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Title + Difficulty */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            {question.title}
          </h2>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${difficultyColors[question.difficulty]}`}
          >
            {question.difficulty}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          {question.category}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-cyan text-cyan"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {activeTab === "problem" && (
          <div className="space-y-4">
            <ReadableText text={question.problem} />
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Table className="h-3.5 w-3.5" />
                Schema
              </h3>
              {question.schema.map((table) => (
                <div
                  key={table.name}
                  className="glass-panel overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-border/50 bg-cyan/5">
                    <span className="text-xs font-mono font-semibold text-cyan">
                      {table.name}
                    </span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between px-3 py-1.5"
                      >
                        <span className="text-xs font-mono text-foreground/80">
                          {col.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          {col.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "solutions" && (
          <div className="space-y-2">
            {question.solutions.map((sol, i) => (
              <div key={i} className="glass-panel overflow-hidden">
                <button
                  onClick={() =>
                    setOpenSolution(openSolution === i ? null : i)
                  }
                  className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">
                    {sol.title}
                  </span>
                  {openSolution === i ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {openSolution === i && (
                  <div className="px-4 pb-4 space-y-3 border-t border-border/30">
                    {sol.description && (
                      <p className="font-reading text-[15px] text-muted-foreground mt-3 leading-relaxed">
                        {sol.description}
                      </p>
                    )}
                    <pre className="bg-background/80 rounded-md p-3 text-xs font-mono text-foreground/90 overflow-x-auto scrollbar-thin leading-relaxed">
                      <code>{sol.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "intelligence" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">AI-generated business context</span>
              <button
                type="button"
                onClick={generateWithGemini}
                disabled={geminiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan/15 text-cyan border border-cyan/30 hover:bg-cyan/25 disabled:opacity-50"
              >
                {geminiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
                {geminiLoading ? "Generating…" : "Generate with Gemini"}
              </button>
            </div>
            {geminiError && (
              <p className="text-xs text-red-400">{geminiError}</p>
            )}
            <div className="glass-panel p-4 space-y-2">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan">
                <TrendingUp className="h-3.5 w-3.5" />
                Business Impact
              </h3>
              <ReadableText text={displayedBusinessImpact} className="text-foreground/85" />
            </div>
            <div className="glass-panel p-4 space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan">
                <Sparkles className="h-3.5 w-3.5" />
                Optimization Tips
              </h3>
              <ul className="space-y-2.5 list-none pl-0">
                {displayedOptimizationTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 font-reading text-[15px] leading-relaxed text-foreground/85">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "edge-cases" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 pb-1">
              <span className="text-xs text-muted-foreground">Consider these edge cases</span>
              <button
                type="button"
                onClick={generateWithGemini}
                disabled={geminiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan/15 text-cyan border border-cyan/30 hover:bg-cyan/25 disabled:opacity-50"
              >
                {geminiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
                {geminiLoading ? "Generating…" : "Generate with Gemini"}
              </button>
            </div>
            {geminiError && (
              <p className="text-xs text-red-400">{geminiError}</p>
            )}
            {displayedEdgeCases.map((ec, i) => (
              <button
                key={i}
                onClick={() => toggleEdgeCase(i)}
                className="flex items-center gap-3 w-full glass-panel px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
              >
                {edgeCaseChecks[i] ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    edgeCaseChecks[i]
                      ? "text-muted-foreground line-through"
                      : "text-foreground/90"
                  }`}
                >
                  {typeof ec === "object" && ec !== null && "text" in ec ? ec.text : String(ec)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
