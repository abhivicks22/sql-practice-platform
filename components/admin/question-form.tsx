"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2, Save } from 'lucide-react'
import type { Question } from '@/lib/sql-data'
import { categories, difficulties } from '@/lib/sql-data'
import { toast } from 'sonner'

interface QuestionFormProps {
    initialData?: Partial<Question>
    isEditing?: boolean
}

export function QuestionForm({ initialData = {}, isEditing = false }: QuestionFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Basic Fields
    const [title, setTitle] = useState(initialData.title || '')
    const [difficulty, setDifficulty] = useState(initialData.difficulty || 'Easy')
    const [category, setCategory] = useState(initialData.category || categories[1]) // Analytics default
    const [problem, setProblem] = useState(initialData.problem || '')
    const [expectedOutput, setExpectedOutput] = useState(initialData.expectedOutput || '')
    const [starterCode, setStarterCode] = useState(initialData.starterCode || 'SELECT * FROM table_name;')
    const [systemSolution, setSystemSolution] = useState(initialData.systemSolution || '')
    const [businessImpact, setBusinessImpact] = useState(initialData.businessImpact || '')

    // Dynamic Lists
    const [optimizationTips, setOptimizationTips] = useState<string[]>(initialData.optimizationTips || [])
    const [edgeCases, setEdgeCases] = useState<string[]>(
        (initialData.edgeCases || []).map(ec => typeof ec === 'string' ? ec : ec.text)
    )

    const [schema, setSchema] = useState<any[]>(
        initialData.schema || [{ name: 'new_table', columns: [{ name: 'id', type: 'Integer' }] }]
    )

    const [solutions, setSolutions] = useState<any[]>(
        initialData.solutions?.length ? initialData.solutions : [{ title: 'System Solution', description: '', code: '' }]
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                title,
                difficulty,
                category,
                problem,
                expectedOutput,
                starterCode,
                systemSolution,
                businessImpact,
                optimizationTips: optimizationTips.filter(t => t.trim()),
                edgeCases: edgeCases.filter(e => e.trim()).map(text => ({ text, checked: false })),
                schema,
                solutions
            }

            const url = isEditing && initialData.id ? `/api/admin/question/${initialData.id}` : '/api/admin/question'
            const method = isEditing ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to save question')
            }

            toast.success(isEditing ? 'Question updated!' : 'Question created!')
            router.push('/admin')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
            <div className="glass-panel p-6 space-y-6">
                <h3 className="text-lg font-semibold text-theme border-b border-border/50 pb-2">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/40 border border-border rounded p-2 text-sm" placeholder="Question Title" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/40 border border-border rounded p-2 text-sm">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Difficulty</label>
                        <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full bg-black/40 border border-border rounded p-2 text-sm">
                            {difficulties.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 space-y-6">
                <h3 className="text-lg font-semibold text-theme border-b border-border/50 pb-2">Problem Description & Data</h3>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Problem Statement (Supports Markdown/Text)</label>
                    <textarea required value={problem} onChange={e => setProblem(e.target.value)} rows={5} className="w-full bg-black/40 border border-border rounded p-2 text-sm font-mono" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Starter SQL Code</label>
                        <textarea required value={starterCode} onChange={e => setStarterCode(e.target.value)} rows={4} className="w-full bg-black/40 border border-border rounded p-2 text-sm font-mono" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Expected Output (Text Representation)</label>
                        <textarea value={expectedOutput} onChange={e => setExpectedOutput(e.target.value)} rows={4} className="w-full bg-black/40 border border-border rounded p-2 text-sm font-mono" placeholder="| id | name |\n| 1  | John |" />
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <h3 className="text-lg font-semibold text-theme">Database Schema</h3>
                    <button type="button" onClick={() => setSchema([...schema, { name: 'new_table', columns: [{ name: 'id', type: 'Integer' }] }])} className="text-xs flex items-center gap-1 bg-theme/10 text-theme px-2 py-1 rounded hover:bg-theme/20">
                        <Plus className="w-3 h-3" /> Add Table
                    </button>
                </div>

                {schema.map((table, tIdx) => (
                    <div key={tIdx} className="p-4 border border-border/50 bg-black/20 rounded-lg space-y-4">
                        <div className="flex items-center gap-4">
                            <input value={table.name} onChange={e => { const newS = [...schema]; newS[tIdx].name = e.target.value; setSchema(newS) }} className="bg-transparent border-b border-border focus:outline-none text-theme font-mono font-medium" placeholder="Table Name" />
                            <button type="button" onClick={() => setSchema(schema.filter((_, i) => i !== tIdx))} className="text-red-400 hover:text-red-300 ml-auto"><Trash2 className="w-4 h-4" /></button>
                        </div>

                        <div className="pl-4 space-y-2 border-l-2 border-border/30">
                            {table.columns.map((col: any, cIdx: number) => (
                                <div key={cIdx} className="flex gap-2 items-center">
                                    <input value={col.name} onChange={e => { const newS = [...schema]; newS[tIdx].columns[cIdx].name = e.target.value; setSchema(newS) }} className="bg-black/40 border border-border rounded p-1.5 text-xs font-mono w-1/3" placeholder="Column Name" />
                                    <input value={col.type} onChange={e => { const newS = [...schema]; newS[tIdx].columns[cIdx].type = e.target.value; setSchema(newS) }} className="bg-black/40 border border-border rounded p-1.5 text-xs font-mono w-1/3" placeholder="Type (e.g. Integer)" />
                                    <button type="button" onClick={() => { const newS = [...schema]; newS[tIdx].columns = newS[tIdx].columns.filter((_: any, i: number) => i !== cIdx); setSchema(newS) }} className="text-muted-foreground hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            ))}
                            <button type="button" onClick={() => { const newS = [...schema]; newS[tIdx].columns.push({ name: 'new_col', type: 'String' }); setSchema(newS) }} className="text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground">
                                + Add Column
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-panel p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <h3 className="text-lg font-semibold text-theme">Solutions</h3>
                    <button type="button" onClick={() => setSolutions([...solutions, { title: 'Alternative Solution', description: '', code: '' }])} className="text-xs flex items-center gap-1 bg-theme/10 text-theme px-2 py-1 rounded hover:bg-theme/20">
                        <Plus className="w-3 h-3" /> Add Solution
                    </button>
                </div>

                {solutions.map((sol, sIdx) => (
                    <div key={sIdx} className="p-4 border border-border/50 bg-black/20 rounded-lg space-y-3">
                        <div className="flex items-center gap-4">
                            <input value={sol.title} onChange={e => { const newS = [...solutions]; newS[sIdx].title = e.target.value; setSolutions(newS) }} className="bg-transparent border-b border-border focus:outline-none text-theme font-medium font-mono" placeholder="Solution Title" />
                            <button type="button" onClick={() => setSolutions(solutions.filter((_, i) => i !== sIdx))} className="text-red-400 hover:text-red-300 ml-auto"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <input value={sol.description || ''} onChange={e => { const newS = [...solutions]; newS[sIdx].description = e.target.value; setSolutions(newS) }} className="w-full bg-black/40 border border-border rounded p-2 text-sm" placeholder="Description (Optional)" />
                        <textarea value={sol.code} onChange={e => { const newS = [...solutions]; newS[sIdx].code = e.target.value; setSolutions(newS) }} rows={4} className="w-full bg-black/40 border border-border rounded p-2 text-sm font-mono" placeholder="SQL Code here..." />
                    </div>
                ))}
            </div>

            <div className="glass-panel p-6 space-y-6">
                <h3 className="text-lg font-semibold text-theme border-b border-border/50 pb-2">Intelligence (Right Panel)</h3>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Business Impact</label>
                    <textarea value={businessImpact} onChange={e => setBusinessImpact(e.target.value)} rows={3} className="w-full bg-black/40 border border-border rounded p-2 text-sm font-mono" />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Optimization Tips</label>
                        <button type="button" onClick={() => setOptimizationTips([...optimizationTips, ''])} className="text-[10px] uppercase font-bold text-theme hover:underline">+ Add Tip</button>
                    </div>
                    {optimizationTips.map((tip, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input value={tip} onChange={e => { const newT = [...optimizationTips]; newT[idx] = e.target.value; setOptimizationTips(newT) }} className="flex-1 bg-black/40 border border-border rounded p-2 text-sm" placeholder="Tip..." />
                            <button type="button" onClick={() => setOptimizationTips(optimizationTips.filter((_, i) => i !== idx))} className="text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Edge Cases</label>
                        <button type="button" onClick={() => setEdgeCases([...edgeCases, ''])} className="text-[10px] uppercase font-bold text-theme hover:underline">+ Add Edge Case</button>
                    </div>
                    {edgeCases.map((ec, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input value={ec} onChange={e => { const newE = [...edgeCases]; newE[idx] = e.target.value; setEdgeCases(newE) }} className="flex-1 bg-black/40 border border-border rounded p-2 text-sm" placeholder="Edge Case desc..." />
                            <button type="button" onClick={() => setEdgeCases(edgeCases.filter((_, i) => i !== idx))} className="text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sticky bottom-4 z-10 flex justify-end gap-4 p-4 glass-panel bg-black/80 backdrop-blur-xl border border-theme/20 rounded-xl">
                <button type="button" onClick={() => router.push('/admin')} className="px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground">
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-space-primary flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isEditing ? 'Save Changes' : 'Create Question'}
                </button>
            </div>
        </form>
    )
}
