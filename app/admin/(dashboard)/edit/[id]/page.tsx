import { QuestionForm } from '@/components/admin/question-form'
import Link from 'next/link'
import prisma from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import type { Question } from '@/lib/sql-data'

export const dynamic = 'force-dynamic'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function EditQuestionPage({ params }: PageProps) {
    const resolvedParams = await params
    const questionId = parseInt(resolvedParams.id)
    if (isNaN(questionId)) return notFound()

    const data = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
            schemaTables: { include: { columns: true } },
            solutions: true
        }
    })

    if (!data) return notFound()

    // Transform back to Question type for form
    const initialData: Partial<Question> = {
        id: data.id,
        title: data.title,
        difficulty: data.difficulty as any,
        category: data.category,
        problem: data.problem,
        mySolution: data.mySolution,
        businessImpact: data.businessImpact,
        optimizationTips: data.optimizationTips,
        edgeCases: data.edgeCases.map(text => ({ text, checked: false })),
        expectedOutput: data.expectedOutput,
        starterCode: data.starterCode,
        systemSolution: data.systemSolution || '',
        schema: data.schemaTables.map(t => ({
            name: t.name,
            columns: t.columns.map(c => ({ name: c.name, type: c.type }))
        })),
        solutions: data.solutions.map(s => ({
            title: s.title,
            description: s.description || '',
            code: s.code
        }))
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Edit Question #{data.id}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Make changes to this SQL problem.</p>
                </div>
                <Link href="/admin" className="px-4 py-2 border border-border text-foreground hover:bg-secondary/50 rounded-lg text-sm font-medium transition-colors">
                    &larr; Back
                </Link>
            </div>

            <QuestionForm initialData={initialData} isEditing />
        </div>
    )
}
