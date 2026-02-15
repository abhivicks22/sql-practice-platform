// lib/sql-data.ts
// All SQL questions with schemas, solutions, sample data, and metadata

export interface SQLQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme Hard';
  category: string;
  points: number;
  problem: string;
  schema: SchemaTable[];
  sampleData: string;
  systemSolution: string;
  starterCode: string;
  businessImpact: string;
  optimizationTips: string[];
  edgeCases: string[];
}

export interface SchemaTable {
  name: string;
  columns: { name: string; type: string }[];
}

// App compatibility: types expected by components
export type Difficulty = SQLQuestion['difficulty'];
export interface EdgeCase {
  text: string;
  checked: boolean;
}
export interface Solution {
  title: string;
  code: string;
  description: string;
}
export interface Question {
  id: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  problem: string;
  schema: SchemaTable[];
  solutions: Solution[];
  businessImpact: string;
  optimizationTips: string[];
  edgeCases: EdgeCase[];
  starterCode: string;
}

const sqlQuestionsData: SQLQuestion[] = [
  {
    id: 19,
    title: "Order Fulfilment",
    difficulty: "Extreme Hard",
    category: "Analytics",
    points: 75,
    problem: `You are given two tables: products and orders. The products table contains information about each product, including the product ID and available quantity in the warehouse. The orders table contains details about customer orders, including the order ID, product ID, order date, and quantity requested by the customer.

Write an SQL query to generate a report listing the orders that can be fulfilled based on the available inventory in the warehouse, following a first-come-first-serve approach based on the order date. Each row in the report should include the order ID, product name, quantity requested by the customer, quantity actually fulfilled, and a comments column as below:

• If the order can be completely fulfilled then 'Full Order'.
• If the order can be partially fulfilled then 'Partial Order'.
• If order can not be fulfilled at all then 'No Order'.

Display the output in ascending order of order id.`,
    schema: [
      {
        name: "products",
        columns: [
          { name: "product_id", type: "int" },
          { name: "product_name", type: "varchar(50)" },
          { name: "available_quantity", type: "int" }
        ]
      },
      {
        name: "orders",
        columns: [
          { name: "order_id", type: "int" },
          { name: "product_id", type: "int" },
          { name: "order_date", type: "date" },
          { name: "quantity_requested", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(50),
  available_quantity INT
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  product_id INT,
  order_date DATE,
  quantity_requested INT
);

INSERT INTO products VALUES
(1, 'Laptop', 10),
(2, 'Phone', 5),
(3, 'Tablet', 8);

INSERT INTO orders VALUES
(101, 1, '2024-01-01', 3),
(102, 1, '2024-01-02', 5),
(103, 1, '2024-01-03', 4),
(104, 2, '2024-01-01', 3),
(105, 2, '2024-01-02', 3),
(106, 3, '2024-01-01', 10);`,
    systemSolution: `WITH cte AS (
  SELECT o.*,
    SUM(quantity_requested) OVER(PARTITION BY o.product_id ORDER BY order_date) AS running_requested_qty,
    p.available_quantity,
    p.product_name
  FROM orders o
  INNER JOIN products p ON o.product_id = p.product_id
)
SELECT 
  order_id,
  product_name,
  quantity_requested,
  CASE 
    WHEN running_requested_qty <= available_quantity THEN quantity_requested
    WHEN available_quantity - (running_requested_qty - quantity_requested) > 0 
      THEN available_quantity - (running_requested_qty - quantity_requested)
    ELSE 0 
  END AS qty_fulfilled,
  CASE 
    WHEN running_requested_qty <= available_quantity THEN 'Full Order'
    WHEN available_quantity - (running_requested_qty - quantity_requested) > 0 THEN 'Partial Order'
    ELSE 'No Order' 
  END AS comments
FROM cte
ORDER BY order_id;`,
    starterCode: `-- Order Fulfilment: First-come-first-serve inventory allocation
SELECT 
  order_id,
  product_name,
  quantity_requested
  -- Add qty_fulfilled and comments columns
FROM orders o
JOIN products p ON o.product_id = p.product_id
ORDER BY order_id;`,
    businessImpact: `This query directly impacts customer satisfaction and warehouse operations. In e-commerce, accurate order fulfillment tracking helps:
• Prevent overselling and customer complaints
• Optimize inventory allocation during high-demand periods
• Provide transparency to customers about order status
• Enable proactive communication for partial/unfulfilled orders
• Support demand forecasting by analyzing fulfillment gaps`,
    optimizationTips: [
      "Use window functions for running totals instead of correlated subqueries",
      "Create an index on (product_id, order_date) for faster FIFO processing",
      "Consider materialized views for real-time inventory dashboards"
    ],
    edgeCases: [
      "Multiple orders on the same date for same product - need tiebreaker (order_id)",
      "Zero available quantity - all orders should be 'No Order'",
      "Exact match: running total equals available quantity exactly",
      "Single order exceeds total inventory - partial fulfillment",
      "Product with no orders should not appear in results"
    ]
  },
  {
    id: 43,
    title: "Customer Retention",
    difficulty: "Extreme Hard",
    category: "Analytics",
    points: 75,
    problem: `Customer retention can be defined as the number of customers who continue to make purchases over a certain period compared to the total number of customers. Here's a step-by-step approach to calculate customer retention rate:

1. Determine the number of customers who made purchases in the current period (e.g., month: m)
2. Identify the number of customers from month m who made purchases in month m+1, m+2 as well.

Suppose you are a data analyst working for Amazon. The company is interested in measuring customer retention over the months to understand how many customers continue to make purchases over time. Your task is to write an SQL to derive customer retention month over month, display the output in ascending order of current year, month & future year, month.`,
    schema: [
      {
        name: "orders",
        columns: [
          { name: "order_id", type: "int" },
          { name: "customer_id", type: "int" },
          { name: "order_date", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  order_date DATE
);

INSERT INTO orders VALUES
(1, 101, '2024-01-15'),
(2, 102, '2024-01-20'),
(3, 103, '2024-01-25'),
(4, 101, '2024-02-10'),
(5, 102, '2024-02-15'),
(6, 104, '2024-02-20'),
(7, 101, '2024-03-05'),
(8, 103, '2024-03-10'),
(9, 105, '2024-03-15'),
(10, 101, '2024-04-01'),
(11, 102, '2024-04-10');`,
    systemSolution: `WITH cte AS (
  SELECT DISTINCT 
    EXTRACT(YEAR FROM order_date) AS year, 
    EXTRACT(MONTH FROM order_date) AS month, 
    customer_id 
  FROM orders
)
SELECT 
  cm.year AS current_year,
  cm.month AS current_month,
  fm.year AS future_year,
  fm.month AS future_month,
  COUNT(DISTINCT cm.customer_id) AS total_customers,
  COUNT(DISTINCT CASE WHEN fm.customer_id = cm.customer_id THEN fm.customer_id END) AS retained_customers
FROM cte cm
INNER JOIN cte fm 
  ON (fm.year > cm.year OR (fm.year = cm.year AND fm.month > cm.month))
GROUP BY cm.year, cm.month, fm.year, fm.month
ORDER BY cm.year, cm.month, fm.year, fm.month;`,
    starterCode: `-- Customer Retention Analysis
-- Find how many customers from month M also purchased in month M+1, M+2, etc.
SELECT 
  -- current period columns
  -- future period columns
  -- retention metrics
FROM orders
ORDER BY current_year, current_month;`,
    businessImpact: `Customer retention analysis is critical for subscription and e-commerce businesses:
• Retention rate directly correlates with Customer Lifetime Value (CLV)
• Helps identify months with high churn for targeted interventions
• Enables cohort analysis to measure marketing campaign effectiveness
• Reducing churn by 5% can increase profits by 25-95% (Harvard Business Review)
• Guides budget allocation between acquisition vs retention marketing`,
    optimizationTips: [
      "Pre-aggregate to monthly level before self-join to reduce row count",
      "Use date_trunc('month', order_date) for cleaner month extraction",
      "Consider rolling 30-day windows instead of calendar months for accuracy"
    ],
    edgeCases: [
      "Customer with multiple orders in same month - should count once",
      "Gap months with no orders - should not appear in results",
      "Customer's first month - 100% are 'new', not retained",
      "Year boundary crossing (Dec to Jan) - year comparison logic",
      "Single customer in a month - retention to self in future months"
    ]
  },
  {
    id: 65,
    title: "Service Downtime",
    difficulty: "Extreme Hard",
    category: "Analytics",
    points: 75,
    problem: `You are a DevOps engineer responsible for monitoring the health and status of various services in your organization's infrastructure. Your team conducts canary tests on each service every minute to ensure their reliability and performance. 

As part of your responsibilities, you need to develop a SQL to identify any service that experiences continuous downtime for at least 5 minutes so that team can find the root cause and fix the issue. Display the output in descending order of service down minutes.`,
    schema: [
      {
        name: "service_status",
        columns: [
          { name: "service_name", type: "varchar(50)" },
          { name: "status", type: "varchar(10)" },
          { name: "updated_time", type: "timestamp" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS service_status;

CREATE TABLE service_status (
  service_name VARCHAR(50),
  status VARCHAR(10),
  updated_time TIMESTAMP
);

INSERT INTO service_status VALUES
('API', 'up', '2024-01-01 10:00:00'),
('API', 'up', '2024-01-01 10:01:00'),
('API', 'down', '2024-01-01 10:02:00'),
('API', 'down', '2024-01-01 10:03:00'),
('API', 'down', '2024-01-01 10:04:00'),
('API', 'down', '2024-01-01 10:05:00'),
('API', 'down', '2024-01-01 10:06:00'),
('API', 'up', '2024-01-01 10:07:00'),
('DB', 'up', '2024-01-01 10:00:00'),
('DB', 'down', '2024-01-01 10:01:00'),
('DB', 'down', '2024-01-01 10:02:00'),
('DB', 'down', '2024-01-01 10:03:00'),
('DB', 'up', '2024-01-01 10:04:00'),
('Cache', 'down', '2024-01-01 10:00:00'),
('Cache', 'down', '2024-01-01 10:01:00'),
('Cache', 'down', '2024-01-01 10:02:00'),
('Cache', 'down', '2024-01-01 10:03:00'),
('Cache', 'down', '2024-01-01 10:04:00'),
('Cache', 'down', '2024-01-01 10:05:00'),
('Cache', 'down', '2024-01-01 10:06:00'),
('Cache', 'down', '2024-01-01 10:07:00'),
('Cache', 'up', '2024-01-01 10:08:00');`,
    systemSolution: `WITH consecutive_down AS (
  SELECT 
    service_name,
    updated_time,
    status,
    ROW_NUMBER() OVER (PARTITION BY service_name ORDER BY updated_time) AS row_num,
    ROW_NUMBER() OVER (PARTITION BY service_name, status ORDER BY updated_time) AS status_row_num
  FROM service_status
)
SELECT 
  service_name,
  MIN(updated_time) AS down_start_time,
  MAX(updated_time) AS down_end_time,
  COUNT(*) AS down_minutes
FROM consecutive_down
WHERE status = 'down'
GROUP BY service_name, row_num - status_row_num
HAVING COUNT(*) >= 5
ORDER BY down_minutes DESC;`,
    starterCode: `-- Service Downtime Detection
-- Find services with 5+ consecutive minutes of downtime
SELECT 
  service_name
  -- down_start_time,
  -- down_end_time,
  -- down_minutes
FROM service_status
WHERE status = 'down'
ORDER BY down_minutes DESC;`,
    businessImpact: `Service downtime detection is essential for SLA compliance and incident management:
• Enables automated alerting before SLA breaches occur
• Helps calculate downtime costs (average: $5,600 per minute for enterprises)
• Supports root cause analysis by identifying downtime patterns
• Required for compliance reporting (SOC 2, ISO 27001)
• Drives infrastructure investment decisions based on reliability data`,
    optimizationTips: [
      "Use gaps-and-islands technique with ROW_NUMBER() difference",
      "Create index on (service_name, updated_time) for time-series queries",
      "Consider streaming analytics for real-time alerting instead of batch queries"
    ],
    edgeCases: [
      "Service starts with 'down' status - no prior 'up' reference",
      "Exactly 5 minutes downtime - should be included (>= 5)",
      "Multiple downtime periods for same service - each counted separately",
      "Missing minute readings (gaps in data) - handle as separate incidents",
      "Service never goes back 'up' - open-ended downtime period"
    ]
  },
  {
    id: 87,
    title: "Leave Approval",
    difficulty: "Extreme Hard",
    category: "Analytics",
    points: 75,
    problem: `You are tasked with writing an SQL query to determine whether a leave request can be approved for each employee based on their available leave balance for 2024. Employees receive 1.5 leaves at the start of each month, and they may have some balance leaves carried over from the previous year 2023 (available in employees table). A leave request can only be approved if the employee has a sufficient leave balance at the start date of planned leave period.

Write an SQL to derive a new status column stating if leave request is Approved or Rejected for each leave request. Sort the output by request id. Consider the following assumptions:

1. If a leave request is eligible for approval, then it will always be taken by employee and leave balance will be deducted as per the leave period. If the leave is rejected then the balance will not be deducted.
2. A leave will either be fully approved or cancelled. No partial approvals possible.
3. If a weekend is falling between the leave start and end date then do consider them when calculating the leave days, meaning no exclusion of weekends.`,
    schema: [
      {
        name: "employees",
        columns: [
          { name: "employee_id", type: "int" },
          { name: "name", type: "varchar(50)" },
          { name: "leave_balance_from_2023", type: "int" }
        ]
      },
      {
        name: "leave_requests",
        columns: [
          { name: "request_id", type: "int" },
          { name: "employee_id", type: "int" },
          { name: "leave_start_date", type: "date" },
          { name: "leave_end_date", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  name VARCHAR(50),
  leave_balance_from_2023 INT
);

CREATE TABLE leave_requests (
  request_id INT PRIMARY KEY,
  employee_id INT,
  leave_start_date DATE,
  leave_end_date DATE
);

INSERT INTO employees VALUES
(1, 'Alice', 2),
(2, 'Bob', 0),
(3, 'Charlie', 5);

INSERT INTO leave_requests VALUES
(1, 1, '2024-01-15', '2024-01-17'),
(2, 1, '2024-02-10', '2024-02-12'),
(3, 1, '2024-03-05', '2024-03-10'),
(4, 2, '2024-01-20', '2024-01-22'),
(5, 2, '2024-02-15', '2024-02-16'),
(6, 3, '2024-01-10', '2024-01-12');`,
    systemSolution: `WITH RECURSIVE cte AS (
  SELECT lr.*, e.leave_balance_from_2023,
    EXTRACT(MONTH FROM leave_start_date) AS leave_start_month,
    (leave_end_date - leave_start_date) + 1 AS leave_days,
    ROW_NUMBER() OVER(PARTITION BY lr.employee_id ORDER BY lr.leave_start_date) AS rn
  FROM leave_requests lr 
  INNER JOIN employees e ON lr.employee_id = e.employee_id
),
r_cte AS (
  SELECT request_id, leave_start_date, leave_end_date, employee_id, leave_start_month,
    CASE WHEN leave_balance_from_2023 + leave_start_month * 1.5 >= leave_days 
      THEN leave_balance_from_2023 + leave_start_month * 1.5 - leave_days
      ELSE leave_balance_from_2023 + leave_start_month * 1.5
    END AS balance_leaves,
    CASE WHEN leave_balance_from_2023 + leave_start_month * 1.5 >= leave_days 
      THEN 'Approved' ELSE 'Rejected' 
    END AS status,
    rn, leave_days
  FROM cte WHERE rn = 1
  
  UNION ALL
  
  SELECT cte.request_id, cte.leave_start_date, cte.leave_end_date, cte.employee_id, cte.leave_start_month,
    CASE WHEN r_cte.balance_leaves + (cte.leave_start_month - r_cte.leave_start_month) * 1.5 >= cte.leave_days
      THEN r_cte.balance_leaves + (cte.leave_start_month - r_cte.leave_start_month) * 1.5 - cte.leave_days
      ELSE r_cte.balance_leaves + (cte.leave_start_month - r_cte.leave_start_month) * 1.5 
    END AS balance_leaves,
    CASE WHEN r_cte.balance_leaves + (cte.leave_start_month - r_cte.leave_start_month) * 1.5 >= cte.leave_days
      THEN 'Approved' ELSE 'Rejected' 
    END AS status,
    cte.rn, cte.leave_days
  FROM cte 
  INNER JOIN r_cte ON cte.employee_id = r_cte.employee_id AND cte.rn = r_cte.rn + 1
)
SELECT request_id, employee_id, leave_start_date, leave_end_date, status
FROM r_cte
ORDER BY request_id;`,
    starterCode: `-- Leave Approval System
-- Employees get 1.5 leaves/month + carryover from 2023
-- Determine if each leave request can be approved
SELECT 
  lr.request_id,
  lr.employee_id,
  lr.leave_start_date,
  lr.leave_end_date
  -- Add status column: 'Approved' or 'Rejected'
FROM leave_requests lr
JOIN employees e ON lr.employee_id = e.employee_id
ORDER BY request_id;`,
    businessImpact: `Automated leave approval systems save HR teams significant time and ensure policy compliance:
• Eliminates manual balance tracking errors
• Ensures fair, consistent policy application across all employees
• Prevents leave conflicts and understaffing
• Provides audit trail for compliance and dispute resolution
• Enables self-service leave management, reducing HR workload by 30-40%`,
    optimizationTips: [
      "Use recursive CTE to process sequential leave requests per employee",
      "Pre-calculate accrued leaves per month to avoid repeated calculations",
      "Consider caching leave balances and updating incrementally"
    ],
    edgeCases: [
      "Employee with zero carryover balance requesting leave in January",
      "Multiple leave requests in same month - order matters for balance",
      "Leave spanning month boundary - which month's accrual to use",
      "Rejected leave followed by approved leave - balance not deducted for rejected",
      "Fractional leave balance (1.5 * months creates decimals)"
    ]
  },
  {
    id: 113,
    title: "Cab Driver Streak",
    difficulty: "Extreme Hard",
    category: "Analytics",
    points: 75,
    problem: `A Cab booking company has a dataset of its trip ratings, each row represents a single trip of a driver. A trip has a positive rating if it was rated 4 or above, a streak of positive ratings is when a driver has a rating of 4 and above in consecutive trips. Example: If there are 3 consecutive trips with a rating of 4 or above then the streak is 2.

Find out the maximum streak that a driver has had and sort the output in descending order of their maximum streak and then by descending order of driver_id.

Note: Only users who have at least 1 streak should be included in the output.`,
    schema: [
      {
        name: "rating_table",
        columns: [
          { name: "trip_time", type: "timestamp" },
          { name: "driver_id", type: "varchar(10)" },
          { name: "trip_id", type: "int" },
          { name: "rating", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS rating_table;

CREATE TABLE rating_table (
  trip_time TIMESTAMP,
  driver_id VARCHAR(10),
  trip_id INT PRIMARY KEY,
  rating INT
);

INSERT INTO rating_table VALUES
('2024-01-01 09:00:00', 'D1', 1, 5),
('2024-01-01 10:00:00', 'D1', 2, 4),
('2024-01-01 11:00:00', 'D1', 3, 4),
('2024-01-01 12:00:00', 'D1', 4, 3),
('2024-01-01 13:00:00', 'D1', 5, 5),
('2024-01-01 14:00:00', 'D1', 6, 4),
('2024-01-01 09:00:00', 'D2', 7, 4),
('2024-01-01 10:00:00', 'D2', 8, 4),
('2024-01-01 11:00:00', 'D2', 9, 4),
('2024-01-01 12:00:00', 'D2', 10, 4),
('2024-01-01 13:00:00', 'D2', 11, 4),
('2024-01-01 09:00:00', 'D3', 12, 3),
('2024-01-01 10:00:00', 'D3', 13, 2),
('2024-01-01 11:00:00', 'D3', 14, 3);`,
    systemSolution: `WITH RankedRatings AS (
  SELECT 
    driver_id, 
    trip_id,
    trip_time,
    rating,
    trip_id - ROW_NUMBER() OVER (PARTITION BY driver_id ORDER BY trip_time) AS streak_group
  FROM rating_table
  WHERE rating >= 4
),
StreakLengths AS (
  SELECT 
    driver_id, 
    streak_group,
    COUNT(*) - 1 AS streak_length
  FROM RankedRatings
  GROUP BY driver_id, streak_group
),
MaxStreaks AS (
  SELECT 
    driver_id, 
    MAX(streak_length) AS max_streak
  FROM StreakLengths
  GROUP BY driver_id
)
SELECT driver_id, max_streak
FROM MaxStreaks
WHERE max_streak > 0
ORDER BY max_streak DESC, driver_id DESC;`,
    starterCode: `-- Cab Driver Streak Analysis
-- Find maximum streak of positive ratings (4+) per driver
-- Streak of N consecutive good ratings = streak length N-1
SELECT 
  driver_id,
  rating
  -- Calculate max_streak
FROM rating_table
WHERE rating >= 4
ORDER BY max_streak DESC, driver_id DESC;`,
    businessImpact: `Driver streak analysis helps ride-sharing companies maintain service quality:
• Identify top-performing drivers for rewards and recognition programs
• Detect drivers with inconsistent performance for coaching
• Gamification: Streaks motivate drivers to maintain quality
• Correlate streaks with customer retention and repeat bookings
• Inform bonus structures tied to sustained performance`,
    optimizationTips: [
      "Use gaps-and-islands technique: difference between ROW_NUMBER values",
      "Filter early (rating >= 4) to reduce data volume before grouping",
      "Index on (driver_id, trip_time) for partition/order operations"
    ],
    edgeCases: [
      "Driver with all ratings below 4 - excluded from output",
      "Single positive rating (streak = 0) - excluded per problem statement",
      "All ratings positive (one long streak) - streak = total trips - 1",
      "Alternating 4,3,4,3 - max streak = 0 (no consecutives)",
      "Same trip_time for different trips - need tiebreaker (trip_id)"
    ]
  },
  {
    id: 121,
    title: "Amazon Warehouse Packing",
    difficulty: "Extreme Hard",
    category: "Analytics",
    points: 75,
    problem: `During a warehouse packaging process, items of various weights (1 kg to 5 kg) need to be packed sequentially into boxes. Each box can hold a maximum of 5 kg in total. The items are presented in a table according to their arrival order, and the goal is to pack them into boxes, keeping the order (based on id) while ensuring each box's total weight does not exceed 5 kg.

Requirements:
1. Pack items into boxes in their given order based on id.
2. Each box should not exceed 5 kg in total weight.
3. Once a box reaches the 5 kg limit or would exceed it by adding the next item, start packing into a new box.
4. Assign a box number to each item based on its position in the sequence, so that items within each box do not exceed the 5 kg limit.

Example:
Given the items with weights [1, 3, 5, 3, 2], we need to pack them into boxes as follows:
• Box 1: Items with weights [1, 3] — Total weight = 4 kg
• Box 2: Item with weight [5] — Total weight = 5 kg
• Box 3: Items with weights [3, 2] — Total weight = 5 kg

The result should display each item, weight and its assigned box number starting from 1.`,
    schema: [
      {
        name: "items",
        columns: [
          { name: "id", type: "int" },
          { name: "weight", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS items;

CREATE TABLE items (
  id INT PRIMARY KEY,
  weight INT
);

INSERT INTO items VALUES
(1, 1),
(2, 3),
(3, 5),
(4, 3),
(5, 2),
(6, 2),
(7, 2),
(8, 4),
(9, 1);`,
    systemSolution: `WITH RECURSIVE cte AS (
  SELECT id, weight, weight AS running_sum, 1 AS box_number 
  FROM items
  WHERE id = 1
  
  UNION ALL
  
  SELECT 
    b.id, 
    b.weight,
    CASE WHEN cte.running_sum + b.weight <= 5 
      THEN cte.running_sum + b.weight 
      ELSE b.weight 
    END AS running_sum,
    CASE WHEN cte.running_sum + b.weight <= 5 
      THEN cte.box_number 
      ELSE cte.box_number + 1 
    END AS box_number
  FROM items b
  INNER JOIN cte ON b.id = cte.id + 1
)
SELECT id, weight, box_number FROM cte;`,
    starterCode: `-- Amazon Warehouse Packing
-- Assign items to boxes (max 5kg per box) in order
SELECT 
  id,
  weight
  -- Add box_number column
FROM items
ORDER BY id;`,
    businessImpact: `Optimal bin packing directly impacts warehouse efficiency and shipping costs:
• Reduces number of boxes used, saving packaging costs
• Minimizes shipping costs (fewer packages = lower fees)
• Improves loading efficiency for delivery trucks
• Reduces environmental impact (less packaging waste)
• Critical for Amazon's promise of fast, efficient delivery`,
    optimizationTips: [
      "Recursive CTE is necessary due to sequential dependency",
      "Cannot parallelize - each row depends on previous row's state",
      "For very large datasets, consider procedural approach (cursor/loop)"
    ],
    edgeCases: [
      "Item with weight exactly 5kg - fills box alone",
      "All items weight 1kg - maximum items per box (5)",
      "Sequence of 5kg items - each in separate box",
      "Empty table - no results",
      "Single item - box_number = 1 regardless of weight"
    ]
  },
  {
    id: 129,
    title: "Uber Active Drivers",
    difficulty: "Extreme Hard",
    category: "Analytics",
    points: 75,
    problem: `We have a driver table which has driver id and join date for each Uber driver. We have another table rides where we have ride id, ride date and driver id. A driver becomes inactive if he doesn't have any ride for consecutive 28 days after joining the company. Driver can become active again once he takes a new ride. We need to find number of active drivers for Uber at the end of each month for year 2023.

For example if a driver joins Uber on Jan 15th and takes his first ride on March 15th. He will be considered active for Jan month end, Not active for Feb month end but active for March month end.`,
    schema: [
      {
        name: "drivers",
        columns: [
          { name: "driver_id", type: "int" },
          { name: "join_date", type: "date" }
        ]
      },
      {
        name: "rides",
        columns: [
          { name: "ride_id", type: "int" },
          { name: "ride_date", type: "date" },
          { name: "driver_id", type: "int" }
        ]
      },
      {
        name: "calendar_dim",
        columns: [
          { name: "cal_date", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS calendar_dim;

CREATE TABLE drivers (
  driver_id INT PRIMARY KEY,
  join_date DATE
);

CREATE TABLE rides (
  ride_id INT PRIMARY KEY,
  ride_date DATE,
  driver_id INT
);

CREATE TABLE calendar_dim (
  cal_date DATE PRIMARY KEY
);

INSERT INTO drivers VALUES
(1, '2023-01-15'),
(2, '2023-01-20'),
(3, '2023-02-10'),
(4, '2023-03-01');

INSERT INTO rides VALUES
(101, '2023-01-20', 1),
(102, '2023-02-15', 1),
(103, '2023-03-10', 1),
(104, '2023-01-25', 2),
(105, '2023-04-01', 2),
(106, '2023-02-15', 3),
(107, '2023-03-15', 3);

INSERT INTO calendar_dim 
SELECT generate_series('2023-01-01'::date, '2023-12-31'::date, '1 day'::interval)::date;`,
    systemSolution: `WITH cal AS (
  SELECT 
    EXTRACT(MONTH FROM cal_date) AS cal_month, 
    MAX(cal_date) AS month_end_date
  FROM calendar_dim
  GROUP BY EXTRACT(MONTH FROM cal_date)
),
join_ride AS (
  SELECT driver_id, join_date AS join_ride_date FROM drivers
  UNION 
  SELECT driver_id, ride_date FROM rides
),
days_since_last_ride_monthend AS (
  SELECT 
    cal.month_end_date, 
    jr.driver_id, 
    MAX(jr.join_ride_date) AS latest_ride,
    cal.month_end_date - MAX(jr.join_ride_date) AS days_since_last_ride
  FROM cal
  LEFT JOIN join_ride jr ON cal.month_end_date >= jr.join_ride_date
  GROUP BY cal.month_end_date, jr.driver_id
)
SELECT 
  month_end_date, 
  SUM(CASE WHEN days_since_last_ride <= 28 THEN 1 ELSE 0 END) AS no_of_active_drivers
FROM days_since_last_ride_monthend
GROUP BY month_end_date
ORDER BY month_end_date;`,
    starterCode: `-- Uber Active Drivers
-- Driver is active if they had a ride within last 28 days
-- Find active driver count at end of each month in 2023
SELECT 
  -- month_end_date,
  -- no_of_active_drivers
FROM drivers d
LEFT JOIN rides r ON d.driver_id = r.driver_id
ORDER BY month_end_date;`,
    businessImpact: `Active driver tracking is crucial for ride-sharing platform operations:
• Ensures sufficient driver supply to meet rider demand
• Identifies re-engagement opportunities for churning drivers
• Informs driver incentive programs and bonuses
• Supports market expansion planning (driver density by region)
• Key metric for investor reporting and platform health`,
    optimizationTips: [
      "Pre-build calendar dimension table instead of generating on-the-fly",
      "Union join_date and ride_dates to simplify 'last activity' calculation",
      "Partition data by year if querying specific periods"
    ],
    edgeCases: [
      "Driver joins on month-end date - active for that month",
      "Driver joins after month-end - not counted for that month",
      "Driver with no rides ever - only join_date counts for activity",
      "Exactly 28 days since last activity - still active (<=28)",
      "Driver joins in future year - not in 2023 results"
    ]
  },
  {
    id: 144,
    title: "Key Out-of-Stock Events",
    difficulty: "Extreme Hard",
    category: "Analytics",
    points: 75,
    problem: `You are working with a large dataset of out-of-stock (OOS) events for products across multiple marketplaces. Each record in the dataset represents an OOS event for a specific product (MASTER_ID) in a specific marketplace (MARKETPLACE_ID) on a specific date (OOS_DATE). The combination of (MASTER_ID, MARKETPLACE_ID, OOS_DATE) is always unique. Your task is to identify key OOS event dates for each product and marketplace combination.

Steps to identify key OOS events:
1. Identify the earliest OOS event for each (MASTER_ID, MARKETPLACE_ID).
2. Recursively find the next OOS event that occurs at least 7 days after the previous event.
3. Continue this process until no more OOS events meet the condition.

Order the result by MASTER_ID, MARKETPLACE_ID, OOS_DATE.`,
    schema: [
      {
        name: "detailed_oos_events",
        columns: [
          { name: "master_id", type: "varchar(20)" },
          { name: "marketplace_id", type: "int" },
          { name: "oos_date", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS detailed_oos_events;

CREATE TABLE detailed_oos_events (
  master_id VARCHAR(20),
  marketplace_id INT,
  oos_date DATE,
  PRIMARY KEY (master_id, marketplace_id, oos_date)
);

INSERT INTO detailed_oos_events VALUES
('PROD1', 1, '2024-01-01'),
('PROD1', 1, '2024-01-03'),
('PROD1', 1, '2024-01-08'),
('PROD1', 1, '2024-01-10'),
('PROD1', 1, '2024-01-15'),
('PROD1', 1, '2024-01-25'),
('PROD1', 2, '2024-01-05'),
('PROD1', 2, '2024-01-12'),
('PROD1', 2, '2024-01-20'),
('PROD2', 1, '2024-01-02'),
('PROD2', 1, '2024-01-04'),
('PROD2', 1, '2024-01-11');`,
    systemSolution: `WITH RECURSIVE ranked_data AS (
  SELECT 
    master_id,
    marketplace_id,
    oos_date,
    ROW_NUMBER() OVER (PARTITION BY master_id, marketplace_id ORDER BY oos_date) AS event_id
  FROM detailed_oos_events
),
oos_events AS (
  SELECT 
    master_id,
    marketplace_id,
    oos_date,
    event_id,
    1 AS valid_flag
  FROM ranked_data
  WHERE event_id = 1

  UNION ALL

  SELECT 
    e.master_id,
    e.marketplace_id,
    CASE 
      WHEN e.oos_date >= o.oos_date + INTERVAL '7 days' THEN e.oos_date
      ELSE o.oos_date
    END AS oos_date,
    e.event_id,
    CASE 
      WHEN e.oos_date >= o.oos_date + INTERVAL '7 days' THEN 1
      ELSE 0
    END AS valid_flag
  FROM ranked_data e
  INNER JOIN oos_events o
    ON e.master_id = o.master_id
    AND e.marketplace_id = o.marketplace_id
    AND e.event_id = o.event_id + 1
)
SELECT master_id, marketplace_id, oos_date
FROM oos_events
WHERE valid_flag = 1
ORDER BY master_id, marketplace_id, oos_date;`,
    starterCode: `-- Key Out-of-Stock Events
-- Find OOS events at least 7 days apart per product/marketplace
SELECT 
  master_id,
  marketplace_id,
  oos_date
FROM detailed_oos_events
ORDER BY master_id, marketplace_id, oos_date;`,
    businessImpact: `Identifying key OOS events helps e-commerce companies optimize inventory:
• Distinguishes chronic stockout issues from temporary blips
• Focuses attention on significant supply chain failures
• Reduces alert fatigue by filtering noise from daily OOS data
• Enables root cause analysis of recurring stockout patterns
• Informs safety stock calculations and reorder points`,
    optimizationTips: [
      "Recursive CTE needed due to sequential 7-day gap dependency",
      "Use row numbering to enable recursive iteration through events",
      "Consider materialized view for frequently-queried date ranges"
    ],
    edgeCases: [
      "Only one OOS event for product/marketplace - it's a key event",
      "All events within 7 days of each other - only first is key",
      "Exactly 7 days apart - should be included (>= 7 days)",
      "Large gap (e.g., 100 days) between events - both are key events",
      "Same product, different marketplaces - tracked independently"
    ]
  }
];

// Convert to app shape (Question with solutions[] and edgeCases: EdgeCase[])
export const questions: Question[] = sqlQuestionsData.map((q) => ({
  id: q.id,
  title: q.title,
  difficulty: q.difficulty,
  category: q.category,
  problem: q.problem,
  schema: q.schema,
  solutions: [{ title: "Solution", code: q.systemSolution, description: "" }],
  businessImpact: q.businessImpact,
  optimizationTips: q.optimizationTips,
  edgeCases: q.edgeCases.map((text) => ({ text, checked: false })),
  starterCode: q.starterCode,
}));

export const categories = [
  "All Patterns",
  "Analytics",
  "Window Functions",
  "Recursive CTEs"
] as const;

export const difficulties = [
  "All",
  "Easy",
  "Medium", 
  "Hard",
  "Extreme Hard"
] as const;

export function getQuestionById(id: number): SQLQuestion | undefined {
  return sqlQuestionsData.find(q => q.id === id);
}

export function getQuestionsByCategory(category: string): SQLQuestion[] {
  if (category === "All Patterns") return sqlQuestionsData;
  return sqlQuestionsData.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: string): SQLQuestion[] {
  if (difficulty === "All") return sqlQuestionsData;
  return sqlQuestionsData.filter(q => q.difficulty === difficulty);
}

export function filterQuestions(category: string, difficulty: string): SQLQuestion[] {
  return sqlQuestionsData.filter(q => {
    const matchCategory = category === "All Patterns" || q.category === category;
    const matchDifficulty = difficulty === "All" || q.difficulty === difficulty;
    return matchCategory && matchDifficulty;
  });
}
