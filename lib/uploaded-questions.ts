import type { Question, SchemaTable, Solution, EdgeCase } from "./sql-data"

const STORAGE_KEY = "sql_navigator_uploaded_questions"

export function getUploadedQuestions(): Question[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Question[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveUploadedQuestions(questions: Question[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
  } catch {
    // ignore
  }
}

export function addUploadedQuestion(q: Omit<Question, "id">): Question[] {
  const existing = getUploadedQuestions()
  const maxId = existing.length > 0 ? Math.max(...existing.map((x) => x.id)) : 999
  const newQ: Question = {
    ...q,
    id: maxId + 1,
    edgeCases: (q.edgeCases ?? []).map((e) =>
      typeof e === "string" ? { text: e, checked: false } : e
    ),
  }
  const next = [...existing, newQ]
  saveUploadedQuestions(next)
  return next
}

export function deleteUploadedQuestion(id: number): Question[] {
  const next = getUploadedQuestions().filter((q) => q.id !== id)
  saveUploadedQuestions(next)
  return next
}
