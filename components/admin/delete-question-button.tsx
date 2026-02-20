"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function DeleteQuestionButton({ id }: { id: number }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
            return
        }

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/question/${id}`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to delete question')
            }

            toast.success('Question deleted successfully')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
            console.error(error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-50"
            title="Delete Question"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    )
}
