import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

/**
 * Brain layer: Gemini API key is used ONLY on the server in this route.
 * It is never sent to the browser or exposed to the client.
 */
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set. Add it in .env.local or Vercel Environment Variables." },
      { status: 503 }
    )
  }

  let body: { title?: string; problem?: string; category?: string; schema?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { title = "", problem = "", category = "", schema } = body
  const schemaText =
    typeof schema === "string"
      ? schema
      : Array.isArray(schema)
        ? (schema as { name: string; columns: { name: string; type: string }[] }[])
          .map(
            (t: { name: string; columns: { name: string; type: string }[] }) =>
              `Table ${t.name}: ${t.columns.map((c: { name: string; type: string }) => `${c.name} ${c.type}`).join(", ")}`
          )
          .join("\n")
        : ""

  const prompt = `You are a SQL and analytics expert. Given this practice question, respond with valid JSON only (no markdown, no code block), with exactly these keys:
- businessImpact: one short paragraph on why this query pattern matters in business/analytics.
- optimizationTips: array of 2-4 short strings (indexing, query tips).
- edgeCases: array of 3-5 short strings (edge cases or gotchas to consider).

Question title: ${title}
Category: ${category}
Problem: ${problem}
Schema:
${schemaText}`

  const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite"]

  for (const modelName of models) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      if (!text) {
        return NextResponse.json({ error: "Empty response from Gemini" }, { status: 502 })
      }
      // Strip possible markdown code fence
      const raw = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim()
      const parsed = JSON.parse(raw) as {
        businessImpact?: string
        optimizationTips?: string[]
        edgeCases?: string[]
      }
      const businessImpact = typeof parsed.businessImpact === "string" ? parsed.businessImpact : ""
      const optimizationTips = Array.isArray(parsed.optimizationTips) ? parsed.optimizationTips : []
      const edgeCases = Array.isArray(parsed.edgeCases)
        ? parsed.edgeCases.map((text: string) => ({ text: String(text), checked: false }))
        : []
      return NextResponse.json({
        businessImpact,
        optimizationTips,
        edgeCases,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gemini request failed"
      // If rate limited (429), try the next model
      if (message.includes("429") && modelName !== models[models.length - 1]) {
        continue
      }
      return NextResponse.json({ error: message }, { status: 502 })
    }
  }

  return NextResponse.json({ error: "All models rate limited. Please try again later." }, { status: 429 })
}
