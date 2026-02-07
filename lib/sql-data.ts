export type Difficulty = "Easy" | "Medium" | "Hard"

export interface SchemaColumn {
  name: string
  type: string
}

export interface SchemaTable {
  name: string
  columns: SchemaColumn[]
}

export interface Solution {
  title: string
  code: string
  description: string
}

export interface EdgeCase {
  text: string
  checked: boolean
}

export interface Question {
  id: number
  title: string
  difficulty: Difficulty
  category: string
  problem: string
  schema: SchemaTable[]
  solutions: Solution[]
  businessImpact: string
  optimizationTips: string[]
  edgeCases: EdgeCase[]
  starterCode: string
}

export const categories = [
  "All Patterns",
  "Window Functions",
  "Recursive CTEs",
  "Self Joins",
  "Subqueries",
  "Aggregations",
  "Pivoting",
]

export const difficulties: ("All" | Difficulty)[] = [
  "All",
  "Easy",
  "Medium",
  "Hard",
]

export const questions: Question[] = [
  {
    id: 1,
    title: "Department Top Earners",
    difficulty: "Medium",
    category: "Window Functions",
    problem:
      "Write a query to find the top 3 highest-paid employees in each department. Return the department name, employee name, and salary. If employees share the same salary, they should share the same rank.",
    schema: [
      {
        name: "employees",
        columns: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(100)" },
          { name: "department_id", type: "INT" },
          { name: "salary", type: "DECIMAL(10,2)" },
          { name: "hire_date", type: "DATE" },
        ],
      },
      {
        name: "departments",
        columns: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(100)" },
          { name: "budget", type: "DECIMAL(12,2)" },
        ],
      },
    ],
    solutions: [
      {
        title: "Method 1: DENSE_RANK()",
        description:
          "Uses DENSE_RANK() to assign ranks within each department partition, then filters for the top 3.",
        code: `SELECT d.name AS department, e.name AS employee, e.salary
FROM (
  SELECT *, DENSE_RANK() OVER (
    PARTITION BY department_id
    ORDER BY salary DESC
  ) AS rnk
  FROM employees
) e
JOIN departments d ON e.department_id = d.id
WHERE e.rnk <= 3
ORDER BY d.name, e.salary DESC;`,
      },
      {
        title: "Method 2: Correlated Subquery",
        description:
          "Uses a correlated subquery to count employees with higher salaries in the same department.",
        code: `SELECT d.name AS department, e.name AS employee, e.salary
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE (
  SELECT COUNT(DISTINCT e2.salary)
  FROM employees e2
  WHERE e2.department_id = e.department_id
    AND e2.salary > e.salary
) < 3
ORDER BY d.name, e.salary DESC;`,
      },
      {
        title: "Method 3: CTE + ROW_NUMBER",
        description:
          "Combines a CTE with ROW_NUMBER for clear, readable ranking logic.",
        code: `WITH ranked AS (
  SELECT
    e.name AS employee,
    d.name AS department,
    e.salary,
    ROW_NUMBER() OVER (
      PARTITION BY e.department_id
      ORDER BY e.salary DESC, e.hire_date ASC
    ) AS row_num
  FROM employees e
  JOIN departments d ON e.department_id = d.id
)
SELECT department, employee, salary
FROM ranked
WHERE row_num <= 3
ORDER BY department, salary DESC;`,
      },
    ],
    businessImpact:
      "Identifying top earners per department is essential for compensation reviews, budget allocation, and ensuring salary equity across teams. This query pattern is commonly used in HR analytics dashboards.",
    optimizationTips: [
      "Index on (department_id, salary DESC) for optimal window function performance.",
      "Use DENSE_RANK over ROW_NUMBER when ties in salary should share the same rank.",
      "Avoid SELECT * inside subqueries — select only the columns you need.",
    ],
    edgeCases: [
      { text: "Handle NULL salaries", checked: false },
      { text: "Departments with fewer than 3 employees", checked: false },
      { text: "Tied salaries across rank boundaries", checked: false },
      { text: "Empty departments (no employees)", checked: false },
    ],
    starterCode: `-- Find the top 3 highest-paid employees per department
SELECT
  d.name AS department,
  e.name AS employee,
  e.salary
FROM employees e
JOIN departments d
  ON e.department_id = d.id
-- Add your ranking logic here
ORDER BY d.name, e.salary DESC;`,
  },
  {
    id: 2,
    title: "Recursive Org Chart",
    difficulty: "Hard",
    category: "Recursive CTEs",
    problem:
      "Write a recursive CTE to generate a full organizational chart starting from the CEO. Include the employee name, their manager name, and their depth level in the hierarchy.",
    schema: [
      {
        name: "org_tree",
        columns: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(100)" },
          { name: "manager_id", type: "INT NULL" },
          { name: "title", type: "VARCHAR(100)" },
        ],
      },
    ],
    solutions: [
      {
        title: "Method 1: Basic Recursive CTE",
        description:
          "Anchors on the root node (CEO with NULL manager_id) and recursively joins child employees.",
        code: `WITH RECURSIVE org AS (
  SELECT id, name, manager_id, title, 0 AS depth
  FROM org_tree
  WHERE manager_id IS NULL

  UNION ALL

  SELECT e.id, e.name, e.manager_id, e.title, o.depth + 1
  FROM org_tree e
  JOIN org o ON e.manager_id = o.id
)
SELECT name, title, depth
FROM org
ORDER BY depth, name;`,
      },
    ],
    businessImpact:
      "Recursive org chart queries power reporting dashboards, access-control hierarchies, and management span analysis across enterprise HR systems.",
    optimizationTips: [
      "Add a MAXRECURSION hint to prevent runaway recursion on cyclic data.",
      "Index on manager_id for efficient recursive joins.",
    ],
    edgeCases: [
      { text: "Cyclic references in manager_id", checked: false },
      { text: "Multiple root nodes (orphan managers)", checked: false },
      { text: "Very deep hierarchies (> 100 levels)", checked: false },
    ],
    starterCode: `-- Build a recursive org chart from the CEO down
WITH RECURSIVE org AS (
  -- anchor: select the root (CEO)

  UNION ALL

  -- recursive: join children to parents
)
SELECT name, title, depth
FROM org
ORDER BY depth, name;`,
  },
  {
    id: 3,
    title: "Find Duplicate Emails",
    difficulty: "Easy",
    category: "Aggregations",
    problem:
      "Write a query to find all email addresses that appear more than once in the users table. Return the email and the count of occurrences.",
    schema: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INT" },
          { name: "email", type: "VARCHAR(255)" },
          { name: "created_at", type: "TIMESTAMP" },
        ],
      },
    ],
    solutions: [
      {
        title: "Method 1: GROUP BY + HAVING",
        description:
          "Groups by email and filters groups with more than one row.",
        code: `SELECT email, COUNT(*) AS occurrences
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY occurrences DESC;`,
      },
      {
        title: "Method 2: Self Join",
        description:
          "Joins the table against itself to detect matching emails on different rows.",
        code: `SELECT DISTINCT a.email
FROM users a
JOIN users b
  ON a.email = b.email
  AND a.id <> b.id
ORDER BY a.email;`,
      },
    ],
    businessImpact:
      "Detecting duplicate emails is critical for data hygiene, preventing fraud, and ensuring each user has a unique account in authentication systems.",
    optimizationTips: [
      "Create a unique index on email to prevent future duplicates.",
      "Use LOWER(email) if your DB collation is case-sensitive.",
    ],
    edgeCases: [
      { text: "Case-sensitive email matching", checked: false },
      { text: "NULL email addresses", checked: false },
      { text: "Leading/trailing whitespace in emails", checked: false },
    ],
    starterCode: `-- Find all duplicate email addresses
SELECT email, COUNT(*) AS occurrences
FROM users
-- Add your filtering logic here
ORDER BY occurrences DESC;`,
  },
  {
    id: 4,
    title: "Running Revenue Total",
    difficulty: "Medium",
    category: "Window Functions",
    problem:
      "Calculate the running total of revenue by month for the current year. Return the month, monthly revenue, and cumulative revenue.",
    schema: [
      {
        name: "orders",
        columns: [
          { name: "id", type: "INT" },
          { name: "customer_id", type: "INT" },
          { name: "amount", type: "DECIMAL(10,2)" },
          { name: "order_date", type: "DATE" },
          { name: "status", type: "VARCHAR(20)" },
        ],
      },
    ],
    solutions: [
      {
        title: "Method 1: SUM() OVER",
        description:
          "Uses a window function with ORDER BY to compute a cumulative sum.",
        code: `SELECT
  DATE_TRUNC('month', order_date) AS month,
  SUM(amount) AS monthly_revenue,
  SUM(SUM(amount)) OVER (
    ORDER BY DATE_TRUNC('month', order_date)
  ) AS cumulative_revenue
FROM orders
WHERE EXTRACT(YEAR FROM order_date) = 2026
  AND status = 'completed'
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;`,
      },
    ],
    businessImpact:
      "Running revenue totals are a core KPI in finance dashboards, enabling teams to track growth trajectories and forecast end-of-period targets.",
    optimizationTips: [
      "Filter by year early to reduce the window function scan range.",
      "Index on (order_date, status) for efficient filtering.",
    ],
    edgeCases: [
      { text: "Months with zero orders", checked: false },
      { text: "Refunded or cancelled orders", checked: false },
      { text: "Orders spanning midnight of month boundaries", checked: false },
    ],
    starterCode: `-- Calculate running total of revenue by month
SELECT
  DATE_TRUNC('month', order_date) AS month,
  SUM(amount) AS monthly_revenue
  -- Add cumulative sum here
FROM orders
WHERE EXTRACT(YEAR FROM order_date) = 2026
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;`,
  },
  {
    id: 5,
    title: "Employee Manager Pairs",
    difficulty: "Easy",
    category: "Self Joins",
    problem:
      "Write a query using a self join to list each employee alongside their direct manager's name. Employees without a manager should still appear.",
    schema: [
      {
        name: "staff",
        columns: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR(100)" },
          { name: "manager_id", type: "INT NULL" },
          { name: "department", type: "VARCHAR(50)" },
        ],
      },
    ],
    solutions: [
      {
        title: "Method 1: LEFT JOIN",
        description:
          "Self-joins the staff table using a LEFT JOIN so employees without managers still show up.",
        code: `SELECT
  e.name AS employee,
  m.name AS manager
FROM staff e
LEFT JOIN staff m ON e.manager_id = m.id
ORDER BY e.name;`,
      },
    ],
    businessImpact:
      "Employee-manager pair queries support org-chart rendering, reporting lines, and management-span dashboards.",
    optimizationTips: [
      "Index on id (primary key) is usually sufficient for the join.",
      "Use COALESCE to replace NULL manager with 'No Manager' for display.",
    ],
    edgeCases: [
      { text: "Employees who manage themselves (self-reference)", checked: false },
      { text: "NULL manager_id for top-level employees", checked: false },
    ],
    starterCode: `-- List each employee with their manager
SELECT
  e.name AS employee,
  -- Add manager name here
FROM staff e
-- Add your join here
ORDER BY e.name;`,
  },
]
