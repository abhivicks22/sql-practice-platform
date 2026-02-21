import prisma from '@/lib/db/prisma'

async function checkQuestion() {
    console.log("Checking Neon DB for question 181...")

    // We'll see if 181 exists at all
    const q181 = await prisma.question.findUnique({
        where: { id: 181 }
    })

    if (q181) {
        console.log("Found:", q181.title)
    } else {
        console.log("NOT FOUND! 404 TRIGGERED.")

        // Let's see what the max ID is
        const latest = await prisma.question.findFirst({
            orderBy: { id: 'desc' },
            select: { id: true, title: true }
        })
        console.log("Highest ID in DB:", latest?.id, latest?.title)
    }
}

checkQuestion()
