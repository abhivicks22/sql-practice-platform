import { NextResponse } from "next/server"
import { getQuestionById } from "@/lib/sql-data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  const { questionId } = await params
  const id = parseInt(questionId, 10)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid question id" }, { status: 400 })
  }
  const question = getQuestionById(id)
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 })
  }
  return NextResponse.json({
    sampleData: question.sampleData,
    systemSolution: question.systemSolution,
  })
}
