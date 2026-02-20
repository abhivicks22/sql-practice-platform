"use client"

import { useState } from 'react'
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setMessage('')
    setError('')

    try {
      // Read file content as text
      const content = await file.text()
      const data = JSON.parse(content)

      if (!Array.isArray(data)) {
        throw new Error("Uploaded JSON must be an array of questions.")
      }

      // Send to API
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: data }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setMessage(`Successfully imported ${result.count} questions!`)
      setFile(null)
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Bulk Upload Questions</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload a JSON file containing an array of new questions.</p>
        </div>
        <Link href="/admin" className="px-4 py-2 border border-border text-foreground hover:bg-secondary/50 rounded-lg text-sm font-medium transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel p-8">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-border/60 hover:border-theme/50 transition-colors rounded-xl p-12 text-center flex flex-col items-center justify-center bg-black/20">
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
            <input
              type="file"
              accept=".json"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-theme/10 file:text-theme hover:file:bg-theme/20 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full btn-space-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all hover:scale-[1.01]"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Processing Upload...' : 'Upload Configuration'}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-lg bg-theme/10 border border-theme/30 text-theme flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
