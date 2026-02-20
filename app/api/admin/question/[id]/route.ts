import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const questionId = parseInt(params.id)
        if (isNaN(questionId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

        const body = await req.json()
        const { title, difficulty, category, problem, expectedOutput, starterCode, systemSolution, businessImpact, optimizationTips, edgeCases, schema, solutions } = body

        // Update basic fields
        await prisma.question.update({
            where: { id: questionId },
            data: {
                title,
                difficulty,
                category,
                problem,
                expectedOutput: expectedOutput || null,
                starterCode: starterCode || '',
                systemSolution: systemSolution || '',
                businessImpact: businessImpact || '',
                optimizationTips: optimizationTips || [],
                edgeCases: edgeCases ? edgeCases.map((e: any) => typeof e === 'string' ? e : e.text) : [],
            }
        })

        // Recreate Schema
        if (schema && Array.isArray(schema)) {
            // Delete old schema tables (cascades to columns implicitly due to Prisma setup usually, but let's be safe: SchemaTable -> Columns)
            await prisma.schemaTable.deleteMany({ where: { questionId } })

            for (const table of schema) {
                const createdTable = await prisma.schemaTable.create({
                    data: {
                        name: table.name,
                        questionId: questionId
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

        // Recreate Solutions
        if (solutions && Array.isArray(solutions)) {
            await prisma.solution.deleteMany({ where: { questionId } })
            for (const sol of solutions) {
                await prisma.solution.create({
                    data: {
                        title: sol.title,
                        description: sol.description || null,
                        code: sol.code,
                        questionId: questionId
                    }
                })
            }
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error: any) {
        console.error('Update question error:', error)
        return NextResponse.json({ error: 'Internal server error while updating question' }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const questionId = parseInt(params.id)
        if (isNaN(questionId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

        await prisma.question.delete({
            where: { id: questionId }
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error: any) {
        console.error('Delete question error:', error)
        return NextResponse.json({ error: 'Internal server error while deleting question' }, { status: 500 })
    }
}
