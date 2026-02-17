"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import {
  Play,
  Send,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Timer as TimerIcon,
  Pause,
  RotateCcw as ResetIcon,
} from "lucide-react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import {
  resetDatabase,
  setupQuestionData,
  executeMultipleQueries,
  evaluateQuery,
  formatResultsAsTable,
} from "@/lib/sql-engine"
import { SqlEditor } from "./sql-editor"
import { useMediaQuery } from "@/components/hooks/use-media-query"
import { MobileActionBar } from "./mobile-action-bar"

interface RightPanelProps {
  starterCode: string
  questionId: number
  timerRunning?: boolean
  timerElapsed?: number
  onTimerStart?: () => void
  onTimerPause?: () => void
  onTimerReset?: () => void
}

export function RightPanel({
  starterCode,
  questionId,
  timerRunning = false,
  timerElapsed = 0,
  onTimerStart,
  onTimerPause,
  onTimerReset,
}: RightPanelProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
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
    mySolution: string | null
  } | null>(null)
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/question/${questionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.sampleData != null && data.systemSolution != null) {
          setQuestionData({
            sampleData: data.sampleData,
            systemSolution: data.systemSolution,
            mySolution: data.mySolution ?? null,
          })
          if (data.mySolution) {
            setCode(data.mySolution)
          }
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
  }, [starterCode, questionId])

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [output])

  const appendOutput = useCallback((lines: string[]) => {
    setOutput((prev) => [...prev, "", ...lines])
  }, [])

  const handleRun = useCallback(async () => {
    if (!questionData) {
      appendOutput(["  Loading question data..."])
      return
    }
    setIsRunning(true)
    onTimerStart?.() // Auto-start timer on run

    // Auto-scroll to console on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }, 100)
    }

    appendOutput([`> Executing query...`])
    try {
      await resetDatabase()
      const setup = await setupQuestionData(questionData.sampleData)
      if (!setup.success) {
        appendOutput([`  Error: ${setup.error}`])
        return
      }
      const results = await executeMultipleQueries(code)
      if (results.length === 0) {
        appendOutput(["  No statements to run (add at least one query ending with ;)."])
        return
      }
      for (let i = 0; i < results.length; i++) {
        if (i > 0) appendOutput([""])
        appendOutput([`  --- Result ${i + 1} ---`])
        const outLines = formatResultsAsTable(results[i])
          .split("\n")
          .map((line) => (line ? `  ${line}` : ""))
        appendOutput(outLines)
      }
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
    const firstStmt = code.split(';').map((s) => s.trim()).filter((s) => s.length > 0 && !/^\s*(--|$)/.test(s))[0]
    const queryToEval = firstStmt ? firstStmt + ';' : code
    setIsEvaluating(true)
    appendOutput([`> Evaluating against solution...`])
    try {
      await resetDatabase()
      const setup = await setupQuestionData(questionData.sampleData)
      if (!setup.success) {
        appendOutput([`  Error: ${setup.error}`])
        return
      }
      const evaluation = await evaluateQuery(queryToEval, questionData.systemSolution)
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
      <ResizablePanelGroup direction="vertical" className="flex-1 min-h-0">
        {/* Top: Editor + controls */}
        <ResizablePanel defaultSize={65} minSize={30} order={1}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-orange-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--primary)_/_0.6)]" />
                </div>
                <span className="text-xs font-mono text-muted-foreground ml-2">query.sql</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={timerRunning ? onTimerPause : onTimerStart}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    title={timerRunning ? "Pause" : "Start"}
                  >
                    {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={onTimerReset}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    title="Reset timer"
                  >
                    <ResetIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button onClick={handleReset} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors" title="Reset code">
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button onClick={handleCopy} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors" title="Copy code">
                  {copied ? <Check className="h-3.5 w-3.5 text-theme" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <SqlEditor value={code} onChange={setCode} placeholder="Write your SQL query here..." />
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-3 border-t border-border/50 shrink-0">
              <button
                onClick={handleRun}
                disabled={isRunning || isEvaluating}
                className="btn-space-primary relative flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 transition-all"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running..." : "Run Code"}
              </button>
              <button
                onClick={handleEvaluate}
                disabled={isRunning || isEvaluating}
                className="btn-space flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all"
              >
                <Send className="h-4 w-4" />
                {isEvaluating ? "Evaluating..." : "Evaluate"}
              </button>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="shrink-0 bg-border/50 hover:bg-[hsl(var(--primary)_/_0.2)] transition-colors data-[panel-group-direction=vertical]:py-1" />

        {/* Bottom: Console - resizable up/down */}
        <ResizablePanel defaultSize={35} minSize={15} order={2}>
          <div className="flex flex-col h-full border-t border-border/30">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-background/40 shrink-0">
              <Terminal className="h-3.5 w-3.5 text-theme" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Console Output</span>
            </div>
            <div ref={consoleRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-background/60 font-mono text-xs leading-5">
              {output.map((line, i) => (
                <div
                  key={i}
                  className={`whitespace-pre ${line.startsWith(">") ? "text-cyan"
                    : line.includes("✓") || line.includes("row(s)") ? "text-theme"
                      : line.includes("✗") || line.includes("Error") ? "text-red-400"
                        : "text-muted-foreground"
                    }`}
                >
                  {line || "\u00A0"}
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <MobileActionBar
        onRun={handleRun}
        onEvaluate={handleEvaluate}
        isRunning={isRunning}
        isEvaluating={isEvaluating}
        timerRunning={timerRunning}
        timerElapsed={timerElapsed}
        onTimerStart={onTimerStart}
        onTimerPause={onTimerPause}
        onTimerReset={onTimerReset}
      />
    </div>
  )
}
