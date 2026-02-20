import { QuestionForm } from '@/components/admin/question-form'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AddQuestionPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Add New Question</h2>
                    <p className="text-sm text-muted-foreground mt-1">Create a new SQL practice question.</p>
                </div>
                <Link href="/admin" className="px-4 py-2 border border-border text-foreground hover:bg-secondary/50 rounded-lg text-sm font-medium transition-colors">
                    &larr; Back
                </Link>
            </div>

            <QuestionForm />
        </div>
    )
}
