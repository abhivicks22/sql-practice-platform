import { NextResponse } from "next/server"
import { getQuestionById } from "@/lib/sql-data"
import {
  resetDatabase,
  setupQuestionData,
  evaluateQuery,
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
        { passed: false, message: `Setup failed: ${setup.error}` },
        { status: 200 }
      )
    }

    const evaluation = await evaluateQuery(userSQL, question.systemSolution)

    return NextResponse.json({
      passed: evaluation.passed,
      message: evaluation.message,
      userRowCount: evaluation.userRowCount,
      expectedRowCount: evaluation.expectedRowCount,
      differences: evaluation.differences,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Evaluation failed"
    return NextResponse.json(
      { passed: false, message: `Error: ${message}` },
      { status: 500 }
    )
  }
}
