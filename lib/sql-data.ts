// lib/sql-data.ts
// SQL Practice Questions - 75 Questions
// Easy: 2, Medium: 24, Hard: 41, Extreme Hard: 8
// Each question has: mySolution (your code or null) + systemSolution (reference)

export interface SQLQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme Hard';
  category: string;
  points: number;
  problem: string;
  schema: SchemaTable[];
  sampleData: string;
  mySolution: string | null;
  systemSolution: string;
  expectedOutput?: string;
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
  mySolution: string | null;
  solutions: Solution[];
  businessImpact: string;
  optimizationTips: string[];
  edgeCases: EdgeCase[];
  expectedOutput?: string;
  starterCode: string;
}

const sqlQuestionsData: SQLQuestion[] = [
  // ============================================
  // Easy (2) + Medium (24) + Hard (41) = 67 Questions
  // ============================================
  {
    id: 1,
    title: "Product Reviews",
    difficulty: "Easy",
    category: "Analytics",
    points: 15,
    problem: `Suppose you are a data analyst working for a retail company, and your team is interested in analysing customer feedback to identify trends and patterns in product reviews.

Your task is to write an SQL query to find all product reviews containing the word "excellent" or "amazing" in the review text. However, you want to exclude reviews that contain the word "not" immediately before "excellent" or "amazing". Please note that the words can be in upper or lower case or combination of both. 

Your query should return the review_id,product_id, and review_text for each review meeting the criteria, display the output in ascending order of review_id.`,
    schema: [
      {
        name: "product_reviews",
        columns: [
          { name: "review_id", type: "int" },
          { name: "product_id", type: "int" },
          { name: "review_text", type: "varchar(40)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS product_reviews;

CREATE TABLE product_reviews (
  review_id INT,
  product_id INT,
  review_text VARCHAR(40)
);

INSERT INTO product_reviews VALUES
(1, 101, 'This product is excellent quality'),
(2, 102, 'Not excellent but decent product'),
(3, 103, 'Absolutely amazing experience'),
(4, 104, 'The service was not amazing at all'),
(5, 105, 'Really excellent value for money'),
(6, 106, 'Average product nothing special'),
(7, 107, 'AMAZING product highly recommend'),
(8, 108, 'It was Excellent in every way');
`,
    mySolution: `select  
from product_reviews 
where (lower(review_text) like '% excellent%' or lower(review_text) like '% amazing%')
and  lower(review_text) not like '%not excellent%'
and lower(review_text) not like '%not amazing%'`,
    systemSolution: `SELECT review_id, product_id, review_text
FROM product_reviews
WHERE (LOWER(review_text) LIKE '% excellent%' OR LOWER(review_text) LIKE '% amazing%')
  AND LOWER(review_text) NOT LIKE '%not excellent%'
  AND LOWER(review_text) NOT LIKE '%not amazing%'
ORDER BY review_id ASC;`,
    starterCode: `-- Product Reviews
-- Write your solution here
SELECT *
FROM product_reviews;`,
    businessImpact: `Sentiment analysis on product reviews helps identify top-performing products, detect quality issues early, and guide marketing strategies. Filtering out negated sentiments (like "not excellent") prevents false positives that could skew customer satisfaction metrics.`,
    optimizationTips: [
      "Create a full-text search index on review_text for faster LIKE pattern matching",
      "Use LOWER() once with a subquery rather than multiple times per row",
      "Consider PostgreSQL's ILIKE operator for case-insensitive matching without LOWER()",
      "Index on review_id for efficient ORDER BY"
    ],
    edgeCases: [
      "Review text starts with 'excellent' (no space before) — not matched by '% excellent%'",
      "Mixed case like 'NOT Excellent' — LOWER() handles this correctly",
      "Review containing both 'not excellent' and 'amazing' — should be excluded",
      "Empty review_text or NULL values",
      "Review with 'not amazing but excellent' — should be excluded due to 'not amazing'"
    ],
    expectedOutput: `+-----------+------------+------------------------------------------+
| review_id | product_id | review_text                              |
+-----------+------------+------------------------------------------+
| 1         | 101        | The product is amazing!                  |
| 3         | 103        | Excellent value for money.               |
+-----------+------------+------------------------------------------+`
  },

  {
    id: 2,
    title: "Domain Names",
    difficulty: "Easy",
    category: "Analytics",
    points: 15,
    problem: `Write an SQL query to extract the domain names from email addresses stored in the Customers table.
Tables: Customers
+-------------+-------------+
| COLUMN_NAME | DATA_TYPE   |
+-------------+-------------+
| CustomerID  | int         |
| Email       | varchar(25) |
+-------------+-------------+`,
    schema: [
      {
        name: "customers",
        columns: [
          { name: "CustomerID", type: "int" },
          { name: "Email", type: "varchar(25)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  CustomerID INT,
  Email VARCHAR(25)
);

INSERT INTO customers VALUES
(1, 'alice@gmail.com'),
(2, 'bob@yahoo.com'),
(3, 'carol@outlook.com'),
(4, 'dave@gmail.com'),
(5, 'eve@company.org'),
(6, 'frank@yahoo.com');
`,
    mySolution: `SELECT email,
SUBSTRING(Email FROM POSITION('@' IN Email) + 1) AS domain_name
FROM customers;`,
    systemSolution: `SELECT
    Email,
    SUBSTRING(Email FROM POSITION('@' IN Email) + 1) AS domain_name
FROM customers;`,
    starterCode: `-- Domain Names
-- Write your solution here
SELECT 1;`,
    businessImpact: `Email domain analysis helps segment customers by email provider (Gmail, Yahoo, corporate domains), enabling targeted communication strategies, identifying B2B vs B2C customers, and detecting suspicious sign-up patterns from disposable email domains.`,
    optimizationTips: [
      "Use PostgreSQL's SPLIT_PART(Email, '@', 2) as a simpler alternative to SUBSTRING + POSITION",
      "Create a computed/generated column for domain if queried frequently",
      "Index the domain column for GROUP BY aggregations"
    ],
    edgeCases: [
      "Email with multiple @ symbols — POSITION returns first occurrence",
      "NULL or empty email values",
      "Email with no domain part (malformed data)",
      "Case sensitivity: 'Gmail.com' vs 'gmail.com'"
    ],
    expectedOutput: `+-------------------+-----------------+
| email             | domain_name     |
+-------------------+-----------------+
| alice@gmail.com   | gmail.com       |
| bob@yahoo.com     | yahoo.com       |
| carol@outlook.com | outlook.com     |
| dave@gmail.com    | gmail.com       |
| eve@company.org   | company.org     |
| frank@yahoo.com   | yahoo.com       |
+-------------------+-----------------+`
  },

  {
    id: 3,
    title: "Dynamic Pricing",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You are given a products table where a new row is inserted every time the price of a product changes. Additionally, there is a transaction table containing details such as order_date and product_id for each order.

Write an SQL query to calculate the total sales value for each product, considering the cost of the product at the time of the order date, display the output in ascending order of the product_id.`,
    schema: [
      {
        name: "products",
        columns: [
          { name: "product_id", type: "int" },
          { name: "price", type: "int" },
          { name: "price_date", type: "date" }
        ]
      },
      {
        name: "orders",
        columns: [
          { name: "order_id", type: "int" },
          { name: "order_date", type: "date" },
          { name: "product_id", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;

CREATE TABLE products (
  product_id INT,
  price INT,
  price_date DATE
);

CREATE TABLE orders (
  order_id INT,
  order_date DATE,
  product_id INT
);

INSERT INTO products VALUES
(1, 100, '2024-01-01'),
(1, 120, '2024-03-01'),
(1, 110, '2024-06-01'),
(2, 50, '2024-01-01'),
(2, 60, '2024-04-01');

INSERT INTO orders VALUES
(1, '2024-01-15', 1),
(2, '2024-02-20', 1),
(3, '2024-03-15', 1),
(4, '2024-04-10', 1),
(5, '2024-06-05', 1),
(6, '2024-01-10', 2),
(7, '2024-03-20', 2),
(8, '2024-04-05', 2);
`,
    mySolution: `WITH price_range AS (
    SELECT *,
           COALESCE(LEAD(price_date) OVER (PARTITION BY product_id ORDER BY price_date) - INTERVAL '1 day', '9999-12-31') AS price_end_date
    FROM products
)
SELECT p.product_id,
       SUM(p.price) AS total_sales
FROM orders o
INNER JOIN price_range p ON o.product_id = p.product_id
    AND o.order_date BETWEEN p.price_date AND p.price_end_date
GROUP BY p.product_id
ORDER BY p.product_id ASC;`,
    systemSolution: `WITH price_range AS (
    SELECT *,
           COALESCE(LEAD(price_date) OVER (PARTITION BY product_id ORDER BY price_date) - INTERVAL '1 day', '9999-12-31') AS price_end_date
    FROM products
)
SELECT p.product_id,
       SUM(p.price) AS total_sales
FROM orders o
INNER JOIN price_range p ON o.product_id = p.product_id
    AND o.order_date BETWEEN p.price_date AND p.price_end_date
GROUP BY p.product_id
ORDER BY p.product_id ASC;`,
    starterCode: `-- Dynamic Pricing
-- Write your solution here
SELECT *
FROM products;`,
    businessImpact: `Dynamic pricing analysis helps e-commerce platforms optimize revenue by tracking how price changes affect order volume. Understanding total sales at time-of-purchase prices enables accurate revenue recognition and helps pricing teams measure the ROI of price adjustments.`,
    optimizationTips: [
      "Index products on (product_id, price_date) for efficient LEAD window function",
      "Use BETWEEN with computed date ranges instead of correlated subqueries",
      "Consider materialized views for price range lookups in high-volume systems",
      "COALESCE with far-future date handles the last price period elegantly"
    ],
    edgeCases: [
      "Product with only one price entry — no LEAD value, needs default end date",
      "Order on exact price_date boundary — should use the new price",
      "Multiple price changes on the same day for a product",
      "Order date before any price was set for that product",
      "Product with no orders at all"
    ],
    expectedOutput: `+------------+-------------+
| product_id | total_sales |
+------------+-------------+
| 1          | 550         |
| 2          | 160         |
+------------+-------------+`
  },

  {
    id: 4,
    title: "Highly Paid Employees",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You are given the data of employees along with their salary and department. Write an SQL to find list of employees who have salary greater than average employee salary of the company.  However, while calculating the company average salary to compare with an employee salary do not consider salaries of that employee's department, display the output in ascending order of employee ids.`,
    schema: [
      {
        name: "employee",
        columns: [
          { name: "emp_id", type: "int" },
          { name: "salary", type: "int" },
          { name: "department", type: "varchar(15)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS employee;

CREATE TABLE employee (
  emp_id INT,
  salary INT,
  department VARCHAR(15)
);

INSERT INTO employee VALUES
(1, 80000, 'Engineering'),
(2, 90000, 'Engineering'),
(3, 60000, 'Engineering'),
(4, 70000, 'Marketing'),
(5, 50000, 'Marketing'),
(6, 95000, 'Sales'),
(7, 45000, 'Sales'),
(8, 75000, 'Sales');
`,
    mySolution: `WITH cte AS (SELECT *,
SUM(salary) OVER(PARTITION BY department) - salary AS total_sal
FROM employee)
,cte1 as (SELECT department,emp_id,salary,
total_sal/(count(emp_id) over(partition by department)-1) as avg
FROM cte
)
Select emp_id,salary,department
from cte1
where salary > avg
order by emp_id`,
    systemSolution: `SELECT * FROM
employee e1
where salary > (select avg(e2.salary) 
from employee e2 
where e1.department != e2.department
)
ORDER BY emp_id ;`,
    starterCode: `-- Highly Paid Employees
-- Write your solution here
SELECT *
FROM employee;`,
    businessImpact: `Identifying employees earning above the cross-department average helps HR detect salary inequities, justify compensation adjustments, and ensure competitive pay across departments without bias from within-department grouping.`,
    optimizationTips: [
      "Correlated subquery recalculates for each row — consider CTE with pre-computed averages per department exclusion",
      "Index on department column speeds up the exclusion filter in the subquery",
      "Window functions (SUM/COUNT with partition exclusion) can replace the correlated subquery"
    ],
    edgeCases: [
      "Department with only one employee — excluding it changes the average significantly",
      "Employee in a department of one — their entire department is excluded from the average",
      "All employees in the same department — no other departments to average",
      "NULL salary values",
      "Tied salary exactly equal to the average — should not be included (strictly greater)"
    ],
    expectedOutput: `+--------+--------+-------------+
| emp_id | salary | department  |
+--------+--------+-------------+
| 1      | 80000  | Engineering |
| 2      | 90000  | Engineering |
| 4      | 70000  | Marketing   |
| 6      | 95000  | Sales       |
| 8      | 75000  | Sales       |
+--------+--------+-------------+`
  },

  {
    id: 5,
    title: "Excess/insufficient Inventory",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `Suppose you are a data analyst working for Flipkart. Your task is to identify excess and insufficient inventory at various Flipkart warehouses in terms of no of units and cost.  Excess inventory is when inventory levels are greater than inventory targets else its insufficient inventory.

Write an SQL to derive excess/insufficient Inventory volume and value in cost for each location as well as at overall company level, display the results in ascending order of location id.`,
    schema: [
      {
        name: "inventory",
        columns: [
          { name: "inventory_level", type: "int" },
          { name: "inventory_target", type: "int" },
          { name: "location_id", type: "int" },
          { name: "product_id", type: "int" }
        ]
      },
      {
        name: "products",
        columns: [
          { name: "product_id", type: "int" },
          { name: "unit_cost", type: "decimal(5,2)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS products;

CREATE TABLE inventory (
  inventory_level INT,
  inventory_target INT,
  location_id INT,
  product_id INT
);

CREATE TABLE products (
  product_id INT,
  unit_cost DECIMAL(5,2)
);

INSERT INTO inventory VALUES
(100, 80, 1, 101),
(50, 70, 1, 102),
(200, 150, 2, 101),
(90, 100, 2, 103),
(60, 60, 3, 102),
(120, 100, 3, 103);

INSERT INTO products VALUES
(101, 25.00),
(102, 15.50),
(103, 40.00);
`,
    mySolution: `with cte as(select i.location_id,
sum(inventory_level-inventory_target) as  excess_qty,
sum(p.unit_cost(inventory_level-inventory_target)) as
excess_value
from inventory i
inner join products p
on i.product_id=p.product_id
group by location_id )
select 
from cte
union all
select 'Overall' as location_id 
, sum(excess_qty) as excess_insufficient_qty
, sum(excess_value) as excess_insufficient_value
from cte
ORDER BY location_id;`,
    systemSolution: `WITH cte AS (
SELECT i.location_id AS location_id,
  SUM(inventory_level - inventory_target) AS excess_insufficient_qty,
  SUM((inventory_level - inventory_target) * p.unit_cost) AS excess_insufficient_value
FROM inventory i
INNER JOIN products p ON i.product_id = p.product_id
GROUP BY i.location_id
)
SELECT CAST(location_id AS VARCHAR) AS location_id, excess_insufficient_qty, excess_insufficient_value
FROM cte
UNION ALL
SELECT 'Overall' AS location_id,
  SUM(excess_insufficient_qty) AS excess_insufficient_qty,
  SUM(excess_insufficient_value) AS excess_insufficient_value
FROM cte
ORDER BY location_id;`,
    starterCode: `-- Excess/insufficient Inventory
-- Write your solution here
SELECT *
FROM inventory;`,
    businessImpact: `Inventory excess/shortage analysis at warehouse level directly impacts working capital management, storage costs, and fulfillment rates. Identifying overstocked locations enables redistribution, while understocked locations signal urgent replenishment needs.`,
    optimizationTips: [
      "Pre-aggregate inventory differences before joining with products for better performance",
      "Use GROUPING SETS or ROLLUP instead of UNION ALL for the overall row",
      "Index on product_id in both tables for efficient JOIN",
      "CAST to VARCHAR for UNION compatibility between INT and string 'Overall'"
    ],
    edgeCases: [
      "Inventory exactly at target (zero difference) — neither excess nor insufficient",
      "Location with only one product",
      "Product in inventory but not in products table (missing unit_cost)",
      "Negative inventory levels (data quality issue)",
      "UNION ALL ordering: 'Overall' sorts alphabetically vs numeric location_ids"
    ],
    expectedOutput: `+-------------+-------------------------+---------------------------+
| location_id | excess_insufficient_qty | excess_insufficient_value |
+-------------+-------------------------+---------------------------+
| 1           | 0                       | 190.00                    |
| 2           | 40                      | 850.00                    |
| 3           | 20                      | 800.00                    |
| Overall     | 60                      | 1840.00                   |
+-------------+-------------------------+---------------------------+`
  },

  {
    id: 6,
    title: "Zomato Membership",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `Zomato is planning to offer a premium membership to customers who have placed multiple orders in a single day.
Your task is to write a SQL to find those customers who have placed multiple orders in a single day at least once , total order value generate by those customers and order value generated only by those orders, display the results in ascending order of total order value.`,
    schema: [
      {
        name: "orders",
        columns: [
          { name: "order_id", type: "int" },
          { name: "customer_name", type: "varchar(20)" },
          { name: "order_date", type: "timestamp" },
          { name: "order_value", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  order_id INT,
  customer_name VARCHAR(20),
  order_date TIMESTAMP,
  order_value INT
);

INSERT INTO orders VALUES
(1, 'Alice', '2024-01-15 10:00:00', 500),
(2, 'Alice', '2024-01-15 14:00:00', 300),
(3, 'Alice', '2024-01-20 11:00:00', 450),
(4, 'Bob', '2024-01-15 09:00:00', 600),
(5, 'Bob', '2024-01-15 18:00:00', 200),
(6, 'Bob', '2024-01-16 10:00:00', 350),
(7, 'Carol', '2024-01-17 12:00:00', 700),
(8, 'Carol', '2024-01-18 15:00:00', 400),
(9, 'Dave', '2024-01-19 10:00:00', 250),
(10, 'Dave', '2024-01-19 16:00:00', 150),
(11, 'Dave', '2024-01-19 20:00:00', 100);
`,
    mySolution: `SELECT customer_name, CAST(order_date AS DATE),
COUNT(*) AS no_of_order
FROM orders
GROUP BY customer_name, CAST(order_date AS DATE)
HAVING COUNT(*) > 1`,
    systemSolution: `WITH cte AS (
SELECT customer_name, CAST(order_date AS DATE) AS order_day,
  COUNT(*) AS no_of_orders
FROM orders
GROUP BY customer_name, CAST(order_date AS DATE)
HAVING COUNT(*) > 1
)
SELECT orders.customer_name,
  SUM(orders.order_value) AS total_order_value,
  SUM(CASE WHEN cte.customer_name IS NOT NULL THEN orders.order_value END) AS order_value
FROM orders
LEFT JOIN cte ON orders.customer_name = cte.customer_name
  AND CAST(orders.order_date AS DATE) = cte.order_day
WHERE orders.customer_name IN (SELECT DISTINCT customer_name FROM cte)
GROUP BY orders.customer_name
ORDER BY total_order_value;`,
    starterCode: `-- Zomato Membership
-- Write your solution here
SELECT *
FROM orders;`,
    businessImpact: `Identifying high-frequency ordering customers helps food delivery platforms target premium membership offers effectively. Understanding same-day multi-order behavior reveals power users who drive disproportionate revenue and are ideal candidates for loyalty programs.`,
    optimizationTips: [
      "Index on (customer_name, order_date) for efficient GROUP BY",
      "CAST to DATE strips time component for day-level grouping",
      "Use EXISTS instead of IN for the subquery filter for better performance with large datasets",
      "Consider using FILTER clause instead of CASE WHEN for conditional aggregation in PostgreSQL"
    ],
    edgeCases: [
      "Customer with orders spanning midnight \u2014 same calendar day vs different",
      "Customer with exactly one order per day \u2014 never qualifies for membership",
      "Customer with 3+ orders on one day but only 1 on others",
      "NULL order_value \u2014 affects SUM calculations",
      "Same customer_name, different customers (name collision)"
    ],
    expectedOutput: `+---------------+-------------------+-------------+
| customer_name | total_order_value | order_value |
+---------------+-------------------+-------------+
| Dave          | 500               | 500         |
| Bob           | 1150              | 800         |
| Alice         | 1250              | 800         |
+---------------+-------------------+-------------+`
  },

  {
    id: 7,
    title: "Employees Inside Office (Part 1)",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `A company record its employee's movement In and Out of office in a table. Please note below points about the data:
First entry for each employee is “in”
Every “in” is succeeded by an “out”
Employee can work across days
Write a SQL to find the number of employees inside the Office at “2019-04-01 19:05:00".`,
    schema: [
      {
        name: "employee_record",
        columns: [
          { name: "emp_id", type: "int" },
          { name: "action", type: "varchar(3)" },
          { name: "created_at", type: "datetime" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS employee_record;

CREATE TABLE employee_record (
  emp_id INT,
  action VARCHAR(3),
  created_at TIMESTAMP
);

INSERT INTO employee_record VALUES
(1, 'in', '2019-04-01 08:00:00'),
(1, 'out', '2019-04-01 17:00:00'),
(2, 'in', '2019-04-01 09:00:00'),
(2, 'out', '2019-04-01 18:30:00'),
(3, 'in', '2019-04-01 10:00:00'),
(3, 'out', '2019-04-01 15:00:00'),
(3, 'in', '2019-04-01 16:00:00'),
(3, 'out', '2019-04-01 20:00:00'),
(4, 'in', '2019-03-31 22:00:00'),
(4, 'out', '2019-04-01 06:00:00'),
(5, 'in', '2019-04-01 18:00:00'),
(5, 'out', '2019-04-01 23:00:00');
`,
    mySolution: `WITH LatestStatus AS (
    SELECT emp_id, action, created_at,
        ROW_NUMBER() OVER(PARTITION BY emp_id ORDER BY created_at DESC) AS rn
    FROM employee_record
    WHERE created_at <= '2019-04-01 19:05:00'
)
SELECT COUNT(*) AS no_of_emp_inside
FROM LatestStatus
WHERE rn = 1 AND action = 'in'`,
    systemSolution: `WITH cte AS (
SELECT *,
  LEAD(created_at) OVER(PARTITION BY emp_id ORDER BY created_at) AS next_created_at
FROM employee_record
)
SELECT COUNT(*) AS no_of_emp_inside
FROM cte
WHERE action = 'in'
  AND '2019-04-01 19:05:00' BETWEEN created_at AND next_created_at;`,
    starterCode: `-- Employees Inside Office (Part 1)
-- Write your solution here
SELECT *
FROM employee_record;`,
    businessImpact: `Real-time office occupancy tracking helps facility management optimize HVAC/lighting, ensure fire safety compliance with headcount limits, and provide data for hybrid work policies by understanding peak office usage times.`,
    optimizationTips: [
      "LEAD window function pairs each 'in' with its next 'out' efficiently",
      "Index on (emp_id, created_at) for optimal PARTITION BY + ORDER BY",
      "ROW_NUMBER approach filters early with WHERE, reducing window computation",
      "BETWEEN is inclusive \u2014 use >= and < for precise timestamp boundaries"
    ],
    edgeCases: [
      "Employee who checked in but hasn't checked out yet (NULL next_created_at)",
      "Employee working across midnight \u2014 in on March 31, out on April 1",
      "Employee with multiple in/out cycles on the same day",
      "Query timestamp exactly matches an in or out event",
      "Employee who checked in exactly at the query timestamp"
    ],
    expectedOutput: `+------------------+
| no_of_emp_inside |
+------------------+
| 2                |
+------------------+`
  },

  {
    id: 8,
    title: "Lowest Price",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You own a small online store, and want to analyze customer ratings for the products that you're selling. After doing a data pull, you have a list of products and a log of purchases. Within the purchase log, each record includes the number of stars (from 1 to 5) as a customer rating for the product.

For each category, find the lowest price among all products that received at least one 4-star or above rating from customers.
If a product category did not have any products that received at least one 4-star or above rating, the lowest price is considered to be 0. The final output should be sorted by product category in alphabetical order.`,
    schema: [
      {
        name: "products",
        columns: [
          { name: "category", type: "varchar(10)" },
          { name: "id", type: "int" },
          { name: "name", type: "varchar(20)" },
          { name: "price", type: "int" }
        ]
      },
      {
        name: "purchases",
        columns: [
          { name: "id", type: "int" },
          { name: "product_id", type: "int" },
          { name: "stars", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  category VARCHAR(10),
  id INT,
  name VARCHAR(20),
  price INT
);

CREATE TABLE purchases (
  id INT,
  product_id INT,
  stars INT
);

INSERT INTO products VALUES
('Electronics', 1, 'Laptop', 1200),
('Electronics', 2, 'Phone', 800),
('Electronics', 3, 'Tablet', 500),
('Clothing', 4, 'Jacket', 150),
('Clothing', 5, 'Shirt', 50),
('Books', 6, 'Novel', 20),
('Books', 7, 'Textbook', 80);

INSERT INTO purchases VALUES
(1, 1, 5),
(2, 1, 4),
(3, 2, 3),
(4, 2, 2),
(5, 4, 4),
(6, 5, 5),
(7, 6, 3),
(8, 6, 2),
(9, 3, 4);
`,
    mySolution: `SELECT
    category,
    COALESCE(MIN(CASE WHEN pur.product_id IS NOT NULL THEN price END), 0) AS price
FROM products p
LEFT JOIN purchases pur ON p.id = pur.product_id AND pur.stars IN (4, 5)
GROUP BY category
ORDER BY category;`,
    systemSolution: `SELECT
    category,
    COALESCE(MIN(CASE WHEN pur.product_id IS NOT NULL THEN price END), 0) AS price
FROM products p
LEFT JOIN purchases pur ON p.id = pur.product_id AND pur.stars IN (4, 5)
GROUP BY category
ORDER BY category;`,
    starterCode: `-- Lowest Price
-- Write your solution here
SELECT *
FROM products;`,
    businessImpact: `Finding the cheapest well-rated product per category helps e-commerce platforms highlight "best value" items, guide pricing strategy, and identify entry-level products that drive customer acquisition into each category.`,
    optimizationTips: [
      "LEFT JOIN ensures categories with no 4+ star products still appear (as 0)",
      "COALESCE with 0 handles NULL from MIN when no qualifying products exist",
      "Index on (product_id, stars) in purchases for efficient filtered joins",
      "CASE WHEN inside MIN avoids counting non-qualifying rows"
    ],
    edgeCases: [
      "Category with no purchases at all \u2014 should show price 0",
      "Category where all products have only 1-3 star ratings \u2014 price should be 0",
      "Product with both high and low star ratings \u2014 still qualifies",
      "Multiple products with same lowest price in a category",
      "Product with no purchases (never bought)"
    ],
    expectedOutput: `+-------------+-------+
| category    | price |
+-------------+-------+
| Books       | 0     |
| Clothing    | 50    |
| Electronics | 500   |
+-------------+-------+`
  },

  {
    id: 9,
    title: "Expenses Excluding MasterCard",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You're working for a financial analytics company that specializes in analyzing credit card expenditures. You have a dataset containing information about users' credit card expenditures across different card companies.
Write an SQL query to find the total expenditure from other cards (excluding Mastercard) for users who hold Mastercard.  Display only the users(along with Mastercard expense and other expense) for which expense from other cards together is more than Mastercard expense.`,
    schema: [
      {
        name: "expenditures",
        columns: [
          { name: "user_name", type: "varchar(10)" },
          { name: "expenditure", type: "int" },
          { name: "card_company", type: "varchar(15)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS expenditures;

CREATE TABLE expenditures (
  user_name VARCHAR(10),
  expenditure INT,
  card_company VARCHAR(15)
);

INSERT INTO expenditures VALUES
('Alice', 5000, 'Mastercard'),
('Alice', 3000, 'Visa'),
('Alice', 4000, 'Amex'),
('Bob', 2000, 'Mastercard'),
('Bob', 1000, 'Visa'),
('Carol', 3000, 'Mastercard'),
('Carol', 2000, 'Visa'),
('Carol', 1500, 'Amex'),
('Dave', 1000, 'Visa'),
('Dave', 2000, 'Amex'),
('Eve', 4000, 'Mastercard'),
('Eve', 5000, 'Visa');
`,
    mySolution: `WITH mastercard AS (
SELECT user_name, SUM(expenditure) AS expenditure
FROM expenditures
WHERE card_company = 'Mastercard'
GROUP BY user_name
),
non_mastercard AS (
SELECT user_name, SUM(expenditure) AS expenditure
FROM expenditures
WHERE card_company != 'Mastercard'
GROUP BY user_name
)
SELECT m.user_name, m.expenditure AS mastercard_expense, nm.expenditure AS other_expense
FROM mastercard m
INNER JOIN non_mastercard nm ON m.user_name = nm.user_name
WHERE nm.expenditure > m.expenditure;`,
    systemSolution: `WITH mastercard AS (
SELECT user_name, SUM(expenditure) AS expenditure
FROM expenditures
WHERE card_company = 'Mastercard'
GROUP BY user_name
),
non_mastercard AS (
SELECT user_name, SUM(expenditure) AS expenditure
FROM expenditures
WHERE card_company != 'Mastercard'
GROUP BY user_name
)
SELECT m.user_name, m.expenditure AS mastercard_expense, nm.expenditure AS other_expense
FROM mastercard m
INNER JOIN non_mastercard nm ON m.user_name = nm.user_name
WHERE nm.expenditure > m.expenditure;`,
    starterCode: `-- Expenses Excluding MasterCard
-- Write your solution here
SELECT *
FROM expenditures;`,
    businessImpact: `Cross-card spending analysis helps credit card companies identify customers whose non-Mastercard spending exceeds their Mastercard usage, enabling targeted offers and incentives to capture more wallet share from competing card issuers.`,
    optimizationTips: [
      "Two separate CTEs are cleaner than conditional aggregation for this comparison",
      "INNER JOIN naturally excludes users without both card types",
      "Index on (card_company, user_name) for efficient filtered grouping",
      "Consider using FILTER clause: SUM(expenditure) FILTER (WHERE card_company = 'Mastercard')"
    ],
    edgeCases: [
      "User with Mastercard only and no other cards \u2014 excluded by INNER JOIN",
      "User with other cards but no Mastercard \u2014 excluded from Mastercard CTE",
      "User with equal Mastercard and other card expenses \u2014 not included (strictly greater)",
      "User with multiple transactions on same card company",
      "NULL expenditure values"
    ],
    expectedOutput: `+-----------+--------------------+---------------+
| user_name | mastercard_expense | other_expense |
+-----------+--------------------+---------------+
| Alice     | 5000               | 7000          |
| Carol     | 3000               | 3500          |
| Eve       | 4000               | 5000          |
+-----------+--------------------+---------------+`
  },

  {
    id: 10,
    title: "2022 vs 2023 vs 2024 Sales",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You are tasked with analyzing the sales growth of products over the years 2022, 2023, and 2024. Your goal is to identify months where the sales for a product have consistently increased from 2022 to 2023 and from 2023 to 2024.
Your task is to write an SQL query to generate a report that includes the sales for each product at the month level for the years 2022, 2023, and 2024. However, you should only include product and months combination where the sales have consistently increased from 2022 to 2023 and from 2023 to 2024, display the output in ascending order of product_id.`,
    schema: [
      {
        name: "orders",
        columns: [
          { name: "order_id", type: "int" },
          { name: "customer_id", type: "int" },
          { name: "order_date", type: "date" },
          { name: "product_id", type: "int" },
          { name: "sales", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  order_id INT,
  customer_id INT,
  order_date DATE,
  product_id INT,
  sales INT
);

INSERT INTO orders VALUES
(1, 1, '2022-01-10', 1, 100),
(2, 2, '2022-01-15', 1, 150),
(3, 1, '2023-01-12', 1, 300),
(4, 3, '2024-01-08', 1, 500),
(5, 1, '2022-03-05', 1, 200),
(6, 2, '2023-03-10', 1, 250),
(7, 3, '2024-03-15', 1, 200),
(8, 1, '2022-01-20', 2, 400),
(9, 2, '2023-01-25', 2, 450),
(10, 3, '2024-01-30', 2, 500),
(11, 1, '2022-06-10', 2, 300),
(12, 2, '2023-06-15', 2, 350),
(13, 3, '2024-06-20', 2, 400);
`,
    mySolution: `WITH cte AS (
SELECT product_id,
  EXTRACT(MONTH FROM order_date) AS order_month,
  EXTRACT(YEAR FROM order_date) AS order_year,
  SUM(sales) AS sales
FROM orders
GROUP BY product_id, EXTRACT(MONTH FROM order_date), EXTRACT(YEAR FROM order_date)
),
cte2 AS (
SELECT product_id, order_month,
  SUM(CASE WHEN order_year = 2022 THEN sales ELSE 0 END) AS sales_2022,
  SUM(CASE WHEN order_year = 2023 THEN sales ELSE 0 END) AS sales_2023,
  SUM(CASE WHEN order_year = 2024 THEN sales ELSE 0 END) AS sales_2024
FROM cte
GROUP BY product_id, order_month
)
SELECT *
FROM cte2
WHERE sales_2024 > sales_2023 AND sales_2023 > sales_2022
ORDER BY product_id;`,
    systemSolution: `WITH cte AS (
SELECT product_id,
  EXTRACT(MONTH FROM order_date) AS order_month,
  EXTRACT(YEAR FROM order_date) AS order_year,
  SUM(sales) AS sales
FROM orders
GROUP BY product_id, EXTRACT(MONTH FROM order_date), EXTRACT(YEAR FROM order_date)
),
cte2 AS (
SELECT product_id, order_month,
  SUM(CASE WHEN order_year = 2022 THEN sales ELSE 0 END) AS sales_2022,
  SUM(CASE WHEN order_year = 2023 THEN sales ELSE 0 END) AS sales_2023,
  SUM(CASE WHEN order_year = 2024 THEN sales ELSE 0 END) AS sales_2024
FROM cte
GROUP BY product_id, order_month
)
SELECT *
FROM cte2
WHERE sales_2024 > sales_2023 AND sales_2023 > sales_2022
ORDER BY product_id;`,
    starterCode: `-- 2022 vs 2023 vs 2024 Sales
-- Write your solution here
SELECT *
FROM orders;`,
    businessImpact: `Year-over-year sales growth analysis at the month level identifies consistently growing product-month combinations, helping demand planning teams forecast inventory needs, allocate marketing budgets to high-momentum products, and detect seasonal growth patterns.`,
    optimizationTips: [
      "Use EXTRACT(MONTH FROM ...) and EXTRACT(YEAR FROM ...) in PostgreSQL instead of MySQL's MONTH()/YEAR()",
      "Index on (product_id, order_date) for efficient grouping",
      "Pivot with CASE WHEN is more efficient than three separate subqueries",
      "Consider using FILTER clause for cleaner conditional aggregation"
    ],
    edgeCases: [
      "Product with no sales in one of the three years \u2014 sales = 0, breaks 'consistently increased'",
      "Product sold only in 2024 \u2014 0 < 0 fails the condition",
      "Multiple orders on same date for same product \u2014 correctly summed",
      "Sales exactly equal between two years \u2014 strictly greater required",
      "Product with sales in only some months"
    ],
    expectedOutput: `+------------+-------+------------+------------+------------+
| product_id | month | sales_2022 | sales_2023 | sales_2024 |
+------------+-------+------------+------------+------------+
| 1          | 1     | 100        | 300        | 500        |
| 2          | 1     | 400        | 450        | 500        |
| 2          | 6     | 300        | 350        | 400        |
+------------+-------+------------+------------+------------+`
  },

  {
    id: 11,
    title: "Hotel Booking Mistake",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `A hotel has accidentally made overbookings for certain rooms on specific dates. Due to this error, some rooms have been assigned to multiple customers for overlapping periods, leading to potential conflicts. The hotel management needs to rectify this mistake by contacting the affected customers and providing them with alternative arrangements.
Your task is to write an SQL query to identify the overlapping bookings for each room and determine the list of customers affected by these overlaps. For each room and overlapping date, the query should list the customers who have booked the room for that date. 
A booking's check-out date is not inclusive, meaning that if a room is booked from April 1st to April 4th, it is considered occupied from April 1st to April 3rd , another customer can check-in on April 4th and that will not be considered as overlap.

Order the result by room id, booking date. You may use calendar dim table which has all the dates for the year April 2024.`,
    schema: [
      {
        name: "bookings",
        columns: [
          { name: "room_id", type: "int" },
          { name: "customer_id", type: "int" },
          { name: "check_in_date", type: "date" },
          { name: "check_out_date", type: "date" }
        ]
      },
      {
        name: "calendar_dim",
        columns: [
          { name: "cal_date", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS calendar_dim;

CREATE TABLE bookings (
  room_id INT,
  customer_id INT,
  check_in_date DATE,
  check_out_date DATE
);

CREATE TABLE calendar_dim (
  cal_date DATE
);

INSERT INTO bookings VALUES
(101, 1, '2024-04-01', '2024-04-05'),
(101, 2, '2024-04-03', '2024-04-07'),
(101, 3, '2024-04-06', '2024-04-10'),
(102, 4, '2024-04-01', '2024-04-04'),
(102, 5, '2024-04-04', '2024-04-08'),
(103, 6, '2024-04-02', '2024-04-06'),
(103, 7, '2024-04-03', '2024-04-05');

INSERT INTO calendar_dim VALUES
('2024-04-01'), ('2024-04-02'), ('2024-04-03'), ('2024-04-04'), ('2024-04-05'),
('2024-04-06'), ('2024-04-07'), ('2024-04-08'), ('2024-04-09'), ('2024-04-10'),
('2024-04-11'), ('2024-04-12'), ('2024-04-13'), ('2024-04-14'), ('2024-04-15'),
('2024-04-16'), ('2024-04-17'), ('2024-04-18'), ('2024-04-19'), ('2024-04-20'),
('2024-04-21'), ('2024-04-22'), ('2024-04-23'), ('2024-04-24'), ('2024-04-25'),
('2024-04-26'), ('2024-04-27'), ('2024-04-28'), ('2024-04-29'), ('2024-04-30');
`,
    mySolution: `WITH cte AS (
SELECT b.room_id, b.customer_id, c.cal_date
FROM bookings b
INNER JOIN calendar_dim c ON c.cal_date >= b.check_in_date AND c.cal_date < b.check_out_date
WHERE check_in_date IS NOT NULL AND check_out_date IS NOT NULL
)
SELECT room_id, cal_date,
  STRING_AGG(CAST(customer_id AS VARCHAR), ',' ORDER BY customer_id) AS customers
FROM cte
GROUP BY room_id, cal_date
HAVING COUNT(DISTINCT customer_id) > 1
ORDER BY room_id, cal_date`,
    systemSolution: `WITH cte AS (
SELECT room_id, customer_id, c.cal_date AS book_date
FROM bookings b
INNER JOIN calendar_dim c ON c.cal_date >= b.check_in_date AND c.cal_date < b.check_out_date
)
SELECT room_id, book_date,
  STRING_AGG(CAST(customer_id AS VARCHAR), ',' ORDER BY customer_id) AS customers
FROM cte
GROUP BY room_id, book_date
HAVING COUNT(*) > 1
ORDER BY room_id, book_date;`,
    starterCode: `-- Hotel Booking Mistake
-- Write your solution here
SELECT *
FROM bookings;`,
    businessImpact: `Overbooking detection prevents customer dissatisfaction, avoids costly compensation, and maintains hotel reputation. Identifying exact overlapping dates and affected customers enables proactive rebooking and targeted communication for service recovery.`,
    optimizationTips: [
      "Calendar dimension table enables date expansion without generating series",
      "Use STRING_AGG (PostgreSQL) instead of GROUP_CONCAT (MySQL) for aggregating customer IDs",
      "Index on bookings (room_id, check_in_date, check_out_date) for range join",
      "HAVING COUNT > 1 filters only overlapping dates efficiently"
    ],
    edgeCases: [
      "Check-out date is not inclusive \u2014 same-day checkout/checkin is not an overlap",
      "Three or more customers overlapping on the same date for the same room",
      "Booking with NULL check_in or check_out dates",
      "Single-night booking (check_in and check_out one day apart)",
      "Booking spanning into the next month beyond calendar_dim range"
    ]
  },

  {
    id: 12,
    title: "Child and Parents",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You are tasked to determine the mother and father's name for each child based on the given data. The people table provides information about individuals, including their names and genders. The relations table specifies parent-child relationships, linking each child (c_id) to their parent (p_id). Each parent is identified by their ID, and their gender is used to distinguish between mothers (F) and fathers (M).

Write an SQL query to retrieve the names of each child along with the names of their respective mother and father, if available. If a child has only one parent listed in the relations table, the query should still include that parent's name and leave the other parent's name as NULL. Order the output by child name in ascending order.

 

Tables: people
+-------------+-------------+
| COLUMN_NAME | DATA_TYPE   |
+-------------+-------------+
| gender      | char(2)     |
| id          | int         |
| name        | varchar(20) |
+-------------+-------------+
Tables: relations 
+-------------+-----------+
| COLUMN_NAME | DATA_TYPE |
+-------------+-----------+
| c_id        | int       |
| p_id        | int       |
+-------------+-----------+`,
    schema: [
      {
        name: "people",
        columns: [
          { name: "id", type: "int" },
          { name: "name", type: "varchar(20)" },
          { name: "gender", type: "char(2)" }
        ]
      },
      {
        name: "relations",
        columns: [
          { name: "c_id", type: "int" },
          { name: "p_id", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS people;
DROP TABLE IF EXISTS relations;

CREATE TABLE people (
  id INT,
  name VARCHAR(20),
  gender CHAR(2)
);

CREATE TABLE relations (
  c_id INT,
  p_id INT
);

INSERT INTO people VALUES
(1, 'Alice', 'F'),
(2, 'Bob', 'M'),
(3, 'Charlie', 'M'),
(4, 'Diana', 'F'),
(5, 'Eve', 'F'),
(6, 'Frank', 'M'),
(7, 'Grace', 'F'),
(8, 'Henry', 'M');

INSERT INTO relations VALUES
(3, 1),
(3, 2),
(5, 1),
(5, 2),
(7, 4),
(7, 6),
(8, 4);
`,
    mySolution: `WITH mother_father AS (
    SELECT r.c_id AS child_id,
           MAX(p1.name) AS mother_name,
           MAX(p2.name) AS father_name
    FROM relations r
    LEFT JOIN people p1 ON r.p_id = p1.id AND p1.gender = 'F'
    LEFT JOIN people p2 ON r.p_id = p2.id AND p2.gender = 'M'
    GROUP BY r.c_id
)
SELECT p.name AS child_name,
       mf.mother_name,
       mf.father_name
FROM people p
INNER JOIN mother_father mf ON p.id = mf.child_id
ORDER BY child_name;`,
    systemSolution: `WITH mother_father AS (
    SELECT r.c_id AS child_id,
           MAX(p1.name) AS mother_name,
           MAX(p2.name) AS father_name
    FROM relations r
    LEFT JOIN people p1 ON r.p_id = p1.id AND p1.gender = 'F'
    LEFT JOIN people p2 ON r.p_id = p2.id AND p2.gender = 'M'
    GROUP BY r.c_id
)
SELECT p.name AS child_name,
       mf.mother_name,
       mf.father_name
FROM people p
INNER JOIN mother_father mf ON p.id = mf.child_id
ORDER BY child_name;`,
    starterCode: `-- Child and Parents
-- Write your solution here
SELECT *
FROM people;`,
    businessImpact: `Family relationship mapping from normalized relational data is essential in healthcare (genetic history), insurance (dependent coverage), legal systems (inheritance), and CRM systems (household grouping for family-based promotions).`,
    optimizationTips: [
      "Double LEFT JOIN with gender filter efficiently pivots parent rows into mother/father columns",
      "MAX aggregation with GROUP BY handles the pivot since each child has at most one mother and one father",
      "Index on relations (c_id) and people (id, gender) for join performance",
      "Could use conditional aggregation: MAX(CASE WHEN gender='F' THEN name END) in a single join"
    ],
    edgeCases: [
      "Child with only one parent in relations table \u2014 other parent shows as NULL",
      "Child with no parents in relations \u2014 excluded by INNER JOIN",
      "Person who is both a parent and a child",
      "Two parents of same gender (data quality issue)",
      "Orphan records in relations table (p_id not in people)"
    ]
  },

  {
    id: 13,
    title: "Election Winner",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You are provided with election data from multiple districts in India. Each district conducted elections for selecting a representative from various political parties. Your task is to analyze the election results to determine the winning party at national levels.  Here are the steps to identify winner:

1- Determine the winning party in each district based on the candidate with the highest number of votes.
2- If multiple candidates from different parties have the same highest number of votes in a district
  , consider it a tie, and all tied candidates are declared winners for that district.
3- Calculate the total number of seats won by each party across all districts
4- A party wins the election if it secures more than 50% of the total seats available nationwide.
Display the total number of seats won by each party and a result column specifying Winner or Loser. Order the output by total seats won in descending order.`,
    schema: [
      {
        name: "elections",
        columns: [
          { name: "district_name", type: "varchar(20)" },
          { name: "candidate_id", type: "int" },
          { name: "party_name", type: "varchar(10)" },
          { name: "votes", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS elections;

CREATE TABLE elections (
  district_name VARCHAR(20),
  candidate_id INT,
  party_name VARCHAR(10),
  votes INT
);

INSERT INTO elections VALUES
('Mumbai', 1, 'PartyA', 50000),
('Mumbai', 2, 'PartyB', 45000),
('Delhi', 3, 'PartyA', 60000),
('Delhi', 4, 'PartyB', 60000),
('Chennai', 5, 'PartyA', 35000),
('Chennai', 6, 'PartyC', 40000),
('Kolkata', 7, 'PartyB', 55000),
('Kolkata', 8, 'PartyC', 30000),
('Bangalore', 9, 'PartyA', 48000),
('Bangalore', 10, 'PartyB', 42000),
('Bangalore', 11, 'PartyC', 48000);
`,
    mySolution: `WITH cte AS (
SELECT *,
  RANK() OVER(PARTITION BY district_name ORDER BY votes DESC) AS rn
FROM elections
),
cte_total_seats AS (
SELECT COUNT(DISTINCT district_name) AS total_seats FROM elections
)
SELECT party_name, COUNT(*) AS seats_won,
  CASE WHEN COUNT(*) > total_seats * 0.5 THEN 'Winner' ELSE 'Loser' END AS result
FROM cte, cte_total_seats
WHERE rn = 1
GROUP BY party_name, total_seats
ORDER BY seats_won DESC;`,
    systemSolution: `WITH cte AS (
SELECT *,
  RANK() OVER(PARTITION BY district_name ORDER BY votes DESC) AS rn
FROM elections
),
cte_total_seats AS (
SELECT COUNT(DISTINCT district_name) AS total_seats FROM elections
)
SELECT party_name, COUNT(*) AS seats_won,
  CASE WHEN COUNT(*) > total_seats * 0.5 THEN 'Winner' ELSE 'Loser' END AS result
FROM cte, cte_total_seats
WHERE rn = 1
GROUP BY party_name, total_seats
ORDER BY seats_won DESC;`,
    starterCode: `-- Election Winner
-- Write your solution here
SELECT *
FROM elections;`,
    businessImpact: `Election analysis with district-level winner determination and national seat aggregation mirrors real-world parliamentary systems. The 50% threshold logic enables automated winner declaration, useful for election commissions, media dashboards, and political analytics platforms.`,
    optimizationTips: [
      "RANK() handles ties correctly \u2014 multiple candidates can win a district",
      "Cross join with CTE for total_seats avoids correlated subquery",
      "Index on (district_name, votes) for efficient PARTITION BY + ORDER BY",
      "COUNT(*) with GROUP BY is more efficient than subquery-based counting"
    ],
    edgeCases: [
      "Tie in a district \u2014 both candidates declared winners, inflates seat count",
      "All candidates in a district have the same votes",
      "Party with exactly 50% of seats \u2014 strictly greater means they don't win",
      "District with only one candidate",
      "Candidate with zero votes"
    ]
  },

  {
    id: 14,
    title: "Busiest Airline Route",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You are given a table named "tickets" containing information about airline tickets sold. Write an SQL query to find the busiest route based on the total number of tickets sold. Also display total ticket count for that route.
oneway_round ='O' -> One Way Trip 
oneway_round ='R' -> Round Trip 
Note: DEL -> BOM is different route from BOM -> DEL

 

Tables: tickets
+----------------+-------------+
| COLUMN_NAME    | DATA_TYPE   |
+----------------+-------------+
| airline_number | varchar(10) |
| origin         | varchar(3)  |
| destination    | varchar(3)  |
| oneway_round   | char(1)     |
| ticket_count   | int         |
+----------------+-------------+`,
    schema: [
      {
        name: "tickets",
        columns: [
          { name: "airline_number", type: "varchar(10)" },
          { name: "origin", type: "varchar(3)" },
          { name: "destination", type: "varchar(3)" },
          { name: "oneway_round", type: "char(1)" },
          { name: "ticket_count", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS tickets;

CREATE TABLE tickets (
  airline_number VARCHAR(10),
  origin VARCHAR(3),
  destination VARCHAR(3),
  oneway_round CHAR(1),
  ticket_count INT
);

INSERT INTO tickets VALUES
('AI101', 'DEL', 'BOM', 'R', 150),
('AI102', 'DEL', 'BOM', 'O', 80),
('AI103', 'BOM', 'DEL', 'O', 120),
('AI104', 'DEL', 'MAA', 'R', 90),
('AI105', 'MAA', 'BOM', 'O', 60),
('AI106', 'BOM', 'MAA', 'R', 70),
('AI107', 'DEL', 'CCU', 'O', 50);
`,
    mySolution: `WITH all_flight AS (
SELECT destination, origin, ticket_count
FROM tickets
WHERE oneway_round = 'R'
AND ticket_count IS NOT NULL
UNION ALL
SELECT origin, destination, ticket_count
FROM tickets
)
SELECT destination, origin, SUM(ticket_count) AS tc
FROM all_flight
GROUP BY destination, origin
ORDER BY tc DESC
LIMIT 1`,
    systemSolution: `SELECT origin, destination, SUM(ticket_count) AS tc
FROM (
  SELECT origin, destination, ticket_count FROM tickets
  UNION ALL
  SELECT destination, origin, ticket_count FROM tickets WHERE oneway_round = 'R'
) A
GROUP BY origin, destination
ORDER BY tc DESC
LIMIT 1;`,
    starterCode: `-- Busiest Airline Route
-- Write your solution here
SELECT *
FROM tickets;`,
    businessImpact: `Route traffic analysis helps airlines optimize fleet allocation, adjust frequency on high-demand routes, and identify underperformance. Distinguishing one-way vs round-trip tickets provides insight into travel patterns and helps with revenue management pricing.`,
    optimizationTips: [
      "UNION ALL for round trips doubles the contribution to both origin and destination routes",
      "LIMIT 1 with ORDER BY DESC efficiently finds the top route without scanning all results",
      "Index on (origin, destination) and (oneway_round) for partition pruning",
      "Consider FETCH FIRST 1 ROW ONLY as PostgreSQL standard alternative to LIMIT"
    ],
    edgeCases: [
      "Multiple routes tied for busiest \u2014 LIMIT 1 returns arbitrary one; use RANK for all ties",
      "NULL ticket_count values \u2014 excluded from SUM",
      "DEL→BOM and BOM→DEL are different routes per problem specification",
      "Round trip ticket already counted from origin→dest, UNION ALL adds dest→origin",
      "Route with only round-trip tickets vs only one-way tickets"
    ]
  },

  {
    id: 15,
    title: "Credit Card Transactions (Part-2)",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You are given a history of credit card transaction data for the people of India across cities as below. Your task is to find out highest spend card type and lowest spent card type for each city, display the output in ascending order of city.`,
    schema: [
      {
        name: "credit_card_transactions",
        columns: [
          { name: "transaction_id", type: "int" },
          { name: "city", type: "varchar(10)" },
          { name: "transaction_date", type: "date" },
          { name: "card_type", type: "varchar(12)" },
          { name: "gender", type: "varchar(1)" },
          { name: "amount", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS credit_card_transactions;

CREATE TABLE credit_card_transactions (
  transaction_id INT,
  city VARCHAR(10),
  transaction_date DATE,
  card_type VARCHAR(12),
  gender VARCHAR(1),
  amount INT
);

INSERT INTO credit_card_transactions VALUES
(1, 'Mumbai', '2024-01-05', 'Gold', 'M', 5000),
(2, 'Mumbai', '2024-01-10', 'Silver', 'F', 3000),
(3, 'Mumbai', '2024-01-15', 'Platinum', 'M', 8000),
(4, 'Mumbai', '2024-02-01', 'Gold', 'F', 4000),
(5, 'Delhi', '2024-01-08', 'Gold', 'M', 6000),
(6, 'Delhi', '2024-01-12', 'Silver', 'F', 2000),
(7, 'Delhi', '2024-01-20', 'Platinum', 'M', 7000),
(8, 'Delhi', '2024-02-05', 'Silver', 'F', 1500),
(9, 'Chennai', '2024-01-03', 'Gold', 'M', 4500),
(10, 'Chennai', '2024-01-18', 'Platinum', 'F', 9000),
(11, 'Chennai', '2024-02-10', 'Silver', 'M', 2500);
`,
    mySolution: `WITH transactions AS (
SELECT city, card_type, SUM(amount) AS amt
FROM credit_card_transactions
GROUP BY city, card_type
),
cte AS (
SELECT city, card_type,
  RANK() OVER (PARTITION BY city ORDER BY amt DESC) AS hr,
  RANK() OVER (PARTITION BY city ORDER BY amt ASC) AS lr
FROM transactions
)
SELECT city,
  MAX(CASE WHEN hr = 1 THEN card_type END) AS highest_expense_type,
  MAX(CASE WHEN lr = 1 THEN card_type END) AS lowest_expense_type
FROM cte
WHERE hr = 1 OR lr = 1
GROUP BY city
ORDER BY city`,
    systemSolution: `WITH cte AS (
SELECT city, card_type, SUM(amount) AS total_spend
FROM credit_card_transactions
GROUP BY city, card_type
),
cte2 AS (
SELECT *,
  RANK() OVER(PARTITION BY city ORDER BY total_spend DESC) AS rn_high,
  RANK() OVER(PARTITION BY city ORDER BY total_spend) AS rn_low
FROM cte
)
SELECT city,
  MAX(CASE WHEN rn_high = 1 THEN card_type END) AS highest_expense_type,
  MAX(CASE WHEN rn_low = 1 THEN card_type END) AS lowest_expense_type
FROM cte2
WHERE rn_high = 1 OR rn_low = 1
GROUP BY city
ORDER BY city;`,
    starterCode: `-- Credit Card Transactions (Part-2)
-- Write your solution here
SELECT *
FROM credit_card_transactions;`,
    businessImpact: `City-level card type spending analysis reveals consumer payment preferences by geography, helping banks tailor card offerings, adjust credit limits, and design city-specific rewards programs for different card tiers.`,
    optimizationTips: [
      "Double RANK() in one pass avoids scanning data twice",
      "MAX with CASE WHEN pivots high/low into columns efficiently",
      "WHERE filter on hr=1 OR lr=1 before GROUP BY reduces rows to aggregate",
      "Index on (city, card_type) for grouped aggregation"
    ],
    edgeCases: [
      "City with only one card type \u2014 same card is both highest and lowest",
      "Tied spending between card types \u2014 RANK gives same rank to both",
      "City with NULL amounts \u2014 affects SUM",
      "Card type with zero transactions in a city"
    ]
  },

  {
    id: 16,
    title: "Users With Valid Passwords",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `Write a SQL query to identify the users with valid passwords according to the conditions below.

The password must be at least 8 characters long.
The password must contain at least one letter (lowercase or uppercase).
The password must contain at least one digit (0-9).
The password must contain at least one special character from the set @#$%^&*.
The password must not contain any spaces.`,
    schema: [
      {
        name: "user_passwords",
        columns: [
          { name: "user_id", type: "int" },
          { name: "user_name", type: "varchar(10)" },
          { name: "password", type: "varchar(20)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS user_passwords;

CREATE TABLE user_passwords (
  user_id INT,
  user_name VARCHAR(10),
  password VARCHAR(20)
);

INSERT INTO user_passwords VALUES
(1, 'Alice', 'Passw0rd@1'),
(2, 'Bob', 'short1@'),
(3, 'Carol', 'NoSpecial1abc'),
(4, 'Dave', 'Good#Pass9'),
(5, 'Eve', 'has space@1A'),
(6, 'Frank', '12345678@'),
(7, 'Grace', 'Abcdefgh'),
(8, 'Henry', 'V@lid1Pass');
`,
    mySolution: `SELECT user_id, user_name
FROM user_passwords
WHERE
  LENGTH(password) >= 8
  AND password ~ '[A-Za-z]'
  AND password ~ '[0-9]'
  AND password ~ '[@#$%^&*]'
  AND password NOT LIKE '% %';`,
    systemSolution: `SELECT user_id, user_name
FROM user_passwords
WHERE
  LENGTH(password) >= 8
  AND password ~ '[A-Za-z]'
  AND password ~ '[0-9]'
  AND password ~ '[@#$%^&*]'
  AND password NOT LIKE '% %';`,
    starterCode: `-- Users With Valid Passwords
-- Write your solution here
SELECT *
FROM user_passwords;`,
    businessImpact: `Password validation queries help security teams audit existing user accounts for weak credentials, identify accounts requiring password resets, and ensure compliance with organizational security policies without exposing actual passwords.`,
    optimizationTips: [
      "Use PostgreSQL's ~ operator instead of MySQL's REGEXP for regex matching",
      "Multiple regex checks are clearer than one complex pattern",
      "NOT LIKE '% %' is more readable than regex for space detection",
      "Consider using CHECK constraints on the table itself instead of query-time validation"
    ],
    edgeCases: [
      "Password exactly 8 characters \u2014 passes length check",
      "Password with only special chars and digits but no letters \u2014 fails letter check",
      "Leading or trailing spaces in password",
      "NULL password values",
      "Special characters not in the allowed set (e.g., ! or ?)"
    ]
  },

  {
    id: 17,
    title: "Student Major Subject",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You are provided with information about students enrolled in various courses at a university. Each student can be enrolled in multiple courses, and for each course, it is specified whether the course is a major or an elective for the student.
Write a SQL query to generate a report that lists the primary (major_flag='Y') course for each student. If a student is enrolled in only one course, that course should be considered their primary course by default irrespective of the flag. Sort the output by student_id.`,
    schema: [
      {
        name: "student_courses",
        columns: [
          { name: "student_id", type: "int" },
          { name: "course_id", type: "int" },
          { name: "major_flag", type: "varchar(1)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS student_courses;

CREATE TABLE student_courses (
  student_id INT,
  course_id INT,
  major_flag VARCHAR(1)
);

INSERT INTO student_courses VALUES
(1, 101, 'Y'),
(1, 102, 'N'),
(1, 103, 'N'),
(2, 201, 'N'),
(3, 301, 'Y'),
(3, 302, 'N'),
(4, 401, 'N'),
(5, 501, 'Y'),
(5, 502, 'Y');
`,
    mySolution: `WITH student_course_counts AS (
    SELECT student_id, course_id, major_flag,
        COUNT(*) OVER (PARTITION BY student_id) AS course_count
    FROM student_courses
)
SELECT student_id, course_id
FROM student_course_counts
WHERE major_flag = 'Y' OR course_count = 1
ORDER BY student_id;`,
    systemSolution: `SELECT student_id, course_id
FROM student_courses
WHERE major_flag = 'Y'
   OR student_id IN (
       SELECT student_id
       FROM student_courses
       GROUP BY student_id
       HAVING COUNT(*) = 1
   )
ORDER BY student_id;`,
    starterCode: `-- Student Major Subject
-- Write your solution here
SELECT *
FROM student_courses;`,
    businessImpact: `Identifying primary courses per student helps universities optimize class scheduling, allocate department resources, track degree completion progress, and generate accurate enrollment reports for accreditation.`,
    optimizationTips: [
      "Window function approach (COUNT OVER) avoids correlated subquery",
      "IN subquery approach is simpler but scans the table twice",
      "Index on student_id for efficient grouping and partitioning",
      "OR condition handles both cases: explicit major flag and single-course students"
    ],
    edgeCases: [
      "Student enrolled in only one course with major_flag='N' \u2014 still their primary",
      "Student with multiple major flags set to 'Y' \u2014 returns multiple rows",
      "Student with no courses at all \u2014 not in the table",
      "All courses for a student are electives (major_flag='N') with >1 course"
    ]
  },

  {
    id: 18,
    title: "Products Sold in All Cities",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `A technology company operates in several major cities across India, selling a variety of tech products. The company wants to analyze its sales data to understand which products have been successfully sold in all the cities where they operate(available in cities table).
Write an SQL query to identify the product names that have been sold at least 2 times in every city where the company operates.`,
    schema: [
      {
        name: "products",
        columns: [
          { name: "product_id", type: "int" },
          { name: "product_name", type: "VARCHAR(12)" }
        ]
      },
      {
        name: "cities",
        columns: [
          { name: "city_id", type: "int" },
          { name: "city_name", type: "VARCHAR(10)" }
        ]
      },
      {
        name: "sales",
        columns: [
          { name: "sale_id", type: "int" },
          { name: "product_id", type: "int" },
          { name: "city_id", type: "int" },
          { name: "sale_date", type: "VARCHAR(12)" },
          { name: "quantity", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS cities;

CREATE TABLE products (
  product_id INT,
  product_name VARCHAR(12)
);

CREATE TABLE cities (
  city_id INT,
  city_name VARCHAR(10)
);

CREATE TABLE sales (
  sale_id INT,
  product_id INT,
  city_id INT,
  sale_date VARCHAR(12),
  quantity INT
);

INSERT INTO products VALUES
(1, 'Laptop'),
(2, 'Phone'),
(3, 'Tablet');

INSERT INTO cities VALUES
(1, 'Mumbai'),
(2, 'Delhi'),
(3, 'Chennai');

INSERT INTO sales VALUES
(1, 1, 1, '2024-01-05', 2),
(2, 1, 1, '2024-01-10', 1),
(3, 1, 2, '2024-01-08', 3),
(4, 1, 2, '2024-01-15', 1),
(5, 1, 3, '2024-01-12', 2),
(6, 1, 3, '2024-01-20', 1),
(7, 2, 1, '2024-01-06', 4),
(8, 2, 1, '2024-01-18', 2),
(9, 2, 2, '2024-01-09', 1),
(10, 2, 2, '2024-01-22', 3),
(11, 2, 3, '2024-01-11', 1),
(12, 3, 1, '2024-01-07', 2),
(13, 3, 1, '2024-01-14', 1),
(14, 3, 2, '2024-01-16', 1);
`,
    mySolution: `WITH cte AS (
SELECT product_id, city_id, COUNT(*)
FROM sales
GROUP BY product_id, city_id
HAVING COUNT(*) >= 2
)
SELECT p.product_name
FROM cte c
INNER JOIN products p ON c.product_id = p.product_id
GROUP BY p.product_name
HAVING COUNT(DISTINCT city_id) = (SELECT COUNT(*) FROM cities)`,
    systemSolution: `WITH product_sales AS (
    SELECT product_id, city_id
    FROM sales
    GROUP BY product_id, city_id
    HAVING COUNT(*) >= 2
)
SELECT p.product_name
FROM products p
JOIN product_sales ps ON p.product_id = ps.product_id
GROUP BY p.product_name
HAVING COUNT(DISTINCT ps.city_id) = (SELECT COUNT(*) FROM cities);`,
    starterCode: `-- Products Sold in All Cities
-- Write your solution here
SELECT *
FROM products;`,
    businessImpact: `Identifying products with consistent sales across all operating cities helps supply chain teams ensure nationwide availability, detect distribution gaps, and recognize universally popular products for national marketing campaigns.`,
    optimizationTips: [
      "HAVING with subquery COUNT(*) FROM cities dynamically adapts to new cities",
      "Two-phase approach: first filter by min sales per city, then check city coverage",
      "Index on sales (product_id, city_id) for efficient grouping",
      "COUNT(DISTINCT city_id) vs total cities uses relational division pattern"
    ],
    edgeCases: [
      "Product sold in all cities but only once in one city \u2014 fails the >= 2 threshold",
      "Empty cities table \u2014 COUNT(*) = 0, HAVING always true",
      "New city added \u2014 query automatically requires sales in new city",
      "Product with sales but not in products table (orphan records)",
      "City with no sales at all for any product"
    ]
  },

  {
    id: 19,
    title: "Reel Daily View Averages by State",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `Meta (formerly Facebook) is analyzing the performance of Instagram Reels across different states in the USA. You have access to a table named REEL that tracks the cumulative views of each reel over time. Write an SQL to get average daily views for each Instagram Reel in each state. Round the average to 2 decimal places and sort the result by average is descending order.`,
    schema: [
      {
        name: "reel",
        columns: [
          { name: "reel_id", type: "int" },
          { name: "record_date", type: "date" },
          { name: "state", type: "varchar" },
          { name: "cumulative_views", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS reel;

CREATE TABLE reel (
  reel_id INT,
  record_date DATE,
  state VARCHAR,
  cumulative_views INT
);

INSERT INTO reel VALUES
(1, '2024-01-01', 'California', 1000),
(1, '2024-01-02', 'California', 2500),
(1, '2024-01-03', 'California', 4200),
(1, '2024-01-01', 'Texas', 500),
(1, '2024-01-02', 'Texas', 1200),
(1, '2024-01-03', 'Texas', 1800),
(2, '2024-01-01', 'California', 800),
(2, '2024-01-02', 'California', 1600),
(2, '2024-01-03', 'California', 2100),
(3, '2024-01-01', 'Texas', 2000),
(3, '2024-01-02', 'Texas', 5000),
(3, '2024-01-03', 'Texas', 9000);
`,
    mySolution: `WITH views AS (
SELECT reel_id, state, record_date,
  cumulative_views -
  LAG(cumulative_views, 1, 0) OVER(PARTITION BY reel_id, state ORDER BY record_date) AS views
FROM reel
WHERE cumulative_views IS NOT NULL
)
SELECT reel_id, state,
  ROUND(AVG(views), 2) AS avg_daily_views
FROM views
GROUP BY reel_id, state
ORDER BY avg_daily_views DESC;`,
    systemSolution: `WITH MaxViews AS (
    SELECT reel_id, state,
        MAX(cumulative_views) AS max_cumulative_views,
        COUNT(*) AS days
    FROM reel
    GROUP BY reel_id, state
)
SELECT reel_id, state,
    ROUND(CAST(max_cumulative_views AS NUMERIC) / days, 2) AS avg_daily_views
FROM MaxViews
ORDER BY avg_daily_views DESC;`,
    starterCode: `-- Reel Daily View Averages by State
-- Write your solution here
SELECT *
FROM reel;`,
    businessImpact: `Regional content performance analysis helps social media platforms optimize content delivery networks, target advertising by geography, identify viral content in specific markets, and help creators understand their regional audience engagement.`,
    optimizationTips: [
      "LAG approach calculates daily increments from cumulative data accurately",
      "MAX/COUNT approach is simpler but assumes linear growth (less accurate)",
      "CAST to NUMERIC prevents integer division in PostgreSQL",
      "Index on (reel_id, state, record_date) for efficient window function"
    ],
    edgeCases: [
      "First record for a reel-state combo \u2014 LAG defaults to 0, inflating first day views",
      "NULL cumulative_views \u2014 filtered out or affects calculations",
      "Cumulative views decreasing (data correction) \u2014 negative daily views",
      "Single-day data for a reel-state \u2014 can't calculate daily average with LAG",
      "Same reel in multiple states \u2014 partitioned correctly"
    ]
  },

  {
    id: 20,
    title: "Sequence Expansion",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `Category - Analytics
Medium - 20 Points
You have a table named numbers containing a single column n. You are required to generate an output that expands each number n into a sequence where the number appears n times.`,
    schema: [
      {
        name: "numbers",
        columns: [
          { name: "n", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS numbers;

CREATE TABLE numbers (
  n INT
);

INSERT INTO numbers VALUES (1), (2), (3), (4), (5);
`,
    mySolution: `WITH RECURSIVE NumberSeries AS (
    SELECT n AS original_number, n AS expanded_number, 1 AS sequence_length
    FROM numbers
    UNION ALL
    SELECT ns.original_number, ns.expanded_number, ns.sequence_length + 1
    FROM NumberSeries ns
    WHERE ns.sequence_length < ns.original_number
)
SELECT expanded_number
FROM NumberSeries
ORDER BY original_number, sequence_length;`,
    systemSolution: `WITH RECURSIVE NumberSeries AS (
    SELECT n AS original_number, n AS expanded_number, 1 AS sequence_length
    FROM numbers
    UNION ALL
    SELECT ns.original_number, ns.expanded_number, ns.sequence_length + 1
    FROM NumberSeries ns
    WHERE ns.sequence_length < ns.original_number
)
SELECT expanded_number
FROM NumberSeries
ORDER BY original_number, sequence_length;`,
    starterCode: `-- Sequence Expansion
-- Write your solution here
SELECT *
FROM numbers;`,
    businessImpact: `Sequence expansion is a foundational pattern for generating test data, creating date ranges, expanding compressed records, and building report scaffolding. Recursive CTEs in PostgreSQL are powerful for hierarchical and iterative data generation.`,
    optimizationTips: [
      "WITH RECURSIVE is PostgreSQL's way to implement iterative expansion",
      "Base case selects from the table; recursive case increments until limit",
      "GENERATE_SERIES could be an alternative: CROSS JOIN LATERAL generate_series(1, n)",
      "Monitor recursion depth \u2014 large n values can cause memory issues"
    ],
    edgeCases: [
      "n = 0 \u2014 no rows generated (WHERE sequence_length < 0 is never true)",
      "n = 1 \u2014 appears exactly once from base case",
      "Negative n values \u2014 sequence_length never < negative, no expansion",
      "NULL n value \u2014 comparisons with NULL fail, no expansion",
      "Very large n \u2014 could exceed recursive query limits"
    ]
  },

  {
    id: 21,
    title: "Employees Status Change(Part-1)",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You work in the Human Resources (HR) department of a growing company that tracks the status of its employees year over year. The company needs to analyze employee status changes between two consecutive years: 2020 and 2021.

The company's HR system has two separate tables of employees for the years 2020 and 2021, which include each employee's unique identifier (emp_id) and their corresponding designation (role) within the organization.

The task is to track how the designations of employees have changed over the year. Specifically, you are required to identify the following changes:

Promoted: If an employee's designation has changed (e.g., from Trainee to Developer, or from Developer to Manager).
Resigned: If an employee was present in 2020 but has left the company by 2021.
New Hire: If an employee was hired in 2021 but was not present in 2020.

Assume that employees can only be promoted and cannot be demoted.`,
    schema: [
      {
        name: "emp_2020",
        columns: [
          { name: "emp_id", type: "int" },
          { name: "designation", type: "varchar" }
        ]
      },
      {
        name: "emp_2021",
        columns: [
          { name: "emp_id", type: "int" },
          { name: "designation", type: "varchar" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS emp_2020;
DROP TABLE IF EXISTS emp_2021;

CREATE TABLE emp_2020 (
  emp_id INT,
  designation VARCHAR
);

CREATE TABLE emp_2021 (
  emp_id INT,
  designation VARCHAR
);

INSERT INTO emp_2020 VALUES
(1, 'Trainee'),
(2, 'Developer'),
(3, 'Developer'),
(4, 'Manager'),
(5, 'Trainee');

INSERT INTO emp_2021 VALUES
(1, 'Developer'),
(2, 'Developer'),
(4, 'Senior Manager'),
(6, 'Trainee');
`,
    mySolution: `SELECT
    COALESCE(e20.emp_id, e21.emp_id) AS emp_id,
    e20.designation AS designation_2020,
    e21.designation AS designation_2021,
    CASE
        WHEN e20.emp_id IS NULL THEN 'New Hire'
        WHEN e21.emp_id IS NULL THEN 'Resigned'
        WHEN e20.designation != e21.designation THEN 'Promoted'
        ELSE 'No Change'
    END AS status
FROM emp_2020 e20
FULL OUTER JOIN emp_2021 e21 ON e20.emp_id = e21.emp_id;`,
    systemSolution: `SELECT
    COALESCE(e20.emp_id, e21.emp_id) AS emp_id,
    CASE
        WHEN e20.designation != e21.designation THEN 'Promoted'
        WHEN e21.designation IS NULL THEN 'Resigned'
        ELSE 'New Hire'
    END AS comment
FROM emp_2020 e20
LEFT JOIN emp_2021 e21 ON e20.emp_id = e21.emp_id
WHERE e20.designation != e21.designation
   OR e20.designation IS NULL
   OR e21.designation IS NULL

UNION

SELECT
    COALESCE(e20.emp_id, e21.emp_id) AS emp_id,
    CASE
        WHEN e20.designation != e21.designation THEN 'Promoted'
        WHEN e21.designation IS NULL THEN 'Resigned'
        ELSE 'New Hire'
    END AS comment
FROM emp_2021 e21
LEFT JOIN emp_2020 e20 ON e20.emp_id = e21.emp_id
WHERE e20.designation != e21.designation
   OR e20.designation IS NULL
   OR e21.designation IS NULL;`,
    starterCode: `-- Employees Status Change(Part-1)
-- Write your solution here
SELECT *
FROM emp_2020;`,
    businessImpact: `Year-over-year employee status tracking helps HR teams identify promotion velocity, attrition patterns, and hiring effectiveness. This data feeds into workforce planning, retention strategies, and organizational health dashboards.`,
    optimizationTips: [
      "FULL OUTER JOIN approach is cleaner and handles all three statuses in one pass",
      "UNION of two LEFT JOINs is an alternative when FULL OUTER JOIN isn't supported",
      "COALESCE handles NULLs from the outer join to find the employee ID",
      "Index on emp_id for efficient join between year tables"
    ],
    edgeCases: [
      "Employee present in both years with same designation \u2014 no change",
      "Employee only in 2020 \u2014 resigned",
      "Employee only in 2021 \u2014 new hire",
      "Employee with NULL designation in either year",
      "Same emp_id with different designations \u2014 promoted (demotion not possible per assumption)"
    ]
  },

  {
    id: 22,
    title: "Employees Status Change(Part-2)",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You work in the Human Resources (HR) department of a growing company that tracks the status of its employees year over year. The company needs to analyze employee status changes between two consecutive years: 2020 and 2021.

The company's HR system has two separate records of employees for the years 2020 and 2021 in the same table, which include each employee's unique identifier (emp_id) and their corresponding designation (role) within the organization for each year.

The task is to track how the designations of employees have changed over the year. Specifically, you are required to identify the following changes:

Promoted: If an employee's designation has changed (e.g., from Trainee to Developer, or from Developer to Manager).
Resigned: If an employee was present in 2020 but has left the company by 2021.
New Hire: If an employee was hired in 2021 but was not present in 2020.

Assume that employees can only be promoted and cannot be demoted.`,
    schema: [
      {
        name: "employees",
        columns: [
          { name: "emp_id", type: "int" },
          { name: "year", type: "int" },
          { name: "designation", type: "varchar" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  emp_id INT,
  year INT,
  designation VARCHAR
);

INSERT INTO employees VALUES
(1, 2020, 'Trainee'),
(1, 2021, 'Developer'),
(2, 2020, 'Developer'),
(2, 2021, 'Developer'),
(3, 2020, 'Developer'),
(4, 2020, 'Manager'),
(4, 2021, 'Senior Manager'),
(5, 2020, 'Trainee'),
(6, 2021, 'Trainee');
`,
    mySolution: `SELECT
  COALESCE(e.emp_id, e1.emp_id) AS emp_id,
  CASE
    WHEN e.designation != e1.designation THEN 'Promoted'
    WHEN e1.emp_id IS NULL THEN 'Resigned'
    ELSE 'New Hire'
  END AS comment
FROM employees e
LEFT JOIN employees e1 ON e.emp_id = e1.emp_id AND e1.year = 2021
WHERE e.year = 2020
  AND (e.designation != e1.designation OR e1.year IS NULL)
UNION
SELECT
  COALESCE(e.emp_id, e1.emp_id) AS emp_id,
  CASE
    WHEN e.designation != e1.designation THEN 'Promoted'
    WHEN e1.emp_id IS NULL THEN 'New Hire'
    ELSE 'Resigned'
  END AS comment
FROM employees e
LEFT JOIN employees e1 ON e.emp_id = e1.emp_id AND e.year > e1.year
WHERE e.year != 2020 AND e1.emp_id IS NULL`,
    systemSolution: `SELECT
    COALESCE(e20.emp_id, e21.emp_id) AS emp_id,
    CASE
        WHEN e20.designation != e21.designation THEN 'Promoted'
        WHEN e21.designation IS NULL THEN 'Resigned'
        ELSE 'New Hire'
    END AS comment
FROM employees e20
LEFT JOIN employees e21 ON e20.emp_id = e21.emp_id AND e21.year = 2021
WHERE e20.year = 2020
   AND (e20.designation != e21.designation
   OR e20.designation IS NULL
   OR e21.designation IS NULL)

UNION

SELECT
    COALESCE(e20.emp_id, e21.emp_id) AS emp_id,
    CASE
        WHEN e20.designation != e21.designation THEN 'Promoted'
        WHEN e21.designation IS NULL THEN 'Resigned'
        ELSE 'New Hire'
    END AS comment
FROM employees e21
LEFT JOIN employees e20 ON e20.emp_id = e21.emp_id AND e20.year = 2020
WHERE e21.year = 2021
  AND (e20.designation != e21.designation
   OR e20.designation IS NULL
   OR e21.designation IS NULL);`,
    starterCode: `-- Employees Status Change(Part-2)
-- Write your solution here
SELECT *
FROM employees;`,
    businessImpact: `Single-table year-over-year analysis uses self-join to compare employee records across time periods. This pattern is common in data warehouses storing slowly changing dimension data where historical records are preserved in the same table.`,
    optimizationTips: [
      "Self-join with year filter avoids pivot/unpivot operations",
      "UNION removes duplicates from both LEFT JOIN directions",
      "Index on (emp_id, year) for efficient self-join",
      "FULL OUTER JOIN alternative is cleaner when supported"
    ],
    edgeCases: [
      "Employee in both years with same designation \u2014 no change, not included",
      "Employee only in 2020 \u2014 resigned",
      "Employee only in 2021 \u2014 new hire",
      "Employee with multiple records in same year",
      "NULL designation in either year"
    ]
  },

  {
    id: 23,
    title: "Music Lovers",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `At Spotify, we track user activity to understand their engagement with the platform. One of the key metrics we focus on is how consistently a user listens to music each day. A user is considered "consistent" if they have login session every single day since their first login.

Your task is to identify users who have logged in and listened to music every single day since their first login date until today.


Note: Dates are as per UTC time zone.`,
    schema: [
      {
        name: "user_sessions",
        columns: [
          { name: "user_id", type: "int" },
          { name: "login_timestamp", type: "timestamp" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS user_sessions;

CREATE TABLE user_sessions (
  user_id INT,
  login_timestamp TIMESTAMP
);

INSERT INTO user_sessions VALUES
(1, '2024-01-01 08:00:00'),
(1, '2024-01-02 09:30:00'),
(1, '2024-01-03 07:45:00'),
(1, '2024-01-04 10:00:00'),
(1, '2024-01-05 08:30:00'),
(2, '2024-01-03 12:00:00'),
(2, '2024-01-04 14:00:00'),
(2, '2024-01-05 11:00:00'),
(3, '2024-01-01 09:00:00'),
(3, '2024-01-03 10:00:00'),
(3, '2024-01-05 08:00:00');
`,
    mySolution: `WITH cte AS (
SELECT user_id,
  MIN(CAST(login_timestamp AS DATE)) AS first_date,
  COUNT(DISTINCT CAST(login_timestamp AS DATE)) AS cnt
FROM user_sessions
GROUP BY user_id
)
SELECT user_id
FROM cte
WHERE cnt = (CURRENT_DATE - first_date) + 1`,
    systemSolution: `SELECT user_id
FROM user_sessions
GROUP BY user_id
HAVING COUNT(DISTINCT CAST(login_timestamp AS DATE)) =
  (CURRENT_DATE - MIN(CAST(login_timestamp AS DATE))) + 1;`,
    starterCode: `-- Music Lovers
-- Write your solution here
SELECT *
FROM user_sessions;`,
    businessImpact: `Identifying consistently engaged users helps Spotify measure platform stickiness, target retention campaigns, and understand what drives daily active usage. These "power users" are valuable for beta testing and premium upselling.`,
    optimizationTips: [
      "PostgreSQL date subtraction returns integer days directly (no DATEDIFF needed)",
      "CURRENT_DATE replaces MySQL's CURDATE()",
      "CAST(timestamp AS DATE) extracts date portion in PostgreSQL",
      "Index on (user_id, login_timestamp) for efficient grouping"
    ],
    edgeCases: [
      "User who joined today \u2014 cnt=1 and date diff+1=1, consistent",
      "Multiple logins on the same day \u2014 COUNT(DISTINCT date) handles this",
      "User with gap in login dates \u2014 cnt < expected, not consistent",
      "NULL login_timestamp values",
      "Timezone considerations if logins cross midnight"
    ]
  },

  {
    id: 24,
    title: "Customer Data Cleaning",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You are given a table with customers information that contains inconsistent and messy data. Your task is to clean the data by writing an SQL query to:


Trim extra spaces from the customer name and email fields.
Convert all email addresses to lowercase for consistency.
Remove duplicate records based on email address (keep the record with lower customer id).
Standardize the phone number format to only contain digits (remove dashes, spaces, and special characters).
Replace NULL values in address with 'Unknown'.

Sort the output by customer id.`,
    schema: [
      {
        name: "customers",
        columns: [
          { name: "customer_id", type: "int" },
          { name: "customer_name", type: "varchar" },
          { name: "email", type: "varchar" },
          { name: "phone", type: "varchar" },
          { name: "address", type: "varchar" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  customer_id INT,
  customer_name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  address VARCHAR
);

INSERT INTO customers VALUES
(1, '  John Smith  ', 'John@Email.COM', '123-456-7890', '123 Main St'),
(2, 'Jane Doe', 'JANE@email.com', '(987) 654 3210', NULL),
(3, ' Bob Wilson', 'john@email.com', '555.123.4567', '456 Oak Ave'),
(4, 'Alice Brown  ', 'Alice@Email.Com', '111-222-3333', '789 Pine Rd'),
(5, 'Charlie', 'jane@EMAIL.COM', '444 555 6666', NULL);
`,
    mySolution: `WITH RankedCustomers AS (
    SELECT
        customer_id,
        TRIM(customer_name) AS customer_name,
        LOWER(TRIM(email)) AS email,
        REGEXP_REPLACE(phone, '[^0-9]', '', 'g') AS phone,
        COALESCE(address, 'Unknown') AS address,
        ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY customer_id) AS rn
    FROM customers
)
SELECT customer_id, customer_name, email, phone, address
FROM RankedCustomers
WHERE rn = 1
ORDER BY customer_id;`,
    systemSolution: `WITH RankedCustomers AS (
    SELECT
        customer_id,
        TRIM(customer_name) AS customer_name,
        LOWER(TRIM(email)) AS email,
        REGEXP_REPLACE(phone, '[^0-9]', '', 'g') AS phone,
        COALESCE(address, 'Unknown') AS address,
        ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY customer_id) AS rn
    FROM customers
)
SELECT customer_id, customer_name, email, phone, address
FROM RankedCustomers
WHERE rn = 1
ORDER BY customer_id;`,
    starterCode: `-- Customer Data Cleaning
-- Write your solution here
SELECT *
FROM customers;`,
    businessImpact: `Data cleansing queries are critical for maintaining CRM integrity. Deduplication by email prevents over-counting customers, while standardized phone formats enable SMS campaigns. NULL address handling ensures complete mailing lists for physical marketing.`,
    optimizationTips: [
      "REGEXP_REPLACE with 'g' flag for global replacement in PostgreSQL (MySQL doesn't need it)",
      "ROW_NUMBER with PARTITION BY deduplicates while keeping the lowest customer_id",
      "COALESCE replaces NULL with defaults in one pass",
      "LOWER + TRIM normalization before partitioning ensures accurate deduplication"
    ],
    edgeCases: [
      "Multiple records with same email but different case/spacing",
      "NULL email \u2014 all NULL emails would be grouped together",
      "Phone number with only special characters \u2014 becomes empty string",
      "Address is empty string vs NULL \u2014 COALESCE only catches NULL",
      "Customer name with internal multiple spaces"
    ]
  },

  {
    id: 25,
    title: "Salary Difference",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `You are given an employees table containing information about employees' salaries across different departments. Your task is to calculate the difference between the highest and second-highest salaries for each department.
Conditions:
If a department has only one employee, return NULL for that department.
If all employees in a department have the same salary, return NULL for that department.


The final output should include Department Name and Salary Difference. Order by Department Name.`,
    schema: [
      {
        name: "employees",
        columns: [
          { name: "id", type: "int" },
          { name: "name", type: "VARCHAR" },
          { name: "department", type: "VARCHAR" },
          { name: "salary", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id INT,
  name VARCHAR,
  department VARCHAR,
  salary INT
);

INSERT INTO employees VALUES
(1, 'Alice', 'Engineering', 90000),
(2, 'Bob', 'Engineering', 85000),
(3, 'Carol', 'Engineering', 85000),
(4, 'Dave', 'Marketing', 70000),
(5, 'Eve', 'Marketing', 70000),
(6, 'Frank', 'Sales', 60000),
(7, 'Grace', 'HR', 75000),
(8, 'Henry', 'HR', 72000);
`,
    mySolution: `WITH cte AS (
SELECT department, salary,
  DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS rn
FROM employees
WHERE salary IS NOT NULL
)
SELECT department,
  MAX(CASE WHEN rn = 1 THEN salary END) -
  MAX(CASE WHEN rn = 2 THEN salary END) AS SalaryDifference
FROM cte
GROUP BY department
ORDER BY department`,
    systemSolution: `WITH RankedSalaries AS (
    SELECT department, salary,
        DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT department,
    MAX(CASE WHEN rnk = 1 THEN salary END) -
    MAX(CASE WHEN rnk = 2 THEN salary END) AS SalaryDifference
FROM RankedSalaries
GROUP BY department
ORDER BY department;`,
    starterCode: `-- Salary Difference
-- Write your solution here
SELECT *
FROM employees;`,
    businessImpact: `Salary gap analysis between top earners helps HR identify pay compression issues, ensure competitive compensation, and assess whether top performers are adequately differentiated from peers within each department.`,
    optimizationTips: [
      "DENSE_RANK handles tied salaries correctly \u2014 same salary gets same rank",
      "MAX with CASE WHEN pivots ranked rows into columnar format",
      "Subtraction of NULLs (single-employee department) naturally returns NULL",
      "Index on (department, salary DESC) for efficient ranking"
    ],
    edgeCases: [
      "Department with only one employee \u2014 no second rank, returns NULL",
      "All employees in department have same salary \u2014 no rank 2, returns NULL",
      "NULL salary values \u2014 should be filtered out",
      "Department with exactly two distinct salary levels",
      "Negative salary difference (impossible with DESC ranking)"
    ]
  },

  {
    id: 26,
    title: "Insured Amount",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `An insurance company analyzes the risk for an individual applicant/user before issuing the policy. Depending on the risk the insured amount for the user is different. You are provided with the user id, type of insurance and the risk for a user. Calculate the amount insured for every user based on the insurance type and risk.
Monthly premiums paid by users are:

$100 for Term Life and Whole Life
$400 for Health
$500 for Endowment
 

Calculate the amount insured for user by following criteria:

Term Life and Whole Life - 10%, 8.5% and 7% of the total amount collected in a year for Low, Medium and High risk users respectively
Health - 2%, 1.5% and 1% of the total amount collected in a year for Low, Medium and High risk users respectively
Endowment - 15%, 12% and 10% of the total amount collected in a year for Low, Medium and High risk users respectively
 

Note: Round off the insured values to an integer value and order the result by user id.`,
    schema: [
      {
        name: "users",
        columns: [
          { name: "user_id", type: "VARCHAR" },
          { name: "insurance_type", type: "VARCHAR" },
          { name: "risk", type: "VARCHAR" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id VARCHAR,
  insurance_type VARCHAR,
  risk VARCHAR
);

INSERT INTO users VALUES
('U001', 'Term Life', 'Low'),
('U002', 'Health', 'Medium'),
('U003', 'Endowment', 'High'),
('U004', 'Whole Life', 'Low'),
('U005', 'Health', 'Low'),
('U006', 'Endowment', 'Medium'),
('U007', 'Term Life', 'High');
`,
    mySolution: `WITH cte AS (
SELECT *,
  CASE
    WHEN insurance_type IN ('Term Life', 'Whole Life') THEN 12 * 100
    WHEN insurance_type = 'Health' THEN 12 * 400
    WHEN insurance_type = 'Endowment' THEN 12 * 500
  END AS premium,
  CASE
    WHEN insurance_type IN ('Term Life', 'Whole Life') AND risk = 'Low' THEN 0.1
    WHEN insurance_type IN ('Term Life', 'Whole Life') AND risk = 'Medium' THEN 0.085
    WHEN insurance_type IN ('Term Life', 'Whole Life') AND risk = 'High' THEN 0.07
    WHEN insurance_type = 'Health' AND risk = 'Low' THEN 0.02
    WHEN insurance_type = 'Health' AND risk = 'Medium' THEN 0.015
    WHEN insurance_type = 'Health' AND risk = 'High' THEN 0.01
    WHEN insurance_type = 'Endowment' AND risk = 'Low' THEN 0.15
    WHEN insurance_type = 'Endowment' AND risk = 'Medium' THEN 0.12
    WHEN insurance_type = 'Endowment' AND risk = 'High' THEN 0.1
  END AS risk_per
FROM users
)
SELECT user_id, insurance_type, risk,
  ROUND(SUM(premium * risk_per)) AS insured_amount
FROM cte
GROUP BY user_id, insurance_type, risk
ORDER BY user_id`,
    systemSolution: `WITH insurance_counts AS (
    SELECT insurance_type,
        COUNT(*) AS policy_count
    FROM users
    GROUP BY insurance_type
),
total_collection AS (
    SELECT SUM(
        CASE
            WHEN insurance_type IN ('Term Life', 'Whole Life')
                THEN policy_count * 12 * 100
            WHEN insurance_type = 'Health'
                THEN policy_count * 12 * 400
            ELSE
                policy_count * 12 * 500
        END
    ) AS total_collection
    FROM insurance_counts
)
SELECT u.*,
    ROUND(
        CASE
            WHEN u.insurance_type IN ('Term Life', 'Whole Life') THEN
                CASE
                    WHEN u.risk = 'Low'    THEN 0.10
                    WHEN u.risk = 'Medium' THEN 0.085
                    ELSE                        0.07
                END
            WHEN u.insurance_type = 'Health' THEN
                CASE
                    WHEN u.risk = 'Low'    THEN 0.02
                    WHEN u.risk = 'Medium' THEN 0.015
                    ELSE                        0.01
                END
            ELSE
                CASE
                    WHEN u.risk = 'Low'    THEN 0.15
                    WHEN u.risk = 'Medium' THEN 0.12
                    ELSE                        0.10
                END
        END
        * t.total_collection
    ) AS insured_amount
FROM users u
CROSS JOIN total_collection t
ORDER BY u.user_id;`,
    starterCode: `-- Insured Amount
-- Write your solution here
SELECT *
FROM users;`,
    businessImpact: `Insurance risk-based pricing ensures actuarial soundness by linking premiums to risk profiles. This calculation allows insurers to set appropriate coverage levels, maintain profitability, and offer competitive rates to low-risk customers while protecting against high-risk exposure.`,
    optimizationTips: [
      "Nested CASE expressions handle the two-dimensional lookup (insurance type \u00d7 risk level)",
      "CROSS JOIN with total collection CTE efficiently shares the aggregate value",
      "ROUND without decimal places gives integer result as required",
      "Consider a lookup table instead of hardcoded CASE for maintainability"
    ],
    edgeCases: [
      "Unknown insurance type or risk level \u2014 CASE returns NULL",
      "User with no premium data \u2014 premium calculation yields NULL",
      "All users in same risk category",
      "Single user in the system \u2014 total collection is just their premium",
      "Rounding precision with multiplication of decimals"
    ]
  },

  {
    id: 27,
    title: "CIBIL Score",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `CIBIL score, often referred to as a credit score, is a numerical representation of an individual's credit worthiness. While the exact formula used by credit bureaus like CIBIL may not be publicly disclosed and can vary slightly between bureaus, the following are some common factors that typically influence the calculation of a credit score:

Payment History: This accounts for the largest portion of your credit score. 
It includes factors such as whether you pay your bills on time, any late payments, defaults, bankruptcies, etc.
Assume this accounts for 70 percent of your credit score.
 
Credit Utilization Ratio: This is the ratio of your credit card balances to your credit limits.
Keeping this ratio low (ideally below 30%) indicates responsible credit usage. 
Assume it accounts for 30% of your score and below logic to calculate it:  
Utilization below 30% = 1
Utilization between 30% and 50% = 0.7
Utilization above 50% = 0.5
Assume that we have credit card bills data for March 2023 based on that we need to calculate credit utilization ratio. round the result to 1 decimal place.
 
Final Credit score formula = (on_time_loan_or_bill_payment)/total_bills_and_loans * 70 + Credit Utilization Ratio * 30 
Display the output in ascending order of customer id.`,
    schema: [
      {
        name: "customers",
        columns: [
          { name: "customer_id", type: "int" },
          { name: "credit_limit", type: "int" }
        ]
      },
      {
        name: "loans",
        columns: [
          { name: "customer_id", type: "int" },
          { name: "loan_id", type: "int" },
          { name: "loan_due_date", type: "date" }
        ]
      },
      {
        name: "credit_card_bills",
        columns: [
          { name: "bill_amount", type: "int" },
          { name: "bill_due_date", type: "date" },
          { name: "bill_id", type: "int" },
          { name: "customer_id", type: "int" }
        ]
      },
      {
        name: "customer_transactions",
        columns: [
          { name: "loan_bill_id", type: "int" },
          { name: "transaction_date", type: "date" },
          { name: "transaction_type", type: "varchar(10)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS customer_transactions;
DROP TABLE IF EXISTS credit_card_bills;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  customer_id INT,
  credit_limit INT
);

CREATE TABLE loans (
  customer_id INT,
  loan_id INT,
  loan_due_date DATE
);

CREATE TABLE credit_card_bills (
  bill_amount INT,
  bill_due_date DATE,
  bill_id INT,
  customer_id INT
);

CREATE TABLE customer_transactions (
  loan_bill_id INT,
  transaction_date DATE,
  transaction_type VARCHAR(10)
);

INSERT INTO customers VALUES (1, 50000), (2, 80000), (3, 30000);

INSERT INTO loans VALUES
(1, 101, '2023-03-15'),
(2, 102, '2023-03-20'),
(3, 103, '2023-03-10');

INSERT INTO credit_card_bills VALUES
(10000, '2023-03-05', 201, 1),
(20000, '2023-03-10', 202, 2),
(18000, '2023-03-08', 203, 3),
(5000, '2023-03-15', 204, 1);

INSERT INTO customer_transactions VALUES
(101, '2023-03-14', 'Loan'),
(102, '2023-03-21', 'Loan'),
(103, '2023-03-09', 'Loan'),
(201, '2023-03-04', 'Bill'),
(202, '2023-03-12', 'Bill'),
(203, '2023-03-07', 'Bill'),
(204, '2023-03-16', 'Bill');
`,
    mySolution: `WITH all_bills AS (
    SELECT customer_id, loan_id AS bill_id, loan_due_date AS due_date, 0 AS bill_amount
    FROM loans
    UNION ALL
    SELECT customer_id, bill_id, bill_due_date AS due_date, bill_amount
    FROM credit_card_bills
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
    systemSolution: `WITH all_bills AS (
    SELECT customer_id, loan_id AS bill_id, loan_due_date AS due_date, 0 AS bill_amount
    FROM loans
    UNION ALL
    SELECT customer_id, bill_id, bill_due_date AS due_date, bill_amount
    FROM credit_card_bills
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
    starterCode: `-- CIBIL Score
-- Write your solution here
SELECT *
FROM customers;`,
    businessImpact: `Credit scoring models assess borrower risk by weighing payment history (70%) and credit utilization (30%). Banks use these scores for loan approvals, interest rate determination, and risk-based pricing. Accurate scoring reduces default rates and improves portfolio quality.`,
    optimizationTips: [
      "UNION ALL combines loans and bills into a unified dataset for on-time calculation",
      "Multiply by 1.0 before division to force floating-point arithmetic in PostgreSQL",
      "CASE-based utilization buckets provide stepped scoring (1, 0.7, 0.5)",
      "Indexes on customer_id across all tables for efficient multi-table joins"
    ],
    edgeCases: [
      "Customer with no transactions \u2014 not in results due to INNER JOIN",
      "All payments on time \u2014 on_time_payments = total_bills, ratio = 1.0",
      "Credit limit of 0 \u2014 division by zero in utilization calculation",
      "Bill paid on exact due date \u2014 counts as on-time (<=)",
      "Customer with only loans and no credit card bills"
    ]
  },

  {
    id: 28,
    title: "New and Repeat Customers",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Flipkart wants to build a very important business metrics where they want to track on daily basis how many new and repeat customers are purchasing products from their website. A new customer is defined when he purchased anything for the first time from the website and repeat customer is someone who has done at least one purchase in the past.
 
Display order date , new customers , repeat customers  in ascending order of order_date.`,
    schema: [
      {
        name: "customer_orders",
        columns: [
          { name: "order_id", type: "int" },
          { name: "customer_id", type: "int" },
          { name: "order_date", type: "date" },
          { name: "order_amount", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS customer_orders;

CREATE TABLE customer_orders (
  order_id INT,
  customer_id INT,
  order_date DATE,
  order_amount INT
);

INSERT INTO customer_orders VALUES
(1, 101, '2024-01-01', 500),
(2, 102, '2024-01-01', 300),
(3, 101, '2024-01-02', 200),
(4, 103, '2024-01-02', 400),
(5, 102, '2024-01-03', 600),
(6, 104, '2024-01-03', 150),
(7, 101, '2024-01-03', 350),
(8, 105, '2024-01-04', 800);
`,
    mySolution: `WITH first_order_date AS (
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
    systemSolution: `WITH first_order_date AS (
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
    starterCode: `-- New and Repeat Customers
-- Write your solution here
SELECT *
FROM customer_orders;`,
    businessImpact: `Daily new vs repeat customer metrics are fundamental for e-commerce platforms to measure customer acquisition effectiveness, retention rates, and lifetime value trends. This data drives marketing budget allocation between acquisition and retention campaigns.`,
    optimizationTips: [
      "CTE with MIN(order_date) pre-computes first order for each customer",
      "CASE WHEN with SUM creates pivot-style aggregation in one pass",
      "Index on (customer_id, order_date) for efficient grouping and joining",
      "Could add a third metric: total orders per day for context"
    ],
    edgeCases: [
      "Customer with multiple orders on their first day \u2014 counted as new for each order",
      "Customer ordering only once \u2014 appears as new, never as repeat",
      "No orders on a specific date \u2014 date won't appear in results",
      "Same customer ordering multiple times on the same day after first day",
      "NULL order_date values"
    ]
  },

  {
    id: 29,
    title: "Workaholics Employees",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Write a query to find workaholics employees.  Workaholics employees are those who satisfy at least one of the given criterions:
Worked for more than 8 hours a day for at least 3 days in a week. 
worked for more than 10 hours a day for at least 2 days in a week. 
You are given the login and logout timings of all the employees for a given week. Write a SQL to find all the workaholic employees along with the criterion that they are satisfying (1,2 or both), display it in the order of increasing employee id`,
    schema: [
      {
        name: "employees",
        columns: [
          { name: "emp_id", type: "int" },
          { name: "login", type: "timestamp" },
          { name: "logout", type: "timestamp" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  emp_id INT,
  login TIMESTAMP,
  logout TIMESTAMP
);

INSERT INTO employees VALUES
(1, '2024-01-01 08:00:00', '2024-01-01 17:00:00'),
(1, '2024-01-02 07:30:00', '2024-01-02 18:00:00'),
(1, '2024-01-03 08:00:00', '2024-01-03 19:30:00'),
(1, '2024-01-04 09:00:00', '2024-01-04 18:00:00'),
(2, '2024-01-01 08:00:00', '2024-01-01 19:00:00'),
(2, '2024-01-02 07:00:00', '2024-01-02 18:30:00'),
(2, '2024-01-03 08:00:00', '2024-01-03 16:00:00'),
(3, '2024-01-01 09:00:00', '2024-01-01 17:00:00'),
(3, '2024-01-02 09:00:00', '2024-01-02 17:00:00');
`,
    mySolution: `WITH logged_hours AS (
SELECT *,
  EXTRACT(EPOCH FROM (logout - login)) / 3600.0 AS hours_worked,
  CASE
    WHEN EXTRACT(EPOCH FROM (logout - login)) / 3600.0 > 10 THEN '10+'
    WHEN EXTRACT(EPOCH FROM (logout - login)) / 3600.0 > 8 THEN '8+'
    ELSE '8-'
  END AS time_window
FROM employees
),
time_window AS (
  SELECT emp_id,
    COUNT(*) AS days_8,
    SUM(CASE WHEN time_window = '10+' THEN 1 ELSE 0 END) AS days_10
  FROM logged_hours
  WHERE time_window IN ('10+', '8+')
  GROUP BY emp_id
)
SELECT emp_id,
  CASE
    WHEN days_8 >= 3 AND days_10 >= 2 THEN 'both'
    WHEN days_8 >= 3 THEN '1'
    ELSE '2'
  END AS criterion
FROM time_window
WHERE days_8 >= 3 OR days_10 >= 2
ORDER BY emp_id ASC;`,
    systemSolution: `WITH logged_hours AS (
SELECT *,
  EXTRACT(EPOCH FROM (logout - login)) / 3600.0 AS hours_worked,
  CASE
    WHEN EXTRACT(EPOCH FROM (logout - login)) / 3600.0 > 10 THEN '10+'
    WHEN EXTRACT(EPOCH FROM (logout - login)) / 3600.0 > 8 THEN '8+'
    ELSE '8-'
  END AS time_window
FROM employees
),
time_window AS (
  SELECT emp_id,
    COUNT(*) AS days_8,
    SUM(CASE WHEN time_window = '10+' THEN 1 ELSE 0 END) AS days_10
  FROM logged_hours
  WHERE time_window IN ('10+', '8+')
  GROUP BY emp_id
)
SELECT emp_id,
  CASE
    WHEN days_8 >= 3 AND days_10 >= 2 THEN 'both'
    WHEN days_8 >= 3 THEN '1'
    ELSE '2'
  END AS criterion
FROM time_window
WHERE days_8 >= 3 OR days_10 >= 2
ORDER BY emp_id ASC;`,
    starterCode: `-- Workaholics Employees
-- Write your solution here
SELECT *
FROM employees;`,
    businessImpact: `Identifying employees with excessive working hours helps HR ensure labor law compliance, prevent burnout, and implement wellness programs. This analysis can flag potential overtime cost issues and help managers redistribute workload more effectively.`,
    optimizationTips: [
      "EXTRACT(EPOCH FROM interval) / 3600 converts to hours in PostgreSQL (replaces MySQL's TIMESTAMPDIFF)",
      "Categorizing into time windows first simplifies the counting logic",
      "WHERE filter on time_window reduces unnecessary aggregation of normal-hour days",
      "Multiple criteria with CASE WHEN avoids separate queries for each criterion"
    ],
    edgeCases: [
      "Employee working exactly 8 or 10 hours \u2014 strict > means not counted",
      "Login and logout on different days (overnight shift)",
      "NULL login or logout values",
      "Employee with exactly 3 days of 8+ hours but also 2 of those are 10+ \u2014 should be 'both'",
      "Employee with multiple login/logout pairs on the same day"
    ]
  },

  {
    id: 30,
    title: "Lift Overloaded (Part 2)",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are given a table of list of lifts , their maximum capacity and people along with their weight and gender who wants to enter into it. You need to make sure maximum people enter into the lift without lift getting overloaded but you need to give preference to female passengers first.
For each lift find the comma separated list of people who can be accomodated. The comma separated list should have female first and then people in the order of their weight in increasing order, display the output in increasing order of id.`,
    schema: [
      {
        name: "lifts",
        columns: [
          { name: "capacity_kg", type: "int" },
          { name: "id", type: "int" }
        ]
      },
      {
        name: "lift_passengers",
        columns: [
          { name: "passenger_name", type: "varchar(10)" },
          { name: "weight_kg", type: "int" },
          { name: "gender", type: "varchar(1)" },
          { name: "lift_id", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS lift_passengers;
DROP TABLE IF EXISTS lifts;

CREATE TABLE lifts (
  capacity_kg INT,
  id INT
);

CREATE TABLE lift_passengers (
  passenger_name VARCHAR(10),
  weight_kg INT,
  gender VARCHAR(1),
  lift_id INT
);

INSERT INTO lifts VALUES (200, 1), (300, 2);

INSERT INTO lift_passengers VALUES
('Alice', 55, 'F', 1),
('Bob', 80, 'M', 1),
('Carol', 60, 'F', 1),
('Dave', 90, 'M', 1),
('Eve', 50, 'F', 2),
('Frank', 85, 'M', 2),
('Grace', 65, 'F', 2),
('Henry', 70, 'M', 2),
('Ivy', 45, 'F', 2);
`,
    mySolution: `WITH running_weight AS (
SELECT l.id, lp.passenger_name, lp.weight_kg, l.capacity_kg, lp.gender,
  SUM(lp.weight_kg) OVER(
    PARTITION BY l.id
    ORDER BY CASE WHEN lp.gender = 'F' THEN 0 ELSE 1 END, lp.weight_kg
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_sum
FROM lifts l
INNER JOIN lift_passengers lp ON l.id = lp.lift_id
)
SELECT id,
  STRING_AGG(passenger_name, ',' ORDER BY CASE WHEN gender = 'F' THEN 0 ELSE 1 END, weight_kg) AS passenger_list
FROM running_weight
WHERE running_sum <= capacity_kg
GROUP BY id
ORDER BY id;`,
    systemSolution: `WITH running_weight AS (
SELECT l.id, lp.passenger_name, lp.weight_kg, l.capacity_kg, lp.gender,
  SUM(lp.weight_kg) OVER(
    PARTITION BY l.id
    ORDER BY CASE WHEN lp.gender = 'F' THEN 0 ELSE 1 END, lp.weight_kg
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_sum
FROM lifts l
INNER JOIN lift_passengers lp ON l.id = lp.lift_id
)
SELECT id,
  STRING_AGG(passenger_name, ',' ORDER BY CASE WHEN gender = 'F' THEN 0 ELSE 1 END, weight_kg) AS passenger_list
FROM running_weight
WHERE running_sum <= capacity_kg
GROUP BY id
ORDER BY id;`,
    starterCode: `-- Lift Overloaded (Part 2)
-- Write your solution here
SELECT *
FROM lifts;`,
    businessImpact: `Capacity-constrained resource allocation with priority ordering models real-world scenarios like elevator management, vehicle loading, and batch processing. The gender-priority ordering demonstrates how business rules can be incorporated into SQL optimization problems.`,
    optimizationTips: [
      "STRING_AGG replaces MySQL's GROUP_CONCAT with SEPARATOR syntax in PostgreSQL",
      "Running SUM with window function tracks cumulative weight without self-join",
      "CASE in ORDER BY implements female-first priority sorting",
      "WHERE running_sum <= capacity_kg filters passengers that exceed capacity"
    ],
    edgeCases: [
      "Lift where single heaviest female exceeds capacity",
      "All passengers are same gender \u2014 ordering falls back to weight only",
      "Lift with exact capacity match \u2014 <= includes boundary",
      "Empty lift (no passengers assigned)",
      "Multiple passengers with identical weight and gender"
    ]
  },

  {
    id: 31,
    title: "Trending Products",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Amazon wants to find out the trending products for each month. Trending products are those for which any given month sales are more than the sum of previous 2 months sales for that product.
Please note that for first 2 months of operations this metrics does not make sense. So output should start from 3rd month only.  Assume that each product has at least 1 sale each month, display order month and product id. Sort by order month.`,
    schema: [
      {
        name: "orders",
        columns: [
          { name: "order_month", type: "varchar(6)" },
          { name: "product_id", type: "varchar(5)" },
          { name: "sales", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  order_month VARCHAR(6),
  product_id VARCHAR(5),
  sales INT
);

INSERT INTO orders VALUES
('202301', 'P001', 100),
('202301', 'P002', 150),
('202302', 'P001', 120),
('202302', 'P002', 130),
('202303', 'P001', 250),
('202303', 'P002', 200),
('202304', 'P001', 180),
('202304', 'P002', 400),
('202305', 'P001', 300),
('202305', 'P002', 350);
`,
    mySolution: `WITH cte AS (
SELECT order_month, product_id, SUM(sales) AS total_sales
FROM orders
GROUP BY order_month, product_id
),
cte1 AS (
SELECT *,
  SUM(total_sales) OVER(PARTITION BY product_id ORDER BY order_month ROWS BETWEEN 2 PRECEDING AND 1 PRECEDING) AS ttl_sales
FROM cte
)
SELECT order_month, product_id
FROM cte1
WHERE total_sales > ttl_sales AND order_month > '202302'
ORDER BY order_month`,
    systemSolution: `WITH cte AS (
SELECT *,
  SUM(sales) OVER(PARTITION BY product_id ORDER BY order_month ROWS BETWEEN 2 PRECEDING AND 1 PRECEDING) AS last2,
  ROW_NUMBER() OVER(PARTITION BY product_id ORDER BY order_month) AS rn
FROM orders
)
SELECT order_month, product_id
FROM cte
WHERE rn >= 3 AND sales > last2
ORDER BY order_month, product_id ASC;`,
    starterCode: `-- Trending Products
-- Write your solution here
SELECT *
FROM orders;`,
    businessImpact: `Identifying trending products helps Amazon optimize inventory allocation, adjust pricing strategies, and feature products in promotional campaigns. Products with accelerating sales velocity may indicate emerging trends or successful marketing campaigns.`,
    optimizationTips: [
      "Window function with ROWS BETWEEN efficiently computes rolling sum of previous 2 months",
      "ROW_NUMBER filters out first 2 months where comparison is meaningless",
      "Partition by product_id ensures each product's trend is tracked independently",
      "Index on (product_id, order_month) for efficient window function computation"
    ],
    edgeCases: [
      "Product with no sales in one of the previous months \u2014 NULL in rolling sum",
      "Product with identical sales each month \u2014 never trending",
      "First two months of data \u2014 excluded from results",
      "Multiple products trending in the same month",
      "Product with sales in non-consecutive months"
    ]
  },

  {
    id: 32,
    title: "Uber Profit Rides",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `A profit ride for a Uber driver is considered when the start location and start time of a ride exactly match with the previous ride's end location and end time. 
Write an SQL to calculate total number of rides and total profit rides by each driver, display the output in ascending order of id.`,
    schema: [
      {
        name: "drivers",
        columns: [
          { name: "id", type: "varchar(10)" },
          { name: "start_loc", type: "varchar(1)" },
          { name: "start_time", type: "time" },
          { name: "end_loc", type: "varchar(1)" },
          { name: "end_time", type: "time" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS drivers;

CREATE TABLE drivers (
  id VARCHAR(10),
  start_loc VARCHAR(1),
  start_time TIME,
  end_loc VARCHAR(1),
  end_time TIME
);

INSERT INTO drivers VALUES
('D1', 'A', '08:00', 'B', '08:30'),
('D1', 'B', '08:30', 'C', '09:00'),
('D1', 'C', '09:00', 'D', '09:30'),
('D1', 'E', '10:00', 'F', '10:30'),
('D2', 'A', '08:00', 'B', '08:30'),
('D2', 'C', '09:00', 'D', '09:30'),
('D2', 'D', '09:30', 'E', '10:00');
`,
    mySolution: `WITH cte AS (
SELECT *,
  LEAD(start_time) OVER(PARTITION BY id ORDER BY start_time) AS next_start_time,
  LEAD(start_loc) OVER(PARTITION BY id ORDER BY start_time) AS next_start_loc
FROM drivers
)
SELECT id, COUNT(*) AS total_rides,
  SUM(CASE WHEN end_time = next_start_time AND end_loc = next_start_loc THEN 1 ELSE 0 END) AS profit_rides
FROM cte
GROUP BY id`,
    systemSolution: `WITH cte AS (
SELECT *,
  LAG(end_time, 1) OVER(PARTITION BY id ORDER BY start_time) AS prev_end_time,
  LAG(end_loc, 1) OVER(PARTITION BY id ORDER BY start_time) AS prev_end_loc
FROM drivers
)
SELECT id, COUNT(*) AS total_rides,
  SUM(CASE WHEN start_time = prev_end_time AND start_loc = prev_end_loc THEN 1 ELSE 0 END) AS profit_rides
FROM cte
GROUP BY id
ORDER BY id ASC;`,
    starterCode: `-- Uber Profit Rides
-- Write your solution here
SELECT *
FROM drivers;`,
    businessImpact: `Profit rides (back-to-back rides with no repositioning) indicate driver efficiency and demand density. This metric helps Uber optimize driver routing algorithms, identify high-demand corridors, and adjust surge pricing zones.`,
    optimizationTips: [
      "LAG and LEAD are interchangeable approaches \u2014 both capture consecutive ride transitions",
      "Partition by driver ID, ordered by start time ensures correct ride sequence",
      "CASE WHEN inside SUM creates a conditional count in one pass",
      "Index on (id, start_time) for efficient window function computation"
    ],
    edgeCases: [
      "Driver with only one ride \u2014 no profit ride possible",
      "Same end/start location but different times \u2014 not a profit ride",
      "Three consecutive profit rides \u2014 each pair counts separately",
      "NULL start or end locations",
      "Rides spanning midnight (time wraps around)"
    ]
  },

  {
    id: 33,
    title: "Product Recommendation",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Product recommendation. Just the basic type (“customers who bought this also bought…”). That, in its simplest form, is an outcome of basket analysis. Write a SQL to find the product pairs which have been purchased together in same order along with the purchase frequency (count of times they have been purchased together). Based on this data Amazon can recommend frequently bought together products to other users.

Order the output by purchase frequency in descending order. Please make in the output first product column has id greater than second product column.`,
    schema: [
      {
        name: "orders",
        columns: [
          { name: "order_id", type: "int" },
          { name: "product_id", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  order_id INT,
  product_id INT
);

INSERT INTO orders VALUES
(1, 101), (1, 102), (1, 103),
(2, 101), (2, 102),
(3, 102), (3, 103), (3, 104),
(4, 101), (4, 103),
(5, 102), (5, 104);
`,
    mySolution: `SELECT o.product_id, o1.product_id, COUNT(*) AS purchase_frequency
FROM orders o
INNER JOIN orders o1
  ON o.order_id = o1.order_id AND o.product_id > o1.product_id
GROUP BY o.product_id, o1.product_id
ORDER BY purchase_frequency DESC`,
    systemSolution: `SELECT
    o1.product_id AS product_1,
    o2.product_id AS product_2,
    COUNT(*) AS purchase_frequency
FROM orders o1
INNER JOIN orders o2
    ON o1.order_id = o2.order_id
WHERE o1.product_id > o2.product_id
GROUP BY o1.product_id, o2.product_id
ORDER BY purchase_frequency DESC;`,
    starterCode: `-- Product Recommendation
-- Write your solution here
SELECT *
FROM orders;`,
    businessImpact: `Market basket analysis identifies frequently co-purchased products, powering 'frequently bought together' recommendations. This drives cross-selling revenue, optimizes product bundling strategies, and improves inventory co-location in warehouses.`,
    optimizationTips: [
      "Self-join on order_id with product_id inequality avoids duplicate pairs",
      "WHERE clause (not ON) is clearer for the inequality filter",
      "product_1 > product_2 ensures consistent ordering of pairs",
      "Index on (order_id, product_id) for efficient self-join"
    ],
    edgeCases: [
      "Order with single product \u2014 no pairs generated",
      "Same product ordered multiple times in one order",
      "Product pair purchased only once \u2014 low confidence recommendation",
      "Very popular product appearing in most orders \u2014 high pair frequency but may not be meaningful",
      "No overlapping products between orders"
    ]
  },

  {
    id: 34,
    title: "Cancellation vs Return",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are given an orders table containing data about orders placed on an e-commerce website, with information on order date, delivery date, and cancel date. The task is to calculate both the cancellation rate and the return rate for each month based on the order date.

Definitions:

An order is considered cancelled if it is cancelled before delivery (i.e., cancel_date is not null, and delivery_date is null). If an order is cancelled, no delivery will take place.
An order is considered a return if it is cancelled after it has already been delivered (i.e., cancel_date is not null, and cancel_date > delivery_date).

Metrics to Calculate:
Cancel Rate = (Number of orders cancelled / Number of orders placed but not returned) * 100
Return Rate = (Number of orders returned / Number of orders placed but not cancelled) * 100

Write an SQL query to calculate the cancellation rate and return rate for each month (based on the order_date).Round the rates to 2 decimal places. Sort the output by year and month in increasing order.`,
    schema: [
      {
        name: "orders",
        columns: [
          { name: "order_id", type: "int" },
          { name: "order_date", type: "date" },
          { name: "customer_id", type: "int" },
          { name: "delivery_date", type: "date" },
          { name: "cancel_date", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  order_id INT,
  order_date DATE,
  customer_id INT,
  delivery_date DATE,
  cancel_date DATE
);

INSERT INTO orders VALUES
(1, '2024-01-05', 101, '2024-01-10', NULL),
(2, '2024-01-08', 102, NULL, '2024-01-09'),
(3, '2024-01-12', 103, '2024-01-15', '2024-01-18'),
(4, '2024-01-20', 104, '2024-01-25', NULL),
(5, '2024-02-01', 105, NULL, '2024-02-03'),
(6, '2024-02-05', 106, '2024-02-08', '2024-02-10'),
(7, '2024-02-10', 107, '2024-02-14', NULL),
(8, '2024-02-15', 108, '2024-02-18', NULL);
`,
    mySolution: `WITH combined AS (
SELECT
  EXTRACT(YEAR FROM order_date) AS order_year,
  EXTRACT(MONTH FROM order_date) AS order_month,
  CASE
    WHEN cancel_date IS NOT NULL AND delivery_date IS NULL THEN 1 ELSE 0
  END AS cancel_flag,
  CASE
    WHEN cancel_date IS NOT NULL AND cancel_date > delivery_date THEN 1 ELSE 0
  END AS return_flag
FROM orders
WHERE order_date IS NOT NULL
)
SELECT order_year, order_month,
  ROUND(SUM(cancel_flag) * 100.0 / NULLIF(COUNT(*) - SUM(return_flag), 0), 2) AS cancellation_rate,
  ROUND(SUM(return_flag) * 100.0 / NULLIF(COUNT(*) - SUM(cancel_flag), 0), 2) AS return_rate
FROM combined
GROUP BY order_year, order_month
ORDER BY order_year, order_month;`,
    systemSolution: `WITH cte AS (
SELECT EXTRACT(YEAR FROM order_date) AS order_year,
  EXTRACT(MONTH FROM order_date) AS order_month, order_id,
  CASE WHEN delivery_date IS NULL AND cancel_date IS NOT NULL
    THEN 1 ELSE 0 END AS cancel_flag,
  CASE WHEN delivery_date IS NOT NULL AND cancel_date IS NOT NULL
    THEN 1 ELSE 0 END AS return_flag
FROM orders
)
SELECT order_year, order_month,
  ROUND(SUM(cancel_flag) * 100.0 / (COUNT(*) - SUM(return_flag)), 2) AS cancellation_rate,
  ROUND(SUM(return_flag) * 100.0 / (COUNT(*) - SUM(cancel_flag)), 2) AS return_rate
FROM cte
GROUP BY order_year, order_month
ORDER BY order_year, order_month;`,
    starterCode: `-- Cancellation vs Return
-- Write your solution here
SELECT *
FROM orders;`,
    businessImpact: `Separating cancellation rates from return rates helps e-commerce platforms identify distinct operational issues: high cancellation suggests pricing/inventory problems, while high returns indicate product quality or listing accuracy issues. Monthly trends reveal seasonality and the impact of policy changes.`,
    optimizationTips: [
      "EXTRACT(YEAR/MONTH FROM) replaces MySQL's YEAR()/MONTH() in PostgreSQL",
      "NULLIF prevents division by zero when denominator could be 0",
      "Separate cancel and return flags enable independent rate calculations",
      "Index on order_date for efficient month-based grouping"
    ],
    edgeCases: [
      "Order with both delivery_date and cancel_date NULL \u2014 neither cancelled nor returned",
      "Cancel date before delivery date \u2014 cancelled before delivery",
      "Month with all orders cancelled \u2014 denominator for cancellation rate is 0",
      "No cancellations or returns in a month \u2014 both rates are 0",
      "Order cancelled and delivered on same date"
    ]
  },

  {
    id: 35,
    title: "Points Table",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are given table of cricket match played in a ICC cricket tournament with the details of winner for each match. You need to derive a points table using below rules.

For each win a team gets 2 points. 
For a loss team gets 0 points.
In case of a draw both the team gets 1 point each.
Display team name , matches played, # of wins , # of losses and points.  Sort output in ascending order of team name.`,
    schema: [
      {
        name: "icc_world_cup",
        columns: [
          { name: "team_1", type: "varchar(10)" },
          { name: "team_2", type: "varchar(10)" },
          { name: "winner", type: "varchar(10)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS icc_world_cup;

CREATE TABLE icc_world_cup (
  team_1 VARCHAR(10),
  team_2 VARCHAR(10),
  winner VARCHAR(10)
);

INSERT INTO icc_world_cup VALUES
('India', 'SL', 'India'),
('SL', 'Aus', 'Aus'),
('SA', 'Eng', 'Eng'),
('Eng', 'NZ', 'NZ'),
('Aus', 'India', 'India'),
('India', 'SA', 'Draw'),
('SL', 'Eng', 'SL');
`,
    mySolution: `WITH combined_flag AS (
SELECT team_1,
  CASE WHEN team_1 = winner THEN 1 ELSE 0 END AS winner_flag,
  CASE WHEN winner = 'Draw' THEN 1 ELSE 0 END AS draw_flag
FROM icc_world_cup
UNION ALL
SELECT team_2,
  CASE WHEN team_2 = winner THEN 1 ELSE 0 END AS winner_flag,
  CASE WHEN winner = 'Draw' THEN 1 ELSE 0 END AS draw_flag
FROM icc_world_cup
)
SELECT team_1 AS team_name,
  COUNT(*) AS match_played,
  SUM(winner_flag) AS no_of_wins,
  COUNT(*) - SUM(winner_flag) - SUM(draw_flag) AS no_of_losses,
  SUM(winner_flag) * 2 + SUM(draw_flag) AS total_points
FROM combined_flag
GROUP BY team_1
ORDER BY team_name;`,
    systemSolution: `WITH cte AS (
SELECT team_1 AS team_name,
  CASE WHEN team_1 = winner THEN 1 ELSE 0 END AS win_flag,
  CASE WHEN winner = 'Draw' THEN 1 ELSE 0 END AS draw_flag
FROM icc_world_cup
UNION ALL
SELECT team_2 AS team_name,
  CASE WHEN team_2 = winner THEN 1 ELSE 0 END AS win_flag,
  CASE WHEN winner = 'Draw' THEN 1 ELSE 0 END AS draw_flag
FROM icc_world_cup
)
SELECT team_name, COUNT(*) AS match_played,
  SUM(win_flag) AS no_of_wins,
  COUNT(*) - SUM(win_flag) - SUM(draw_flag) AS no_of_losses,
  2 * SUM(win_flag) + SUM(draw_flag) AS total_points
FROM cte
GROUP BY team_name
ORDER BY team_name;`,
    starterCode: `-- Points Table
-- Write your solution here
SELECT *
FROM icc_world_cup;`,
    businessImpact: `Tournament points table derivation from match results is a classic UNION ALL + aggregation pattern. It normalizes asymmetric match data (team_1 vs team_2) into a per-team view, applicable to any sports league, gaming leaderboard, or competitive ranking system.`,
    optimizationTips: [
      "UNION ALL unpivots team_1 and team_2 into a single team column for aggregation",
      "CASE WHEN flags computed inline avoid multiple passes over the data",
      "Losses computed as total - wins - draws avoids a third flag",
      "Points formula: 2*wins + draws computed in one expression"
    ],
    edgeCases: [
      "All matches drawn \u2014 every team has equal points",
      "Team plays itself (invalid data) \u2014 would double-count",
      "Winner value doesn't match either team (invalid data)",
      "Team with zero wins and zero draws \u2014 all losses",
      "Single match in tournament"
    ]
  },

  {
    id: 36,
    title: "Employees Inside Office (Part 2)",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `A company record its employee's movement In and Out of office in a table. Please note below points about the data:

First entry for each employee is “in”
Every “in” is succeeded by an “out”
Employee can work across days
Write an SQL to measure the time spent by each employee inside the office between “2019-04-01 14:00:00” and “2019-04-02 10:00:00" in minutes, display the output in ascending order of employee id .`,
    schema: [
      {
        name: "employee_record",
        columns: [
          { name: "emp_id", type: "int" },
          { name: "action", type: "varchar(3)" },
          { name: "created_at", type: "timestamp" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS employee_record;

CREATE TABLE employee_record (
  emp_id INT,
  action VARCHAR(3),
  created_at TIMESTAMP
);

INSERT INTO employee_record VALUES
(1, 'in', '2019-04-01 09:00:00'),
(1, 'out', '2019-04-01 17:00:00'),
(1, 'in', '2019-04-01 18:00:00'),
(1, 'out', '2019-04-02 06:00:00'),
(2, 'in', '2019-04-01 12:00:00'),
(2, 'out', '2019-04-01 23:00:00'),
(2, 'in', '2019-04-02 08:00:00'),
(2, 'out', '2019-04-02 12:00:00'),
(3, 'in', '2019-04-01 10:00:00'),
(3, 'out', '2019-04-01 15:00:00');
`,
    mySolution: `WITH cte AS (
SELECT *,
  LEAD(created_at) OVER(PARTITION BY emp_id ORDER BY created_at) AS out_time
FROM employee_record
),
created_window AS (
SELECT emp_id,
  CASE WHEN created_at <= '2019-04-01 14:00:00'::TIMESTAMP THEN '2019-04-01 14:00:00'::TIMESTAMP ELSE created_at END AS final_in_time,
  CASE WHEN out_time > '2019-04-02 10:00:00'::TIMESTAMP THEN '2019-04-02 10:00:00'::TIMESTAMP ELSE out_time END AS final_out_time
FROM cte
WHERE action = 'in'
)
SELECT emp_id,
  SUM(CASE WHEN final_in_time > final_out_time THEN 0
    ELSE EXTRACT(EPOCH FROM (final_out_time - final_in_time)) / 60
  END) AS time_spent_in_mins
FROM created_window
GROUP BY emp_id
ORDER BY emp_id`,
    systemSolution: `WITH cte AS (
SELECT *,
  LEAD(created_at) OVER(PARTITION BY emp_id ORDER BY created_at) AS next_created_at
FROM employee_record
),
considered_time AS (
SELECT emp_id,
  CASE WHEN created_at < '2019-04-01 14:00:00'::TIMESTAMP THEN '2019-04-01 14:00:00'::TIMESTAMP ELSE created_at END AS in_time,
  CASE WHEN next_created_at > '2019-04-02 10:00:00'::TIMESTAMP THEN '2019-04-02 10:00:00'::TIMESTAMP ELSE next_created_at END AS out_time
FROM cte
WHERE action = 'in'
)
SELECT emp_id,
  ROUND(SUM(CASE WHEN in_time >= out_time THEN 0
    ELSE EXTRACT(EPOCH FROM (out_time - in_time)) / 60
  END), 1) AS time_spent_in_mins
FROM considered_time
GROUP BY emp_id
ORDER BY emp_id;`,
    starterCode: `-- Employees Inside Office (Part 2)
-- Write your solution here
SELECT *
FROM employee_record;`,
    businessImpact: `Time-windowed employee attendance tracking between specific timestamps requires clipping in/out times to the observation window. This pattern applies broadly to billing calculations, resource utilization during maintenance windows, and shift-overlap analysis.`,
    optimizationTips: [
      "EXTRACT(EPOCH FROM interval) / 60 converts to minutes in PostgreSQL (replaces TIMESTAMPDIFF)",
      "LEAD pairs each 'in' with the next 'out' chronologically",
      "CASE clipping to window boundaries handles sessions spanning the observation period",
      "Filter action='in' ensures only in-out pairs are measured"
    ],
    edgeCases: [
      "Employee enters before the window starts \u2014 clip in_time to window start",
      "Employee exits after the window ends \u2014 clip out_time to window end",
      "Employee entirely outside the window \u2014 in_time > out_time, returns 0",
      "Employee works across midnight within the window",
      "Multiple in/out cycles within the window for same employee"
    ]
  },

  {
    id: 37,
    title: "LinkedIn Recommendation",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `LinkedIn stores information of post likes in below format. Every time a user likes a post there will be an entry made in post likes table.`,
    schema: [
      {
        name: "post_likes",
        columns: [
          { name: "post_id", type: "int" },
          { name: "user_id", type: "int" }
        ]
      },
      {
        name: "user_follows",
        columns: [
          { name: "user_id", type: "int" },
          { name: "follows_user_id", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS user_follows;

CREATE TABLE post_likes (
  post_id INT,
  user_id INT
);

CREATE TABLE user_follows (
  user_id INT,
  follows_user_id INT
);

INSERT INTO post_likes VALUES
(1, 101), (1, 102), (2, 101),
(2, 103), (3, 102), (3, 103),
(4, 101), (4, 104), (5, 102);

INSERT INTO user_follows VALUES
(201, 101), (201, 102),
(202, 103), (202, 101),
(203, 104);
`,
    mySolution: `WITH followed_likes AS (
    SELECT
        u.user_id,
        p.post_id,
        COUNT(*) AS like_count
    FROM user_follows u
    INNER JOIN post_likes p
        ON u.follows_user_id = p.user_id
    GROUP BY u.user_id, p.post_id
),
ranked AS (
    SELECT
        fl.user_id,
        fl.post_id,
        fl.like_count,
        ROW_NUMBER() OVER (
            PARTITION BY fl.user_id
            ORDER BY fl.like_count DESC, fl.post_id
        ) AS rn
    FROM followed_likes fl
    LEFT JOIN post_likes my_likes
        ON fl.user_id = my_likes.user_id
        AND fl.post_id = my_likes.post_id
    WHERE my_likes.post_id IS NULL
)
SELECT user_id, post_id, like_count
FROM ranked
WHERE rn = 1
ORDER BY user_id;`,
    systemSolution: `WITH cte AS (
SELECT f.user_id, p.post_id, COUNT(*) AS no_of_likes
FROM user_follows f
INNER JOIN post_likes p ON f.follows_user_id = p.user_id
GROUP BY f.user_id, p.post_id
)
SELECT user_id, post_id, no_of_likes FROM (
SELECT cte.*,
  ROW_NUMBER() OVER(PARTITION BY cte.user_id ORDER BY no_of_likes DESC, cte.post_id) AS rn
FROM cte
LEFT JOIN post_likes p ON p.user_id = cte.user_id AND p.post_id = cte.post_id
WHERE p.post_id IS NULL
) s
WHERE rn = 1
ORDER BY user_id;`,
    starterCode: `-- LinkedIn Recommendation
-- Write your solution here
SELECT *
FROM post_likes;`,
    businessImpact: `Social media feed recommendation based on network activity \u2014 recommending posts liked by people you follow, excluding posts you've already liked. This collaborative filtering approach drives engagement by surfacing relevant content from a user's social graph.`,
    optimizationTips: [
      "JOIN between user_follows and post_likes identifies posts liked by followed users",
      "LEFT JOIN with IS NULL exclusion filters out already-liked posts",
      "ROW_NUMBER with like_count DESC picks the most-liked unread post per user",
      "Index on (user_id, post_id) in both tables for efficient joins"
    ],
    edgeCases: [
      "User follows nobody \u2014 no recommendations",
      "User has already liked all posts from followed users",
      "Multiple posts with same like count \u2014 secondary sort by post_id breaks tie",
      "User follows someone who hasn't liked any posts",
      "Circular follows (A follows B, B follows A)"
    ]
  },

  {
    id: 38,
    title: "Dashboard Visits",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You're working as a data analyst for a popular website's dashboard analytics team. Your task is to analyze user visits to the dashboard and identify users who are highly engaged with the platform. The dashboard records user visits along with timestamps to provide insights into user activity patterns.
A user can visit the dashboard multiple times within a day. However, to be counted as separate visits, there should be a minimum gap of 60 minutes between consecutive visits. If the next visit occurs within 60 minutes of the previous one, it's considered part of the same visit.`,
    schema: [
      {
        name: "dashboard_visit",
        columns: [
          { name: "user_id", type: "varchar(10)" },
          { name: "visit_time", type: "timestamp" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS dashboard_visit;

CREATE TABLE dashboard_visit (
  user_id VARCHAR(10),
  visit_time TIMESTAMP
);

INSERT INTO dashboard_visit VALUES
('U1', '2024-01-01 08:00:00'),
('U1', '2024-01-01 08:30:00'),
('U1', '2024-01-01 10:00:00'),
('U1', '2024-01-02 09:00:00'),
('U2', '2024-01-01 12:00:00'),
('U2', '2024-01-01 12:45:00'),
('U2', '2024-01-01 14:00:00'),
('U3', '2024-01-01 10:00:00');
`,
    mySolution: `WITH previous_visits AS (
    SELECT
        user_id,
        visit_time,
        LAG(visit_time) OVER (PARTITION BY user_id ORDER BY visit_time) AS previous_visit_time
    FROM dashboard_visit
),
visit_flag AS (
SELECT user_id, previous_visit_time, visit_time,
  CASE
    WHEN previous_visit_time IS NULL THEN 1
    WHEN EXTRACT(EPOCH FROM (visit_time - previous_visit_time)) / 3600 > 1 THEN 1
    ELSE 0
  END AS new_visit_flag
FROM previous_visits
)
SELECT user_id,
  SUM(new_visit_flag) AS no_of_visits,
  COUNT(DISTINCT CAST(visit_time AS DATE)) AS visit_days
FROM visit_flag
GROUP BY user_id
ORDER BY user_id ASC;`,
    systemSolution: `WITH previous_visits AS (
    SELECT
        user_id,
        visit_time,
        LAG(visit_time) OVER (PARTITION BY user_id ORDER BY visit_time) AS previous_visit_time
    FROM dashboard_visit
),
visit_flag AS (
SELECT user_id, previous_visit_time, visit_time,
  CASE
    WHEN previous_visit_time IS NULL THEN 1
    WHEN EXTRACT(EPOCH FROM (visit_time - previous_visit_time)) / 3600 > 1 THEN 1
    ELSE 0
  END AS new_visit_flag
FROM previous_visits
)
SELECT user_id,
  SUM(new_visit_flag) AS no_of_visits,
  COUNT(DISTINCT CAST(visit_time AS DATE)) AS visit_days
FROM visit_flag
GROUP BY user_id
ORDER BY user_id ASC;`,
    starterCode: `-- Dashboard Visits
-- Write your solution here
SELECT *
FROM dashboard_visit;`,
    businessImpact: `Session-based visit counting (merging events within 60 minutes) provides more accurate engagement metrics than raw page views. This pattern is standard in web analytics and helps distinguish true user sessions from rapid refreshes or multi-tab browsing.`,
    optimizationTips: [
      "LAG identifies the previous visit time for gap calculation",
      "EXTRACT(EPOCH FROM interval) / 3600 converts to hours in PostgreSQL",
      "First visit per user (NULL previous) automatically starts a new session",
      "CAST(visit_time AS DATE) with COUNT(DISTINCT) gives unique visit days"
    ],
    edgeCases: [
      "User with exactly 60-minute gap \u2014 not > 1 hour, so same session",
      "User with single visit \u2014 1 visit, 1 visit day",
      "Multiple visits on different days within 60 minutes of midnight",
      "NULL visit_time values",
      "Visits spanning midnight \u2014 gap calculation still works on timestamps"
    ]
  },

  {
    id: 39,
    title: "Final Account Balance",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are given history of your bank account for the year 2020. Each transaction is either a credit card payment or incoming transfer. There is a fee of holding a credit card which you have to pay every month, Fee is 5 per month. However, you are not charged for a given month if you made at least 2 credit card payments for a total cost of at least 100 within that month. Note that this fee is not included in the supplied history of transactions.
Each row in the table contains information about a single transaction. If the amount value is negative, it is a credit card payment otherwise it is an incoming transfer. At the beginning of the year, the balance of your account was 0 . Your task is to compute the balance at the end of the year.`,
    schema: [
      {
        name: "Transactions",
        columns: [
          { name: "amount", type: "int" },
          { name: "transaction_date", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS Transactions;

CREATE TABLE Transactions (
  amount INT,
  transaction_date DATE
);

INSERT INTO Transactions VALUES
(1000, '2020-01-06'),
(-200, '2020-01-14'),
(-50, '2020-01-25'),
(400, '2020-02-10'),
(-100, '2020-02-15'),
(-80, '2020-02-28'),
(300, '2020-03-05'),
(-150, '2020-03-20'),
(-60, '2020-04-01'),
(500, '2020-06-15');
`,
    mySolution: `WITH cte AS (
SELECT
  EXTRACT(MONTH FROM transaction_date) AS mnt,
  SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) AS card_payment,
  COUNT(CASE WHEN amount < 0 THEN 1 END) AS cnt_card_payment,
  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS incoming_transfer
FROM transactions
GROUP BY EXTRACT(MONTH FROM transaction_date)
),
cte1 AS (
SELECT
  CASE WHEN card_payment <= -100 AND cnt_card_payment >= 2 THEN 0 ELSE -5 END + card_payment + incoming_transfer AS total
FROM cte
)
SELECT SUM(total) + -5 * (12 - (SELECT COUNT(DISTINCT mnt) FROM cte)) AS final_balance
FROM cte1`,
    systemSolution: `WITH cte AS (
SELECT EXTRACT(MONTH FROM transaction_date) AS tran_month, amount
FROM transactions
),
cte2 AS (
SELECT tran_month,
  SUM(amount) AS net_amount,
  SUM(CASE WHEN amount < 0 THEN -1 * amount ELSE 0 END) AS credit_card_amount,
  SUM(CASE WHEN amount < 0 THEN 1 ELSE 0 END) AS credit_card_transact_cnt
FROM cte
GROUP BY tran_month
)
SELECT SUM(net_amount)
  - SUM(CASE WHEN credit_card_amount >= 100 AND credit_card_transact_cnt >= 2 THEN 0 ELSE 5 END)
  - 5 * (12 - (SELECT COUNT(DISTINCT tran_month) FROM cte)) AS final_balance
FROM cte2;`,
    starterCode: `-- Final Account Balance
-- Write your solution here
SELECT *
FROM Transactions;`,
    businessImpact: `Banking fee calculation with conditional waiver rules requires month-by-month aggregation and business logic application. This pattern is common in financial systems where fees are waived based on activity thresholds, loyalty tiers, or minimum balance requirements.`,
    optimizationTips: [
      "EXTRACT(MONTH FROM) replaces MySQL's MONTH() in PostgreSQL",
      "Negative amounts for credit card payments enables simple sign-based classification",
      "Months with no transactions still incur the $5 fee \u2014 handled by 12 - COUNT(DISTINCT month)",
      "CASE WHEN for fee waiver check: >= 2 payments AND >= $100 total"
    ],
    edgeCases: [
      "Month with no transactions \u2014 fee still applies ($5)",
      "Month with exactly 2 payments totaling exactly $100 \u2014 fee waived",
      "Month with 1 large payment > $100 \u2014 fee NOT waived (need >= 2 payments)",
      "All 12 months have qualifying transactions \u2014 no additional fees",
      "Transaction amount of exactly 0"
    ]
  },

  {
    id: 40,
    title: "Prime Subscription",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Amazon, the world's largest online retailer, offers various services to its customers, including Amazon Prime membership, Video streaming, Amazon Music, Amazon Pay, and more. The company is interested in analyzing which of its services are most effective at converting regular customers into Amazon Prime members.
You are given a table of events which consists services accessed by each users along with service access date. This table also contains the event when customer bought the prime membership (type='prime').
Write an SQL to get date when each customer became prime member, last service used and last service access date (just before becoming prime member). If a customer never became prime member, then populate only the last service used and last service access date by the customer, display the output in ascending order of last service access date.`,
    schema: [
      {
        name: "users",
        columns: [
          { name: "name", type: "varchar(15)" },
          { name: "user_id", type: "int" }
        ]
      },
      {
        name: "events",
        columns: [
          { name: "user_id", type: "int" },
          { name: "type", type: "varchar(15)" },
          { name: "access_date", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  name VARCHAR(15),
  user_id INT
);

CREATE TABLE events (
  user_id INT,
  type VARCHAR(15),
  access_date DATE
);

INSERT INTO users VALUES
('Alice', 1), ('Bob', 2), ('Carol', 3);

INSERT INTO events VALUES
(1, 'Video', '2024-01-01'),
(1, 'Music', '2024-01-05'),
(1, 'Prime', '2024-01-10'),
(2, 'Pay', '2024-01-02'),
(2, 'Video', '2024-01-08'),
(2, 'Music', '2024-01-15'),
(3, 'Video', '2024-01-03'),
(3, 'Music', '2024-01-07'),
(3, 'Prime', '2024-01-12');
`,
    mySolution: `WITH cte AS (
SELECT *,
  LAG(type, 1) OVER(PARTITION BY user_id ORDER BY access_date) AS prev_service,
  LAG(access_date, 1) OVER(PARTITION BY user_id ORDER BY access_date) AS prev_date,
  ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY access_date DESC) AS rn
FROM events
)
SELECT u.name AS user_name,
  c.access_date AS prime_member_date,
  COALESCE(c.prev_service, c1.type) AS last_access_service,
  COALESCE(c.prev_date, c1.access_date) AS last_access_service_date
FROM users u
LEFT JOIN cte c ON u.user_id = c.user_id AND c.type = 'Prime'
LEFT JOIN cte c1 ON u.user_id = c1.user_id AND c1.rn = 1
ORDER BY last_access_service_date`,
    systemSolution: `WITH cte AS (
SELECT *,
  LAG(type, 1) OVER(PARTITION BY user_id ORDER BY access_date) AS prev_type,
  LAG(access_date, 1) OVER(PARTITION BY user_id ORDER BY access_date) AS prev_access_date,
  ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY access_date DESC) AS rn
FROM events
)
SELECT u.name AS user_name,
  cte.access_date AS prime_member_date,
  COALESCE(cte.prev_type, c.type) AS last_access_service,
  COALESCE(cte.prev_access_date, c.access_date) AS last_access_service_date
FROM users u
LEFT JOIN cte ON u.user_id = cte.user_id AND cte.type = 'Prime'
LEFT JOIN cte c ON c.user_id = u.user_id AND c.rn = 1
ORDER BY last_access_service_date;`,
    starterCode: `-- Prime Subscription
-- Write your solution here
SELECT *
FROM users;`,
    businessImpact: `Funnel analysis identifying which service was the last touchpoint before Prime conversion helps Amazon optimize its upselling strategy. For non-Prime users, the last accessed service indicates the best channel for targeted Prime promotions.`,
    optimizationTips: [
      "LAG gets the previous service/date before Prime conversion event",
      "ROW_NUMBER DESC gets the most recent event for non-Prime users",
      "COALESCE falls back to the most recent event when user isn't Prime",
      "Double LEFT JOIN handles both Prime and non-Prime users in one query"
    ],
    edgeCases: [
      "User with Prime as their first event \u2014 no previous service (NULL)",
      "User who never becomes Prime \u2014 prime_member_date is NULL",
      "User with no events at all \u2014 all fields NULL",
      "Case sensitivity: 'prime' vs 'Prime' \u2014 check data consistency",
      "User with multiple Prime events (re-subscription)"
    ]
  },

  {
    id: 41,
    title: "Employee Name",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `The HR department needs to extract the first name, middle name and last name of each employee from the full name column. However, the full name column contains names in the format "Lastname,Firstname Middlename". 
Please consider that an employee name can be in one of the 3 following formats.
"Lastname,Firstname Middlename"
"Lastname,Firstname"
"Firstname"`,
    schema: [
      {
        name: "employee",
        columns: [
          { name: "employeeid", type: "int" },
          { name: "fullname", type: "varchar(20)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS employee;

CREATE TABLE employee (
  employeeid INT,
  fullname VARCHAR(40)
);

INSERT INTO employee VALUES
(1, 'Smith,John Michael'),
(2, 'Doe,Jane'),
(3, 'Alice'),
(4, 'Johnson,Bob William'),
(5, 'Brown,Mary');
`,
    mySolution: `WITH cte AS (
SELECT *, POSITION(',' IN fullname) AS comma_position,
  POSITION(' ' IN fullname) AS space_position
FROM employee
)
SELECT fullname,
  CASE WHEN comma_position = 0 THEN fullname
    WHEN space_position > 0 THEN SUBSTR(fullname, comma_position + 1, space_position - comma_position - 1)
    ELSE SUBSTR(fullname, comma_position + 1, LENGTH(fullname) - comma_position)
  END AS first_name,
  CASE WHEN space_position = 0 THEN NULL
    ELSE SUBSTR(fullname, space_position + 1, LENGTH(fullname) - space_position)
  END AS middle_name,
  CASE WHEN comma_position = 0 THEN NULL
    ELSE SUBSTR(fullname, 1, comma_position - 1)
  END AS last_name
FROM cte;`,
    systemSolution: `WITH cte AS (
SELECT *, POSITION(',' IN fullname) AS comma_position,
  POSITION(' ' IN fullname) AS space_position
FROM employee
)
SELECT fullname,
  CASE WHEN comma_position = 0 THEN fullname
    WHEN space_position > 0 THEN SUBSTR(fullname, comma_position + 1, space_position - comma_position - 1)
    ELSE SUBSTR(fullname, comma_position + 1, LENGTH(fullname) - comma_position)
  END AS first_name,
  CASE WHEN space_position = 0 THEN NULL
    ELSE SUBSTR(fullname, space_position + 1, LENGTH(fullname) - space_position)
  END AS middle_name,
  CASE WHEN comma_position = 0 THEN NULL
    ELSE SUBSTR(fullname, 1, comma_position - 1)
  END AS last_name
FROM cte;`,
    starterCode: `-- Employee Name
-- Write your solution here
SELECT *
FROM employee;`,
    businessImpact: `Name parsing from combined full name fields is a common data cleansing task. Proper first/middle/last name separation enables personalized communications, duplicate detection, and integration with external systems that require structured name fields.`,
    optimizationTips: [
      "POSITION() replaces MySQL's INSTR() in PostgreSQL",
      "SUBSTR with computed offsets handles variable-length name parts",
      "CASE WHEN handles three different name formats cleanly",
      "CTE computes delimiter positions once, reused in multiple CASE expressions"
    ],
    edgeCases: [
      "Name with only first name (no comma, no space)",
      "Name with first and last but no middle name",
      "Name with all three parts",
      "NULL or empty fullname values",
      "Names with multiple spaces or special characters"
    ]
  },

  {
    id: 42,
    title: "Rider Ride Time",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are working with Zomato, a food delivery platform, and you need to analyze the performance of Zomato riders in terms of the time they spend delivering orders each day. Given the pickup and delivery times for each order, your task is to calculate the duration of time spent by each rider on deliveries each day.  Order the output by rider id and ride date.`,
    schema: [
      {
        name: "orders",
        columns: [
          { name: "rider_id", type: "int" },
          { name: "order_id", type: "int" },
          { name: "pickup_time", type: "timestamp" },
          { name: "delivery_time", type: "timestamp" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  rider_id INT,
  order_id INT,
  pickup_time TIMESTAMP,
  delivery_time TIMESTAMP
);

INSERT INTO orders VALUES
(1, 101, '2024-01-01 10:00:00', '2024-01-01 10:30:00'),
(1, 102, '2024-01-01 11:00:00', '2024-01-01 11:45:00'),
(1, 103, '2024-01-01 22:00:00', '2024-01-02 00:30:00'),
(2, 104, '2024-01-01 09:00:00', '2024-01-01 09:20:00'),
(2, 105, '2024-01-01 14:00:00', '2024-01-01 14:50:00'),
(2, 106, '2024-01-01 23:00:00', '2024-01-02 01:00:00');
`,
    mySolution: `WITH cte AS (
SELECT rider_id, pickup_time,
  EXTRACT(EPOCH FROM (delivery_time - pickup_time)) / 60 AS ride_time_mins
FROM orders
WHERE CAST(pickup_time AS DATE) = CAST(delivery_time AS DATE)
UNION ALL
SELECT rider_id, pickup_time,
  EXTRACT(EPOCH FROM (CAST(delivery_time AS DATE) - pickup_time)) / 60 AS ride_time_mins
FROM orders
WHERE CAST(pickup_time AS DATE) != CAST(delivery_time AS DATE)
UNION ALL
SELECT rider_id, delivery_time,
  EXTRACT(EPOCH FROM (delivery_time - CAST(delivery_time AS DATE))) / 60 AS ride_time_mins
FROM orders
WHERE CAST(pickup_time AS DATE) != CAST(delivery_time AS DATE)
)
SELECT rider_id,
  CAST(pickup_time AS DATE) AS ride_date,
  SUM(ride_time_mins) AS ride_time_mins
FROM cte
GROUP BY rider_id, CAST(pickup_time AS DATE)
HAVING SUM(ride_time_mins) > 0
ORDER BY rider_id, ride_date;`,
    systemSolution: `WITH cte AS (
SELECT order_id, rider_id, CAST(pickup_time AS DATE) AS ride_date,
  EXTRACT(EPOCH FROM (delivery_time - pickup_time)) / 60 AS ride_time
FROM orders
WHERE CAST(pickup_time AS DATE) = CAST(delivery_time AS DATE)
UNION ALL
SELECT order_id, rider_id, CAST(pickup_time AS DATE) AS ride_date,
  EXTRACT(EPOCH FROM (CAST(delivery_time AS DATE) - pickup_time)) / 60 AS ride_time
FROM orders
WHERE CAST(pickup_time AS DATE) != CAST(delivery_time AS DATE)
UNION ALL
SELECT order_id, rider_id, CAST(delivery_time AS DATE) AS ride_date,
  EXTRACT(EPOCH FROM (delivery_time - CAST(delivery_time AS DATE))) / 60 AS ride_time
FROM orders
WHERE CAST(pickup_time AS DATE) != CAST(delivery_time AS DATE)
)
SELECT rider_id, ride_date, SUM(ride_time) AS ride_time_mins
FROM cte
WHERE ride_time != 0
GROUP BY rider_id, ride_date
ORDER BY rider_id, ride_date;`,
    starterCode: `-- Rider Ride Time
-- Write your solution here
SELECT *
FROM orders;`,
    businessImpact: `Splitting delivery time across calendar days is essential for accurate daily rider performance tracking. Deliveries spanning midnight need to be attributed proportionally to each day for fair compensation, shift scheduling, and operational analytics.`,
    optimizationTips: [
      "EXTRACT(EPOCH FROM interval) / 60 replaces TIMESTAMPDIFF(MINUTE) in PostgreSQL",
      "CAST(timestamp AS DATE) replaces MySQL's DATE() function",
      "UNION ALL splits cross-day deliveries into per-day segments",
      "HAVING > 0 or WHERE ride_time != 0 removes zero-minute segments"
    ],
    edgeCases: [
      "Delivery spanning midnight \u2014 split into two day records",
      "Same pickup and delivery day \u2014 single record",
      "Delivery spanning multiple days \u2014 needs additional UNION ALL logic",
      "Very short delivery (< 1 minute)",
      "NULL pickup_time or delivery_time"
    ]
  },

  {
    id: 43,
    title: "Amazon Notifications",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Your task is to analyze the effectiveness of Amazon's notifications in driving user engagement and conversions, considering the user purchase data. A purchase is considered to be associated with a notification if the purchase happens within the timeframe of earliest of below 2 events:
1-  2 hours from notification delivered time
2-  Next notification delivered time.
Each notification is sent for a particular product id but a customer may purchase same or another product. Considering these rules write an SQL to find number of purchases associated with each notification for same product or a different product in 2 separate columns, display the output in ascending order of notification id.`,
    schema: [
      {
        name: "notifications",
        columns: [
          { name: "notification_id", type: "int" },
          { name: "delivered_at", type: "timestamp" },
          { name: "product_id", type: "varchar(2)" }
        ]
      },
      {
        name: "purchases",
        columns: [
          { name: "product_id", type: "varchar(2)" },
          { name: "purchase_timestamp", type: "timestamp" },
          { name: "user_id", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS notifications;

CREATE TABLE notifications (
  notification_id INT,
  delivered_at TIMESTAMP,
  product_id VARCHAR(2)
);

CREATE TABLE purchases (
  product_id VARCHAR(2),
  purchase_timestamp TIMESTAMP,
  user_id INT
);

INSERT INTO notifications VALUES
(1, '2024-01-01 10:00:00', 'P1'),
(2, '2024-01-01 11:30:00', 'P2'),
(3, '2024-01-01 14:00:00', 'P1');

INSERT INTO purchases VALUES
('P1', '2024-01-01 10:30:00', 101),
('P2', '2024-01-01 10:45:00', 102),
('P1', '2024-01-01 11:00:00', 103),
('P2', '2024-01-01 12:00:00', 104),
('P1', '2024-01-01 14:30:00', 105);
`,
    mySolution: `WITH cte AS (
SELECT *,
  EXTRACT(EPOCH FROM (LEAD(delivered_at) OVER(ORDER BY delivered_at) - delivered_at)) / 60 AS next_time_diff,
  LEAD(delivered_at) OVER(ORDER BY delivered_at) AS next_notification,
  delivered_at + INTERVAL '2 hours' AS next_time,
  120 AS next_two_diff
FROM notifications
),
cte1 AS (
SELECT notification_id, product_id, delivered_at,
  CASE
    WHEN next_time_diff > next_two_diff THEN next_time
    WHEN next_time_diff IS NULL THEN next_time
    ELSE next_notification
  END AS next_time
FROM cte
)
SELECT c1.notification_id,
  SUM(CASE WHEN c1.product_id = p.product_id THEN 1 ELSE 0 END) AS same_product_purchases,
  SUM(CASE WHEN c1.product_id != p.product_id THEN 1 ELSE 0 END) AS different_product_purchases
FROM cte1 c1
INNER JOIN purchases p
  ON p.purchase_timestamp >= c1.delivered_at
  AND p.purchase_timestamp <= c1.next_time
GROUP BY c1.notification_id`,
    systemSolution: `WITH cte AS (
    SELECT *,
      CASE
        WHEN delivered_at + INTERVAL '2 hours' <= COALESCE(LEAD(delivered_at, 1) OVER (ORDER BY notification_id), '9999-12-31'::TIMESTAMP)
          THEN delivered_at + INTERVAL '2 hours'
        ELSE COALESCE(LEAD(delivered_at, 1) OVER (ORDER BY notification_id), '9999-12-31'::TIMESTAMP)
      END AS notification_valid_till
    FROM notifications
),
cte2 AS (
    SELECT
        notification_id,
        p.user_id,
        p.product_id AS purchased_product,
        cte.product_id AS notified_product
    FROM purchases p
    INNER JOIN cte ON p.purchase_timestamp BETWEEN delivered_at AND notification_valid_till
)
SELECT
    notification_id,
    SUM(CASE WHEN purchased_product = notified_product THEN 1 ELSE 0 END) AS same_product_purchases,
    SUM(CASE WHEN purchased_product != notified_product THEN 1 ELSE 0 END) AS different_product_purchases
FROM cte2
GROUP BY notification_id
ORDER BY notification_id;`,
    starterCode: `-- Amazon Notifications
-- Write your solution here
SELECT *
FROM notifications;`,
    businessImpact: `Notification attribution analysis measures which push notifications directly drive purchases. By associating purchases within a 2-hour window (or before the next notification), Amazon can calculate notification ROI, optimize send frequency, and personalize product recommendations.`,
    optimizationTips: [
      "'delivered_at + INTERVAL 2 hours' replaces MySQL's DATE_ADD in PostgreSQL",
      "LEAD gets next notification time to cap the attribution window",
      "LEAST of 2-hour window and next notification prevents double-attribution",
      "BETWEEN in JOIN condition efficiently filters purchases in the valid window"
    ],
    edgeCases: [
      "Last notification \u2014 no next notification, use 2-hour window only",
      "Next notification within 2 hours \u2014 use next notification time as cutoff",
      "Purchase at exact boundary time \u2014 included or excluded?",
      "No purchases within any notification window \u2014 empty result",
      "Purchase of different product within window"
    ]
  },

  {
    id: 44,
    title: "Rolling Sales",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are tasked with analysing the sales data for products during the month of January 2024. Your goal is to calculate the rolling sum of sales for each product and each day of Jan 2024, considering the sales for the current day and the two previous days. Note that for some days, there might not be any sales for certain products, and you need to consider these days as having sales of 0.

You can make use of the calendar table which has the all the dates for Jan-2024.

Tables: orders
+-------------+------------+
| COLUMN_NAME | DATA_TYPE  |
+-------------+------------+
| amount      | int        |
| order_date  | date       |
| order_id    | int        |
| product_id  | varchar(5) |
+-------------+------------+
Tables: calendar_dim
+-------------+-----------+
| COLUMN_NAME | DATA_TYPE |
+-------------+-----------+
| cal_date    | date      |
+-------------+-----------+`,
    schema: [
      {
        name: "orders",
        columns: [
          { name: "order_id", type: "int" },
          { name: "product_id", type: "varchar(5)" },
          { name: "amount", type: "int" },
          { name: "order_date", type: "date" }
        ]
      },
      {
        name: "calendar_dim",
        columns: [
          { name: "cal_date", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS calendar_dim;

CREATE TABLE orders (
  order_id INT,
  product_id VARCHAR(5),
  amount INT,
  order_date DATE
);

CREATE TABLE calendar_dim (
  cal_date DATE
);

INSERT INTO orders VALUES
(1, 'P001', 100, '2024-01-01'),
(2, 'P001', 150, '2024-01-03'),
(3, 'P002', 200, '2024-01-01'),
(4, 'P001', 80, '2024-01-05'),
(5, 'P002', 120, '2024-01-04');

INSERT INTO calendar_dim VALUES
('2024-01-01'), ('2024-01-02'), ('2024-01-03'),
('2024-01-04'), ('2024-01-05'), ('2024-01-06'),
('2024-01-07');
`,
    mySolution: `WITH cte AS (
SELECT product_id, order_date, SUM(amount) AS sales
FROM orders
GROUP BY product_id, order_date
),
all_products_dates AS (
SELECT DISTINCT product_id, cal_date AS order_date
FROM cte
CROSS JOIN calendar_dim
)
SELECT a.product_id, a.order_date, COALESCE(cte.sales, 0) AS sales,
  SUM(COALESCE(cte.sales, 0)) OVER(PARTITION BY a.product_id ORDER BY a.order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling3_sum
FROM all_products_dates a
LEFT JOIN cte ON a.product_id = cte.product_id AND a.order_date = cte.order_date
ORDER BY a.product_id, a.order_date;`,
    systemSolution: `WITH cte AS (
SELECT product_id, order_date, SUM(amount) AS sales
FROM orders
GROUP BY product_id, order_date
),
all_products_dates AS (
SELECT DISTINCT product_id, cal_date AS order_date
FROM cte
CROSS JOIN calendar_dim
)
SELECT a.product_id, a.order_date, COALESCE(cte.sales, 0) AS sales,
  SUM(COALESCE(cte.sales, 0)) OVER(PARTITION BY a.product_id ORDER BY a.order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling3_sum
FROM all_products_dates a
LEFT JOIN cte ON a.product_id = cte.product_id AND a.order_date = cte.order_date
ORDER BY a.product_id, a.order_date;`,
    starterCode: `-- Rolling Sales
-- Write your solution here
SELECT *
FROM orders;`,
    businessImpact: `Rolling 3-day sales calculations smooth out daily volatility and reveal short-term trends. Using a calendar table ensures zero-sale days are included, preventing misleading gaps that would distort the rolling window calculation.`,
    optimizationTips: [
      "Calendar table CROSS JOIN ensures every date is represented per product",
      "LEFT JOIN with COALESCE fills missing sales days with 0",
      "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW gives exact 3-day rolling window",
      "CTE pre-aggregates daily sales before joining to calendar"
    ],
    edgeCases: [
      "Product with no sales on a given day \u2014 0 in rolling sum",
      "First day \u2014 rolling sum equals just that day's sales",
      "Second day \u2014 rolling sum is sum of first two days",
      "Product appearing only once in the entire month",
      "Calendar table missing dates \u2014 gaps in rolling calculation"
    ]
  },

  {
    id: 45,
    title: "Consistent Growth",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `In a financial analysis project, you are tasked with identifying companies that have consistently increased their revenue by at least 25% every year. You have a table named revenue that contains information about the revenue of different companies over several years.
Your goal is to find companies whose revenue has increased by at least 25% every year consecutively. So for example If a company's revenue has increased by 25% or more for three consecutive years but not for the fourth year, it will not be considered.
Write an SQL query to retrieve the names of companies that meet the criteria mentioned above along with total lifetime revenue , display the output in ascending order of company id`,
    schema: [
      {
        name: "revenue",
        columns: [
          { name: "company_id", type: "int" },
          { name: "year", type: "int" },
          { name: "revenue", type: "decimal(10,2)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS revenue;

CREATE TABLE revenue (
  company_id INT,
  year INT,
  revenue DECIMAL(10,2)
);

INSERT INTO revenue VALUES
(1, 2018, 100000.00),
(1, 2019, 130000.00),
(1, 2020, 170000.00),
(1, 2021, 220000.00),
(2, 2018, 50000.00),
(2, 2019, 65000.00),
(2, 2020, 60000.00),
(3, 2019, 80000.00),
(3, 2020, 110000.00),
(3, 2021, 145000.00);
`,
    mySolution: `WITH revenue_growth AS (
    SELECT
        company_id,
        year,
        revenue,
        CASE
          WHEN revenue >= 1.25 * LAG(revenue, 1, 0) OVER (PARTITION BY company_id ORDER BY year) THEN 1
          ELSE 0
        END AS revenue_growth_flag
    FROM revenue
)
SELECT company_id, SUM(revenue) AS total_revenue
FROM revenue_growth
WHERE company_id NOT IN
  (SELECT company_id FROM revenue_growth WHERE revenue_growth_flag = 0)
GROUP BY company_id
ORDER BY company_id;`,
    systemSolution: `WITH revenue_growth AS (
    SELECT
        company_id,
        year,
        revenue,
        CASE
          WHEN revenue >= 1.25 * LAG(revenue, 1, 0) OVER (PARTITION BY company_id ORDER BY year) THEN 1
          ELSE 0
        END AS revenue_growth_flag
    FROM revenue
)
SELECT company_id, SUM(revenue) AS total_revenue
FROM revenue_growth
WHERE company_id NOT IN
  (SELECT company_id FROM revenue_growth WHERE revenue_growth_flag = 0)
GROUP BY company_id
ORDER BY company_id;`,
    starterCode: `-- Consistent Growth
-- Write your solution here
SELECT *
FROM revenue;`,
    businessImpact: `Identifying companies with consistent 25%+ annual revenue growth filters for hypergrowth candidates in investment analysis. The NOT IN subquery approach elegantly excludes any company that ever failed the growth threshold, ensuring true consistency.`,
    optimizationTips: [
      "LAG with default 0 ensures the first year always passes the threshold",
      "NOT IN subquery with flag=0 filters out companies with any year of sub-threshold growth",
      "Window function partitioned by company_id compares each year to its predecessor",
      "SUM(revenue) gives lifetime revenue for qualifying companies"
    ],
    edgeCases: [
      "Company with only one year of data \u2014 always passes (no prior to compare)",
      "Company with 24.9% growth one year \u2014 fails entire company",
      "Company with missing year data \u2014 artificial growth spike",
      "Revenue of 0 in any year \u2014 division by zero if using percentage calculation",
      "Tie at exactly 25% growth \u2014 included (>= threshold)"
    ]
  },

  {
    id: 46,
    title: "Customer Support Metrics",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are working for a customer support team at an e-commerce company. The company provides customer support through both web-based chat and mobile app chat. Each conversation between a customer and a support agent is logged in a database table named conversation. The table contains information about the sender (customer or agent), the message content, the order related to the conversation, and other relevant details.
Your task is to analyze the conversation data to extract meaningful insights for improving customer support efficiency. Write an SQL query to fetch the following information from the conversation table for each order_id and sort the output by order_id.

order_id: The unique identifier of the order related to the conversation.
city_code: The city code where the conversation took place. This is unique to each order_id.
first_agent_message: The timestamp of the first message sent by a support agent in the conversation.
first_customer_message: The timestamp of the first message sent by a customer in the conversation.
num_messages_agent: The total number of messages sent by the support agent in the conversation.
num_messages_customer: The total number of messages sent by the customer in the conversation.
first_message_by: Indicates whether the first message in the conversation was sent by a support agent or a customer.
resolved(0 or 1): Indicates whether the conversation has a message marked as resolution = true, atleast once.
reassigned(0 or 1): Indicates whether the conversation has had interactions by more than one support agent.`,
    schema: [
      {
        name: "conversation",
        columns: [
          { name: "senderDeviceType", type: "varchar(20)" },
          { name: "customerId", type: "int" },
          { name: "orderId", type: "varchar(10)" },
          { name: "resolution", type: "varchar(10)" },
          { name: "agentId", type: "int" },
          { name: "messageSentTime", type: "timestamp" },
          { name: "cityCode", type: "varchar(6)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS conversation;

CREATE TABLE conversation (
  senderDeviceType VARCHAR(20),
  customerId INT,
  orderId VARCHAR(10),
  resolution VARCHAR(10),
  agentId INT,
  messageSentTime TIMESTAMP,
  cityCode VARCHAR(6)
);

INSERT INTO conversation VALUES
('Web Agent', 101, 'ORD001', 'False', 1, '2024-01-01 10:00:00', 'NYC'),
('Android Customer', 101, 'ORD001', 'False', NULL, '2024-01-01 10:05:00', 'NYC'),
('Web Agent', 101, 'ORD001', 'True', 1, '2024-01-01 10:10:00', 'NYC'),
('Android Customer', 102, 'ORD002', 'False', NULL, '2024-01-01 11:00:00', 'LAX'),
('Web Agent', 102, 'ORD002', 'False', 2, '2024-01-01 11:05:00', 'LAX'),
('Web Agent', 102, 'ORD002', 'False', 3, '2024-01-01 11:15:00', 'LAX');
`,
    mySolution: `SELECT
    orderId AS order_id,
    cityCode AS city_code,
    MIN(CASE WHEN senderDeviceType = 'Web Agent' THEN messageSentTime END) AS first_agent_message,
    MIN(CASE WHEN senderDeviceType = 'Android Customer' THEN messageSentTime END) AS first_customer_message,
    SUM(CASE WHEN senderDeviceType = 'Web Agent' THEN 1 ELSE 0 END) AS num_messages_agent,
    SUM(CASE WHEN senderDeviceType = 'Android Customer' THEN 1 ELSE 0 END) AS num_messages_customer,
    CASE WHEN MIN(messageSentTime) = MIN(CASE WHEN senderDeviceType = 'Web Agent' THEN messageSentTime END) THEN 'Agent'
         WHEN MIN(messageSentTime) = MIN(CASE WHEN senderDeviceType = 'Android Customer' THEN messageSentTime END) THEN 'Customer' END AS first_message_by,
    MAX(CASE WHEN resolution = 'True' THEN 1 ELSE 0 END) AS resolved,
    CASE WHEN COUNT(DISTINCT agentId) > 1 THEN 1 ELSE 0 END AS reassigned
FROM conversation
GROUP BY orderId, cityCode
ORDER BY orderId;`,
    systemSolution: `SELECT
    orderId AS order_id,
    cityCode AS city_code,
    MIN(CASE WHEN senderDeviceType = 'Web Agent' THEN messageSentTime END) AS first_agent_message,
    MIN(CASE WHEN senderDeviceType = 'Android Customer' THEN messageSentTime END) AS first_customer_message,
    SUM(CASE WHEN senderDeviceType = 'Web Agent' THEN 1 ELSE 0 END) AS num_messages_agent,
    SUM(CASE WHEN senderDeviceType = 'Android Customer' THEN 1 ELSE 0 END) AS num_messages_customer,
    CASE WHEN MIN(messageSentTime) = MIN(CASE WHEN senderDeviceType = 'Web Agent' THEN messageSentTime END) THEN 'Agent'
         WHEN MIN(messageSentTime) = MIN(CASE WHEN senderDeviceType = 'Android Customer' THEN messageSentTime END) THEN 'Customer' END AS first_message_by,
    MAX(CASE WHEN resolution = 'True' THEN 1 ELSE 0 END) AS resolved,
    CASE WHEN COUNT(DISTINCT agentId) > 1 THEN 1 ELSE 0 END AS reassigned
FROM conversation
GROUP BY orderId, cityCode
ORDER BY orderId;`,
    starterCode: `-- Customer Support Metrics
-- Write your solution here
SELECT *
FROM conversation;`,
    businessImpact: `Multi-dimensional customer support metrics from conversation logs provide insights into response times, resolution rates, and agent reassignment patterns. This enables support team optimization, SLA monitoring, and identification of systemic issues affecting customer experience.`,
    optimizationTips: [
      "Conditional MIN/SUM with CASE WHEN computes multiple metrics in a single GROUP BY pass",
      "COUNT(DISTINCT agentId) > 1 efficiently detects reassignment",
      "MAX(CASE WHEN resolution = 'True' THEN 1) acts as an ANY/EXISTS check per group",
      "Comparing MIN(messageSentTime) with conditional MINs determines who messaged first"
    ],
    edgeCases: [
      "Order with only agent messages \u2014 first_customer_message is NULL",
      "Order with only customer messages \u2014 first_agent_message is NULL",
      "Same timestamp for agent and customer \u2014 first_message_by ambiguous",
      "NULL agentId values \u2014 excluded from COUNT(DISTINCT)",
      "Order never resolved \u2014 resolved = 0"
    ]
  },

  {
    id: 47,
    title: "Eat and Win",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `A pizza eating competition is organized. All the participants are organized into different groups. In a contest , A participant who eat the most pieces of pizza is the winner and recieves their original bet plus 30% of all losing participants bets. In case of a tie all winning participants will get equal share (of 30%) divided among them .Return the winning participants' names for each group and amount of their payout(round to 2 decimal places) . ordered ascending by group_id , participant_name. 

Tables: Competition
+------------------+-------------+
| COLUMN_NAME      | DATA_TYPE   |
+------------------+-------------+
| group_id         | int         |
| participant_name | varchar(10) |
| slice_count      | int         |
| bet              | int         |
+------------------+-------------+`,
    schema: [
      {
        name: "competition",
        columns: [
          { name: "group_id", type: "int" },
          { name: "participant_name", type: "varchar(10)" },
          { name: "slice_count", type: "int" },
          { name: "bet", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS competition;

CREATE TABLE competition (
  group_id INT,
  participant_name VARCHAR(10),
  slice_count INT,
  bet INT
);

INSERT INTO competition VALUES
(1, 'Alice', 12, 50),
(1, 'Bob', 10, 40),
(1, 'Carol', 8, 30),
(2, 'Dave', 15, 60),
(2, 'Eve', 15, 45),
(2, 'Frank', 9, 35);
`,
    mySolution: `WITH ranking AS (
SELECT *,
  RANK() OVER(PARTITION BY group_id ORDER BY slice_count DESC) AS rn
FROM competition
),
looser_payout AS (
SELECT group_id, SUM(bet) * 0.3 AS total_losser_bet
FROM ranking
WHERE rn != 1
GROUP BY group_id
),
winner AS (
SELECT group_id, COUNT(*) AS no_of_winner
FROM ranking
WHERE rn = 1
  AND slice_count IS NOT NULL
  AND bet IS NOT NULL
GROUP BY group_id
)
SELECT r.group_id, r.participant_name,
  ROUND(r.bet + (l.total_losser_bet / w.no_of_winner), 2) AS total_payout
FROM ranking r
INNER JOIN looser_payout l ON r.group_id = l.group_id
INNER JOIN winner w ON r.group_id = w.group_id
WHERE r.rn = 1
ORDER BY r.group_id, r.participant_name`,
    systemSolution: `WITH cte AS (
SELECT *,
  RANK() OVER(PARTITION BY group_id ORDER BY slice_count DESC) AS rn
FROM competition
),
cte2 AS (
SELECT group_id,
  SUM(CASE WHEN rn = 1 THEN 1 ELSE 0 END) AS no_of_winners,
  SUM(CASE WHEN rn > 1 THEN bet ELSE 0 END) * 0.3 AS losers_bet
FROM cte
GROUP BY group_id
)
SELECT cte.group_id, cte.participant_name,
  ROUND(cte.bet + (cte2.losers_bet) / cte2.no_of_winners, 2) AS total_payout
FROM cte
INNER JOIN cte2 ON cte.group_id = cte2.group_id
WHERE cte.rn = 1
ORDER BY cte.group_id, cte.participant_name;`,
    starterCode: `-- Eat and Win
-- Write your solution here
SELECT *
FROM competition;`,
    businessImpact: `Prize pool distribution with RANK-based winner detection and proportional payout calculation. The 30% loser-bet redistribution with tie-splitting demonstrates a common pattern in gaming, fantasy sports, and betting platform calculations.`,
    optimizationTips: [
      "RANK() handles ties correctly \u2014 all tied participants get rank 1",
      "Separate CTEs for losers' pot and winner count keeps logic clear",
      "Alternative: single CTE with conditional SUM avoids multiple passes",
      "ROUND to 2 decimal places for currency precision"
    ],
    edgeCases: [
      "All participants tie \u2014 no losers, no redistribution pool",
      "Single participant in group \u2014 wins by default, keeps own bet",
      "NULL slice_count or bet values \u2014 excluded from winner/loser calculation",
      "Multiple tied winners \u2014 loser pot split equally",
      "Group with all same slice_count \u2014 everyone is rank 1"
    ]
  },

  {
    id: 48,
    title: "Seasonal Trends",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You're working for a retail company that sells various products. The company wants to identify seasonal trends in sales for its top-selling products across different regions. They are particularly interested in understanding the variation in sales volume across seasons for these products.
For each top-selling product in each region, calculate the total quantity sold for each season (spring, summer, autumn, winter) in 2023, display the output in ascending order of region name, product name & season name.`,
    schema: [
      {
        name: "products",
        columns: [
          { name: "product_id", type: "int" },
          { name: "product_name", type: "varchar(10)" }
        ]
      },
      {
        name: "sales",
        columns: [
          { name: "sale_id", type: "int" },
          { name: "product_id", type: "int" },
          { name: "region_name", type: "varchar(20)" },
          { name: "sale_date", type: "date" },
          { name: "quantity_sold", type: "int" }
        ]
      },
      {
        name: "seasons",
        columns: [
          { name: "start_date", type: "date" },
          { name: "end_date", type: "date" },
          { name: "season_name", type: "varchar(10)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS seasons;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  product_id INT,
  product_name VARCHAR(10)
);

CREATE TABLE sales (
  sale_id INT,
  product_id INT,
  region_name VARCHAR(20),
  sale_date DATE,
  quantity_sold INT
);

CREATE TABLE seasons (
  start_date DATE,
  end_date DATE,
  season_name VARCHAR(10)
);

INSERT INTO products VALUES
(1, 'Widget'), (2, 'Gadget'), (3, 'Gizmo');

INSERT INTO seasons VALUES
('2023-03-01', '2023-05-31', 'Spring'),
('2023-06-01', '2023-08-31', 'Summer'),
('2023-09-01', '2023-11-30', 'Autumn'),
('2023-12-01', '2024-02-28', 'Winter');

INSERT INTO sales VALUES
(1, 1, 'East', '2023-03-15', 50),
(2, 1, 'East', '2023-06-20', 80),
(3, 2, 'East', '2023-04-10', 30),
(4, 1, 'West', '2023-07-05', 60),
(5, 2, 'West', '2023-09-12', 45),
(6, 3, 'East', '2023-12-01', 70);
`,
    mySolution: `WITH cte AS (
SELECT s.product_id, s.region_name, se.season_name,
  SUM(s.quantity_sold) AS total_qty
FROM sales s
LEFT JOIN seasons se
  ON s.sale_date >= se.start_date
  AND s.sale_date <= se.end_date
GROUP BY s.product_id, s.region_name, se.season_name
),
cte1 AS (
SELECT *,
  RANK() OVER(PARTITION BY region_name, season_name ORDER BY total_qty DESC) AS rn
FROM cte
)
SELECT
  c1.region_name, p.product_name,
  c1.season_name,
  c1.total_qty AS total_quantity_sold
FROM cte1 c1
INNER JOIN products p ON c1.product_id = p.product_id
WHERE rn = 1
ORDER BY region_name ASC`,
    systemSolution: `WITH top_selling_per_region AS (
    SELECT
        s.region_name,
        p.product_name,
        SUM(s.quantity_sold) AS total_quantity_sold,
        ROW_NUMBER() OVER(PARTITION BY s.region_name ORDER BY SUM(s.quantity_sold) DESC) AS rn
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    GROUP BY s.region_name, p.product_name
)
SELECT
    ts.region_name,
    ts.product_name,
    ss.season_name,
    SUM(s.quantity_sold) AS total_quantity_sold
FROM sales s
JOIN products p ON s.product_id = p.product_id
JOIN top_selling_per_region ts ON s.region_name = ts.region_name AND p.product_name = ts.product_name
JOIN seasons ss ON s.sale_date BETWEEN ss.start_date AND ss.end_date
WHERE ts.rn = 1
GROUP BY ts.region_name, ts.product_name, ss.season_name
ORDER BY ts.region_name, ts.product_name, ss.season_name;`,
    starterCode: `-- Seasonal Trends
-- Write your solution here
SELECT *
FROM products;`,
    businessImpact: `Seasonal sales analysis for top products per region enables targeted inventory planning, regional marketing campaigns, and demand forecasting. Understanding which products peak in which seasons drives purchasing decisions and promotional scheduling.`,
    optimizationTips: [
      "First CTE identifies top product per region, second breaks down by season",
      "BETWEEN on date ranges maps sales to seasons efficiently",
      "ROW_NUMBER or RANK determines top product per region",
      "Index on (product_id, region_name, sale_date) for efficient aggregation"
    ],
    edgeCases: [
      "Product with no sales in certain seasons \u2014 missing from output",
      "Tied top products in a region \u2014 ROW_NUMBER picks one, RANK picks both",
      "Sale date falling outside all season ranges \u2014 not counted",
      "Region with only one product \u2014 automatically top seller",
      "Seasons with overlapping date ranges"
    ]
  },

  {
    id: 49,
    title: "Contiguous Ranges",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Write an SQL query to find all the contiguous ranges of log_id values.`,
    schema: [
      {
        name: "logs",
        columns: [
          { name: "log_id", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS logs;

CREATE TABLE logs (
  log_id INT
);

INSERT INTO logs VALUES
(1), (2), (3), (5), (6), (8), (10), (11), (12), (13), (20);
`,
    mySolution: `WITH numbered_logs AS (
    SELECT
        log_id,
        log_id - ROW_NUMBER() OVER (ORDER BY log_id) AS grp
    FROM logs
)
SELECT
    MIN(log_id) AS start_id,
    MAX(log_id) AS end_id
FROM numbered_logs
GROUP BY grp
ORDER BY start_id;`,
    systemSolution: `WITH numbered_logs AS (
    SELECT
        log_id,
        log_id - ROW_NUMBER() OVER (ORDER BY log_id) AS grp
    FROM logs
)
SELECT
    MIN(log_id) AS start_id,
    MAX(log_id) AS end_id
FROM numbered_logs
GROUP BY grp
ORDER BY start_id;`,
    starterCode: `-- Contiguous Ranges
-- Write your solution here
SELECT *
FROM logs;`,
    businessImpact: `Gap-and-island detection identifies contiguous ranges in sequential data. This pattern is fundamental for log analysis (finding continuous uptime/downtime), seat/resource allocation, missing data detection, and sequence gap reporting.`,
    optimizationTips: [
      "Classic gap-and-island technique: log_id - ROW_NUMBER() creates same group value for contiguous IDs",
      "ROW_NUMBER over ordered data produces sequential numbers that, when subtracted from actual IDs, cluster contiguous ranges",
      "MIN/MAX per group gives range boundaries",
      "Index on log_id for efficient ordering"
    ],
    edgeCases: [
      "Single isolated log_id \u2014 start_id = end_id",
      "All log_ids contiguous \u2014 single range",
      "Duplicate log_ids \u2014 may break the technique",
      "Very large gaps between ranges",
      "Empty table \u2014 no results"
    ]
  },

  {
    id: 50,
    title: "Hierarchy Reportee Count",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Write a SQL query to find the number of reportees (both direct and indirect) under each manager. The output should include:
m_id: The manager ID.
num_of_reportees: The total number of unique reportees (both direct and indirect) under that manager.
Order the result by number of reportees in descending order.`,
    schema: [
      {
        name: "hierarchy",
        columns: [
          { name: "e_id", type: "int" },
          { name: "m_id", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS hierarchy;

CREATE TABLE hierarchy (
  e_id INT,
  m_id INT
);

INSERT INTO hierarchy VALUES
(2, 1), (3, 1), (4, 2), (5, 2),
(6, 3), (7, 4), (8, 5);
`,
    mySolution: `WITH RECURSIVE ReporteesCTE AS (
    SELECT
        m_id AS manager_id,
        e_id AS employee_id
    FROM hierarchy

    UNION ALL

    SELECT
        h.m_id AS manager_id,
        r.employee_id
    FROM hierarchy h
    JOIN ReporteesCTE r ON h.e_id = r.manager_id
)
SELECT
    manager_id AS m_id,
    COUNT(DISTINCT employee_id) AS num_of_reportees
FROM ReporteesCTE
GROUP BY manager_id
ORDER BY num_of_reportees DESC, m_id;`,
    systemSolution: `WITH RECURSIVE ReporteesCTE AS (
    SELECT
        m_id AS manager_id,
        e_id AS employee_id
    FROM hierarchy

    UNION ALL

    SELECT
        h.m_id AS manager_id,
        r.employee_id
    FROM hierarchy h
    JOIN ReporteesCTE r ON h.e_id = r.manager_id
)
SELECT
    manager_id AS m_id,
    COUNT(DISTINCT employee_id) AS num_of_reportees
FROM ReporteesCTE
GROUP BY manager_id
ORDER BY num_of_reportees DESC, m_id;`,
    starterCode: `-- Hierarchy Reportee Count
-- Write your solution here
SELECT *
FROM hierarchy;`,
    businessImpact: `Recursive CTE traversal of org hierarchy counts all direct and indirect reports under each manager. This is essential for span-of-control analysis, restructuring decisions, and understanding organizational bottlenecks.`,
    optimizationTips: [
      "WITH RECURSIVE builds the full reporting chain from each manager down",
      "Anchor: direct reports; Recursive: reports of reports",
      "COUNT(DISTINCT employee_id) avoids double-counting in diamond hierarchies",
      "Index on (e_id, m_id) for efficient recursive joins"
    ],
    edgeCases: [
      "Employee with no reports \u2014 not in result as manager",
      "Top-level manager (no m_id) \u2014 NULL m_id handling",
      "Diamond hierarchy (employee reports to two managers) \u2014 DISTINCT prevents double-count",
      "Circular reporting chain \u2014 infinite recursion risk",
      "Very deep hierarchy \u2014 PostgreSQL recursion limit"
    ]
  },

  {
    id: 51,
    title: "User Session Activity",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are given a table user events that tracks user activity with the following schema:`,
    schema: [
      {
        name: "events",
        columns: [
          { name: "userid", type: "int" },
          { name: "event_type", type: "varchar" },
          { name: "event_time", type: "timestamp" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS events;

CREATE TABLE events (
  userid INT,
  event_type VARCHAR,
  event_time TIMESTAMP
);

INSERT INTO events VALUES
(1, 'page_view', '2024-01-01 10:00:00'),
(1, 'click', '2024-01-01 10:15:00'),
(1, 'page_view', '2024-01-01 10:25:00'),
(1, 'click', '2024-01-01 11:30:00'),
(1, 'page_view', '2024-01-01 11:45:00'),
(2, 'page_view', '2024-01-01 09:00:00'),
(2, 'click', '2024-01-01 09:10:00');
`,
    mySolution: `WITH cte AS (
    SELECT *,
      LAG(event_time, 1, event_time) OVER (PARTITION BY userid ORDER BY event_time) AS prev_event_time,
      EXTRACT(EPOCH FROM (event_time - LAG(event_time, 1, event_time) OVER (PARTITION BY userid ORDER BY event_time))) / 60 AS time_diff
    FROM events
),
cte2 AS (
    SELECT userid, event_type, prev_event_time, event_time,
      CASE WHEN time_diff <= 30 THEN 0 ELSE 1 END AS flag,
      SUM(CASE WHEN time_diff <= 30 THEN 0 ELSE 1 END) OVER (PARTITION BY userid ORDER BY event_time) AS group_id
    FROM cte
)
SELECT userid,
  ROW_NUMBER() OVER (PARTITION BY userid ORDER BY MIN(event_time)) AS session_id,
  MIN(event_time) AS session_start_time,
  MAX(event_time) AS session_end_time,
  EXTRACT(EPOCH FROM (MAX(event_time) - MIN(event_time))) / 60 AS session_duration,
  COUNT(*) AS event_count
FROM cte2
GROUP BY userid, group_id;`,
    systemSolution: `WITH cte AS (
    SELECT *,
      LAG(event_time, 1, event_time) OVER (PARTITION BY userid ORDER BY event_time) AS prev_event_time,
      EXTRACT(EPOCH FROM (event_time - LAG(event_time, 1, event_time) OVER (PARTITION BY userid ORDER BY event_time))) / 60 AS time_diff
    FROM events
),
cte2 AS (
    SELECT userid, event_type, prev_event_time, event_time,
      CASE WHEN time_diff <= 30 THEN 0 ELSE 1 END AS flag,
      SUM(CASE WHEN time_diff <= 30 THEN 0 ELSE 1 END) OVER (PARTITION BY userid ORDER BY event_time) AS group_id
    FROM cte
)
SELECT userid,
  ROW_NUMBER() OVER (PARTITION BY userid ORDER BY MIN(event_time)) AS session_id,
  MIN(event_time) AS session_start_time,
  MAX(event_time) AS session_end_time,
  EXTRACT(EPOCH FROM (MAX(event_time) - MIN(event_time))) / 60 AS session_duration,
  COUNT(*) AS event_count
FROM cte2
GROUP BY userid, group_id;`,
    starterCode: `-- User Session Activity
-- Write your solution here
SELECT *
FROM events;`,
    businessImpact: `Session detection from raw event streams is foundational for web/app analytics. Identifying session boundaries (30-minute inactivity gap) enables calculation of engagement metrics, retention analysis, and user behavior funnel optimization.`,
    optimizationTips: [
      "EXTRACT(EPOCH FROM interval) / 60 replaces TIMESTAMPDIFF(MINUTE) in PostgreSQL",
      "LAG with default value handles the first event per user",
      "Running SUM of flags creates session group IDs",
      "ROW_NUMBER assigns sequential session numbers per user"
    ],
    edgeCases: [
      "User with only one event \u2014 single session with 0 duration",
      "Events exactly 30 minutes apart \u2014 same or new session?",
      "Events at the exact same timestamp",
      "Very long gaps between sessions",
      "NULL event_time values"
    ]
  },

  {
    id: 52,
    title: "Perfect Score Candidates",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are given a table named assessments that contains information about candidate evaluations for various technical tasks. Each row in the table represents a candidate and includes their years of experience, along with scores for three different tasks: SQL, Algorithms, and Bug Fixing. A NULL value in any of the task columns indicates that the candidate was not required to solve that specific task.
Your task is to analyze this data and determine, for each experience level, the total number of candidates and how many of them achieved a "perfect score." A candidate is considered to have achieved a "perfect score" if they score 100 in every task they were requested to solve.
The output should include the experience level, the total number of candidates for each level, and the count of candidates who achieved a "perfect score." The result should be ordered by experience level.`,
    schema: [
      {
        name: "assessments",
        columns: [
          { name: "candidate_id", type: "int" },
          { name: "experience", type: "int" },
          { name: "sql_score", type: "int" },
          { name: "algo", type: "int" },
          { name: "bug_fixing", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS assessments;

CREATE TABLE assessments (
  candidate_id INT,
  experience INT,
  sql_score INT,
  algo INT,
  bug_fixing INT
);

INSERT INTO assessments VALUES
(1, 3, 100, 100, NULL),
(2, 3, 100, 80, 100),
(3, 5, 100, 100, 100),
(4, 5, 90, 100, 100),
(5, 2, NULL, 100, NULL),
(6, 2, 100, NULL, 100);
`,
    mySolution: `SELECT experience, COUNT(*) AS total_candidates,
  SUM(CASE WHEN (
    CASE WHEN sql_score IS NULL OR sql_score = 100 THEN 1 ELSE 0 END +
    CASE WHEN algo IS NULL OR algo = 100 THEN 1 ELSE 0 END +
    CASE WHEN bug_fixing IS NULL OR bug_fixing = 100 THEN 1 ELSE 0 END
  ) = 3 THEN 1 ELSE 0 END) AS perfect_score_candidates
FROM assessments
GROUP BY experience;`,
    systemSolution: `SELECT experience, COUNT(*) AS total_candidates,
  SUM(CASE WHEN (
    CASE WHEN sql_score IS NULL OR sql_score = 100 THEN 1 ELSE 0 END +
    CASE WHEN algo IS NULL OR algo = 100 THEN 1 ELSE 0 END +
    CASE WHEN bug_fixing IS NULL OR bug_fixing = 100 THEN 1 ELSE 0 END
  ) = 3 THEN 1 ELSE 0 END) AS perfect_score_candidates
FROM assessments
GROUP BY experience;`,
    starterCode: `-- Perfect Score Candidates
-- Write your solution here
SELECT *
FROM assessments;`,
    businessImpact: `Perfect score analysis per experience level reveals hiring pipeline quality. NULL-aware scoring (treating unassigned tasks as non-failures) correctly handles partial assessments, providing fair evaluation metrics for recruitment optimization.`,
    optimizationTips: [
      "Nested CASE handles NULL as 'not required' (pass by default)",
      "Sum of 3 individual CASE flags = 3 means all tasks passed",
      "Single-pass GROUP BY avoids correlated subqueries",
      "No JOIN needed \u2014 all data in one table"
    ],
    edgeCases: [
      "All scores NULL \u2014 candidate is 'perfect' (no tasks assigned)",
      "Score of 99 \u2014 not a perfect score",
      "Experience level with no perfect scores",
      "Single candidate per experience level",
      "All candidates have perfect scores"
    ]
  },

  {
    id: 53,
    title: "Project Budget",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are tasked with managing project budgets at a company. Each project has a fixed budget, and multiple employees work on these projects. The company's payroll is based on annual salaries, and each employee works for a specific duration on a project.
Over budget on a project is defined when the salaries (allocated on per day basis as per project duration) exceed the budget of the project. For example, if Ankit and Rohit both combined income make 200K and work on a project of a budget of 50K that takes half a year, then the project is over budget given 0.5 * 200K = 100K > 50K.
Write a query to forecast the budget for all projects and return a label of "overbudget" if it is over budget and "within budget" otherwise. Order the result by project title.

 Note: Assume that employees only work on one project at a time.`,
    schema: [
      {
        name: "employees",
        columns: [
          { name: "id", type: "int" },
          { name: "name", type: "varchar" },
          { name: "salary", type: "int" }
        ]
      },
      {
        name: "projects",
        columns: [
          { name: "id", type: "int" },
          { name: "title", type: "varchar" },
          { name: "start_date", type: "date" },
          { name: "end_date", type: "date" },
          { name: "budget", type: "int" }
        ]
      },
      {
        name: "project_employees",
        columns: [
          { name: "project_id", type: "int" },
          { name: "employee_id", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS project_employees;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id INT,
  name VARCHAR,
  salary INT
);

CREATE TABLE projects (
  id INT,
  title VARCHAR,
  start_date DATE,
  end_date DATE,
  budget INT
);

CREATE TABLE project_employees (
  project_id INT,
  employee_id INT
);

INSERT INTO employees VALUES
(1, 'Ankit', 120000),
(2, 'Rohit', 80000),
(3, 'Priya', 100000);

INSERT INTO projects VALUES
(1, 'Alpha', '2024-01-01', '2024-06-30', 50000),
(2, 'Beta', '2024-01-01', '2024-12-31', 200000);

INSERT INTO project_employees VALUES
(1, 1), (1, 2), (2, 3);
`,
    mySolution: `WITH salary_budget AS (
SELECT p.project_id,
  SUM(e.salary) AS total_salary
FROM employees e
INNER JOIN project_employees p ON e.id = p.employee_id
GROUP BY p.project_id
)
SELECT p.title, p.budget,
  CASE WHEN ROUND((p.end_date - p.start_date)::NUMERIC / 365, 2) * s.total_salary > budget THEN 'overbudget'
    ELSE 'within budget'
  END AS label
FROM projects p
INNER JOIN salary_budget s ON p.id = s.project_id
ORDER BY title`,
    systemSolution: `WITH Project_Salary_Cost AS (
    SELECT
        p.title AS project_title,
        p.budget,
        SUM(e.salary * ((p.end_date - p.start_date)::NUMERIC / 365.0)) AS total_salary_cost
    FROM Projects p
    JOIN Project_Employees pe ON p.id = pe.project_id
    JOIN Employees e ON e.id = pe.employee_id
    GROUP BY p.id, p.title, p.budget
)
SELECT
    project_title AS title,
    budget,
    CASE
        WHEN total_salary_cost > budget THEN 'overbudget'
        ELSE 'within budget'
    END AS label
FROM Project_Salary_Cost
ORDER BY project_title;`,
    starterCode: `-- Project Budget
-- Write your solution here
SELECT *
FROM employees;`,
    businessImpact: `Project budget forecasting prorates employee salaries by project duration to predict cost overruns. This enables proactive budget management, resource reallocation, and financial planning before projects exceed their allocated budgets.`,
    optimizationTips: [
      "(end_date - start_date)::NUMERIC / 365.0 replaces MySQL's DATEDIFF / 365 in PostgreSQL",
      "CTE pre-calculates total salary cost per project",
      "CASE WHEN labels projects as overbudget vs within budget",
      "JOIN chain: projects → project_employees → employees"
    ],
    edgeCases: [
      "Project with no assigned employees \u2014 no salary cost",
      "Very short project \u2014 fraction of year salary",
      "Budget exactly equal to cost \u2014 'within budget'",
      "Employee on multiple projects \u2014 salary counted per project",
      "Project spanning exactly one year \u2014 full annual salary"
    ]
  },

  {
    id: 54,
    title: "Selective Buyers Analysis",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are given an orders table that contains information about customer purchases, including the products they bought. Write a query to find all customers who have purchased both "Laptop" and "Mouse", but have never purchased "Phone Case". Additionally, include the total number of distinct products purchased by these customers. Sort the result by customer id.`,
    schema: [
      {
        name: "orders",
        columns: [
          { name: "customer_id", type: "int" },
          { name: "order_id", type: "int" },
          { name: "product_name", type: "varchar" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  customer_id INT,
  order_id INT,
  product_name VARCHAR
);

INSERT INTO orders VALUES
(1, 101, 'Laptop'),
(1, 102, 'Mouse'),
(1, 103, 'Keyboard'),
(2, 104, 'Laptop'),
(2, 105, 'Mouse'),
(2, 106, 'Phone Case'),
(3, 107, 'Laptop'),
(3, 108, 'Mouse'),
(4, 109, 'Laptop');
`,
    mySolution: `SELECT customer_id, COUNT(DISTINCT product_name) AS total_distinct_products
FROM orders
WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE product_name = 'Phone Case')
GROUP BY customer_id
HAVING COUNT(DISTINCT CASE WHEN product_name IN ('Laptop', 'Mouse') THEN product_name END) = 2
ORDER BY customer_id;`,
    systemSolution: `SELECT customer_id, COUNT(DISTINCT product_name) AS total_distinct_products
FROM orders
WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE product_name = 'Phone Case')
GROUP BY customer_id
HAVING COUNT(DISTINCT CASE WHEN product_name IN ('Laptop', 'Mouse') THEN product_name END) = 2
ORDER BY customer_id;`,
    starterCode: `-- Selective Buyers Analysis
-- Write your solution here
SELECT *
FROM orders;`,
    businessImpact: `Customer purchase pattern analysis combining inclusion (bought A AND B) with exclusion (never bought C) criteria enables targeted marketing, cross-sell recommendations, and customer segmentation for product bundle strategies.`,
    optimizationTips: [
      "NOT IN subquery filters out customers who ever bought 'Phone Case'",
      "HAVING with COUNT(DISTINCT CASE) ensures both required products were purchased",
      "Single-table query with no joins \u2014 efficient for simple product analysis",
      "DISTINCT in CASE prevents double-counting repeat purchases"
    ],
    edgeCases: [
      "Customer bought Laptop twice but no Mouse \u2014 excluded",
      "Customer bought all three products \u2014 excluded by Phone Case filter",
      "Customer bought only Laptop and Mouse \u2014 total_distinct_products = 2",
      "No customers match criteria \u2014 empty result",
      "NULL product_name \u2014 not matched by any filter"
    ]
  },

  {
    id: 55,
    title: "Train Schedule",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are given a table of  train schedule which contains the arrival and departure times of trains at each station on a given day. 
At each station one platform can accommodate only one train at a time, from the beginning of the minute the train arrives until the end of the minute it departs. 
Write a query to find the minimum number of platforms required at each station to handle all train traffic to ensure that no two trains overlap at any station.`,
    schema: [
      {
        name: "train_schedule",
        columns: [
          { name: "station_id", type: "int" },
          { name: "train_id", type: "int" },
          { name: "arrival_time", type: "time" },
          { name: "departure_time", type: "time" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS train_schedule;

CREATE TABLE train_schedule (
  station_id INT,
  train_id INT,
  arrival_time TIME,
  departure_time TIME
);

INSERT INTO train_schedule VALUES
(1, 101, '08:00', '08:30'),
(1, 102, '08:15', '08:45'),
(1, 103, '08:40', '09:10'),
(1, 104, '09:00', '09:30'),
(2, 201, '07:00', '07:20'),
(2, 202, '07:10', '07:40');
`,
    mySolution: `WITH cte AS (
SELECT station_id, arrival_time, +1 AS points
FROM train_schedule
UNION ALL
SELECT station_id, departure_time, -1
FROM train_schedule
)
SELECT station_id, arrival_time,
  SUM(points) OVER(PARTITION BY station_id ORDER BY arrival_time) AS points
FROM cte`,
    systemSolution: `WITH combined_times AS (
    SELECT station_id, arrival_time AS event_time, 1 AS event_type
    FROM train_schedule
    UNION ALL
    SELECT station_id, departure_time AS event_time, -1 AS event_type
    FROM train_schedule
),
cumulative_events AS (
    SELECT station_id,
        event_time,
        SUM(event_type) OVER (PARTITION BY station_id ORDER BY event_time) AS current_trains
    FROM combined_times
)
SELECT station_id, MAX(current_trains) AS min_platforms_required
FROM cumulative_events
GROUP BY station_id;`,
    starterCode: `-- Train Schedule
-- Write your solution here
SELECT *
FROM train_schedule;`,
    businessImpact: `The sweep-line algorithm (arrival = +1, departure = -1 events) determines peak concurrent occupancy at each station. This classic interval scheduling technique is used in platform allocation, meeting room scheduling, and resource capacity planning.`,
    optimizationTips: [
      "UNION ALL creates +1/-1 events for arrivals and departures",
      "Running SUM over ordered events gives concurrent occupancy at each point",
      "MAX of running sum gives peak occupancy = minimum platforms needed",
      "Index on (station_id, arrival_time, departure_time) for efficiency"
    ],
    edgeCases: [
      "Train departing exactly when another arrives \u2014 same platform reuse?",
      "Trains with same arrival and departure time",
      "Single train at a station \u2014 always 1 platform",
      "All trains overlapping \u2014 platforms = number of trains",
      "Station with no trains \u2014 0 platforms"
    ]
  },

  {
    id: 56,
    title: "Last Sunday",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Write an SQL to get the date of the last Sunday as per today's date. If you are solving the problem on Sunday then it should still return the date of last Sunday (not current date).
Note : Dates are displayed as per UTC time zone.`,
    schema: [],
    sampleData: ``,
    mySolution: `SELECT CURRENT_DATE - CAST(EXTRACT(DOW FROM CURRENT_DATE) AS INT) - CASE WHEN EXTRACT(DOW FROM CURRENT_DATE) = 0 THEN 7 ELSE 0 END AS last_sunday;`,
    systemSolution: `SELECT CURRENT_DATE - CAST(EXTRACT(DOW FROM CURRENT_DATE) AS INT) - CASE WHEN EXTRACT(DOW FROM CURRENT_DATE) = 0 THEN 7 ELSE 0 END AS last_sunday;`,
    starterCode: `-- Last Sunday
-- Write your solution here
SELECT 1;`,
    businessImpact: `Date arithmetic to find the last occurrence of a specific weekday is common in weekly reporting, payroll processing, and SLA deadline calculations. PostgreSQL's EXTRACT(DOW) returns 0 for Sunday, requiring special handling.`,
    optimizationTips: [
      "EXTRACT(DOW FROM date) returns 0=Sunday through 6=Saturday in PostgreSQL",
      "Subtraction of DOW gives the previous Sunday for Mon-Sat",
      "Special case: if today is Sunday, subtract 7 to get LAST Sunday",
      "No table scan needed \u2014 pure date computation"
    ],
    edgeCases: [
      "Current day is Sunday \u2014 should return previous Sunday, not today",
      "Current day is Monday \u2014 should return yesterday",
      "Current day is Saturday \u2014 should return 6 days ago",
      "Leap year boundary dates",
      "Year boundary (e.g., Jan 1 is Monday)"
    ]
  },

  {
    id: 57,
    title: "The Yellow Pages",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `To enhance the functionality of "The Yellow Pages" website, create a SQL query to generate a report of companies, including their phone numbers and ratings. The query must account for the following:
Columns in the output:

name: The company name as per below rules:
    For promoted companies:
        Format: [PROMOTED] <company_name>.
    For non-promoted companies:
        Format: <company_name>.


phone: The company phone number.

rating: The overall star rating of the company as per rules below:
    Promoted companies : should always have NULL as their rating.
    For non-promoted companies:
        Format: <#_stars> (<average_rating>, based on <total_reviews> reviews), where:
        <#_stars>: Rounded down average rating to the nearest whole number.
        <average_rating>: Exact average rating rounded to 1 decimal place.
        <total_reviews>: Total number of reviews across all categories for the company.

Rules: Non-promoted companies should only be included if their average rating is 1 star or higher.
Results should be sorted:
By promotion status (promoted first).
In descending order of the average rating (before rounding).
By the total number of reviews (descending).`,
    schema: [
      {
        name: "companies",
        columns: [
          { name: "id", type: "int" },
          { name: "name", type: "VARCHAR" },
          { name: "phone", type: "VARCHAR" },
          { name: "is_promoted", type: "int" }
        ]
      },
      {
        name: "categories",
        columns: [
          { name: "company_id", type: "int" },
          { name: "name", type: "VARCHAR" },
          { name: "rating", type: "decimal" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
  id INT,
  name VARCHAR,
  phone VARCHAR,
  is_promoted INT
);

CREATE TABLE categories (
  company_id INT,
  name VARCHAR,
  rating DECIMAL
);

INSERT INTO companies VALUES
(1, 'TechCorp', '555-0101', 1),
(2, 'DataInc', '555-0202', 0),
(3, 'WebStudio', '555-0303', 0),
(4, 'AppForge', '555-0404', 0);

INSERT INTO categories VALUES
(2, 'Service', 4.5),
(2, 'Quality', 3.8),
(3, 'Service', 2.0),
(3, 'Quality', 1.5),
(4, 'Service', 0.5);
`,
    mySolution: `WITH cte AS (
SELECT company_id,
  ROUND(AVG(rating), 1) AS avg_rating,
  COUNT(*) AS total_rating
FROM categories
GROUP BY company_id
)
SELECT
  CASE WHEN is_promoted = 1 THEN CONCAT('[PROMOTED] ', c1.name) ELSE c1.name END AS name,
  c1.phone,
  CASE WHEN is_promoted = 1 THEN NULL
    ELSE CONCAT(
      REPEAT('*', FLOOR(c.avg_rating)::INT), ' (',
      c.avg_rating, ', based on ', c.total_rating, ' reviews)')
  END AS rating
FROM cte c
LEFT JOIN companies c1 ON c.company_id = c1.id
WHERE (c1.is_promoted = 0 AND c.avg_rating >= 1)
  OR c1.is_promoted = 1
ORDER BY c1.is_promoted DESC, c.avg_rating DESC, c.total_rating DESC`,
    systemSolution: `WITH company_ratings AS (
    SELECT
        c.id AS company_id,
        c.name AS company_name,
        c.phone AS company_phone,
        c.is_promoted,
        AVG(cat.rating) AS avg_rating,
        COUNT(cat.rating) AS total_reviews
    FROM companies c
    INNER JOIN categories cat ON c.id = cat.company_id
    GROUP BY c.id, c.name, c.phone, c.is_promoted
),
formatted_output AS (
    SELECT
        CASE
            WHEN cr.is_promoted = 1 THEN CONCAT('[PROMOTED] ', cr.company_name)
            ELSE cr.company_name
        END AS name,
        cr.company_phone AS phone,
        CASE
            WHEN cr.is_promoted = 1 THEN NULL
            ELSE CONCAT(
                REPEAT('*', FLOOR(cr.avg_rating)::INT),
                ' (',
                TO_CHAR(cr.avg_rating, 'FM999.0'),
                ', based on ',
                cr.total_reviews,
                ' reviews)'
            )
        END AS rating,
        cr.is_promoted,
        cr.total_reviews,
        cr.avg_rating
    FROM company_ratings cr
    WHERE cr.is_promoted = 1 OR cr.avg_rating >= 1
)
SELECT name, phone, rating
FROM formatted_output
ORDER BY is_promoted DESC, avg_rating DESC, total_reviews DESC;`,
    starterCode: `-- The Yellow Pages
-- Write your solution here
SELECT *
FROM companies;`,
    businessImpact: `Business directory formatting with promotion flags, star ratings, and review counts creates a structured Yellow Pages listing. CONCAT with REPEAT generates visual star ratings, while conditional formatting separates promoted (unrated) from organic (rated) listings.`,
    optimizationTips: [
      "REPEAT('*', FLOOR(avg)::INT) generates star characters in PostgreSQL",
      "TO_CHAR(value, 'FM999.0') replaces MySQL's FORMAT() for decimal formatting",
      "FM prefix removes leading spaces in TO_CHAR output",
      "WHERE filter in CTE excludes sub-1-star non-promoted companies before formatting"
    ],
    edgeCases: [
      "Company with no reviews \u2014 not in categories table, excluded from output",
      "Promoted company with reviews \u2014 rating shown as NULL",
      "Average rating below 1.0 for non-promoted \u2014 excluded",
      "Rating of exactly 1.0 \u2014 included (>= threshold)",
      "Company with 0.0 average rating \u2014 excluded"
    ]
  },

  {
    id: 58,
    title: "Quarterly sales Analysis",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Given a sales dataset that records daily transactions for various products, write an SQL query to calculate last quarter's total sales and quarter-to-date (QTD) sales for each product, helping analyze past performance and current trends.`,
    schema: [
      {
        name: "sales",
        columns: [
          { name: "id", type: "int" },
          { name: "product_id", type: "int" },
          { name: "sale_date", type: "date" },
          { name: "sales_amount", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
  id INT,
  product_id INT,
  sale_date DATE,
  sales_amount INT
);

INSERT INTO sales VALUES
(1, 1, '2024-07-15', 500),
(2, 1, '2024-08-20', 600),
(3, 1, '2024-09-10', 400),
(4, 2, '2024-07-01', 300),
(5, 2, '2024-08-15', 350),
(6, 1, '2024-10-05', 700),
(7, 2, '2024-10-12', 250);
`,
    mySolution: `WITH last_quarter_sales AS (
    SELECT
        product_id,
        SUM(sales_amount) AS lq_total
    FROM sales
    WHERE sale_date >= DATE_TRUNC('quarter', CURRENT_DATE - INTERVAL '3 months')
      AND sale_date < DATE_TRUNC('quarter', CURRENT_DATE)
    GROUP BY product_id
),
qtd_sales AS (
    SELECT
        product_id,
        SUM(sales_amount) AS qtd_total
    FROM sales
    WHERE sale_date >= DATE_TRUNC('quarter', CURRENT_DATE)
      AND sale_date <= CURRENT_DATE
    GROUP BY product_id
)
SELECT
    COALESCE(lq.product_id, qtd.product_id) AS product_id,
    COALESCE(lq.lq_total, 0) AS last_quarter_sales,
    COALESCE(qtd.qtd_total, 0) AS qtd_sales,
    ROUND(
        100.0 * (COALESCE(qtd.qtd_total, 0) - COALESCE(lq.lq_total, 0))
        / NULLIF(lq.lq_total, 0),
        2
    ) AS pct_change
FROM last_quarter_sales lq
FULL OUTER JOIN qtd_sales qtd USING (product_id)
ORDER BY last_quarter_sales DESC;`,
    systemSolution: `WITH DateRanges AS (
  SELECT
    DATE_TRUNC('quarter', CURRENT_DATE) AS current_qtr_start,
    DATE_TRUNC('quarter', CURRENT_DATE - INTERVAL '3 months') AS last_qtr_start,
    DATE_TRUNC('quarter', CURRENT_DATE) - INTERVAL '1 day' AS last_qtr_end
),
SalesData AS (
    SELECT
        product_id,
        SUM(CASE
            WHEN sale_date >= (SELECT last_qtr_start FROM DateRanges)
                 AND sale_date <= (SELECT last_qtr_end FROM DateRanges)
            THEN sales_amount
            ELSE 0
        END) AS last_quarter_sales,
        SUM(CASE
            WHEN sale_date >= (SELECT current_qtr_start FROM DateRanges)
                 AND sale_date <= CURRENT_DATE
            THEN sales_amount
            ELSE 0
        END) AS qtd_sales
    FROM sales
    GROUP BY product_id
)
SELECT product_id, last_quarter_sales, qtd_sales
FROM SalesData;`,
    starterCode: `-- Quarterly sales Analysis
-- Write your solution here
SELECT *
FROM sales;`,
    businessImpact: `Quarterly sales comparison (last quarter total vs. quarter-to-date) is a standard financial KPI. DATE_TRUNC for quarter boundaries eliminates manual month calculations, and FULL OUTER JOIN preserves products that exist in only one quarter.`,
    optimizationTips: [
      "DATE_TRUNC('quarter', date) replaces MySQL's DATE_FORMAT + MOD + MONTH approach",
      "FULL OUTER JOIN ensures products in either quarter appear",
      "NULLIF prevents division by zero in percentage change",
      "CTE with DateRanges computes boundaries once, reused in CASE"
    ],
    edgeCases: [
      "Product with sales only in last quarter \u2014 qtd_sales = 0",
      "Product with sales only in current quarter \u2014 last_quarter_sales = 0",
      "No sales in either quarter \u2014 not in result",
      "Sale on quarter boundary date \u2014 correct assignment",
      "Current date is first day of quarter \u2014 qtd may be very small"
    ]
  },

  {
    id: 59,
    title: "Team Points Calculation",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Given a list of matches in the group stage of the football World Cup, compute the number of points each team currently has.
You are given two tables, "teams" and "matches", with the following structures:`,
    schema: [
      {
        name: "teams",
        columns: [
          { name: "team_id", type: "int" },
          { name: "team_name", type: "VARCHAR" }
        ]
      },
      {
        name: "matches",
        columns: [
          { name: "match_id", type: "int" },
          { name: "host_team", type: "int" },
          { name: "guest_team", type: "int" },
          { name: "host_goals", type: "int" },
          { name: "guest_goals", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS teams;

CREATE TABLE teams (
  team_id INT,
  team_name VARCHAR
);

CREATE TABLE matches (
  match_id INT,
  host_team INT,
  guest_team INT,
  host_goals INT,
  guest_goals INT
);

INSERT INTO teams VALUES
(1, 'Brazil'), (2, 'Germany'), (3, 'France'), (4, 'Argentina');

INSERT INTO matches VALUES
(1, 1, 2, 3, 1),
(2, 3, 4, 2, 2),
(3, 1, 3, 0, 1),
(4, 2, 4, 2, 0);
`,
    mySolution: `WITH cte AS (
SELECT host_team AS team,
  CASE WHEN host_goals > guest_goals THEN 3
    WHEN host_goals < guest_goals THEN 0
    WHEN host_goals = guest_goals THEN 1 END AS points
FROM matches
UNION ALL
SELECT guest_team,
  CASE WHEN host_goals < guest_goals THEN 3
    WHEN host_goals > guest_goals THEN 0
    WHEN host_goals = guest_goals THEN 1 END AS points
FROM matches
),
cte1 AS (
SELECT team, SUM(points) AS total_points
FROM cte
GROUP BY team
)
SELECT t.team_id, t.team_name,
  COALESCE(c1.total_points, 0) AS num_points
FROM teams t
LEFT JOIN cte1 c1 ON t.team_id = c1.team
ORDER BY num_points DESC;


-- TECHNIQUE 1: Avoid UNION ALL if possible (faster)
SELECT
    t.team_id,
    t.team_name,
    COALESCE(
        SUM(CASE
            WHEN m.host_team = t.team_id THEN
                CASE WHEN m.host_goals > m.guest_goals THEN 3
                     WHEN m.host_goals = m.guest_goals THEN 1
                     ELSE 0 END
            WHEN m.guest_team = t.team_id THEN
                CASE WHEN m.guest_goals > m.host_goals THEN 3
                     WHEN m.guest_goals = m.host_goals THEN 1
                     ELSE 0 END
        END), 0
    ) AS num_points
FROM teams t
LEFT JOIN matches m
    ON t.team_id IN (m.host_team, m.guest_team)
GROUP BY t.team_id, t.team_name
ORDER BY num_points DESC, t.team_id ASC;

-- TECHNIQUE 2: Pre-aggregated daily snapshots
-- Instead of scanning all matches, maintain running totals`,
    systemSolution: `SELECT
    t.team_id,
    t.team_name,
    SUM(CASE
        WHEN m.host_team = t.team_id AND m.host_goals > m.guest_goals THEN 3
        WHEN m.guest_team = t.team_id AND m.guest_goals > m.host_goals THEN 3
        WHEN m.host_team = t.team_id AND m.host_goals = m.guest_goals THEN 1
        WHEN m.guest_team = t.team_id AND m.guest_goals = m.host_goals THEN 1
        ELSE 0
    END) AS num_points
FROM teams t
LEFT JOIN matches m ON m.host_team = t.team_id OR m.guest_team = t.team_id
GROUP BY t.team_id, t.team_name
ORDER BY num_points DESC, t.team_id ASC;`,
    starterCode: `-- Team Points Calculation
-- Write your solution here
SELECT *
FROM teams;`,
    businessImpact: `World Cup group stage point calculation (Win=3, Draw=1, Loss=0) from match results. The UNION ALL approach normalizes host/guest into a single team column, while the single-pass JOIN approach with nested CASE is more efficient for large datasets.`,
    optimizationTips: [
      "Single JOIN with OR + nested CASE avoids UNION ALL overhead",
      "LEFT JOIN preserves teams with no matches (0 points)",
      "COALESCE handles NULL from unmatched LEFT JOIN",
      "Two approaches shown: UNION ALL (clearer) vs single SUM (faster)"
    ],
    edgeCases: [
      "Team with no matches played \u2014 0 points",
      "All draws \u2014 every team gets 1 point per match",
      "0-0 draw vs other draws \u2014 same points",
      "Team playing against itself \u2014 invalid data",
      "Multiple matches between same teams"
    ]
  },

  {
    id: 60,
    title: "Employees Current Salary",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `In your organization, each employee has a fixed joining salary recorded at the time they start. Over time, employees may receive one or more promotions, each offering a certain percentage increase to their current salary.

You're given two datasets:
employees :  contains each employee’s name and joining salary.=
promotions:  lists all promotions that have occurred, including the promotion date and the percent increase granted during that promotion.
Your task is to write a SQL query to compute the current salary of every employee by applying each of their promotions increase round to 1 decimal places.
If an employee has no promotions, their current salary remains equal to the joining salary. Order the result by emp id.`,
    schema: [
      {
        name: "employees",
        columns: [
          { name: "id", type: "INT" },
          { name: "name", type: "VARCHAR" },
          { name: "joining_salary", type: "INT" }
        ]
      },
      {
        name: "promotions",
        columns: [
          { name: "emp_id", type: "INT" },
          { name: "promotion_date", type: "DATE" },
          { name: "percent_increase", type: "INT" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id INT,
  name VARCHAR,
  joining_salary INT
);

CREATE TABLE promotions (
  emp_id INT,
  promotion_date DATE,
  percent_increase INT
);

INSERT INTO employees VALUES
(1, 'Ankit', 50000),
(2, 'Rohit', 60000),
(3, 'Priya', 45000);

INSERT INTO promotions VALUES
(1, '2022-06-01', 10),
(1, '2023-06-01', 15),
(2, '2023-01-01', 20);
`,
    mySolution: `WITH cte AS (
SELECT emp_id,
  EXP(SUM(LN(1 + percent_increase::NUMERIC / 100))) AS per_increase
FROM promotions
GROUP BY emp_id
)
SELECT e.id, e.name, e.joining_salary AS initial_salary,
  ROUND(COALESCE(c.per_increase * e.joining_salary, e.joining_salary)::NUMERIC, 1) AS current_salary
FROM employees e
LEFT JOIN cte c ON e.id = c.emp_id
ORDER BY e.id ASC`,
    systemSolution: `WITH promotion_multipliers AS (
    SELECT
        emp_id,
        EXP(SUM(LN(1 + percent_increase::NUMERIC / 100))) AS total_multiplier
    FROM promotions
    GROUP BY emp_id
)
SELECT
    e.id,
    e.name,
    e.joining_salary AS initial_salary,
    ROUND((e.joining_salary * COALESCE(pm.total_multiplier, 1))::NUMERIC, 1) AS current_salary
FROM employees e
LEFT JOIN promotion_multipliers pm ON e.id = pm.emp_id
ORDER BY e.id;`,
    starterCode: `-- Employees Current Salary
-- Write your solution here
SELECT *
FROM employees;`,
    businessImpact: `Compound percentage salary calculation using EXP(SUM(LN())) is the mathematical trick for multiplying variable-rate increases without iteration. This pattern applies to compound interest, inflation-adjusted pricing, and any cumulative percentage growth calculation.`,
    optimizationTips: [
      "EXP(SUM(LN(1 + pct/100))) = product of (1 + pct/100) for all promotions",
      "LN replaces MySQL's LOG (natural logarithm) in PostgreSQL",
      "COALESCE(multiplier, 1) handles employees with no promotions",
      "::NUMERIC cast needed for ROUND in PostgreSQL"
    ],
    edgeCases: [
      "Employee with no promotions \u2014 current salary = joining salary",
      "Employee with single promotion \u2014 simple percentage increase",
      "Multiple promotions compound \u2014 not additive",
      "100% increase \u2014 salary doubles",
      "0% increase promotion \u2014 no change"
    ]
  },

  {
    id: 61,
    title: "Salary Growth Analysis",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `The HR analytics team wants to evaluate employee performance based on their salary progression and promotion history. Write a query to return a summary for each employee with the following:
 1. \`employee_id\`
 2. \`latest_salary\`: most recent salary value
 3. \`total_promotions\`: number of times the employee got a promotion 
 4. \`max_perc_change\`: the maximum percentage increase between any two salary changes (round to 2 decimal places)
 5. \`never_decreased\`: 'Y' if salary never decreased, else 'N'
 6. \`RankByGrowth\`: rank of the employee based on salary growth (latest_salary / first_salary), tie-breaker = earliest join date`,
    schema: [
      {
        name: "employees",
        columns: [
          { name: "employee_id", type: "INT" },
          { name: "name", type: "VARCHAR" },
          { name: "join_date", type: "DATE" },
          { name: "department", type: "VARCHAR" },
          { name: "intial_salary", type: "INT" }
        ]
      },
      {
        name: "salary_history",
        columns: [
          { name: "employee_id", type: "INT" },
          { name: "change_date", type: "DATE" },
          { name: "salary", type: "INT" },
          { name: "promotion", type: "VARCHAR" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS salary_history;
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  employee_id INT,
  name VARCHAR,
  join_date DATE,
  department VARCHAR,
  intial_salary INT
);

CREATE TABLE salary_history (
  employee_id INT,
  change_date DATE,
  salary INT,
  promotion VARCHAR
);

INSERT INTO employees VALUES
(1, 'Ankit', '2020-01-15', 'Engineering', 50000),
(2, 'Rohit', '2019-06-01', 'Marketing', 45000),
(3, 'Priya', '2021-03-10', 'Engineering', 60000);

INSERT INTO salary_history VALUES
(1, '2021-01-15', 55000, 'Yes'),
(1, '2022-01-15', 62000, 'Yes'),
(1, '2023-01-15', 58000, 'No'),
(2, '2020-06-01', 48000, 'Yes'),
(2, '2021-06-01', 55000, 'Yes');
`,
    mySolution: `WITH salary_union AS (
    SELECT
        employee_id,
        join_date AS change_date,
        intial_salary AS salary,
        'No' AS promotion
    FROM employees
    UNION ALL
    SELECT
        employee_id,
        change_date,
        salary,
        promotion
    FROM salary_history
),
cte AS (
    SELECT
        su.*,
        RANK() OVER (PARTITION BY employee_id ORDER BY change_date DESC) AS rn_desc,
        RANK() OVER (PARTITION BY employee_id ORDER BY change_date ASC) AS rn_asc,
        LEAD(salary) OVER (PARTITION BY employee_id ORDER BY change_date DESC) AS prev_salary
    FROM salary_union su
),
salary_growth_cte AS (
    SELECT
        employee_id,
        MAX(CASE WHEN rn_desc = 1 THEN salary END) * 1.0 /
        MAX(CASE WHEN rn_asc = 1 THEN salary END) AS salary_growth,
        MIN(change_date) AS join_date
    FROM cte
    GROUP BY employee_id
),
decrease_flag AS (
    SELECT
        employee_id,
        MAX(CASE WHEN prev_salary IS NOT NULL AND salary < prev_salary THEN 1 ELSE 0 END) AS has_decreased
    FROM cte
    GROUP BY employee_id
)
SELECT
    c.employee_id,
    MAX(CASE WHEN c.rn_desc = 1 THEN c.salary END) AS latest_salary,
    SUM(CASE WHEN c.promotion = 'Yes' THEN 1 ELSE 0 END) AS total_promotions,
    MAX(
      CASE
        WHEN c.prev_salary IS NOT NULL AND c.prev_salary > 0
        THEN ROUND((c.salary - c.prev_salary) * 100.0 / c.prev_salary, 2)
        ELSE 0.00
      END
    ) AS max_perc_change,
    CASE
        WHEN d.has_decreased = 1 THEN 'N'
        ELSE 'Y'
    END AS never_decreased,
    ROW_NUMBER() OVER (
        ORDER BY sg.salary_growth DESC, sg.join_date ASC
    ) AS RankByGrowth
FROM cte c
JOIN salary_growth_cte sg ON c.employee_id = sg.employee_id
JOIN decrease_flag d ON c.employee_id = d.employee_id
GROUP BY c.employee_id, sg.salary_growth, sg.join_date, d.has_decreased
ORDER BY c.employee_id;`,
    systemSolution: `WITH salary_union AS (
    SELECT
        employee_id,
        join_date AS change_date,
        intial_salary AS salary,
        'No' AS promotion
    FROM employees
    UNION ALL
    SELECT
        employee_id,
        change_date,
        salary,
        promotion
    FROM salary_history
),
cte AS (
    SELECT
        su.*,
        RANK() OVER (PARTITION BY employee_id ORDER BY change_date DESC) AS rn_desc,
        RANK() OVER (PARTITION BY employee_id ORDER BY change_date ASC) AS rn_asc,
        LEAD(salary) OVER (PARTITION BY employee_id ORDER BY change_date DESC) AS prev_salary
    FROM salary_union su
),
salary_growth_cte AS (
    SELECT
        employee_id,
        MAX(CASE WHEN rn_desc = 1 THEN salary END) * 1.0 /
        MAX(CASE WHEN rn_asc = 1 THEN salary END) AS salary_growth,
        MIN(change_date) AS join_date
    FROM cte
    GROUP BY employee_id
),
decrease_flag AS (
    SELECT
        employee_id,
        MAX(CASE WHEN prev_salary IS NOT NULL AND salary < prev_salary THEN 1 ELSE 0 END) AS has_decreased
    FROM cte
    GROUP BY employee_id
)
SELECT
    c.employee_id,
    MAX(CASE WHEN c.rn_desc = 1 THEN c.salary END) AS latest_salary,
    SUM(CASE WHEN c.promotion = 'Yes' THEN 1 ELSE 0 END) AS total_promotions,
    MAX(
      CASE
        WHEN c.prev_salary IS NOT NULL AND c.prev_salary > 0
        THEN ROUND((c.salary - c.prev_salary) * 100.0 / c.prev_salary, 2)
        ELSE 0.00
      END
    ) AS max_perc_change,
    CASE
        WHEN d.has_decreased = 1 THEN 'N'
        ELSE 'Y'
    END AS never_decreased,
    ROW_NUMBER() OVER (
        ORDER BY sg.salary_growth DESC, sg.join_date ASC
    ) AS RankByGrowth
FROM cte c
JOIN salary_growth_cte sg ON c.employee_id = sg.employee_id
JOIN decrease_flag d ON c.employee_id = d.employee_id
GROUP BY c.employee_id, sg.salary_growth, sg.join_date, d.has_decreased
ORDER BY c.employee_id;`,
    starterCode: `-- Salary Growth Analysis
-- Write your solution here
SELECT *
FROM employees;`,
    businessImpact: `Comprehensive salary progression analysis combining latest salary, promotion count, max percentage increase, decrease detection, and growth ranking provides a multi-dimensional view of employee performance for HR compensation reviews and retention planning.`,
    optimizationTips: [
      "UNION ALL combines initial salary with salary_history for complete timeline",
      "RANK with DESC and ASC gets latest and earliest salary per employee",
      "LEAD(salary) over DESC order gives previous salary for change calculation",
      "EXP/LN pattern works for compound growth; here simple ratio is used"
    ],
    edgeCases: [
      "Employee with no salary history \u2014 only initial salary",
      "Salary decreased \u2014 never_decreased = 'N'",
      "prev_salary is NULL for first record \u2014 max_perc_change ignores it",
      "Same salary multiple times \u2014 0% change",
      "Tied salary growth \u2014 broken by earliest join_date"
    ]
  },

  {
    id: 62,
    title: "Customers with 3 Purchases",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Find users who have made exactly three purchases, such that:
1. Their second purchase occurred within 7 days of the first, 
2. Their third purchase occurred at least 30 days after the second, and
3. There is no more purchase after that
Return all user_ids that match the above pattern along with their first_order_date, second_order_date, and third_order_date.`,
    schema: [
      {
        name: "orders",
        columns: [
          { name: "order_id", type: "INT" },
          { name: "user_id", type: "INT" },
          { name: "order_date", type: "DATE" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  order_id INT,
  user_id INT,
  order_date DATE
);

INSERT INTO orders VALUES
(1, 101, '2024-01-01'),
(2, 101, '2024-01-05'),
(3, 101, '2024-02-10'),
(4, 102, '2024-01-10'),
(5, 102, '2024-01-12'),
(6, 102, '2024-01-20'),
(7, 103, '2024-01-01'),
(8, 103, '2024-01-03'),
(9, 103, '2024-02-15');
`,
    mySolution: `WITH ordered_purchases AS (
  SELECT
    user_id,
    order_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_date) AS rn,
    COUNT(*) OVER (PARTITION BY user_id) AS total_orders
  FROM orders
),
pivoted AS (
  SELECT
    user_id,
    MAX(CASE WHEN rn = 1 THEN order_date END) AS first_order_date,
    MAX(CASE WHEN rn = 2 THEN order_date END) AS second_order_date,
    MAX(CASE WHEN rn = 3 THEN order_date END) AS third_order_date
  FROM ordered_purchases
  WHERE total_orders = 3
  GROUP BY user_id
)
SELECT *
FROM pivoted
WHERE (second_order_date - first_order_date) <= 7
  AND (third_order_date - second_order_date) >= 30;`,
    systemSolution: `WITH ordered_purchases AS (
  SELECT
    user_id,
    order_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_date) AS rn,
    COUNT(*) OVER (PARTITION BY user_id) AS total_orders
  FROM orders
),
pivoted AS (
  SELECT
    user_id,
    MAX(CASE WHEN rn = 1 THEN order_date END) AS first_order_date,
    MAX(CASE WHEN rn = 2 THEN order_date END) AS second_order_date,
    MAX(CASE WHEN rn = 3 THEN order_date END) AS third_order_date
  FROM ordered_purchases
  WHERE total_orders = 3
  GROUP BY user_id
)
SELECT *
FROM pivoted
WHERE (second_order_date - first_order_date) <= 7
  AND (third_order_date - second_order_date) >= 30;`,
    starterCode: `-- Customers with 3 Purchases
-- Write your solution here
SELECT *
FROM orders;`,
    businessImpact: `Purchase pattern detection (quick repeat within 7 days, then delayed 30+ days) identifies customer re-engagement behavior. This pattern often indicates trial-then-commitment behavior, useful for subscription conversion and lifecycle marketing triggers.`,
    optimizationTips: [
      "(date2 - date1) returns integer days in PostgreSQL, replacing DATEDIFF",
      "Window COUNT(*) pre-filters to exactly 3 orders per user",
      "Pivot via MAX(CASE WHEN rn = N) converts rows to columns",
      "No self-joins needed \u2014 single scan with window functions"
    ],
    edgeCases: [
      "User with exactly 3 orders but wrong timing \u2014 excluded",
      "User with 4+ orders \u2014 excluded by total_orders = 3",
      "User with fewer than 3 orders \u2014 excluded",
      "Orders on the same day \u2014 difference = 0 days",
      "Exact boundary: 2nd order 7 days after 1st \u2014 <= 7 includes it"
    ]
  },

  {
    id: 63,
    title: "IPv4 Validator",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are given a table logins containing IP addresses as plain text strings.
Each row represents an IP address from a user login attempt. Your task is to validate whether the IP address is a valid IPv4 address or not based on the following criteria:
1- The IP address must contain exactly 4 parts, separated by 3 dots (.).
2- Each part must consist of only numeric digits (no letters or special characters).
3- Each numeric part must be within the inclusive range of 0 to 255.
4- No part should contain leading zeros unless the value is exactly 0.`,
    schema: [
      {
        name: "logins",
        columns: [
          { name: "ip_address", type: "VARCHAR" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS logins;

CREATE TABLE logins (
  ip_address VARCHAR
);

INSERT INTO logins VALUES
('192.168.1.1'),
('255.255.255.255'),
('0.0.0.0'),
('256.1.2.3'),
('1.02.3.4'),
('1.2.3'),
('abc.def.ghi.jkl'),
('1.2.3.4.5'),
('192.168.001.1');
`,
    mySolution: `SELECT
  ip_address,
  CASE
    -- Not exactly 3 dots
    WHEN LENGTH(ip_address) - LENGTH(REPLACE(ip_address, '.', '')) != 3 THEN 0
    -- Any part is non-numeric
    WHEN NOT SPLIT_PART(ip_address, '.', 1) ~ '^[0-9]+$' THEN 0
    WHEN NOT SPLIT_PART(ip_address, '.', 2) ~ '^[0-9]+$' THEN 0
    WHEN NOT SPLIT_PART(ip_address, '.', 3) ~ '^[0-9]+$' THEN 0
    WHEN NOT SPLIT_PART(ip_address, '.', 4) ~ '^[0-9]+$' THEN 0
    -- Any part > 255
    WHEN CAST(SPLIT_PART(ip_address, '.', 1) AS INT) > 255 THEN 0
    WHEN CAST(SPLIT_PART(ip_address, '.', 2) AS INT) > 255 THEN 0
    WHEN CAST(SPLIT_PART(ip_address, '.', 3) AS INT) > 255 THEN 0
    WHEN CAST(SPLIT_PART(ip_address, '.', 4) AS INT) > 255 THEN 0
    -- Leading zeros
    WHEN LENGTH(SPLIT_PART(ip_address, '.', 1)) != LENGTH(CAST(CAST(SPLIT_PART(ip_address, '.', 1) AS INT) AS VARCHAR)) THEN 0
    WHEN LENGTH(SPLIT_PART(ip_address, '.', 2)) != LENGTH(CAST(CAST(SPLIT_PART(ip_address, '.', 2) AS INT) AS VARCHAR)) THEN 0
    WHEN LENGTH(SPLIT_PART(ip_address, '.', 3)) != LENGTH(CAST(CAST(SPLIT_PART(ip_address, '.', 3) AS INT) AS VARCHAR)) THEN 0
    WHEN LENGTH(SPLIT_PART(ip_address, '.', 4)) != LENGTH(CAST(CAST(SPLIT_PART(ip_address, '.', 4) AS INT) AS VARCHAR)) THEN 0
    -- Passed all checks
    ELSE 1
  END AS is_valid
FROM logins;`,
    systemSolution: `SELECT
  ip_address,
  CASE
    -- Not exactly 3 dots
    WHEN LENGTH(ip_address) - LENGTH(REPLACE(ip_address, '.', '')) != 3 THEN 0
    -- Any part is non-numeric
    WHEN NOT SPLIT_PART(ip_address, '.', 1) ~ '^[0-9]+$' THEN 0
    WHEN NOT SPLIT_PART(ip_address, '.', 2) ~ '^[0-9]+$' THEN 0
    WHEN NOT SPLIT_PART(ip_address, '.', 3) ~ '^[0-9]+$' THEN 0
    WHEN NOT SPLIT_PART(ip_address, '.', 4) ~ '^[0-9]+$' THEN 0
    -- Any part > 255
    WHEN CAST(SPLIT_PART(ip_address, '.', 1) AS INT) > 255 THEN 0
    WHEN CAST(SPLIT_PART(ip_address, '.', 2) AS INT) > 255 THEN 0
    WHEN CAST(SPLIT_PART(ip_address, '.', 3) AS INT) > 255 THEN 0
    WHEN CAST(SPLIT_PART(ip_address, '.', 4) AS INT) > 255 THEN 0
    -- Leading zeros
    WHEN LENGTH(SPLIT_PART(ip_address, '.', 1)) != LENGTH(CAST(CAST(SPLIT_PART(ip_address, '.', 1) AS INT) AS VARCHAR)) THEN 0
    WHEN LENGTH(SPLIT_PART(ip_address, '.', 2)) != LENGTH(CAST(CAST(SPLIT_PART(ip_address, '.', 2) AS INT) AS VARCHAR)) THEN 0
    WHEN LENGTH(SPLIT_PART(ip_address, '.', 3)) != LENGTH(CAST(CAST(SPLIT_PART(ip_address, '.', 3) AS INT) AS VARCHAR)) THEN 0
    WHEN LENGTH(SPLIT_PART(ip_address, '.', 4)) != LENGTH(CAST(CAST(SPLIT_PART(ip_address, '.', 4) AS INT) AS VARCHAR)) THEN 0
    -- Passed all checks
    ELSE 1
  END AS is_valid
FROM logins;`,
    starterCode: `-- IPv4 Validator
-- Write your solution here
SELECT *
FROM logins;`,
    businessImpact: `IP address validation in pure SQL is useful for data cleansing ETL pipelines, firewall log analysis, and user login auditing. SPLIT_PART replaces MySQL's SUBSTRING_INDEX, while ~ replaces REGEXP for pattern matching in PostgreSQL.`,
    optimizationTips: [
      "SPLIT_PART(str, '.', N) replaces MySQL's SUBSTRING_INDEX in PostgreSQL",
      "~ operator replaces REGEXP for regex matching in PostgreSQL",
      "CAST(... AS INT) replaces CAST(... AS UNSIGNED)",
      "Chained CASE WHEN provides short-circuit validation"
    ],
    edgeCases: [
      "IP with only 2 dots \u2014 invalid (not 4 parts)",
      "Part with leading zeros like '01' \u2014 invalid",
      "Part = '0' \u2014 valid (no leading zero issue)",
      "Part > 255 \u2014 invalid",
      "Non-numeric characters in any part \u2014 invalid"
    ]
  },

  {
    id: 64,
    title: "Teams",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Write a query to return a list of teams for each city. Teams are formed within these rules :
1. team members must live in the city they represent.
2. for each city, create teams of 3 until there are fewer than 3 who are unassigned.
3. when there are fewer than 3 people unassigned in a city, they form a team.
Report requirements :
1. There should be 3 columns : city name, a comma-delimited list of up to 3 players and the team's name.
2. the city should be ordered alphabetically
3. Players are selected in the order they occur in the table.
4. Player names should be ordered alphabetically within the comma-delimited list.
5. Team names are 'Team' plus a number.
For example, the first row's team is Team1, then Team2 and so on….`,
    schema: [
      {
        name: "emp_details",
        columns: [
          { name: "emp_name", type: "VARCHAR" },
          { name: "city", type: "VARCHAR" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS emp_details;

CREATE TABLE emp_details (
  emp_name VARCHAR,
  city VARCHAR
);

INSERT INTO emp_details VALUES
('Alice', 'Delhi'),
('Bob', 'Delhi'),
('Charlie', 'Delhi'),
('Dave', 'Delhi'),
('Eve', 'Mumbai'),
('Frank', 'Mumbai'),
('Grace', 'Mumbai');
`,
    mySolution: `WITH cte AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY city ORDER BY city) AS rn
    FROM emp_details
),
cte2 AS (
    SELECT *, CEIL(rn / 3.0) AS team_group
    FROM cte
),
cte3 AS (
    SELECT city,
           STRING_AGG(emp_name, ',' ORDER BY emp_name) AS team
    FROM cte2
    GROUP BY city, team_group
)
SELECT *,
       CONCAT('Team', ROW_NUMBER() OVER (ORDER BY city)) AS team_name
FROM cte3;`,
    systemSolution: `WITH cte AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY city ORDER BY city) AS rn
    FROM emp_details
),
cte2 AS (
    SELECT *, CEIL(rn / 3.0) AS team_group
    FROM cte
),
cte3 AS (
    SELECT city,
           STRING_AGG(emp_name, ',' ORDER BY emp_name) AS team
    FROM cte2
    GROUP BY city, team_group
)
SELECT *,
       CONCAT('Team', ROW_NUMBER() OVER (ORDER BY city)) AS team_name
FROM cte3;`,
    starterCode: `-- Teams
-- Write your solution here
SELECT *
FROM emp_details;`,
    businessImpact: `Automatic team formation by city with configurable group size (3) uses integer division for group assignment and STRING_AGG for member aggregation. This pattern applies to event planning, sports league grouping, and workforce organization.`,
    optimizationTips: [
      "STRING_AGG(name, ',' ORDER BY name) replaces GROUP_CONCAT in PostgreSQL",
      "CEIL(rn / 3.0) assigns sequential group numbers (1, 2, 3...)",
      "ROW_NUMBER partitioned by city assigns per-city sequence",
      "Final ROW_NUMBER over city order generates global team names"
    ],
    edgeCases: [
      "City with fewer than 3 people \u2014 forms a smaller team",
      "City with exactly 3 people \u2014 one full team",
      "City with 4 people \u2014 team of 3 + team of 1",
      "Empty city \u2014 no teams generated",
      "Duplicate employee names in same city"
    ]
  },

  {
    id: 65,
    title: "Marketing Analytics",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `As part of NamasteMart's e-commerce marketing analytics, the team needs to generate a July 2021 customer revenue summary report. Revenue from a customer is the sum of the values described below.
type=BUY, the customer purchased something, the transaction amount is potential revenue
type=SELL, the customer sold something, HackerMart collects a fee, 10% of the transaction amount is potential revenue
 

Status determines how a transaction is treated.

status = COMPLETED, the transaction is included
status = PENDING, the transaction is ignored
status = CANCELED, the transaction is void, 1% of the transaction amount is deducted from total revenue
 

Columns to report are customer, buy, sell, completed, pending, canceled, total. 
buy, sell, completed, pending, and canceled are the number of transactions that match, and total is the total revenue, calculated as described and rounded to 2 places after the decimal. Sort the result in descending order of total revenue.`,
    schema: [
      {
        name: "transactions",
        columns: [
          { name: "dt", type: "VARCHAR(19)" },
          { name: "customer", type: "VARCHAR(30)" },
          { name: "type", type: "VARCHAR(4)" },
          { name: "amount", type: "DECIMAL(4,2)" },
          { name: "status", type: "VARCHAR(9)" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
  dt VARCHAR(19),
  customer VARCHAR(30),
  type VARCHAR(4),
  amount DECIMAL(10,2),
  status VARCHAR(9)
);

INSERT INTO transactions VALUES
('2021-07-01 10:00:00', 'Alice', 'BUY', 50.00, 'COMPLETED'),
('2021-07-02 11:00:00', 'Alice', 'SELL', 30.00, 'COMPLETED'),
('2021-07-03 09:00:00', 'Alice', 'BUY', 20.00, 'CANCELED'),
('2021-07-04 14:00:00', 'Bob', 'BUY', 100.00, 'COMPLETED'),
('2021-07-05 15:00:00', 'Bob', 'SELL', 60.00, 'PENDING'),
('2021-07-06 16:00:00', 'Bob', 'BUY', 40.00, 'CANCELED'),
('2021-06-28 08:00:00', 'Alice', 'BUY', 80.00, 'COMPLETED');
`,
    mySolution: `WITH july_tx AS (
    SELECT *
    FROM transactions
    WHERE dt >= '2021-07-01'
      AND dt < '2021-08-01'
),
customer_agg AS (
    SELECT
        customer,
        SUM(CASE WHEN type = 'BUY' THEN 1 ELSE 0 END) AS buy,
        SUM(CASE WHEN type = 'SELL' THEN 1 ELSE 0 END) AS sell,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'CANCELED' THEN 1 ELSE 0 END) AS canceled,
        ROUND(
            SUM(
                CASE
                    WHEN status = 'PENDING' THEN 0
                    WHEN status = 'COMPLETED' AND type = 'BUY' THEN amount
                    WHEN status = 'COMPLETED' AND type = 'SELL' THEN 0.10 * amount
                    WHEN status = 'CANCELED' THEN -0.01 * amount
                END
            ),
            2
        ) AS total
    FROM july_tx
    GROUP BY customer
)
SELECT customer, buy, sell, completed, pending, canceled, total
FROM customer_agg
ORDER BY total DESC;`,
    systemSolution: `WITH july_tx AS (
    SELECT *
    FROM transactions
    WHERE dt >= '2021-07-01'
      AND dt < '2021-08-01'
),
customer_agg AS (
    SELECT
        customer,
        SUM(CASE WHEN type = 'BUY' THEN 1 ELSE 0 END) AS buy,
        SUM(CASE WHEN type = 'SELL' THEN 1 ELSE 0 END) AS sell,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'CANCELED' THEN 1 ELSE 0 END) AS canceled,
        ROUND(
            SUM(
                CASE
                    WHEN status = 'PENDING' THEN 0
                    WHEN status = 'COMPLETED' AND type = 'BUY' THEN amount
                    WHEN status = 'COMPLETED' AND type = 'SELL' THEN 0.10 * amount
                    WHEN status = 'CANCELED' THEN -0.01 * amount
                END
            ),
            2
        ) AS total
    FROM july_tx
    GROUP BY customer
)
SELECT customer, buy, sell, completed, pending, canceled, total
FROM customer_agg
ORDER BY total DESC;`,
    starterCode: `-- Marketing Analytics
-- Write your solution here
SELECT *
FROM transactions;`,
    businessImpact: `E-commerce revenue calculation with multiple transaction types (BUY/SELL) and statuses (COMPLETED/PENDING/CANCELED) models real marketplace economics. SELL transactions generate 10% commission revenue, while CANCELED transactions incur 1% penalty deductions.`,
    optimizationTips: [
      "Nested CASE WHEN handles type + status combinations for revenue",
      "CTE filters to July 2021 before aggregation",
      "ROUND(SUM(...), 2) ensures currency precision",
      "String date comparison works for ISO format dates"
    ],
    edgeCases: [
      "Transaction outside July 2021 \u2014 excluded by CTE filter",
      "PENDING transaction \u2014 counted but contributes 0 revenue",
      "CANCELED BUY \u2014 deducts 1% of amount from total",
      "Customer with only PENDING transactions \u2014 total = 0",
      "Transaction on July 31 23:59:59 \u2014 included"
    ]
  },

  {
    id: 66,
    title: "Cohort Retention",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `Khan Academy capture data on how users are using their product, with the schemas below. Using this data they would like to report on monthly “engaged” retention rates. Monthly “engaged” retention is defined here as the % of users from each registration cohort that continued to use the product as an “engaged” user having met the threshold of >= 30 minutes per month. They are looking for the retention metric calculated for within 1-3 calendar months post registration.`,
    schema: [
      {
        name: "users",
        columns: [
          { name: "user_id", type: "VARCHAR" },
          { name: "registration_date", type: "DATE" }
        ]
      },
      {
        name: "usage_data",
        columns: [
          { name: "user_id", type: "VARCHAR" },
          { name: "usage_date", type: "DATE" },
          { name: "location", type: "VARCHAR" },
          { name: "time_spent", type: "INTEGER" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS usage_data;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id VARCHAR,
  registration_date DATE
);

CREATE TABLE usage_data (
  user_id VARCHAR,
  usage_date DATE,
  location VARCHAR,
  time_spent INTEGER
);

INSERT INTO users VALUES
('U1', '2024-01-15'),
('U2', '2024-01-20'),
('U3', '2024-02-01');

INSERT INTO usage_data VALUES
('U1', '2024-01-20', 'web', 20),
('U1', '2024-01-25', 'app', 15),
('U1', '2024-02-20', 'web', 35),
('U1', '2024-03-20', 'app', 40),
('U2', '2024-02-01', 'web', 10),
('U2', '2024-02-10', 'app', 25),
('U3', '2024-02-15', 'web', 50);
`,
    mySolution: `WITH consolidated_usage AS (
    SELECT
        u.user_id,
        TO_CHAR(u.registration_date, 'YYYY-MM') AS registration_month,
        SUM(CASE
            WHEN usg.usage_date <= u.registration_date + INTERVAL '1 month' THEN usg.time_spent
            ELSE 0
        END) AS m1_time_spent,
        SUM(CASE
            WHEN usg.usage_date > u.registration_date + INTERVAL '1 month'
                 AND usg.usage_date <= u.registration_date + INTERVAL '2 months' THEN usg.time_spent
            ELSE 0
        END) AS m2_time_spent,
        SUM(CASE
            WHEN usg.usage_date > u.registration_date + INTERVAL '2 months'
                 AND usg.usage_date <= u.registration_date + INTERVAL '3 months' THEN usg.time_spent
            ELSE 0
        END) AS m3_time_spent
    FROM users u
    LEFT JOIN usage_data usg ON u.user_id = usg.user_id
    GROUP BY u.user_id, TO_CHAR(u.registration_date, 'YYYY-MM')
)
SELECT
    registration_month,
    COUNT(*) AS total_users,
    COALESCE(ROUND(SUM(CASE WHEN m1_time_spent >= 30 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), 0) AS m1_retention,
    COALESCE(ROUND(SUM(CASE WHEN m2_time_spent >= 30 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), 0) AS m2_retention,
    COALESCE(ROUND(SUM(CASE WHEN m3_time_spent >= 30 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), 0) AS m3_retention
FROM consolidated_usage
GROUP BY registration_month;`,
    systemSolution: `WITH consolidated_usage AS (
    SELECT
        u.user_id,
        TO_CHAR(u.registration_date, 'YYYY-MM') AS registration_month,
        SUM(CASE
            WHEN usg.usage_date <= u.registration_date + INTERVAL '1 month' THEN usg.time_spent
            ELSE 0
        END) AS m1_time_spent,
        SUM(CASE
            WHEN usg.usage_date > u.registration_date + INTERVAL '1 month'
                 AND usg.usage_date <= u.registration_date + INTERVAL '2 months' THEN usg.time_spent
            ELSE 0
        END) AS m2_time_spent,
        SUM(CASE
            WHEN usg.usage_date > u.registration_date + INTERVAL '2 months'
                 AND usg.usage_date <= u.registration_date + INTERVAL '3 months' THEN usg.time_spent
            ELSE 0
        END) AS m3_time_spent
    FROM users u
    LEFT JOIN usage_data usg ON u.user_id = usg.user_id
    GROUP BY u.user_id, TO_CHAR(u.registration_date, 'YYYY-MM')
)
SELECT
    registration_month,
    COUNT(*) AS total_users,
    COALESCE(ROUND(SUM(CASE WHEN m1_time_spent >= 30 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), 0) AS m1_retention,
    COALESCE(ROUND(SUM(CASE WHEN m2_time_spent >= 30 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), 0) AS m2_retention,
    COALESCE(ROUND(SUM(CASE WHEN m3_time_spent >= 30 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2), 0) AS m3_retention
FROM consolidated_usage
GROUP BY registration_month;`,
    starterCode: `-- Cohort Retention
-- Write your solution here
SELECT *
FROM users;`,
    businessImpact: `Cohort retention analysis tracks what percentage of users from each registration month remain 'engaged' (>= 30 minutes) in months 1-3 post-registration. This is a core product analytics metric for measuring onboarding effectiveness and long-term user value.`,
    optimizationTips: [
      "TO_CHAR(date, 'YYYY-MM') replaces MySQL's DATE_FORMAT for month grouping",
      "'+ INTERVAL N months' replaces DATE_ADD in PostgreSQL",
      "COALESCE replaces IFNULL for NULL handling",
      "LEFT JOIN preserves users with no usage data (0 time spent)"
    ],
    edgeCases: [
      "User with no usage data \u2014 all retention periods = 0 minutes",
      "User active in month 1 but not months 2-3",
      "Usage exactly on the boundary date \u2014 included in which month?",
      "Registration cohort with single user",
      "User with exactly 30 minutes \u2014 meets threshold (>=)"
    ]
  },

  {
    id: 67,
    title: "Flight Planner System",
    difficulty: "Hard",
    category: "Analytics",
    points: 40,
    problem: `You are building a flight planner system for a travel application. The system stores data about flights between airports and users who want to travel between cities. The planner must help each user find the fastest possible flight route from their source city to their destination city.

Each route may consist of:
A direct flight, or
A two-leg journey with only one stopover at an intermediate city.

A stopover is allowed only if the connecting flight departs at or after the arrival time of the first flight. The second flight must depart from the airport where the first one landed.

Write a SQL query that returns following columns, for each user:

user_id
trip_start_city
middle_city (NULL if it's a direct flight)
trip_end_city

trip_time (Total journey duration in minutes)
flight_ids (semicolon-separated , eg: 1 for direct, or 3;5 for one-stop)

 

Return all possible valid routes, sorted by user_id and shortest duration.`,
    schema: [
      {
        name: "users",
        columns: [
          { name: "user_id", type: "INT" },
          { name: "source_city", type: "VARCHAR" },
          { name: "destination_city", type: "VARCHAR" }
        ]
      },
      {
        name: "airports",
        columns: [
          { name: "port_code", type: "VARCHAR" },
          { name: "city_name", type: "VARCHAR" }
        ]
      },
      {
        name: "flights",
        columns: [
          { name: "flight_id", type: "VARCHAR" },
          { name: "start_port", type: "VARCHAR" },
          { name: "end_port", type: "VARCHAR" },
          { name: "start_time", type: "datetime" },
          { name: "end_time", type: "datetime" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS airports;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT,
  source_city VARCHAR,
  destination_city VARCHAR
);

CREATE TABLE airports (
  port_code VARCHAR,
  city_name VARCHAR
);

CREATE TABLE flights (
  flight_id VARCHAR,
  start_port VARCHAR,
  end_port VARCHAR,
  start_time TIMESTAMP,
  end_time TIMESTAMP
);

INSERT INTO users VALUES
(1, 'Delhi', 'Mumbai'),
(2, 'Delhi', 'Chennai');

INSERT INTO airports VALUES
('DEL', 'Delhi'),
('BOM', 'Mumbai'),
('MAA', 'Chennai'),
('BLR', 'Bangalore');

INSERT INTO flights VALUES
('F1', 'DEL', 'BOM', '2024-01-01 08:00:00', '2024-01-01 10:00:00'),
('F2', 'DEL', 'BLR', '2024-01-01 09:00:00', '2024-01-01 12:00:00'),
('F3', 'BLR', 'MAA', '2024-01-01 13:00:00', '2024-01-01 14:30:00'),
('F4', 'DEL', 'MAA', '2024-01-01 07:00:00', '2024-01-01 10:30:00'),
('F5', 'BLR', 'BOM', '2024-01-01 13:00:00', '2024-01-01 14:00:00');
`,
    mySolution: `WITH user_start_ports AS (
    SELECT u.user_id, a.port_code, a.city_name AS start_city
    FROM users u
    JOIN airports a ON a.city_name = u.source_city
),
user_end_ports AS (
    SELECT u.user_id, a.port_code, a.city_name AS end_city
    FROM users u
    JOIN airports a ON a.city_name = u.destination_city
),
direct_routes AS (
    SELECT
        sp.user_id,
        sp.start_city AS trip_start_city,
        NULL AS middle_city,
        ep.end_city AS trip_end_city,
        EXTRACT(EPOCH FROM (f.end_time - f.start_time)) / 60 AS trip_time,
        CAST(f.flight_id AS VARCHAR) AS flight_ids
    FROM flights f
    JOIN user_start_ports sp ON f.start_port = sp.port_code
    JOIN user_end_ports ep ON f.end_port = ep.port_code AND sp.user_id = ep.user_id
),
one_stop_routes AS (
    SELECT
        sp.user_id,
        sp.start_city AS trip_start_city,
        mid.city_name AS middle_city,
        ep.end_city AS trip_end_city,
        EXTRACT(EPOCH FROM (f2.end_time - f1.start_time)) / 60 AS trip_time,
        CONCAT(f1.flight_id, ';', f2.flight_id) AS flight_ids
    FROM flights f1
    JOIN flights f2
        ON f1.end_port = f2.start_port
        AND f1.end_time <= f2.start_time
    JOIN user_start_ports sp ON f1.start_port = sp.port_code
    JOIN user_end_ports ep ON f2.end_port = ep.port_code AND sp.user_id = ep.user_id
    JOIN airports mid ON f1.end_port = mid.port_code
)
SELECT * FROM direct_routes
UNION ALL
SELECT * FROM one_stop_routes
ORDER BY user_id, trip_time;`,
    systemSolution: `WITH user_start_ports AS (
    SELECT u.user_id, a.port_code, a.city_name AS start_city
    FROM users u
    JOIN airports a ON a.city_name = u.source_city
),
user_end_ports AS (
    SELECT u.user_id, a.port_code, a.city_name AS end_city
    FROM users u
    JOIN airports a ON a.city_name = u.destination_city
),
direct_routes AS (
    SELECT
        sp.user_id,
        sp.start_city AS trip_start_city,
        NULL AS middle_city,
        ep.end_city AS trip_end_city,
        EXTRACT(EPOCH FROM (f.end_time - f.start_time)) / 60 AS trip_time,
        CAST(f.flight_id AS VARCHAR) AS flight_ids
    FROM flights f
    JOIN user_start_ports sp ON f.start_port = sp.port_code
    JOIN user_end_ports ep ON f.end_port = ep.port_code AND sp.user_id = ep.user_id
),
one_stop_routes AS (
    SELECT
        sp.user_id,
        sp.start_city AS trip_start_city,
        mid.city_name AS middle_city,
        ep.end_city AS trip_end_city,
        EXTRACT(EPOCH FROM (f2.end_time - f1.start_time)) / 60 AS trip_time,
        CONCAT(f1.flight_id, ';', f2.flight_id) AS flight_ids
    FROM flights f1
    JOIN flights f2
        ON f1.end_port = f2.start_port
        AND f1.end_time <= f2.start_time
    JOIN user_start_ports sp ON f1.start_port = sp.port_code
    JOIN user_end_ports ep ON f2.end_port = ep.port_code AND sp.user_id = ep.user_id
    JOIN airports mid ON f1.end_port = mid.port_code
)
SELECT * FROM direct_routes
UNION ALL
SELECT * FROM one_stop_routes
ORDER BY user_id, trip_time;`,
    starterCode: `-- Flight Planner System
-- Write your solution here
SELECT *
FROM users;`,
    businessImpact: `Flight route planning with direct and one-stop connections models real travel search engines. The query joins users' city preferences to airport codes, finds matching flights, and calculates total trip time including layovers for optimal route recommendation.`,
    optimizationTips: [
      "EXTRACT(EPOCH FROM interval) / 60 replaces TIMESTAMPDIFF(MINUTE) in PostgreSQL",
      "CAST(... AS VARCHAR) replaces CAST(... AS CHAR) in PostgreSQL",
      "TIMESTAMP replaces DATETIME in PostgreSQL",
      "UNION ALL combines direct and one-stop routes efficiently"
    ],
    edgeCases: [
      "No direct flight exists \u2014 only one-stop routes returned",
      "Connection flight departs before first flight lands \u2014 invalid, excluded",
      "Multiple airports in same city \u2014 all combinations considered",
      "No valid route for a user \u2014 not in result",
      "Layover of 0 minutes \u2014 valid (f1.end_time = f2.start_time)"
    ]
  },

  // ============================================
  // 8 Extreme Hard Questions (from original repo)
  // ============================================
  {
    id: 68,
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
    mySolution: `WITH cte AS (
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
    id: 69,
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
    mySolution: `WITH cte AS (
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
    id: 70,
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
    mySolution: `WITH consecutive_down AS (
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
    id: 71,
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
    mySolution: `WITH RECURSIVE cte AS (
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
    id: 72,
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
    mySolution: `WITH RankedRatings AS (
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
    id: 73,
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
    mySolution: `WITH RECURSIVE cte AS (
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
    id: 74,
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
    mySolution: `WITH cal AS (
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
    id: 75,
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
    mySolution: `WITH RECURSIVE ranked_data AS (
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

// Convert to app shape
export const questions: Question[] = sqlQuestionsData.map((q) => ({
  id: q.id,
  title: q.title,
  difficulty: q.difficulty,
  category: q.category,
  problem: q.problem,
  schema: q.schema,
  mySolution: q.mySolution,
  solutions: [{ title: "Solution", code: q.systemSolution, description: "" }],
  businessImpact: q.businessImpact,
  optimizationTips: q.optimizationTips,
  edgeCases: q.edgeCases.map((text) => ({ text, checked: false })),
  expectedOutput: q.expectedOutput,
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
