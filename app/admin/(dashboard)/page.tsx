import prisma from '@/lib/db/prisma'
import Link from 'next/link'
import { Plus, Database, Pencil } from 'lucide-react'
import { DeleteQuestionButton } from '@/components/admin/delete-question-button'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  let questions: any[] = []
  let dbError = false

  try {
    questions = await prisma.question.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        title: true,
        difficulty: true,
        category: true,
      }
    })
  } catch (error) {
    console.error("Failed to fetch questions in admin dashboard:", error)
    dbError = true
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Questions Database</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage the SQL practice platform catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/upload" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium border border-border">
            <Database className="w-4 h-4" />
            Bulk Upload JSON
          </Link>
          <Link href="/admin/add" className="btn-space flex items-center gap-2 px-4 py-2 rounded-lg text-theme transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add New Question
          </Link>
        </div>
      </div>

      {dbError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3">
          <Database className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Database Connection Error</p>
            <p className="text-xs opacity-90">Could not connect to the database. Make sure your DATABASE_URL environment variable is set correctly in Vercel.</p>
          </div>
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-black/40 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-mono font-medium">ID</th>
                <th className="px-6 py-4 font-mono font-medium">Title</th>
                <th className="px-6 py-4 font-mono font-medium">Category</th>
                <th className="px-6 py-4 font-mono font-medium">Difficulty</th>
                <th className="px-6 py-4 font-mono font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-muted-foreground">#{q.id}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{q.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{q.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold
                      ${q.difficulty === 'Easy' ? 'bg-theme/10 text-theme border border-theme/20' : ''}
                      ${q.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : ''}
                      ${q.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : ''}
                      ${q.difficulty === 'Extreme Hard' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : ''}
                    `}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/edit/${q.id}`}
                        className="p-2 text-muted-foreground hover:text-theme hover:bg-theme/10 rounded transition-colors"
                        title="Edit Question"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteQuestionButton id={q.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {questions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground border-b-0">
                    No questions found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div >
    </div >
  )
}
