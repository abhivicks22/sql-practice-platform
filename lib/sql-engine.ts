// lib/sql-engine.ts
// PGlite - PostgreSQL running in the browser via WebAssembly

import { PGlite } from '@electric-sql/pglite';

let db: PGlite | null = null;

// Initialize the database
export async function initDatabase(): Promise<PGlite> {
  if (db) return db;
  
  db = new PGlite();
  await db.waitReady;
  
  return db;
}

// Get database instance
export function getDatabase(): PGlite | null {
  return db;
}

// Execute a query and return results
export interface QueryResult {
  success: boolean;
  rows: Record<string, unknown>[];
  columns: string[];
  rowCount: number;
  executionTime: number;
  error?: string;
}

export async function executeQuery(sql: string): Promise<QueryResult> {
  const startTime = performance.now();
  
  try {
    if (!db) {
      await initDatabase();
    }
    
    const result = await db!.query(sql);
    const endTime = performance.now();
    
    // Extract column names from the first row or empty array
    const columns = result.fields?.map(f => f.name) || [];
    
    return {
      success: true,
      rows: result.rows as Record<string, unknown>[],
      columns,
      rowCount: result.rows?.length || 0,
      executionTime: Math.round((endTime - startTime) * 1000) / 1000,
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      success: false,
      rows: [],
      columns: [],
      rowCount: 0,
      executionTime: Math.round((endTime - startTime) * 1000) / 1000,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Split multi-statement SQL into single statements (run one per exec/query to avoid "multiple commands" error)
function splitStatements(sql: string): string[] {
  return sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/^\s*(--|$)/.test(s));
}

/** Run multiple SELECT/statements and return each result (for Run button with multi-statement input). */
export async function executeMultipleQueries(sql: string): Promise<QueryResult[]> {
  const statements = splitStatements(sql);
  const results: QueryResult[] = [];
  for (const stmt of statements) {
    if (!stmt) continue;
    const result = await executeQuery(stmt + ';');
    results.push(result);
  }
  return results;
}

// Setup tables and sample data for a specific question
export async function setupQuestionData(setupSQL: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      await initDatabase();
    }
    const statements = splitStatements(setupSQL);
    for (const stmt of statements) {
      if (stmt) await db!.exec(stmt + ';');
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to setup question data',
    };
  }
}

// Reset database (drop all tables and reinitialize)
export async function resetDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
  await initDatabase();
}

// Compare user result with expected result
export interface EvaluationResult {
  passed: boolean;
  message: string;
  userRowCount: number;
  expectedRowCount: number;
  differences?: string[];
}

export async function evaluateQuery(
  userSQL: string,
  expectedSQL: string
): Promise<EvaluationResult> {
  try {
    // Run user query
    const userResult = await executeQuery(userSQL);
    if (!userResult.success) {
      return {
        passed: false,
        message: `Your query has an error: ${userResult.error}`,
        userRowCount: 0,
        expectedRowCount: 0,
      };
    }
    
    // Run expected query
    const expectedResult = await executeQuery(expectedSQL);
    if (!expectedResult.success) {
      return {
        passed: false,
        message: `Error in expected solution: ${expectedResult.error}`,
        userRowCount: userResult.rowCount,
        expectedRowCount: 0,
      };
    }
    
    // Compare row counts
    if (userResult.rowCount !== expectedResult.rowCount) {
      return {
        passed: false,
        message: `Row count mismatch: Your query returned ${userResult.rowCount} rows, expected ${expectedResult.rowCount} rows.`,
        userRowCount: userResult.rowCount,
        expectedRowCount: expectedResult.rowCount,
      };
    }
    
    // Compare column counts
    if (userResult.columns.length !== expectedResult.columns.length) {
      return {
        passed: false,
        message: `Column count mismatch: Your query returned ${userResult.columns.length} columns, expected ${expectedResult.columns.length} columns.`,
        userRowCount: userResult.rowCount,
        expectedRowCount: expectedResult.rowCount,
      };
    }
    
    // Deep compare rows (convert to JSON strings for comparison)
    const userRowsStr = JSON.stringify(userResult.rows);
    const expectedRowsStr = JSON.stringify(expectedResult.rows);
    
    if (userRowsStr !== expectedRowsStr) {
      // Find specific differences
      const differences: string[] = [];
      const maxDiffs = 3;
      
      for (let i = 0; i < Math.min(userResult.rows.length, expectedResult.rows.length); i++) {
        if (JSON.stringify(userResult.rows[i]) !== JSON.stringify(expectedResult.rows[i])) {
          if (differences.length < maxDiffs) {
            differences.push(`Row ${i + 1}: Got ${JSON.stringify(userResult.rows[i])}, Expected ${JSON.stringify(expectedResult.rows[i])}`);
          }
        }
      }
      
      return {
        passed: false,
        message: `Data mismatch. Your output differs from expected output.`,
        userRowCount: userResult.rowCount,
        expectedRowCount: expectedResult.rowCount,
        differences,
      };
    }
    
    return {
      passed: true,
      message: `✓ Correct! All ${userResult.rowCount} rows match the expected output.`,
      userRowCount: userResult.rowCount,
      expectedRowCount: expectedResult.rowCount,
    };
    
  } catch (error) {
    return {
      passed: false,
      message: error instanceof Error ? error.message : 'Evaluation failed',
      userRowCount: 0,
      expectedRowCount: 0,
    };
  }
}

// Format query results as ASCII table (for console display)
export function formatResultsAsTable(result: QueryResult): string {
  if (!result.success) {
    return `Error: ${result.error}`;
  }
  
  if (result.rows.length === 0) {
    return 'Query executed successfully.\n0 rows returned.';
  }
  
  const columns = result.columns;
  
  // Calculate column widths
  const colWidths: number[] = columns.map((col, idx) => {
    const headerLen = col.length;
    const maxDataLen = result.rows.reduce((max, row) => {
      const val = String(row[col] ?? 'NULL');
      return Math.max(max, val.length);
    }, 0);
    return Math.max(headerLen, maxDataLen, 4); // minimum 4 chars
  });
  
  // Build table
  const separator = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+';
  const header = '|' + columns.map((col, i) => ` ${col.padEnd(colWidths[i])} `).join('|') + '|';
  
  const rows = result.rows.map(row => {
    return '|' + columns.map((col, i) => {
      const val = String(row[col] ?? 'NULL');
      return ` ${val.padEnd(colWidths[i])} `;
    }).join('|') + '|';
  });
  
  return [
    separator,
    header,
    separator,
    ...rows,
    separator,
    '',
    `${result.rowCount} row(s) returned in ${result.executionTime}ms`
  ].join('\n');
}
