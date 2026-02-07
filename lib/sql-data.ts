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
  "Analytics",
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
  // --- Questions from sql_bank.docx ---
  {
    id: 6,
    title: "CIBIL Credit Score (Analytics)",
    difficulty: "Hard",
    category: "Analytics",
    problem: `CIBIL score (credit score) is a numerical representation of credit worthiness. Assume:
- Payment history accounts for 70% of the score: (on_time_loan_or_bill_payment / total_bills_and_loans) * 70
- Credit utilization accounts for 30%: Utilization below 30% = 1, between 30-50% = 0.7, above 50% = 0.5
Using credit card bills data for March 2023, calculate the credit utilization ratio and the final credit score. Round the result to 1 decimal place. Display output in ascending order of customer_id.`,
    schema: [
      { name: "customers", columns: [{ name: "customer_id", type: "INT" }, { name: "credit_limit", type: "INT" }] },
      { name: "loans", columns: [{ name: "customer_id", type: "INT" }, { name: "loan_id", type: "INT" }, { name: "loan_due_date", type: "DATE" }] },
      { name: "credit_card_bills", columns: [{ name: "bill_amount", type: "INT" }, { name: "bill_due_date", type: "DATE" }, { name: "bill_id", type: "INT" }, { name: "customer_id", type: "INT" }] },
      { name: "customer_transactions", columns: [{ name: "loan_bill_id", type: "INT" }, { name: "transaction_date", type: "DATE" }, { name: "transaction_type", type: "VARCHAR(10)" }] },
    ],
    solutions: [
      {
        title: "CTE approach: all_bills + on_time_calc",
        description: "UNION loan bills (zero amount) with credit card bills, join with transactions to count on-time payments; combine with utilization logic for final score.",
        code: `WITH all_bills AS (
  SELECT customer_id, loan_id AS bill_id, loan_due_date AS due_date, 0 AS bill_amount FROM loans
  UNION ALL
  SELECT customer_id, bill_id, bill_due_date AS due_date, bill_amount FROM credit_card_bills
),
on_time_calc AS (
  SELECT b.customer_id,
    SUM(b.bill_amount) AS bill_amount,
    COUNT(*) AS total_bills,
    SUM(CASE WHEN ct.transaction_date <= due_date THEN 1 ELSE 0 END) AS on_time_payments
  FROM all_bills b
  INNER JOIN customer_transactions ct ON b.bill_id = ct.loan_bill_id
  GROUP BY b.customer_id
)
SELECT c.customer_id,
  ROUND(
    (ot.on_time_payments * 1.0 / ot.total_bills) * 70 +
    (CASE
      WHEN ot.bill_amount * 1.0 / c.credit_limit < 0.3 THEN 1
      WHEN ot.bill_amount * 1.0 / c.credit_limit < 0.5 THEN 0.7
      ELSE 0.5
    END) * 30, 1
  ) AS cibil_score
FROM customers c
INNER JOIN on_time_calc ot ON c.customer_id = ot.customer_id
ORDER BY c.customer_id ASC;`,
      },
    ],
    businessImpact: "Credit scoring drives lending decisions and risk-based pricing; this pattern is used in fintech and banking analytics.",
    optimizationTips: ["Index on customer_id and dates for joins.", "Pre-filter by month where applicable."],
    edgeCases: [
      { text: "Customers with no bills or transactions", checked: false },
      { text: "Zero credit_limit (division)", checked: false },
    ],
    starterCode: `-- CIBIL score: payment history (70%) + utilization (30%), round to 1 decimal, ORDER BY customer_id ASC
SELECT c.customer_id
FROM customers c
-- Add CTEs and joins here
ORDER BY c.customer_id ASC;`,
  },
  {
    id: 7,
    title: "New and Repeat Customers",
    difficulty: "Medium",
    category: "Analytics",
    problem: `Track daily how many new vs repeat customers placed orders. A new customer is one placing their first order on that date; repeat means they had at least one order before. Display order_date, new_customers, repeat_customers in ascending order of order_date.`,
    schema: [
      { name: "customer_orders", columns: [{ name: "order_id", type: "INT" }, { name: "customer_id", type: "INT" }, { name: "order_date", type: "DATE" }, { name: "order_amount", type: "INT" }] },
    ],
    solutions: [
      {
        title: "CTE: first order per customer, then CASE counts",
        description: "Get each customer's first order date, then by order date count new (order_date = first) and repeat (order_date > first).",
        code: `WITH first_order_date AS (
  SELECT customer_id, MIN(order_date) AS first_order
  FROM customer_orders
  GROUP BY customer_id
)
SELECT co.order_date,
  SUM(CASE WHEN co.order_date = fod.first_order THEN 1 ELSE 0 END) AS new_customers,
  SUM(CASE WHEN co.order_date > fod.first_order THEN 1 ELSE 0 END) AS repeat_customers
FROM customer_orders co
INNER JOIN first_order_date fod ON co.customer_id = fod.customer_id
GROUP BY co.order_date
ORDER BY order_date ASC;`,
      },
    ],
    businessImpact: "Core e-commerce and growth metric for daily dashboards and cohort analysis.",
    optimizationTips: ["Index on (customer_id, order_date)."],
    edgeCases: [
      { text: "Days with no orders", checked: false },
      { text: "Single-order customers (only new, no repeat)", checked: false },
    ],
    starterCode: `-- Daily new vs repeat customers; output: order_date, new_customers, repeat_customers ORDER BY order_date ASC
SELECT co.order_date
FROM customer_orders co
-- Add first-order CTE and CASE logic
GROUP BY co.order_date
ORDER BY order_date ASC;`,
  },
  {
    id: 8,
    title: "Workaholics Employees",
    difficulty: "Hard",
    category: "Analytics",
    problem: `Find workaholic employees (login/logout for a week): (1) worked >8 hours for at least 3 days, or (2) worked >10 hours for at least 2 days. Show emp_id and which criterion they satisfy: '1', '2', or 'both'. Order by emp_id ascending.`,
    schema: [
      { name: "employees", columns: [{ name: "emp_id", type: "INT" }, { name: "login", type: "DATETIME" }, { name: "logout", type: "DATETIME" }] },
    ],
    solutions: [
      {
        title: "CTEs: hours per row, then count 8+ and 10+ days",
        description: "Compute hours per login session, flag 8+ and 10+; aggregate by emp_id to count days_8 and days_10; filter and label criterion.",
        code: `WITH logged_hours AS (
  SELECT *, TIMESTAMPDIFF(SECOND, login, logout) / 3600.0 AS hours,
    CASE WHEN TIMESTAMPDIFF(SECOND, login, logout) / 3600.0 > 10 THEN '10+'
         WHEN TIMESTAMPDIFF(SECOND, login, logout) / 3600.0 > 8 THEN '8+' ELSE '8-' END AS time_window
  FROM employees
),
time_window AS (
  SELECT emp_id,
    COUNT(*) AS days_8,
    SUM(CASE WHEN time_window = '10+' THEN 1 ELSE 0 END) AS days_10
  FROM logged_hours
  WHERE time_window IN ('10+','8+')
  GROUP BY emp_id
)
SELECT emp_id,
  CASE WHEN days_8 >= 3 AND days_10 >= 2 THEN 'both'
       WHEN days_8 >= 3 THEN '1'
       ELSE '2' END AS criterion
FROM time_window
WHERE days_8 >= 3 OR days_10 >= 2
ORDER BY emp_id ASC;`,
      },
    ],
    businessImpact: "Workforce analytics and compliance for overtime and workload tracking.",
    optimizationTips: ["Index on emp_id; filter by week if needed."],
    edgeCases: [
      { text: "Logout before login (negative hours)", checked: false },
      { text: "Same-day multiple sessions", checked: false },
    ],
    starterCode: `-- Workaholics: criterion 1 (8+ hrs, 3+ days) or 2 (10+ hrs, 2+ days); output criterian '1','2','both' ORDER BY emp_id ASC
SELECT emp_id
FROM employees
-- Add hours and day counts
ORDER BY emp_id ASC;`,
  },
  {
    id: 9,
    title: "Lift Overloaded (Part 2)",
    difficulty: "Hard",
    category: "Window Functions",
    problem: `For each lift, list the comma-separated names of people who can be accommodated without exceeding capacity. Prefer females first, then by weight ascending. Output in ascending order of lift id.`,
    schema: [
      { name: "lifts", columns: [{ name: "id", type: "INT" }, { name: "capacity_kg", type: "INT" }] },
      { name: "lift_passengers", columns: [{ name: "passenger_name", type: "VARCHAR(10)" }, { name: "weight_kg", type: "INT" }, { name: "gender", type: "VARCHAR(1)" }, { name: "lift_id", type: "INT" }] },
    ],
    solutions: [
      {
        title: "Running sum with ORDER BY gender, weight; filter by capacity",
        description: "Window: running sum of weight per lift with ORDER BY female first, then weight; keep rows where running_sum <= capacity; GROUP_CONCAT names.",
        code: `WITH running_weight AS (
  SELECT l.id, lp.passenger_name, lp.weight_kg, l.capacity_kg,
    SUM(lp.weight_kg) OVER (
      PARTITION BY l.id
      ORDER BY CASE WHEN lp.gender = 'F' THEN 0 ELSE 1 END, lp.weight_kg
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_sum
  FROM lifts l
  INNER JOIN lift_passengers lp ON l.id = lp.lift_id
)
SELECT id, GROUP_CONCAT(passenger_name ORDER BY gender, weight_kg SEPARATOR ',') AS passenger_list
FROM running_weight
WHERE running_sum <= capacity_kg
GROUP BY id
ORDER BY id;`,
      },
    ],
    businessImpact: "Resource allocation and capacity planning patterns; similar logic in scheduling and bin-packing.",
    optimizationTips: ["Partition by lift id; ORDER BY ensures preference and running sum correctness."],
    edgeCases: [
      { text: "Single passenger over capacity", checked: false },
      { text: "Empty lift (no passengers)", checked: false },
    ],
    starterCode: `-- Per lift: comma-separated passenger names (female first, then by weight), within capacity, ORDER BY id
SELECT l.id
FROM lifts l
JOIN lift_passengers lp ON l.id = lp.lift_id
-- Add running sum and GROUP_CONCAT
GROUP BY l.id
ORDER BY id;`,
  },
]
