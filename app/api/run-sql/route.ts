import { NextResponse } from "next/server"
import { getQuestionById } from "@/lib/sql-data"
import {
  resetDatabase,
  setupQuestionData,
  executeQuery,
  formatResultsAsTable,
} from "@/lib/sql-engine"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { questionId, userSQL } = body as { questionId?: number; userSQL?: string }

    if (typeof questionId !== "number" || typeof userSQL !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid questionId or userSQL" },
        { status: 400 }
      )
    }

    const question = getQuestionById(questionId)
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    await resetDatabase()
    const setup = await setupQuestionData(question.sampleData)
    if (!setup.success) {
      return NextResponse.json(
        { success: false, error: setup.error, output: setup.error },
        { status: 200 }
      )
    }

    const result = await executeQuery(userSQL)
    const output = formatResultsAsTable(result)

    return NextResponse.json({
      success: result.success,
      error: result.error,
      output,
      rowCount: result.rowCount,
      executionTime: result.executionTime,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Run failed"
    return NextResponse.json(
      { success: false, error: message, output: `Error: ${message}` },
      { status: 500 }
    )
  }
}
