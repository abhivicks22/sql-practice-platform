import { getQuestions } from '@/lib/sql-data'
import SQLNavigatorClient from '@/components/sql-navigator/sql-navigator-client'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const questions = await getQuestions()

    return <SQLNavigatorClient questions={questions} />
}
