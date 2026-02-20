import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title, difficulty, category, problem, expectedOutput, starterCode, systemSolution, businessImpact, optimizationTips, edgeCases, schema, solutions } = body

        if (!title || !problem) {
            return NextResponse.json({ error: 'Title and Problem statement are required' }, { status: 400 })
        }

        const createdQuestion = await prisma.question.create({
            data: {
                title,
                difficulty,
                category,
                points: 0,
                problem,
                sampleData: '',
                mySolution: null,
                systemSolution: systemSolution || '',
                expectedOutput: expectedOutput || null,
                starterCode: starterCode || '',
                businessImpact: businessImpact || '',
                optimizationTips: optimizationTips || [],
                edgeCases: edgeCases ? edgeCases.map((e: any) => typeof e === 'string' ? e : e.text) : [],
            }
        })

        if (schema && Array.isArray(schema)) {
            for (const table of schema) {
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

        if (solutions && Array.isArray(solutions)) {
            for (const sol of solutions) {
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

        return NextResponse.json({ success: true, id: createdQuestion.id }, { status: 201 })
    } catch (error: any) {
        console.error('Create question error:', error)
        return NextResponse.json({ error: 'Internal server error while creating question' }, { status: 500 })
    }
}
