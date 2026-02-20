import prisma from '@/lib/db/prisma'

export const categories = [
  "All Patterns",
  "Analytics",
]

export const difficulties = [
  "All",
  "Easy",
  "Medium",
  "Hard",
  "Extreme Hard",
]

export interface SchemaTable {
  name: string;
  columns: { name: string; type: string }[];
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme Hard';

export interface EdgeCase {
  text: string;
  checked: boolean;
}

export interface Solution {
  title: string;
  code: string;
  description: string | null;
}

export interface Question {
  id: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  problem: string;
  schema: SchemaTable[];
  mySolution: string | null;
  solutions: Solution[];
  businessImpact: string;
  optimizationTips: string[];
  edgeCases: EdgeCase[];
  expectedOutput?: string | null;
  starterCode: string;
  sampleData?: string;
  systemSolution?: string;
}

// Server-side function to fetch all questions for the frontend
export async function getQuestions(): Promise<Question[]> {
  const data = await prisma.question.findMany({
    orderBy: { id: 'asc' },
    include: {
      schemaTables: {
        include: {
          columns: true
        }
      },
      solutions: true
    }
  })

  // Transform Prisma data back into the structure expected by the frontend
  return data.map(q => ({
    id: q.id,
    title: q.title,
    difficulty: q.difficulty as Difficulty,
    category: q.category,
    problem: q.problem,
    mySolution: q.mySolution,
    businessImpact: q.businessImpact,
    optimizationTips: q.optimizationTips,
    edgeCases: q.edgeCases.map(text => ({ text, checked: false })),
    expectedOutput: q.expectedOutput,
    starterCode: q.starterCode,
    sampleData: q.sampleData,
    systemSolution: q.systemSolution,
    schema: q.schemaTables.map(t => ({
      name: t.name,
      columns: t.columns.map(c => ({ name: c.name, type: c.type }))
    })),
    solutions: q.solutions.map(s => ({
      title: s.title,
      description: s.description,
      code: s.code
    }))
  }))
}
