"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import {
  Play,
  Send,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
} from "lucide-react"
import {
  resetDatabase,
  setupQuestionData,
  executeQuery,
  evaluateQuery,
  formatResultsAsTable,
} from "@/lib/sql-engine"

interface RightPanelProps {
  starterCode: string
  questionId: number
}

export function RightPanel({ starterCode, questionId }: RightPanelProps) {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState<string[]>([
    "-- SQL Navigator Console v2.0",
    "-- Ready. Write your query and press Run.",
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [questionData, setQuestionData] = useState<{
    sampleData: string
    systemSolution: string
  } | null>(null)
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/question/${questionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.sampleData != null && data.systemSolution != null) {
          setQuestionData({ sampleData: data.sampleData, systemSolution: data.systemSolution })
        }
      })
      .catch(() => {
        if (!cancelled) setQuestionData(null)
      })
    return () => {
      cancelled = true
    }
  }, [questionId])

  useEffect(() => {
    setCode(starterCode)
    setOutput([
      "-- SQL Navigator Console v2.0",
      "-- Ready. Write your query and press Run.",
    ])
  }, [starterCode])

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [output])

  const lineNumbers = code.split("\n")

  const appendOutput = useCallback((lines: string[]) => {
    setOutput((prev) => [...prev, "", ...lines])
  }, [])

  const handleRun = useCallback(async () => {
    if (!questionData) {
      appendOutput(["  Loading question data..."])
      return
    }
    setIsRunning(true)
    appendOutput([`> Executing query...`])
    try {
      await resetDatabase()
      const setup = await setupQuestionData(questionData.sampleData)
      if (!setup.success) {
        appendOutput([`  Error: ${setup.error}`])
        return
      }
      const result = await executeQuery(code)
      const outLines = formatResultsAsTable(result)
        .split("\n")
        .map((line) => (line ? `  ${line}` : ""))
      appendOutput(outLines)
    } catch (e) {
      appendOutput([`  Error: ${e instanceof Error ? e.message : "Run failed"}`])
    } finally {
      setIsRunning(false)
    }
  }, [questionData, code, appendOutput])

  const handleEvaluate = useCallback(async () => {
    if (!questionData) {
      appendOutput(["  Loading question data..."])
      return
    }
    setIsEvaluating(true)
    appendOutput([`> Evaluating against solution...`])
    try {
      await resetDatabase()
      const setup = await setupQuestionData(questionData.sampleData)
      if (!setup.success) {
        appendOutput([`  Error: ${setup.error}`])
        return
      }
      const evaluation = await evaluateQuery(code, questionData.systemSolution)
      const lines = evaluation.passed
        ? [`  ✓ ${evaluation.message}`]
        : [`  ✗ ${evaluation.message}`, ...(evaluation.differences || []).map((d) => `    ${d}`)]
      appendOutput(lines)
    } catch (e) {
      appendOutput([`  Error: ${e instanceof Error ? e.message : "Evaluation failed"}`])
    } finally {
      setIsEvaluating(false)
    }
  }, [questionData, code, appendOutput])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setCode(starterCode)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-xs font-mono text-muted-foreground ml-2">
            query.sql
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            title="Reset code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="py-4 px-3 text-right select-none border-r border-border/30 bg-background/40 overflow-hidden">
          {lineNumbers.map((_, i) => (
            <div
              key={i}
              className="text-[11px] font-mono leading-5 text-muted-foreground/50"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editor */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent resize-none p-4 text-[13px] font-mono leading-5 text-foreground/90 focus:outline-none scrollbar-thin placeholder:text-muted-foreground/30 caret-cyan"
          placeholder="Write your SQL query here..."
        />
      </div>

      {/* Control Panel */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-border/50 border-b border-b-border/50">
        <button
          onClick={handleRun}
          disabled={isRunning || isEvaluating}
          className="relative flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan text-background text-sm font-semibold hover:bg-cyan-glow disabled:opacity-60 transition-all animate-glow-pulse"
        >
          <Play className="h-4 w-4" />
          {isRunning ? "Running..." : "Run Code"}
        </button>
        <button
          onClick={handleEvaluate}
          disabled={isRunning || isEvaluating}
          className="flex items-center gap-2 px-5 py-2 rounded-lg border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-cyan/30 hover:bg-cyan/5 transition-all disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {isEvaluating ? "Evaluating..." : "Evaluate"}
        </button>
      </div>

      {/* Console Output */}
      <div className="h-52 flex flex-col border-t border-border/30">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-background/40">
          <Terminal className="h-3.5 w-3.5 text-cyan" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Console Output
          </span>
        </div>
        <div ref={consoleRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-background/60 font-mono text-xs leading-5">
          {output.map((line, i) => (
            <div
              key={i}
              className={
                line.startsWith(">")
                  ? "text-cyan"
                  : line.includes("✓") || line.includes("row(s)")
                    ? "text-emerald-400"
                    : line.includes("✗") || line.includes("Error")
                      ? "text-red-400"
                      : "text-muted-foreground"
              }
            >
              {line || "\u00A0"}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
