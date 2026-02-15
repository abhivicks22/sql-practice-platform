"use client"

import { useRef, useEffect } from "react"

const SQL_KEYWORDS = new Set([
  "select", "from", "where", "and", "or", "not", "in", "exists", "between", "like", "is", "null",
  "insert", "into", "values", "update", "set", "delete", "create", "table", "drop", "alter",
  "join", "left", "right", "inner", "outer", "on", "as", "order", "by", "group", "having",
  "asc", "desc", "limit", "offset", "union", "all", "distinct", "case", "when", "then", "else", "end",
  "with", "count", "sum", "avg", "min", "max", "cast", "extract", "interval", "over", "partition",
  "row_number", "rank", "dense_rank", "recursive", "true", "false",
])

function tokenizeLine(line: string): { type: "keyword" | "string" | "comment" | "number" | "default"; text: string }[] {
  const tokens: { type: "keyword" | "string" | "comment" | "number" | "default"; text: string }[] = []
  let i = 0
  while (i < line.length) {
    if (line.slice(i).startsWith("--")) {
      tokens.push({ type: "comment", text: line.slice(i) })
      break
    }
    if (line[i] === "'" || line[i] === '"') {
      const q = line[i]
      let j = i + 1
      while (j < line.length && line[j] !== q) {
        if (line[j] === "\\") j++
        j++
      }
      tokens.push({ type: "string", text: line.slice(i, j + 1) })
      i = j + 1
      continue
    }
    if (/[0-9]/.test(line[i])) {
      let j = i
      while (j < line.length && /[0-9.]/.test(line[j])) j++
      tokens.push({ type: "number", text: line.slice(i, j) })
      i = j
      continue
    }
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++
      const word = line.slice(i, j)
      const lower = word.toLowerCase()
      tokens.push({
        type: SQL_KEYWORDS.has(lower) ? "keyword" : "default",
        text: word,
      })
      i = j
      continue
    }
    tokens.push({ type: "default", text: line[i] })
    i++
  }
  return tokens
}

export function SqlEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const ta = textareaRef.current
    const pre = preRef.current
    if (!ta || !pre) return
    const sync = () => {
      pre.scrollTop = ta.scrollTop
      pre.scrollLeft = ta.scrollLeft
    }
    ta.addEventListener("scroll", sync)
    return () => ta.removeEventListener("scroll", sync)
  }, [])

  const lines = value.split("\n")
  const showPlaceholder = value.length === 0

  return (
    <div className="flex h-full w-full min-w-0">
      <div className="py-4 px-3 text-right select-none border-r border-border/30 bg-background/40 shrink-0 text-[11px] font-mono leading-5 text-muted-foreground/50">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
        {lines.length === 0 && <div>1</div>}
      </div>
      <div className="relative flex-1 min-w-0">
        <pre
          ref={preRef}
          className="absolute inset-0 overflow-auto p-4 text-[13px] font-mono leading-5 text-transparent scrollbar-thin pointer-events-none"
          aria-hidden
        >
          {showPlaceholder ? (
            <span className="text-muted-foreground/30">{placeholder}</span>
          ) : (
            lines.map((line, i) => (
              <div key={i}>
                {tokenizeLine(line).map((t, j) => (
                  <span
                    key={j}
                    className={
                      t.type === "keyword"
                        ? "text-theme"
                        : t.type === "string"
                          ? "text-orange-400/90"
                          : t.type === "comment"
                            ? "text-muted-foreground/70"
                            : t.type === "number"
                              ? "text-theme"
                              : "text-foreground/90"
                    }
                  >
                    {t.text}
                  </span>
                ))}
              </div>
            ))
          )}
        </pre>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder={placeholder}
          className="absolute inset-0 w-full h-full resize-none bg-transparent p-4 text-[13px] font-mono leading-5 caret-cyan placeholder:text-muted-foreground/30 focus:outline-none scrollbar-thin"
          style={{ color: "transparent", caretColor: "hsl(var(--cyan))" }}
        />
      </div>
    </div>
  )
}
