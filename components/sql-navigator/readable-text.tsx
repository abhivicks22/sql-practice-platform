"use client"

/** Renders long-form text with paragraphs and bullet lists for readability. */
export function ReadableText({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean)
  return (
    <div className={`font-reading text-[15px] max-w-[65ch] ${className}`}>
      {paragraphs.map((block, i) => {
        const lines = block.split("\n").filter(Boolean)
        const bulletLines = lines.filter((l) => /^\s*[•\-*]\s+/.test(l) || /^\d+\.\s+/.test(l))
        const hasBullets = bulletLines.length > 0 && bulletLines.length >= lines.length * 0.5
        if (hasBullets) {
          return (
            <ul key={i} className="list-none space-y-2 my-3 pl-0">
              {lines.map((line, j) => {
                const bullet = line.match(/^\s*([•\-*]|\d+\.)\s+/)
                const content = bullet ? line.slice(line.indexOf(bullet[1]) + bullet[1].length).trim() : line.trim()
                return (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-cyan mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-cyan" />
                    <span className="text-foreground/90">{content}</span>
                  </li>
                )
              })}
            </ul>
          )
        }
        return (
          <p key={i} className="my-3 text-foreground/90 first:mt-0 last:mb-0">
            {lines.join(" ")}
          </p>
        )
      })}
    </div>
  )
}
