import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const questions = body.questions

        if (!Array.isArray(questions)) {
            return NextResponse.json({ error: 'Invalid payload. Expected an array of questions.' }, { status: 400 })
        }

        let importedCount = 0

        // Process each question individually to handle relations
        for (const q of questions) {
            const createdQuestion = await prisma.question.create({
                data: {
                    title: q.title,
                    difficulty: q.difficulty,
                    category: q.category,
                    points: q.points || 0,
                    problem: q.problem,
                    sampleData: q.sampleData || '',
                    mySolution: q.mySolution || null,
                    systemSolution: q.systemSolution || '',
                    expectedOutput: q.expectedOutput || null,
                    starterCode: q.starterCode || '',
                    businessImpact: q.businessImpact || '',
                    optimizationTips: q.optimizationTips || [],
                    edgeCases: (q.edgeCases || []).map((e: any) => typeof e === 'string' ? e : e.text),
                }
            })

            if (q.schema && Array.isArray(q.schema)) {
                for (const table of q.schema) {
                    const createdTable = await prisma.schemaTable.create({
                        data: {
                            name: table.name,
                            questionId: createdQuestion.id
                        }
                    })

                    if (table.columns && Array.isArray(table.columns)) {
                        await prisma.column.createMany({
                            data: table.columns.map((c: any) => ({
                                name: c.name,
                                type: c.type,
                                schemaTableId: createdTable.id
                            }))
                        })
                    }
                }
            }

            if (q.solutions && Array.isArray(q.solutions)) {
                for (const sol of q.solutions) {
                    await prisma.solution.create({
                        data: {
                            title: sol.title,
                            description: sol.description || null,
                            code: sol.code,
                            questionId: createdQuestion.id
                        }
                    })
                }
            }

            importedCount++
        }

        return NextResponse.json({
            success: true,
            count: importedCount
        }, { status: 200 })

    } catch (error: any) {
        console.error('Bulk upload error:', error)
        return NextResponse.json({
            error: error.message || 'Internal server error during upload.'
        }, { status: 500 })
    }
}
