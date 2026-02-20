import { PrismaClient } from '@prisma/client'
import { sqlQuestionsData } from '../lib/sql-data.old.ts'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database from imported lib/sql-data.ts...')

    if (!sqlQuestionsData || sqlQuestionsData.length === 0) {
        throw new Error('No questions found to migrate.')
    }

    console.log(`Found ${sqlQuestionsData.length} questions to migrate.`)

    // Clear existing to avoid duplicates during testing
    await prisma.question.deleteMany()

    for (const q of sqlQuestionsData) {
        const createdQuestion = await prisma.question.create({
            data: {
                title: q.title,
                difficulty: q.difficulty,
                category: q.category,
                points: (q as any).points || 0,
                problem: q.problem,
                sampleData: (q as any).sampleData || '',
                mySolution: q.mySolution,
                systemSolution: (q as any).systemSolution || '',
                expectedOutput: q.expectedOutput,
                starterCode: q.starterCode,
                businessImpact: q.businessImpact,
                optimizationTips: q.optimizationTips || [],
                edgeCases: (q.edgeCases || []).map((e: any) => typeof e === 'string' ? e : e.text),
            }
        })

        // Insert schema tables and columns
        if (q.schema && q.schema.length > 0) {
            for (const table of q.schema) {
                const createdTable = await prisma.schemaTable.create({
                    data: {
                        name: table.name,
                        questionId: createdQuestion.id
                    }
                })

                if (table.columns && table.columns.length > 0) {
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

        // Create a Solution record from the systemSolution for the UI to display in the Solutions tab
        if (q.systemSolution) {
            await prisma.solution.create({
                data: {
                    title: "System Solution",
                    description: "Reference solution to the problem.",
                    code: q.systemSolution,
                    questionId: createdQuestion.id
                }
            })
        }
        process.stdout.write('.')
    }

    console.log('\nMigration complete!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
