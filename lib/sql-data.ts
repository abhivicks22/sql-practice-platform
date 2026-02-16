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
`,
    mySolution: `select  
from product_reviews 
where (lower(review_text) like '% excellent%' or lower(review_text) like '% amazing%')
and  lower(review_text) not like '%not excellent%'
and lower(review_text) not like '%not amazing%'`,
    systemSolution: `SELECT review_id, product_id, review_text
FROM product_reviews                                                                                   --    Table containing product reviews
WHERE (LOWER(review_text) LIKE '% excellent%' OR LOWER(review_text) LIKE '% amazing%')                --    Include reviews containing 'excellent' or 'amazing' (case-insensitive)
  AND LOWER(review_text) NOT LIKE '%not excellent%'                                                  --    Exclude reviews with 'not excellent'
  AND LOWER(review_text) NOT LIKE '%not amazing%'                                                    --    Exclude reviews with 'not amazing'
ORDER BY review_id ASC;                                                                                --    Order results by review_id ascending





2 - Category Product Count
You are provided with a table that lists various product categories, each containing a comma-separated list of products. Your task is to write a SQL query to count the number of products in each category. Sort the result by product count & category in ASC order

 

Tables: categories
+-------------+-------------+
| COLUMN_NAME | DATA_TYPE   |
+-------------+-------------+
| category    | varchar(50) |
| products    | varchar(75) |
+-------------+-------------+


MY SOLUTION :



select category,
length(products)-length(replace(products,',',''))+1 as product_count
from categories
order by product_count,category


SYSTEM SOLUTION :

SELECT 
        category,
        LENGTH(products) - LENGTH(REPLACE(products, ',', '')) + 1 AS product_count   --    Count number of products by counting commas plus one
    FROM 
        categories
ORDER BY product_count, category ;                                                          --    Order results by product count ascending`,
    starterCode: `-- Product Reviews\n-- Write your solution here\nSELECT *\nFROM product_reviews;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
    ]
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
    schema: [],
    sampleData: ``,
    mySolution: `select email,
SUBSTRING(Email, INSTR(Email, '@') +1) AS domain_name
from customers;`,
    systemSolution: `SELECT 
    Email,
    SUBSTRING(Email, INSTR(Email, '@') + 1) AS domain_name
FROM Customers;`,
    starterCode: `-- Domain Names\n-- Write your solution here\nSELECT 1;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
    ]
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

CREATE TABLE products (
  product_id INT,
  price INT,
  price_date DATE
);

DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  order_id INT,
  order_date DATE,
  product_id INT
);
`,
    mySolution: `with cte as(select ,
sum(salary) over(partition by department ) -salary as total_sal
from employee)
,cte1 as (SELECT department,emp_id,salary,
total_sal/(count(emp_id) over(partition by department)-1) as avg
FROM cte
)
Select emp_id,salary,department
from cte1
where salary > avg
order by emp_id`,
    systemSolution: `WITH price_range AS (
    SELECT ,
           DATE_ADD(LEAD(price_date, 1, '9999-12-31') OVER (PARTITION BY product_id ORDER BY price_date), INTERVAL -1 DAY) AS price_end_date  --    Calculate price end date as one day before next price_date
    FROM products                                                                                                                        --    Products table containing price history
)
SELECT p.product_id, 
       SUM(p.price) AS total_sales                                                                                                      --    Sum total price for orders within valid price period
FROM orders o
INNER JOIN price_range p ON o.product_id = p.product_id                                                                                  --    Join orders with price ranges on product_id
    AND o.order_date BETWEEN p.price_date AND p.price_end_date                                                                          --    Filter orders within price validity period
GROUP BY p.product_id                                                                                                                    --    Group by product_id to aggregate sales
ORDER BY p.product_id ASC;                                                                                                               --    Order results by product_id ascending`,
    starterCode: `-- Dynamic Pricing\n-- Write your solution here\nSELECT *\nFROM products;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
    ]
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
`,
    mySolution: `with cte as(select ,
sum(salary) over(partition by department ) -salary as total_sal
from employee)
,cte1 as (SELECT department,emp_id,salary,
total_sal/(count(emp_id) over(partition by department)-1) as avg
FROM cte
)
Select emp_id,salary,department
from cte1
where salary > avg
order by emp_id`,
    systemSolution: `select  from 
employee e1
where salary > (select avg(e2.salary) 
from employee e2 
where e1.department != e2.department
)
ORDER BY emp_id ;`,
    starterCode: `-- Highly Paid Employees\n-- Write your solution here\nSELECT *\nFROM employee;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
    ]
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

CREATE TABLE inventory (
  inventory_level INT,
  inventory_target INT,
  location_id INT,
  product_id INT
);

DROP TABLE IF EXISTS products;

CREATE TABLE products (
  product_id INT,
  unit_cost DECIMAL(5,2)
);
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
    systemSolution: `with cte as (
select i.location_id as location_id
,sum(inventory_level-inventory_target) as excess_insufficient_qty
,sum((inventory_level-inventory_target)p.unit_cost) as excess_insufficient_value 
from inventory i 
inner join products p on i.product_id=p.product_id
group by i.location_id)

select CAST(location_id as CHAR) as location_id , excess_insufficient_qty,excess_insufficient_value
from cte
union all
select 'Overall' as location_id 
, sum(excess_insufficient_qty) as excess_insufficient_qty
, sum(excess_insufficient_value) as excess_insufficient_value
from cte
ORDER BY location_id;`,
    starterCode: `-- Excess/insufficient Inventory\n-- Write your solution here\nSELECT *\nFROM inventory;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
    ]
  },

  {
    id: 6,
    title: "Zomato Membership",
    difficulty: "Medium",
    category: "Analytics",
    points: 25,
    problem: `Zomato is planning to offer a premium membership to customers who have placed multiple orders in a single day.
Your task is to write a SQL to find those customers who have placed multiple orders in a single day at least once , total order value generate by those customers and order value generated only by those orders, display the results in ascending order of total order value.`,
    schema: [],
    sampleData: ``,
    mySolution: `select customer_name, CAST(order_date as DATE),
count() as no_of_order
from orders
group by customer_name, CAST(order_date as DATE)
having count()  >1`,
    systemSolution: `with cte as (
select customer_name,CAST(order_date as DATE) as order_day
,count() as no_of_orders
 from orders 
group by customer_name,CAST(order_date as DATE) 
having count()>1
)
select orders.customer_name,sum(orders.order_value) as total_order_value
,sum(case when cte.customer_name is not null then orders.order_value end) as order_value
from orders
left join cte on orders.customer_name=cte.customer_name and 
CAST(orders.order_date as DATE) =cte.order_day
where orders.customer_name in (select distinct customer_name from cte)
group by orders.customer_name
ORDER BY total_order_value;`,
    starterCode: `-- Zomato Membership\n-- Write your solution here\nSELECT 1;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
    ]
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
  created_at DATETIME
);
`,
    mySolution: `WITH LatestStatus AS (
    SELECT 
        emp_id,
        action,created_at,
        ROW_NUMBER() OVER(PARTITION BY emp_id ORDER BY created_at DESC) as rn
    FROM employee_record
    WHERE created_at <= '2019-04-01 19:05:00'
)
SELECT count() as no_of_emp_inside
FROM LatestStatus
where rn=1
and action='in'`,
    systemSolution: `with cte as (
select 
, lead(created_at) over(partition by emp_id order by created_at) as next_created_at
 from employee_record )
 select count() as no_of_emp_inside
 from cte
 where action='in'
 and '2019-04-01 19:05:00' between created_at and next_created_at;`,
    starterCode: `-- Employees Inside Office (Part 1)\n-- Write your solution here\nSELECT *\nFROM employee_record;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
    ]
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
    sampleData: `DROP TABLE IF EXISTS products;

CREATE TABLE products (
  category VARCHAR(10),
  id INT,
  name VARCHAR(20),
  price INT
);

DROP TABLE IF EXISTS purchases;

CREATE TABLE purchases (
  id INT,
  product_id INT,
  stars INT
);
`,
    mySolution: null,
    systemSolution: `SELECT 
    category,
    COALESCE(MIN(CASE WHEN pur.product_id IS NOT NULL THEN price END), 0) AS price          --    Minimum price of products purchased with 4 or 5 stars, default 0 if none
FROM products p                                                                            --    Products table alias 'p'
LEFT JOIN purchases pur ON p.id = pur.product_id AND pur.stars IN (4, 5)                   --    Left join purchases with 4 or 5 star ratings
GROUP BY category                                                                         --    Group results by product category
ORDER BY category;                                                                        --    Order results by category ascending`,
    starterCode: `-- Lowest Price\n-- Write your solution here\nSELECT *\nFROM products;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
    ]
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
`,
    mySolution: null,
    systemSolution: `with mastercard as (
select user_name,sum(expenditure) as expenditure
from expenditures 
where card_company='Mastercard'
group by user_name
)
, non_mastercard as (
select user_name,sum(expenditure) as expenditure
from expenditures 
where card_company!='Mastercard'
group by user_name
)
select m.user_name, m.expenditure as mastercard_expense,nm.expenditure as other_expense
from mastercard m 
inner join non_mastercard nm on m.user_name=nm.user_name
where nm.expenditure > m.expenditure;`,
    starterCode: `-- Expenses Excluding MasterCard\n-- Write your solution here\nSELECT *\nFROM expenditures;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
    ]
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
`,
    mySolution: null,
    systemSolution: `with cte as (
select product_id, MONTH(order_date) AS order_month
,YEAR(order_date) AS order_year
,SUM(sales) AS sales
from orders
group by product_id,MONTH(order_date) ,YEAR(order_date)
)
,cte2 as (
select product_id,order_month
, sum(case when order_year='2022' then sales else 0 end) as sales_2022 
, sum(case when order_year='2023' then sales else 0 end) as sales_2023
, sum(case when order_year='2024' then sales else 0 end) as sales_2024
from cte
group by product_id,order_month
)
select  
from cte2
where sales_2024>sales_2023 and sales_2023>sales_2022
ORDER BY product_id;`,
    starterCode: `-- 2022 vs 2023 vs 2024 Sales\n-- Write your solution here\nSELECT *\nFROM orders;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
    ]
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

CREATE TABLE bookings (
  room_id INT,
  customer_id INT,
  check_in_date DATE,
  check_out_date DATE
);

DROP TABLE IF EXISTS calendar_dim;

CREATE TABLE calendar_dim (
  cal_date DATE
);
`,
    mySolution: `with cte as(select b.room_id,b.customer_id,c.cal_date
from bookings b
inner join  calendar_dim c
on c.cal_date>=b.check_in_date
 and c.cal_date< b.check_out_date
where check_in_date is not null
and check_out_date is not null )
 select room_id,cal_date
,group_concat(customer_id order by customer_id ) as customers
from cte
group by room_id,cal_date
having COUNT(DISTINCT customer_id)>1
order by room_id,cal_date`,
    systemSolution: `with cte as (
select room_id,customer_id,c.cal_date as book_date
from bookings b
inner join calendar_dim c on c.cal_date >= b.check_in_date and c.cal_date < b.check_out_date
)
select room_id,book_date , group_concat(customer_id ORDER BY customer_id)  as customers
from cte 
group by room_id,book_date 
having count()>1
order by room_id,book_date ;`,
    starterCode: `-- Hotel Booking Mistake\n-- Write your solution here\nSELECT *\nFROM bookings;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    schema: [],
    sampleData: ``,
    mySolution: `WITH mother_father AS (
    SELECT r.c_id AS child_id,
           max(p1.name) AS mother_name,
           max(p2.name) AS father_name
    FROM relations r
    LEFT JOIN people p1 ON r.p_id = p1.id AND p1.gender = 'F' -- Join with people table to get mother's name
    LEFT JOIN people p2 ON r.p_id = p2.id AND p2.gender = 'M' -- Join with people table to get father's name
    group by r.c_id
)
SELECT p.name AS child_name,
       mf.mother_name,
       mf.father_name
FROM people p
INNER JOIN mother_father mf ON p.id = mf.child_id
order by child_name;`,
    systemSolution: `WITH mother_father AS (
    SELECT r.c_id AS child_id,
           max(p1.name) AS mother_name,
           max(p2.name) AS father_name
    FROM relations r
    LEFT JOIN people p1 ON r.p_id = p1.id AND p1.gender = 'F' -- Join with people table to get mother's name
    LEFT JOIN people p2 ON r.p_id = p2.id AND p2.gender = 'M' -- Join with people table to get father's name
    group by r.c_id
)
SELECT p.name AS child_name,
       mf.mother_name,
       mf.father_name
FROM people p
INNER JOIN mother_father mf ON p.id = mf.child_id
order by child_name;`,
    starterCode: `-- Child and Parents\n-- Write your solution here\nSELECT 1;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with cte as (
select  
, rank() over(partition by district_name order by votes desc) as rn
from elections
)
, cte_total_seats as (
select count(distinct district_name) as total_seats from elections
)
select party_name, count() as seats_won
, case when count()>total_seats0.5 then 'Winner' else 'Loser' end as result
from cte , cte_total_seats
where rn=1
group by party_name,total_seats
order by seats_won desc;`,
    systemSolution: `with cte as (
select  
, rank() over(partition by district_name order by votes desc) as rn
from elections
)
, cte_total_seats as (
select count(distinct district_name) as total_seats from elections
)
select party_name, count() as seats_won
, case when count()>total_seats0.5 then 'Winner' else 'Loser' end as result
from cte , cte_total_seats
where rn=1
group by party_name,total_seats
order by seats_won desc;`,
    starterCode: `-- Election Winner\n-- Write your solution here\nSELECT *\nFROM elections;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    schema: [],
    sampleData: ``,
    mySolution: `with all_flight as (select destination,origin,ticket_count
from tickets
where oneway_round='R'
and ticket_count is not null
union all
select origin,destination,ticket_count
from tickets)
select destination,origin,sum(ticket_count ) as tc
from all_flight
group by destination,origin
order by tc desc
limit 1`,
    systemSolution: `select origin,destination, SUM(ticket_count) as tc
 from (select origin,destination,ticket_count
 from tickets
 union all
  select destination,origin,ticket_count
 from tickets
 where oneway_round='R') A
 group by origin,destination
 order by tc desc	
 LIMIT 1;`,
    starterCode: `-- Busiest Airline Route\n-- Write your solution here\nSELECT 1;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with transactions as (
select 
	city,
	card_type,
	SUM(amount) as amt
from credit_card_transactions
group by city,card_type)
, cte as (select city,card_type,
rank() over (partition by city order by amt desc ) as hr,
rank() over (partition by city order by amt asc ) as lr
from transactions)
select city,
max(case when hr=1 then card_type end) as highest_expense_type,
max(case when lr=1 then card_type  end )as lowest_expense_type
from cte
where hr=1 or lr=1
group by city
order by city`,
    systemSolution: `with cte as (
select city,card_type,sum(amount) as total_spend 
from credit_card_transactions
group by city,card_type
)
,cte2 as (
select 
,rank() over(partition by city order by total_spend desc) rn_high
,rank() over(partition by city order by total_spend) rn_low
from cte
)
select city
, max(case when rn_high=1 then card_type end) as highest_expense_type
, max(case when rn_low=1 then card_type end) as lowest_expense_type
from cte2
where rn_high=1 or rn_low=1
group by city
ORDER BY city;`,
    starterCode: `-- Credit Card Transactions (Part-2)\n-- Write your solution here\nSELECT *\nFROM credit_card_transactions;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: null,
    systemSolution: `SELECT user_id, user_name
FROM user_passwords
WHERE 
LENGTH(Password) >= 8 AND  -- At least 8 characters long
    Password REGEXP '[A-Za-z]' AND  -- Contains at least one letter
    Password REGEXP '[0-9]' AND  -- Contains at least one digit
    Password REGEXP '[@#$%^&]' AND  -- Contains at least one special character
    Password NOT LIKE '% %';  -- Does not contain spaces`,
    starterCode: `-- Users With Valid Passwords\n-- Write your solution here\nSELECT *\nFROM user_passwords;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with cte as(select 
student_id
from student_courses
GROUP BY student_id
HAVING COUNT(course_id) =1)
select distinct s.student_id,s.course_id
From cte  c
left join student_courses s
on c.student_id=s.student_id or s.major_flag='Y'
order by s.student_id

WITH student_course_counts AS (
    SELECT 
        student_id,
        course_id,
        major_flag,
        COUNT() OVER (PARTITION BY student_id) AS course_count
    FROM student_courses
)
SELECT 
    student_id,
    course_id
FROM student_course_counts
WHERE major_flag = 'Y' 
   OR course_count = 1
ORDER BY student_id;

## Method_2
with cte as(select ,
case when count(student_id) over(partition by  student_id order by student_id) =1 then 'Y' else major_flag end as flag
from student_courses)
select student_id,course_id
From cte 
where flag ='Y'`,
    systemSolution: `SELECT student_id, course_id
FROM student_courses
WHERE major_flag = 'Y'
   OR student_id IN (
       SELECT student_id 
       FROM student_courses 
       GROUP BY student_id 
       HAVING COUNT() = 1
   );`,
    starterCode: `-- Student Major Subject\n-- Write your solution here\nSELECT *\nFROM student_courses;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS products;

CREATE TABLE products (
  product_id INT,
  product_name VARCHAR(12)
);

DROP TABLE IF EXISTS cities;

CREATE TABLE cities (
  city_id INT,
  city_name VARCHAR(10)
);

DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
  sale_id INT,
  product_id INT,
  city_id INT,
  sale_date VARCHAR(12),
  quantity INT
);
`,
    mySolution: `with cte as(select product_id,city_id,count()
from sales
group by product_id,city_id
having  count() >=2 )
select p.product_name
from cte c
inner join products p
on c.product_id=p.product_id
group by p.product_name
having count(distinct city_id ) =(select count() from cities )`,
    systemSolution: `WITH product_sales AS (
    SELECT product_id, city_id
    FROM sales
    GROUP BY product_id, city_id
	having COUNT() >= 2
)
    SELECT  p.product_name
    FROM products p
    JOIN product_sales ps ON p.product_id = ps.product_id
	group by p.product_name
    HAVING COUNT(DISTINCT ps.city_id) = (SELECT COUNT() FROM cities);`,
    starterCode: `-- Products Sold in All Cities\n-- Write your solution here\nSELECT *\nFROM products;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with views as (select reel_id,state,record_date,
	cumulative_views-
	lag(cumulative_views,1,0) over(partition by reel_id,state order by record_date  ) as views
from reel
where cumulative_views is not null )
select reel_id,state,
round(avg(views),2) as Avg_Daily_Views
from views
group by reel_id,state
order by Avg_Daily_Views desc;`,
    systemSolution: `WITH MaxViews AS (
    SELECT
        Reel_id,
        State,
        MAX(Cumulative_Views) AS Max_Cumulative_Views,
        COUNT() AS Days
    FROM REEL
    GROUP BY Reel_id, State
)
SELECT
    Reel_id,
    State,
    ROUND(Max_Cumulative_Views / Days, 2) AS Avg_Daily_Views
FROM MaxViews
order by Avg_Daily_Views desc;`,
    starterCode: `-- Reel Daily View Averages by State\n-- Write your solution here\nSELECT *\nFROM reel;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `WITH RECURSIVE NumberSeries AS (
    SELECT
        n AS original_number,
        n AS expanded_number,
        1 AS sequence_length
    FROM numbers
    UNION ALL
    SELECT
        ns.original_number,
        ns.expanded_number,
        ns.sequence_length + 1
    FROM NumberSeries ns
    WHERE ns.sequence_length < ns.original_number
)
SELECT expanded_number
FROM NumberSeries
ORDER BY original_number, sequence_length;`,
    systemSolution: `WITH RECURSIVE NumberSeries AS (
    SELECT
        n AS original_number,
        n AS expanded_number,
        1 AS sequence_length
    FROM numbers
    UNION ALL
    SELECT
        ns.original_number,
        ns.expanded_number,
        ns.sequence_length + 1
    FROM NumberSeries ns
    WHERE ns.sequence_length < ns.original_number
)
SELECT expanded_number
FROM NumberSeries
ORDER BY original_number, sequence_length;`,
    starterCode: `-- Sequence Expansion\n-- Write your solution here\nSELECT *\nFROM numbers;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
          { name: "designation", type: "date" }
        ]
      },
      {
        name: "emp_2021",
        columns: [
          { name: "emp_id", type: "int" },
          { name: "designation", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS emp_2020;

CREATE TABLE emp_2020 (
  emp_id INT,
  designation DATE
);

DROP TABLE IF EXISTS emp_2021;

CREATE TABLE emp_2021 (
  emp_id INT,
  designation DATE
);
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
    starterCode: `-- Employees Status Change(Part-1)\n-- Write your solution here\nSELECT *\nFROM emp_2020;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
          { name: "designation", type: "date" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  emp_id INT,
  year INT,
  designation DATE
);
`,
    mySolution: `select 
coalesce(e.emp_id,e1.emp_id) as emp_id,
case when e.designation!=e1.designation then 'Promoted'
when e1.emp_id is null then 'Resigned'
else 'New Hire' end as comment
from employees e
left join employees e1
on e.emp_id=e1.emp_id and e1.year=2021 
where e.year!=e1.year and
e.designation!=e1.designation or
e1.year is null 
union
select 
coalesce(e.emp_id,e1.emp_id) as emp_id,
case when e.designation!=e1.designation then 'Promoted'
when e1.emp_id is null then 'New Hire'
else 'Resigned' end as comment
from employees e
left join employees e1
on e.emp_id=e1.emp_id and e.year>e1.year 
where e.year!=2020 and e1.emp_id is null`,
    systemSolution: `SELECT 
    COALESCE(e20.emp_id, e21.emp_id) AS emp_id,
    CASE 
        WHEN e20.designation != e21.designation THEN 'Promoted'
        WHEN e21.designation IS NULL THEN 'Resigned'
        ELSE 'New Hire'
    END AS comment
FROM employees e20
LEFT JOIN employees e21 ON e20.emp_id = e21.emp_id and e21.year=2021
WHERE e20.year=2020 
   and (e20.designation != e21.designation 
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
LEFT JOIN employees e20 ON e20.emp_id = e21.emp_id and e20.year=2020 
WHERE e21.year=2021
	and (e20.designation != e21.designation 
   OR e20.designation IS NULL 
   OR e21.designation IS NULL);`,
    starterCode: `-- Employees Status Change(Part-2)\n-- Write your solution here\nSELECT *\nFROM employees;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
          { name: "login_timestamp", type: "datetime" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS user_sessions;

CREATE TABLE user_sessions (
  user_id INT,
  login_timestamp DATETIME
);
`,
    mySolution: `with cte as(select user_id,
min(date(login_timestamp)) as 1st_date,
count(distinct date(login_timestamp)) as cnt
from user_sessions
group by user_id)
select user_id
from cte
where cnt=timestampdiff(day,1st_date,current_date)+1`,
    systemSolution: `SELECT user_id
FROM user_sessions
GROUP BY user_id
HAVING COUNT(DISTINCT DATE(login_timestamp)) = DATEDIFF(CURDATE(), MIN(login_timestamp)) + 1;`,
    starterCode: `-- Music Lovers\n-- Write your solution here\nSELECT *\nFROM user_sessions;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: null,
    systemSolution: `WITH RankedCustomers AS (
    SELECT 
        customer_id,
        TRIM(customer_name) AS customer_name,  -- Trim spaces from customer_name
        LOWER(TRIM(email)) AS email,  -- Convert email to lowercase and trim spaces
        REGEXP_REPLACE(phone, '[^0-9]', '') AS phone,  -- Remove non-digit characters from phone
        COALESCE(address, 'Unknown') AS address,  -- Replace NULL address with 'Unknown'
        ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY customer_id) AS rn  
        -- Assigns a rank to each duplicate email, keeping the one with the lowest customer_id
    FROM customers
)
SELECT customer_id, customer_name, email, phone, address 
FROM RankedCustomers
WHERE rn = 1
order by customer_id;`,
    starterCode: `-- Customer Data Cleaning\n-- Write your solution here\nSELECT *\nFROM customers;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with cte as(select
 department,salary,
dense_rank() OVER(PARTITION BY department ORDER BY SALARY DESC) AS RN
from employees
WHERE salary IS NOT NULL
)
select department,
max(case when RN=1 THEN salary END),
max(case when RN=2 THEN salary END) AS SalaryDifference
from cte
group by department
ORDER BY  department`,
    systemSolution: `WITH RankedSalaries AS (
    SELECT 
        Department, 
        Salary,
        DENSE_RANK() OVER (PARTITION BY Department ORDER BY Salary DESC) AS rnk
    FROM employees
)
SELECT 
    Department,
    MAX(CASE WHEN rnk = 1 THEN Salary END) - 
        MAX(CASE WHEN rnk = 2 THEN Salary END) AS SalaryDifference
FROM RankedSalaries
GROUP BY Department
ORDER BY Department;`,
    starterCode: `-- Salary Difference\n-- Write your solution here\nSELECT *\nFROM employees;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with cte as(select ,
case 
when insurance_type in ('Term Life','Whole Life') then 12100
when insurance_type='Health' then 12400
when insurance_type='Endowment' then 12500 end as premium,
case 
when insurance_type in ('Term Life','Whole Life') and risk='Low' then 0.1
when insurance_type in ('Term Life','Whole Life') and risk='Medium' then 0.085 
when insurance_type in ('Term Life','Whole Life') and risk='High' then 0.07
when insurance_type ='Health' and risk='Low' then 0.02
when insurance_type ='Health' and risk='Medium' then 0.015
when insurance_type ='Health' and risk='High' then 0.01
when insurance_type ='Endowment' and risk='Low' then 0.15
when insurance_type ='Endowment' and risk='Medium' then 0.12
when insurance_type ='Endowment' and risk='High' then 0.1
end as risk_per
from users)
select user_id,insurance_type,risk,
sum(premiumrisk_per)
from cte
group by user_id,insurance_type,risk
order by user_id`,
    systemSolution: `WITH insurance_counts AS (
    SELECT
        insurance_type,
        COUNT() AS policy_count
    FROM users
    GROUP BY insurance_type
),
total_collection AS (
    SELECT
        SUM(
            CASE
                WHEN insurance_type IN ('Term Life', 'Whole Life')
                    THEN policy_count  12  100
                WHEN insurance_type = 'Health'
                    THEN policy_count  12  400
                ELSE
                    policy_count  12  500
            END
        ) AS total_collection
    FROM insurance_counts
)
SELECT
    u.,
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
         t.total_collection
    ) AS insured_amount
FROM users u
CROSS JOIN total_collection t
ORDER BY u.user_id
;`,
    starterCode: `-- Insured Amount\n-- Write your solution here\nSELECT *\nFROM users;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  customer_id INT,
  credit_limit INT
);

DROP TABLE IF EXISTS loans;

CREATE TABLE loans (
  customer_id INT,
  loan_id INT,
  loan_due_date DATE
);

DROP TABLE IF EXISTS credit_card_bills;

CREATE TABLE credit_card_bills (
  bill_amount INT,
  bill_due_date DATE,
  bill_id INT,
  customer_id INT
);

DROP TABLE IF EXISTS customer_transactions;

CREATE TABLE customer_transactions (
  loan_bill_id INT,
  transaction_date DATE,
  transaction_type VARCHAR(10)
);
`,
    mySolution: null,
    systemSolution: `WITH all_bills AS (
    SELECT customer_id, loan_id AS bill_id, loan_due_date AS due_date, 0 AS bill_amount    --    Select loan bills with zero bill_amount
    FROM loans
    UNION ALL
    SELECT customer_id, bill_id, bill_due_date AS due_date, bill_amount                    --    Select credit card bills with actual amounts
    FROM credit_card_bills
),
on_time_calc AS (
    SELECT b.customer_id,
           SUM(b.bill_amount) AS bill_amount,                                            --    Total bill amount per customer
           COUNT() AS total_bills,                                                      --    Total number of bills per customer
           SUM(CASE WHEN ct.transaction_date <= due_date THEN 1 ELSE 0 END) AS on_time_payments    --    Count of on-time payments per customer
    FROM all_bills b
    INNER JOIN customer_transactions ct ON b.bill_id = ct.loan_bill_id                    --    Join bills with transactions on bill ID
    GROUP BY b.customer_id
)
SELECT c.customer_id,
       ROUND(
           (ot.on_time_payments  1.0 / ot.total_bills)  70 +                         --    Weight on-time payment ratio by 70%
           (CASE
                WHEN ot.bill_amount  1.0 / c.credit_limit < 0.3 THEN 1               --    High score if bill amount < 30% of credit limit
                WHEN ot.bill_amount  1.0 / c.credit_limit < 0.5 THEN 0.7             --    Medium score if bill amount < 50% of credit limit
                ELSE 0.5                                                            --    Low score otherwise
            END)  30, 1
       ) AS cibil_score                                                                --    Calculate final cibil score rounded to 1 decimal place
FROM customers c
INNER JOIN on_time_calc ot ON c.customer_id = ot.customer_id                          --    Join customers with calculated payment info
ORDER BY c.customer_id ASC;                                                            --    Order results by customer_id ascending`,
    starterCode: `-- CIBIL Score\n-- Write your solution here\nSELECT *\nFROM customers;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: null,
    systemSolution: `WITH first_order_date AS (  
    SELECT customer_id, MIN(order_date) AS first_order      -- Get the first order date per customer
    FROM customer_orders  
    GROUP BY customer_id  
)  
SELECT co.order_date  
    , SUM(CASE WHEN co.order_date = fod.first_order THEN 1 ELSE 0 END) AS new_customers     -- Count new customers placing their first order on this date
    , SUM(CASE WHEN co.order_date > fod.first_order THEN 1 ELSE 0 END) AS repeat_customers  -- Count repeat customers ordering after their first order date
FROM customer_orders co  
INNER JOIN first_order_date fod ON co.customer_id = fod.customer_id  
GROUP BY co.order_date     -- Group by each order date
ORDER BY order_date 

ASC;     -- Order results by order_date ascending`,
    starterCode: `-- New and Repeat Customers\n-- Write your solution here\nSELECT *\nFROM customer_orders;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
          { name: "login", type: "datetime" },
          { name: "logout", type: "datetime" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  emp_id INT,
  login DATETIME,
  logout DATETIME
);
`,
    mySolution: null,
    systemSolution: `with logged_hours as (
select ,TIMESTAMPDIFF(second, login, logout)/3600.0,case when TIMESTAMPDIFF(second, login, logout) / 3600.0  > 10 then '10+'
when TIMESTAMPDIFF(second, login, logout) / 3600.0  > 8 then '8+'
else '8-' end as time_window
from employees)
 , time_window as (
 select emp_id , count() as days_8
, sum(case when time_window='10+' then 1 else 0 end ) as days_10
 from logged_hours
where time_window in ('10+','8+')
 group by emp_id)
 select emp_id, case when days_8 >=3 and days_10>=2 then 'both'
 when days_8 >=3 then '1'
 else '2' end as criterian
 from time_window
  where days_8>=3 or days_10>=2 
ORDER BY emp_id ASC;`,
    starterCode: `-- Workaholics Employees\n-- Write your solution here\nSELECT *\nFROM employees;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS lifts;

CREATE TABLE lifts (
  capacity_kg INT,
  id INT
);

DROP TABLE IF EXISTS lift_passengers;

CREATE TABLE lift_passengers (
  passenger_name VARCHAR(10),
  weight_kg INT,
  gender VARCHAR(1),
  lift_id INT
);
`,
    mySolution: null,
    systemSolution: `with running_weight as (
select l.id , lp.passenger_name ,lp.weight_kg,l.capacity_kg,lp.gender
, sum(lp.weight_kg) over(partition by l.id order by case when lp.gender='F' then 0 else 1 end, lp.weight_kg rows between unbounded preceding and current row) as running_sum
from lifts l
inner join lift_passengers lp on l.id=lp.lift_id
)
select id, GROUP_CONCAT(passenger_name ORDER BY gender,weight_kg SEPARATOR',') as passenger_list
from running_weight
where running_sum < capacity_kg
group by id
ORDER BY id;`,
    starterCode: `-- Lift Overloaded (Part 2)\n-- Write your solution here\nSELECT *\nFROM lifts;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with cte as(
select order_month,product_id,sum(sales) as total_sales
from orders
group by order_month,product_id)
,cte1 as (select ,
sum(total_sales) over(partition by product_id order by order_month,total_sales rows between 2 preceding and 1 preceding) as ttl_sales
from cte)
select order_month,product_id
from cte1 
where total_sales>ttl_sales and
order_month>'202302'
order by order_month`,
    systemSolution: `with cte as (
select  
,sum(sales) over(partition by product_id order by order_month rows between 2 preceding and 1 preceding) as last2
,row_number() over(partition by product_id order by order_month) as rn
from orders 
)
select order_month,product_id from cte 
where rn>=3 and sales > last2
ORDER BY order_month,product_id ASC;`,
    starterCode: `-- Trending Products\n-- Write your solution here\nSELECT *\nFROM orders;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with cte as(select ,
lead(start_time) over(partition by id order by start_time) as prev_time,
lead(start_loc) over(partition by id order by start_time) as prev_loc
from drivers)

select  id,count() as total_rides ,
sum(case when end_time=prev_time and end_loc=prev_loc then 1 else 0 end) as profit_rides
from cte
group by id`,
    systemSolution: `with cte as (
select  
, lag(end_time,1) over(partition by id order by start_time) as prev_end_time
, lag(end_loc,1) over(partition by id order by start_time) as prev_end_loc
from drivers
)
select id, count() as total_rides , 
sum(case when start_time = prev_end_time and start_loc=prev_end_loc then 1 else 0 end) as profit_rides
from cte 
group by id
ORDER BY id ASC;`,
    starterCode: `-- Uber Profit Rides\n-- Write your solution here\nSELECT *\nFROM drivers;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    schema: [],
    sampleData: ``,
    mySolution: `select o.product_id,o1.product_id,count() as purchase_frequency
from orders o
cross join orders o1
on o.order_id=o1.order_id and  o.product_id >o1.product_id
group by o.product_id,o1.product_id
order by purchase_frequency desc`,
    systemSolution: `SELECT 
    o1.product_id AS product_1,
    o2.product_id AS product_2,
    COUNT() AS purchase_frequency
FROM orders o1
INNER JOIN orders o2
    ON o1.order_id = o2.order_id
WHERE o1.product_id > o2.product_id
GROUP BY o1.product_id, o2.product_id
ORDER BY purchase_frequency DESC;`,
    starterCode: `-- Product Recommendation\n-- Write your solution here\nSELECT 1;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with combined as (select
  EXTRACT(YEAR FROM order_date) AS order_year,
        EXTRACT(MONTH FROM order_date) AS order_month,
case 
	when cancel_date is not null and delivery_date is null 		then 1 else 0 end as cancel_flag,
case 
	when cancel_date is not null and
	cancel_date >delivery_date then 1 else 0 end as	return_flag
from orders
where order_date is not null)
select order_year,order_month,
	round(sum(cancel_flag)/nullif(count()-sum(return_flag),0)100,2) as cancellation_rate,
	round(sum(return_flag)/nullif(count()-sum(cancel_flag),0)100,2) as return_rate
from combined
group by order_year,order_month
order by order_year, order_month ;`,
    systemSolution: `with cte as (
select year(order_date) as order_year
,month(order_date) as order_month,order_id
,case when delivery_date is null and cancel_date is not null 
then 1 else 0 end as cancel_flag 
,case when delivery_date is not null and cancel_date is not null then 1 else 0 end as return_flag 
from orders
)
select order_year,order_month
,round(sum(cancel_flag)100.0/(count()-sum(return_flag)),2)  as cancellation_rate
,round(sum(return_flag)100.0/(count()-sum(cancel_flag)),2) as return_rate
from cte
group by order_year,order_month
order by order_year,order_month;`,
    starterCode: `-- Cancellation vs Return\n-- Write your solution here\nSELECT *\nFROM orders;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with Combined_flag as(select team_1,
case when team_1=winner then 1 else 0 end as winner_flag,
case when winner='Draw' then 1 else 0 end as draw_flag
from icc_world_cup
union all
select team_2,
case when team_2=winner then 1 else 0 end as winner_flag,
case when winner='Draw' then 1 else 0 end as draw_flag
from icc_world_cup)
select team_1 as team_name,
count() as match_played,
sum(winner_flag) as no_of_wins,
count()-sum(winner_flag)-sum(draw_flag) as no_of_losses,
sum(winner_flag)2+ sum(draw_flag) as total_points 
from Combined_flag
group by team_1
order by team_name ;`,
    systemSolution: `with cte as (
select team_1 as team_name
, case when team_1=winner then 1 else 0 end as win_flag
, case when winner='Draw' then 1 else 0 end as draw_flag
from icc_world_cup 
union all
select team_2 as team_name
, case when team_2=winner then 1 else 0 end as win_flag
, case when winner='Draw' then 1 else 0 end as draw_flag
from icc_world_cup 
)
select team_name,count() as match_played
,sum(win_flag) as no_of_wins
,count()-sum(win_flag)-sum(draw_flag) as no_of_losses
,2sum(win_flag)+sum(draw_flag) as total_points
from cte
group by team_name
ORDER BY team_name ;`,
    starterCode: `-- Points Table\n-- Write your solution here\nSELECT *\nFROM icc_world_cup;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
          { name: "created_at", type: "datetime" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS employee_record;

CREATE TABLE employee_record (
  emp_id INT,
  action VARCHAR(3),
  created_at DATETIME
);
`,
    mySolution: `with cte as(select ,
lead(created_at) over(partition by emp_id order by created_at  ) as out_time
from employee_record)
,created_window as (select emp_id,
case when created_at <= '2019-04-01 14:00:00' then '2019-04-01 14:00:00' else created_at  end as final_in_time,
 case when out_time > '2019-04-02 10:00:00' then '2019-04-02 10:00:00' else out_time  end as final_out_time
from cte
where action='in')
select emp_id,
sum(case when final_in_time>final_out_time then 0 else
timestampdiff(minute,final_in_time,final_out_time)end) as time_spent_in_mins
from created_window
group by emp_id`,
    systemSolution: `with cte as (
select 
, lead(created_at) over(partition by emp_id order by created_at) as next_created_at
 from employee_record
 ),
 considered_time as (
 select emp_id
 , case when created_at < '2019-04-01 14:00:00' then '2019-04-01 14:00:00' else created_at end as in_time
 , case when next_created_at > '2019-04-02 10:00:00' then '2019-04-02 10:00:00' else next_created_at end as out_time
 from cte
 where action='in'
 )
select emp_id 
, ROUND(sum(case when in_time>=out_time then 0 else TIMESTAMPDIFF(minute,in_time,out_time) end) , 1 ) as time_spent_in_mins
from considered_time
group by emp_id
ORDER BY emp_id;`,
    starterCode: `-- Employees Inside Office (Part 2)\n-- Write your solution here\nSELECT *\nFROM employee_record;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
      }
    ],
    sampleData: `DROP TABLE IF EXISTS post_likes;

CREATE TABLE post_likes (
  post_id INT,
  user_id INT
);
`,
    mySolution: `WITH followed_likes AS (
    SELECT 
        u.user_id,
        p.post_id,
        COUNT() AS like_count
    FROM user_follows u
    INNER JOIN post_likes p 
        ON u.follows_user_id = p.user_id
    GROUP BY u.user_id, p.post_id
)
,
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
    systemSolution: `with cte as (
select f.user_id,p.post_id,count() as no_of_likes
from user_follows f 
inner join post_likes p on f.follows_user_id = p.user_id 
group by f.user_id,p.post_id
)
select user_id,post_id,no_of_likes from (
select cte. 
,row_number() over(partition by cte.user_id order by no_of_likes desc, cte.post_id ) as rn
from cte
left join post_likes p on p.user_id=cte.user_id and p.post_id=cte.post_id
where p.post_id is null
) s
where rn=1
ORDER BY user_id;`,
    starterCode: `-- LinkedIn Recommendation\n-- Write your solution here\nSELECT *\nFROM post_likes;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
          { name: "visit_time", type: "datetime" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS dashboard_visit;

CREATE TABLE dashboard_visit (
  user_id VARCHAR(10),
  visit_time DATETIME
);
`,
    mySolution: null,
    systemSolution: `WITH previous_visits AS (
    SELECT 
        user_id,
        visit_time,
        LAG(visit_time) OVER (PARTITION BY user_id ORDER BY visit_time) AS previous_visit_time
    FROM
        dashboard_visit
)
, vigit_flag as (
select user_id, previous_visit_time,visit_time
, CASE WHEN previous_visit_time IS NULL THEN 1
      WHEN TIMESTAMPDIFF(second, previous_visit_time, visit_time) / 3600 > 1 THEN 1
            ELSE 0
        END AS new_visit_flag
from previous_visits
)
select user_id, sum(new_visit_flag) as no_of_visits, count(distinct CAST(visit_time as DATE)) as visit_days
from vigit_flag
group by user_id
ORDER BY user_id ASC;`,
    starterCode: `-- Dashboard Visits\n-- Write your solution here\nSELECT *\nFROM dashboard_visit;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with cte as(select 
month(transaction_date) as mnt,
sum(case when amount <0  then amount else 0 end) as card_payment,
count(case when amount <0  then 1  end) as cnt_card_payment,
sum(case when amount >0 then amount else 0 end) as incoming_transfer
 from transactions
group by month(transaction_date))
,cte1 as (select 
case when card_payment<=-100 and cnt_card_payment>=2 then 0 else -5 end + card_payment+incoming_transfer as total
from cte)
select sum(total)+-5(12-(Select count(distinct mnt) from cte)) as final_balance
from cte1`,
    systemSolution: `with cte as (
select month(transaction_date)  as tran_month ,amount
 from transactions
)
,cte2 as (
select tran_month
, sum(amount) as net_amount , sum(case when amount<0 then -1amount else 0 end) as credit_card_amount
, sum(case when amount<0 then 1 else 0 end) as credit_card_transact_cnt
from cte 
group by tran_month
)
select sum(net_amount) - sum(case when credit_card_amount >=100 and credit_card_transact_cnt >=2 then 0 else 5 end)
- 5(12-(select count(distinct tran_month) from cte)) as final_balance
from cte2;`,
    starterCode: `-- Final Account Balance\n-- Write your solution here\nSELECT *\nFROM Transactions;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS users;

CREATE TABLE users (
  name VARCHAR(15),
  user_id INT
);

DROP TABLE IF EXISTS events;

CREATE TABLE events (
  user_id INT,
  type VARCHAR(15),
  access_date DATE
);
`,
    mySolution: `with cte as(select ,
lag(type,1) over(partition by user_id order by access_date) prev_service,
lag(access_date,1) over(partition by user_id order by access_date) as prev_date,
row_number() over(partition by user_id order by access_date desc) as rn
from events
)

select u.name as user_name,
c.access_date as prime_member_date,
coalesce(c.prev_service,c1.type) as last_access_service,
coalesce(c.prev_date,c1.access_date) as last_access_service_date
from users u
left join cte c
on u.user_id=c.user_id and c.type='prime'
left join cte c1
on u.user_id=c1.user_id and c1.rn=1
order by last_access_service_date`,
    systemSolution: `WITH cte as (
select 
, lag(type,1) over(partition by user_id order by access_date) as prev_type
, lag(access_date,1) over(partition by user_id order by access_date) as prev_access_date
,row_number() over(partition by user_id order by access_date desc) as rn
from events
)
select u.name as user_name 
, cte.access_date as prime_member_date , coalesce(cte.prev_type,c.type) as last_access_service, coalesce(cte.prev_access_date,c.access_date) as last_access_service_date
from users u
left join cte on u.user_id=cte.user_id and cte.type='Prime'
left join cte c on c.user_id=u.user_id and c.rn=1
ORDER BY last_access_service_date;`,
    starterCode: `-- Prime Subscription\n-- Write your solution here\nSELECT *\nFROM users;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
  fullname VARCHAR(20)
);
`,
    mySolution: `with cte as (
select ,instr(fullname,',') as comma_position 
,instr(fullname,' ') as space_position
from employee
)
select fullname
, case when comma_position=0 then fullname
when space_position>0 then substr(fullname,comma_position+1,space_position-comma_position-1)
else substr(fullname,comma_position+1,length(fullname)-comma_position)
end as first_name
,case when space_position=0 then null
else substr(fullname,space_position+1,length(fullname)-space_position)
end as middle_name
,case when comma_position=0 then null
else substr(fullname,1,comma_position-1)
end as last_name
from cte;`,
    systemSolution: `with cte as (
select ,instr(fullname,',') as comma_position 
,instr(fullname,' ') as space_position
from employee
)
select fullname
, case when comma_position=0 then fullname
when space_position>0 then substr(fullname,comma_position+1,space_position-comma_position-1)
else substr(fullname,comma_position+1,length(fullname)-comma_position)
end as first_name
,case when space_position=0 then null
else substr(fullname,space_position+1,length(fullname)-space_position)
end as middle_name
,case when comma_position=0 then null
else substr(fullname,1,comma_position-1)
end as last_name
from cte;`,
    starterCode: `-- Employee Name\n-- Write your solution here\nSELECT *\nFROM employee;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
          { name: "pickup_time", type: "datetime" },
          { name: "delivery_time", type: "datetime" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  rider_id INT,
  order_id INT,
  pickup_time DATETIME,
  delivery_time DATETIME
);
`,
    mySolution: `with cte as(
select rider_id,pickup_time,
timestampdiff(minute,pickup_time,delivery_time) as ride_time_mins
from orders
where date(pickup_time)=date(delivery_time)
union all
select rider_id,pickup_time,
timestampdiff(minute,pickup_time,cast((delivery_time) as date )) as ride_time_mins
from orders
where date(pickup_time)!=date(delivery_time)
union all
select rider_id,delivery_time,
timestampdiff(minute,cast((delivery_time) as date ),delivery_time) as ride_time_mins
from orders
where date(pickup_time)!=date(delivery_time))
select rider_id,
cast(pickup_time as date) as ride_date,
sum(ride_time_mins) as ride_time_mins
from cte
group by rider_id,cast(pickup_time as date)
having sum(ride_time_mins) >0
order by rider_id,ride_date;`,
    systemSolution: `with cte as 
(
select order_id,rider_id,CAST(pickup_time AS DATE) as ride_date
,TIMESTAMPDIFF(MINUTE, pickup_time,delivery_time) as ride_time
 from orders
 where CAST(pickup_time AS DATE)=CAST(delivery_time AS DATE)
union all
select order_id,rider_id, CAST(pickup_time AS DATE) as ride_date
,TIMESTAMPDIFF(MINUTE, pickup_time,CAST(delivery_time as DATE)) as ride_time
 from orders
where CAST(pickup_time AS DATE)!=CAST(delivery_time AS DATE)
union all
select order_id,rider_id, CAST(delivery_time AS DATE) as ride_date
,TIMESTAMPDIFF(MINUTE,CAST(delivery_time as DATE), delivery_time) as ride_time
 from orders
where CAST(pickup_time AS DATE)!=CAST(delivery_time AS DATE)
)
select rider_id,ride_date,sum(ride_time) as ride_time_mins
 from cte
where ride_time!=0
group by rider_id,ride_date
order by rider_id,ride_date;`,
    starterCode: `-- Rider Ride Time\n-- Write your solution here\nSELECT *\nFROM orders;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
          { name: "delivered_at", type: "datetime" },
          { name: "product_id", type: "varchar(2)" }
        ]
      },
      {
        name: "purchases",
        columns: [
          { name: "product_id", type: "varchar(2)" },
          { name: "purchase_timestamp", type: "datetime" },
          { name: "user_id", type: "int" }
        ]
      }
    ],
    sampleData: `DROP TABLE IF EXISTS notifications;

CREATE TABLE notifications (
  notification_id INT,
  delivered_at DATETIME,
  product_id VARCHAR(2)
);

DROP TABLE IF EXISTS purchases;

CREATE TABLE purchases (
  product_id VARCHAR(2),
  purchase_timestamp DATETIME,
  user_id INT
);
`,
    mySolution: `with cte as(select ,
timestampdiff(minute,delivered_at, lead(delivered_at) over(order by delivered_at )) as next_TIME_DIFF,
lead(delivered_at) over(order by delivered_at ) as next_notification,
date_add(delivered_at,interval 2 hour) as next_time,
timestampdiff(minute,delivered_at, date_add(delivered_at,interval 2 hour)) as next_Two_DIFF
from notifications)
,cte1 as (select notification_id,product_id,delivered_at,
case when next_TIME_DIFF >next_Two_DIFF then next_time
when next_TIME_DIFF is null then next_time else next_notification end as next_time
from cte)
select c1.notification_id,
sum(case when c1.product_id=p.product_id then 1 else 0 end) as same_product_purchases,
 sum(case when c1.product_id!=p.product_id then 1 else 0 end) as different_product_purchases
from cte1 c1
inner join purchases p
on p.purchase_timestamp>=c1.delivered_at and 
p.purchase_timestamp <= c1.next_time
group by c1.notification_id`,
    systemSolution: `WITH cte AS (
    SELECT  
         ,CASE 
              WHEN DATE_ADD(delivered_at, INTERVAL 2 HOUR) <= LEAD(delivered_at, 1, '9999-12-31') OVER (ORDER BY notification_id) 
                  THEN DATE_ADD(delivered_at, INTERVAL 2 HOUR)                            --    Calculate valid notification end time as 2 hours after delivery if earlier than next notification
              ELSE LEAD(delivered_at, 1, '9999-12-31') OVER (ORDER BY notification_id)   --    Otherwise use next notification's delivered_at timestamp
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
    INNER JOIN cte ON p.purchase_timestamp BETWEEN delivered_at AND notification_valid_till   --    Join purchases made during notification validity period
)
SELECT 
    notification_id,
    SUM(CASE WHEN purchased_product = notified_product THEN 1 ELSE 0 END) AS same_product_purchases    --    Count purchases of notified product
   ,SUM(CASE WHEN purchased_product != notified_product THEN 1 ELSE 0 END) AS different_product_purchases --    Count purchases of different products
FROM cte2
GROUP BY notification_id                                                                                --    Aggregate counts per notification
ORDER BY notification_id;                                                                              --    Order results by notification_id ascending`,
    starterCode: `-- Amazon Notifications\n-- Write your solution here\nSELECT *\nFROM notifications;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    schema: [],
    sampleData: ``,
    mySolution: `with cte as (
select product_id,order_date,sum(amount) as sales
 from orders
group by product_id,order_date
)
, all_products_dates as (
select distinct product_id, cal_date as order_date
from cte 
cross join calendar_dim
)
select a.product_id,a.order_date,coalesce(cte.sales,0) as sales
,sum(coalesce(cte.sales,0)) over(partition by a.product_id order by a.order_date rows between 2 preceding and current row) as rolling3_sum
from all_products_dates a 
left join cte on a.product_id=cte.product_id and a.order_date=cte.order_date
ORDER BY a.product_id , a.order_date;`,
    systemSolution: `with cte as (
select product_id,order_date,sum(amount) as sales
 from orders
group by product_id,order_date
)
, all_products_dates as (
select distinct product_id, cal_date as order_date
from cte 
cross join calendar_dim
)
select a.product_id,a.order_date,coalesce(cte.sales,0) as sales
,sum(coalesce(cte.sales,0)) over(partition by a.product_id order by a.order_date rows between 2 preceding and current row) as rolling3_sum
from all_products_dates a 
left join cte on a.product_id=cte.product_id and a.order_date=cte.order_date
ORDER BY a.product_id , a.order_date;`,
    starterCode: `-- Rolling Sales\n-- Write your solution here\nSELECT 1;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: null,
    systemSolution: `WITH revenue_growth AS (
    SELECT 
        company_id,
        year,
        revenue,
        CASE 
        WHEN revenue >= 1.25  LAG(revenue,1,0) OVER (PARTITION BY company_id ORDER BY year) THEN 1
            ELSE 0
        END AS revenue_growth_flag
    FROM revenue
)
SELECT company_id, sum(revenue) as total_revenue
FROM revenue_growth
where company_id not in
 (select company_id from revenue_growth where revenue_growth_flag=0)
group by company_id 
ORDER BY company_id;`,
    starterCode: `-- Consistent Growth\n-- Write your solution here\nSELECT *\nFROM revenue;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
          { name: "messageSentTime", type: "datetime" },
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
  messageSentTime DATETIME,
  cityCode VARCHAR(6)
);
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
        MAX(case when resolution='True' then 1 else 0 end) AS resolved,
        CASE WHEN COUNT(DISTINCT agentId) > 1 THEN 1 ELSE 0 END AS reassigned
    FROM
        conversation
    GROUP BY
        orderId,cityCode
    order by orderId;`,
    systemSolution: `SELECT
        orderId AS order_id,
        cityCode AS city_code,
        MIN(CASE WHEN senderDeviceType = 'Web Agent' THEN messageSentTime END) AS first_agent_message,
        MIN(CASE WHEN senderDeviceType = 'Android Customer' THEN messageSentTime END) AS first_customer_message,
        SUM(CASE WHEN senderDeviceType = 'Web Agent' THEN 1 ELSE 0 END) AS num_messages_agent,
        SUM(CASE WHEN senderDeviceType = 'Android Customer' THEN 1 ELSE 0 END) AS num_messages_customer,
        CASE WHEN MIN(messageSentTime) = MIN(CASE WHEN senderDeviceType = 'Web Agent' THEN messageSentTime END) THEN 'Agent'
             WHEN MIN(messageSentTime) = MIN(CASE WHEN senderDeviceType = 'Android Customer' THEN messageSentTime END) THEN 'Customer' END AS first_message_by,
        MAX(case when resolution='True' then 1 else 0 end) AS resolved,
        CASE WHEN COUNT(DISTINCT agentId) > 1 THEN 1 ELSE 0 END AS reassigned
    FROM
        conversation
    GROUP BY
        orderId,cityCode
    order by orderId;`,
    starterCode: `-- Customer Support Metrics\n-- Write your solution here\nSELECT *\nFROM conversation;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    schema: [],
    sampleData: ``,
    mySolution: `with ranking as (select  ,
rank() over(partition by group_id order by slice_count desc ) as rn
from competition)
,looser_payout as (select group_id,sum(bet)0.3 as total_losser_bet
from ranking
where rn!=1
group by group_id)
,winner as(select group_id,count() as no_of_winner
from ranking
where rn=1
and slice_count is not null
and bet is not null
group by group_id)
select r.group_id,r.participant_name,
round(r.bet+ (l.total_losser_bet/w.no_of_winner),2)  as total_payout

from ranking r
inner join looser_payout l
on r.group_id=l.group_id
inner join winner w
on r.group_id=w.group_id
where r.rn=1
order by r.group_id,r.participant_name`,
    systemSolution: `with cte as (
select 
, rank() over(partition by group_id order by slice_count desc) as rn
from Competition
)
, cte2 as 
(
select group_id
,sum(case when rn=1 then 1 else 0 end) as no_of_winners
,sum(case when rn>1 then bet else 0 end)0.3 as losers_bet 
from cte 
group by group_id
)
select cte.group_id,cte.participant_name
,round(cte.bet+ (cte2.losers_bet)/cte2.no_of_winners,2) as total_payout 
from cte
inner join cte2 on cte.group_id=cte2.group_id
where cte.rn=1
order by cte.group_id,cte.participant_name;`,
    starterCode: `-- Eat and Win\n-- Write your solution here\nSELECT 1;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS products;

CREATE TABLE products (
  product_id INT,
  product_name VARCHAR(10)
);

DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
  sale_id INT,
  product_id INT,
  region_name VARCHAR(20),
  sale_date DATE,
  quantity_sold INT
);

DROP TABLE IF EXISTS seasons;

CREATE TABLE seasons (
  start_date DATE,
  end_date DATE,
  season_name VARCHAR(10)
);
`,
    mySolution: `with cte as (
select s.product_id,s.region_name,se.season_name,
sum(s.quantity_sold) as total_qty
from sales s
left join seasons se
on s.sale_date >=se.start_date 
and s.sale_date <=se.end_date 
group by s.product_id,s.region_name,se.season_name)
,cte1 as (select ,
rank() over(partition by region_name, season_name order by total_qty desc) as rn 
from cte)
Select 
c1.region_name,p.product_name,
c1.season_name,
c1.total_qty as total_quantity_sold
from cte1 c1
inner join products p
on c1.product_id=p.product_id
where rn=1
order by region_name
asc`,
    systemSolution: `WITH top_selling_per_region AS (
    SELECT
        s.region_name,
        p.product_name,
        SUM(s.quantity_sold) AS total_quantity_sold,
        ROW_NUMBER() OVER(PARTITION BY s.region_name ORDER BY SUM(s.quantity_sold) DESC) AS rn
    FROM
        sales s
    JOIN
        products p ON s.product_id = p.product_id
    GROUP BY
        s.region_name, p.product_name
)
SELECT
    ts.region_name,
    ts.product_name,
    ss.season_name,
    SUM(s.quantity_sold) AS total_quantity_sold
FROM
    sales s
JOIN
    products p ON s.product_id = p.product_id
JOIN
    top_selling_per_region ts ON s.region_name = ts.region_name AND p.product_name = ts.product_name
JOIN
    seasons ss ON s.sale_date BETWEEN ss.start_date AND ss.end_date
WHERE
    ts.rn = 1 -- Select only top-selling product per region
GROUP BY
    ts.region_name, ts.product_name, ss.season_name
ORDER BY
    ts.region_name, ts.product_name, ss.season_name;`,
    starterCode: `-- Seasonal Trends\n-- Write your solution here\nSELECT *\nFROM products;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: null,
    systemSolution: `WITH numbered_logs AS (
    SELECT 
        log_id,
        log_id - ROW_NUMBER() OVER (ORDER BY log_id) AS grp
    FROM 
        logs
)
SELECT 
    MIN(log_id) AS start_id, 
    MAX(log_id) AS end_id
FROM 
    numbered_logs
GROUP BY 
    grp
ORDER BY 
   start_id;`,
    starterCode: `-- Contiguous Ranges\n-- Write your solution here\nSELECT *\nFROM logs;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: null,
    systemSolution: `WITH RECURSIVE ReporteesCTE AS (
    -- Anchor member: Get the immediate reportees
    SELECT 
        m_id AS manager_id, 
        e_id AS employee_id
    FROM 
        hierarchy
    
    UNION ALL
    
    -- Recursive part: Get the reportees of the reportees
    SELECT 
        h.m_id AS manager_id, 
        r.employee_id
    FROM 
        hierarchy h
    JOIN 
        ReporteesCTE r ON h.e_id = r.manager_id
)

-- Count the number of reportees under each manager
SELECT 
    manager_id AS m_id,
    COUNT(DISTINCT employee_id) AS num_of_reportees
FROM 
    ReporteesCTE
GROUP BY 
    manager_id
ORDER BY 
    num_of_reportees desc, m_id;`,
    starterCode: `-- Hierarchy Reportee Count\n-- Write your solution here\nSELECT *\nFROM hierarchy;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: null,
    systemSolution: `WITH cte AS (
    SELECT 
         , LAG(event_time, 1, event_time) OVER (PARTITION BY userid ORDER BY event_time) AS prev_event_time      --     Get previous event_time per user
         , TIMESTAMPDIFF(MINUTE,
                         LAG(event_time, 1, event_time) OVER (PARTITION BY userid ORDER BY event_time), 
                         event_time) AS time_diff                                               --     Calculate difference in minutes between current and previous event
    FROM events
),
cte2 AS (
    SELECT userid
         , event_type
         , prev_event_time
         , event_time
         , CASE WHEN time_diff <= 30 THEN 0 ELSE 1 END AS flag                                       --     Flag 1 if gap > 30 mins, else 0
         , SUM(CASE WHEN time_diff <= 30 THEN 0 ELSE 1 END) OVER (PARTITION BY userid ORDER BY event_time) AS group_id  --     Assign group/session ids based on flag
    FROM cte
)
SELECT userid
     , ROW_NUMBER() OVER (PARTITION BY userid ORDER BY MIN(event_time)) AS session_id                  --     Assign session number per user
     , MIN(event_time) AS session_start_time                                                          --     Get session start time
     , MAX(event_time) AS session_end_time                                                            --     Get session end time
     , TIMESTAMPDIFF(MINUTE, MIN(event_time), MAX(event_time)) AS session_duration                     --     Calculate session duration in minutes
     , COUNT() AS event_count                                                                        --     Count events in session
FROM cte2
GROUP BY userid, group_id                                                                           --     Group by user and session group
;`,
    starterCode: `-- User Session Activity\n-- Write your solution here\nSELECT *\nFROM events;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: null,
    systemSolution: `select experience, COUNT() as total_condidates
,sum(case when (case when sql_score IS null or sql_score=100 then 1 else 0 end +
 case when algo IS null or algo=100 then 1 else 0 end +
 case when bug_fixing IS null or bug_fixing=100 then 1 else 0 end)=3 then 1 else 0 end) as perfect_score_candidates
from assessments
group by experience`,
    starterCode: `-- Perfect Score Candidates\n-- Write your solution here\nSELECT *\nFROM assessments;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id INT,
  name VARCHAR,
  salary INT
);

DROP TABLE IF EXISTS projects;

CREATE TABLE projects (
  id INT,
  title VARCHAR,
  start_date DATE,
  end_date DATE,
  budget INT
);

DROP TABLE IF EXISTS project_employees;

CREATE TABLE project_employees (
  project_id INT,
  employee_id INT
);
`,
    mySolution: `with salary_budget as(
select p.project_id,
sum(e.salary) as total_salary
from employees e
inner join  project_employees p
on e.id=p.employee_id
group by p.project_id)
select p.title,p.budget,
case when round(datediff(p.end_date,p.start_date)/365,2) s.total_salary >budget then 'overbudget' else 'within budget'
end as label 
from projects p
inner join salary_budget s
on p.id=s.project_id
order by title`,
    systemSolution: `WITH Project_Salary_Cost AS (
    SELECT 
        p.title AS project_title,                                         -- Project title from Projects table
        p.budget,                                                        -- Project budget
        SUM(e.salary  (DATEDIFF(p.end_date, p.start_date) / 365.0)) AS total_salary_cost  -- Total salary cost prorated by project duration in years
    FROM 
        Projects p
    JOIN 
        Project_Employees pe ON p.id = pe.project_id                      -- Join to get employees assigned to projects
    JOIN 
        Employees e ON e.id = pe.employee_id                             -- Join to get employee salaries
    GROUP BY 
        p.id, p.title, p.budget                                           -- Group by project to calculate total salary cost per project
)
SELECT 
    project_title AS title,                                               -- Project title
    budget,                                                             -- Project budget
    CASE 
        WHEN total_salary_cost > budget THEN 'overbudget'                -- Label 'overbudget' if total cost exceeds budget
        ELSE 'within budget'                                              -- Else label 'within budget'
    END AS label
FROM 
    Project_Salary_Cost                                                    -- Use CTE with calculated salary costs
ORDER BY 
    project_title;                                                       -- Order by project title`,
    starterCode: `-- Project Budget\n-- Write your solution here\nSELECT *\nFROM employees;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with salary_budget as(
select p.project_id,
sum(e.salary) as total_salary
from employees e
inner join  project_employees p
on e.id=p.employee_id
group by p.project_id)
select p.title,p.budget,
case when round(datediff(p.end_date,p.start_date)/365,2) s.total_salary >budget then 'overbudget' else 'within budget'
end as label 
from projects p
inner join salary_budget s
on p.id=s.project_id
order by title`,
    systemSolution: `select customer_id, count(distinct product_name) as total_distinct_products
from orders 
where customer_id not in (select customer_id from orders where product_name='Phone Case')
group by customer_id
having count(distinct case when product_name in ('Laptop','Mouse') then product_name end)=2
order by customer_id;`,
    starterCode: `-- Selective Buyers Analysis\n-- Write your solution here\nSELECT *\nFROM orders;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `with cte as(select station_id,arrival_time,+1 as points
from train_schedule
union all
select station_id,departure_time,-1
from train_schedule)
select station_id,arrival_time,
sum(points) over(partition by station_id order by arrival_time) as points
from cte`,
    systemSolution: `WITH combined_times AS (
    SELECT station_id, arrival_time AS event_time, 1 AS event_type 
    FROM train_schedule 
    UNION ALL
    SELECT station_id,departure_time AS event_time, -1 AS event_type 
    FROM train_schedule 
),
cumulative_events AS (
    SELECT station_id, 
        event_time,
        SUM(event_type) OVER (partition by station_id ORDER BY event_time) AS current_trains 
    FROM combined_times
)
SELECT station_id ,MAX(current_trains) AS min_platforms_required 
FROM cumulative_events
group by station_id;`,
    starterCode: `-- Train Schedule\n-- Write your solution here\nSELECT *\nFROM train_schedule;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    mySolution: null,
    systemSolution: `SELECT DATE_SUB(DATE(now()), INTERVAL case when DAYOFWEEK(now())=1 then 7 else DAYOFWEEK(now())-1 end DAY) as last_sunday;`,
    starterCode: `-- Last Sunday\n-- Write your solution here\nSELECT 1;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
  id INT,
  name VARCHAR,
  phone VARCHAR,
  is_promoted INT
);

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  company_id INT,
  name VARCHAR,
  rating DECIMAL
);
`,
    mySolution: `with cte as(
select company_id,
round(avg(rating),1) as  avg_rating,
count() as total_rating
from categories
group by company_id)
select 
case when is_promoted =1 then concat('[PROMOTED] ', c1.name) else c1.name end as name,c1.phone,
case when is_promoted =1 then NULL 
else CONCAT(
REPEAT('', floor(c.avg_rating)),' (',
avg_rating,',' , ' based on ',c.total_rating,' reviews',')')
end as rating
from cte c
left join companies c1
on c.company_id=c1.id
where (c1.is_promoted=0 and c.avg_rating>=1)
or c1.is_promoted=1
order by 
c1.is_promoted desc,
c.avg_rating desc,
c.total_rating desc`,
    systemSolution: `WITH company_ratings AS (
    SELECT 
        c.id AS company_id,
        c.name AS company_name,
        c.phone AS company_phone,
        c.is_promoted,
        AVG(cat.rating) AS avg_rating,
        COUNT(cat.rating) AS total_reviews
    FROM 
        companies c
    INNER JOIN 
        categories cat ON c.id = cat.company_id
    GROUP BY 
        c.id, c.name, c.phone, c.is_promoted
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
                REPEAT('', FLOOR(cr.avg_rating)), 
                ' (', 
                FORMAT(cr.avg_rating, 1), 
                ', based on ', 
                cr.total_reviews, 
                ' reviews)'
            )
        END AS rating,
        cr.is_promoted,
        cr.total_reviews,
        cr.avg_rating
    FROM 
        company_ratings cr
    WHERE 
        cr.is_promoted = 1 OR cr.avg_rating >= 1
)
SELECT 
    name, 
    phone, 
    rating 
FROM 
    formatted_output
ORDER BY 
    is_promoted DESC, 
    avg_rating DESC, 
    total_reviews DESC;`,
    starterCode: `-- The Yellow Pages\n-- Write your solution here\nSELECT *\nFROM companies;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
        100.0  (COALESCE(qtd.qtd_total, 0) - COALESCE(lq.lq_total, 0)) 
        / NULLIF(lq.lq_total, 0), 
        2
    ) AS pct_change
FROM last_quarter_sales lq
FULL OUTER JOIN qtd_sales qtd USING (product_id)
ORDER BY last_quarter_sales DESC;`,
    systemSolution: `-- Calculate quarter-to-date start date
with qtd_start AS (
  SELECT 
    DATE_FORMAT(
        DATE_SUB(CURDATE(), INTERVAL (MOD(MONTH(CURDATE())-1, 3)) MONTH),
        '%Y-%m-01'
    ) AS current_qtr_start
),
DateRanges as (
select current_qtr_start,current_qtr_start - INTERVAL 1 QUARTER as last_qtr_start
,current_qtr_start - INTERVAL 1 DAY as last_qtr_end
from qtd_start
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
    starterCode: `-- Quarterly sales Analysis\n-- Write your solution here\nSELECT *\nFROM sales;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS teams;

CREATE TABLE teams (
  team_id INT,
  team_name VARCHAR
);

DROP TABLE IF EXISTS matches;

CREATE TABLE matches (
  match_id INT,
  host_team INT,
  guest_team INT,
  host_goals INT,
  guest_goals INT
);
`,
    mySolution: `with cte as(select host_team as team,
case when host_goals> guest_goals  then 3 
 when host_goals< guest_goals  then 0 
when  host_goals= guest_goals  then 1 end as  points
from matches
union all
select guest_team,
case when host_goals< guest_goals  then 3 
 when host_goals> guest_goals  then 0 
when  host_goals= guest_goals  then 1 end as  points
from matches)
,cte1 as (select team,
sum(points) as total_points
From cte
group by team)
select t.team_id, t.team_name,
coalesce(c1.total_points,0) as num_points
from teams t
left join cte1 c1
on t.team_id=c1.team
order by num_points desc;


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
    starterCode: `-- Team Points Calculation\n-- Write your solution here\nSELECT *\nFROM teams;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id INT,
  name VARCHAR,
  joining_salary INT
);

DROP TABLE IF EXISTS promotions;

CREATE TABLE promotions (
  emp_id INT,
  promotion_date DATE,
  percent_increase INT
);
`,
    mySolution: `with cte as (select emp_id,
  EXP(SUM(LOG(1 + percent_increase/100))) as per_increase
from promotions
group by emp_id)
select e.id,e.name,e.joining_salary as initial_salary,
round(coalesce(c.per_increase  e.joining_salary,e.joining_salary),1) as current_salary
from employees e
left join cte c
on e.id=c.emp_id
order by e.id asc`,
    systemSolution: `WITH promotion_multipliers AS (
    SELECT 
        emp_id,
        EXP(SUM(LOG(1 + percent_increase/100))) AS total_multiplier          -- Calculate compounded multiplier for all promotions per employee
    FROM promotions
    GROUP BY emp_id                                                        -- Group by employee to accumulate multipliers
)
SELECT 
    e.id,
    e.name,
    e.joining_salary AS initial_salary,                                  -- Initial salary from employees table
    ROUND(e.joining_salary  IFNULL(pm.total_multiplier, 1), 1) AS current_salary  -- Calculate current salary applying promotion multiplier, default 1 if no promotions
FROM 
    employees e
LEFT JOIN 
    promotion_multipliers pm ON e.id = pm.emp_id                         -- Join promotion multipliers, preserve employees without promotions
ORDER BY 
    e.id;                                                                -- Order results by employee id`,
    starterCode: `-- Employees Current Salary\n-- Write your solution here\nSELECT *\nFROM employees;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  employee_id INT,
  name VARCHAR,
  join_date DATE,
  department VARCHAR,
  intial_salary INT
);

DROP TABLE IF EXISTS salary_history;

CREATE TABLE salary_history (
  employee_id INT,
  change_date DATE,
  salary INT,
  promotion VARCHAR
);
`,
    mySolution: null,
    systemSolution: `WITH salary_union AS (
    SELECT 
        employee_id,
        join_date AS change_date,
        initial_salary AS salary,
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
        su.,
        RANK() OVER (PARTITION BY employee_id ORDER BY change_date DESC) AS rn_desc,
        RANK() OVER (PARTITION BY employee_id ORDER BY change_date ASC) AS rn_asc,
        LEAD(salary) OVER (PARTITION BY employee_id ORDER BY change_date DESC) AS prev_salary
    FROM salary_union su
),

salary_growth_cte AS (
    SELECT 
        employee_id,
        MAX(CASE WHEN rn_desc = 1 THEN salary END)  1.0 /
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

-- Final Output
SELECT 
    c.employee_id,
    MAX(CASE WHEN c.rn_desc = 1 THEN c.salary END) AS latest_salary,
    SUM(CASE WHEN c.promotion = 'Yes' THEN 1 ELSE 0 END) AS total_promotions,
    MAX(
  CASE 
    WHEN c.prev_salary IS NOT NULL AND c.prev_salary > 0 
    THEN ROUND((c.salary - c.prev_salary)  100.0 / c.prev_salary, 2)
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
JOIN salary_growth_cte sg 
    ON c.employee_id = sg.employee_id
JOIN decrease_flag d 
    ON c.employee_id = d.employee_id

GROUP BY 
    c.employee_id, 
    sg.salary_growth, 
    sg.join_date,
    d.has_decreased

ORDER BY 
    c.employee_id;`,
    starterCode: `-- Salary Growth Analysis\n-- Write your solution here\nSELECT *\nFROM employees;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: `WITH ordered_purchases AS (
  SELECT
    user_id,
    order_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_date) AS rn,
    COUNT() OVER (PARTITION BY user_id) AS total_orders
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
SELECT 
FROM pivoted
WHERE DATEDIFF(second_order_date, first_order_date) <= 7 
  AND DATEDIFF(third_order_date, second_order_date) >= 30;`,
    systemSolution: `WITH ordered_purchases AS (
  SELECT
    user_id,
    order_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_date) AS rn,
    COUNT() OVER (PARTITION BY user_id) AS total_orders
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
SELECT 
FROM pivoted
WHERE DATEDIFF(second_order_date, first_order_date) <= 7 
  AND DATEDIFF(third_order_date, second_order_date) >= 30;`,
    starterCode: `-- Customers with 3 Purchases\n-- Write your solution here\nSELECT *\nFROM orders;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: null,
    systemSolution: `SELECT 
  ip_address,
  CASE
    --  Not exactly 3 dots
    WHEN LENGTH(ip_address) - LENGTH(REPLACE(ip_address, '.', '')) != 3 THEN 0

    --  Any part is non-numeric
    WHEN NOT SUBSTRING_INDEX(ip_address, '.', 1) REGEXP '^[0-9]+$' THEN 0
    WHEN NOT SUBSTRING_INDEX(SUBSTRING_INDEX(ip_address, '.', 2), '.', -1) REGEXP '^[0-9]+$' THEN 0
    WHEN NOT SUBSTRING_INDEX(SUBSTRING_INDEX(ip_address, '.', 3), '.', -1) REGEXP '^[0-9]+$' THEN 0
    WHEN NOT SUBSTRING_INDEX(ip_address, '.', -1) REGEXP '^[0-9]+$' THEN 0

    --  Any part > 255
    WHEN CAST(SUBSTRING_INDEX(ip_address, '.', 1) AS UNSIGNED) > 255 THEN 0
    WHEN CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(ip_address, '.', 2), '.', -1) AS UNSIGNED) > 255 THEN 0
    WHEN CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(ip_address, '.', 3), '.', -1) AS UNSIGNED) > 255 THEN 0
    WHEN CAST(SUBSTRING_INDEX(ip_address, '.', -1) AS UNSIGNED) > 255 THEN 0

    --  Leading zeros (length check method)
    WHEN LENGTH(SUBSTRING_INDEX(ip_address, '.', 1)) != LENGTH(CAST(SUBSTRING_INDEX(ip_address, '.', 1) AS UNSIGNED)) THEN 0
    WHEN LENGTH(SUBSTRING_INDEX(SUBSTRING_INDEX(ip_address, '.', 2), '.', -1)) != LENGTH(CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(ip_address, '.', 2), '.', -1) AS UNSIGNED)) THEN 0
    WHEN LENGTH(SUBSTRING_INDEX(SUBSTRING_INDEX(ip_address, '.', 3), '.', -1)) != LENGTH(CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(ip_address, '.', 3), '.', -1) AS UNSIGNED)) THEN 0
    WHEN LENGTH(SUBSTRING_INDEX(ip_address, '.', -1)) != LENGTH(CAST(SUBSTRING_INDEX(ip_address, '.', -1) AS UNSIGNED)) THEN 0

    -- Passed all checks
    ELSE 1
  END AS is_valid
FROM logins;`,
    starterCode: `-- IPv4 Validator\n-- Write your solution here\nSELECT *\nFROM logins;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
`,
    mySolution: null,
    systemSolution: `WITH cte AS (
    SELECT 
         , ROW_NUMBER() OVER (PARTITION BY city ORDER BY city) AS rn
    FROM emp_details
),
cte2 AS (
    SELECT 
         , CEIL(rn / 3.0) AS team_group
    FROM cte
),
cte3 AS (
    SELECT city,
           GROUP_CONCAT(emp_name ORDER BY emp_name SEPARATOR ',') AS team
    FROM cte2
    GROUP BY city, team_group
)
SELECT ,
       CONCAT('Team', ROW_NUMBER() OVER (ORDER BY city)) AS team_name
FROM cte3;`,
    starterCode: `-- Teams\n-- Write your solution here\nSELECT *\nFROM emp_details;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
  amount DECIMAL(4,2),
  status VARCHAR(9)
);
`,
    mySolution: null,
    systemSolution: `WITH july_tx AS (
    SELECT 
    FROM transactions
    WHERE dt >= '2021-07-01' 
      AND dt <  '2021-08-01'
),
customer_agg AS (
    SELECT
        customer,
        SUM(CASE WHEN type = 'BUY'  THEN 1 ELSE 0 END) AS buy,
        SUM(CASE WHEN type = 'SELL' THEN 1 ELSE 0 END) AS sell,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'PENDING'   THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'CANCELED'  THEN 1 ELSE 0 END) AS canceled,
        ROUND(
            SUM(
                CASE
                    WHEN status = 'PENDING' THEN 0
                    WHEN status = 'COMPLETED' AND type = 'BUY'
                        THEN amount
                    WHEN status = 'COMPLETED' AND type = 'SELL'
                        THEN 0.10  amount
                    WHEN status = 'CANCELED'
                        THEN -0.01  amount
                END
            ),
            2
        ) AS total
    FROM july_tx
    GROUP BY customer
)
SELECT
    customer, buy, sell, completed, pending, canceled, total
FROM customer_agg
order by total desc;`,
    starterCode: `-- Marketing Analytics\n-- Write your solution here\nSELECT *\nFROM transactions;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id VARCHAR,
  registration_date DATE
);

DROP TABLE IF EXISTS usage_data;

CREATE TABLE usage_data (
  user_id VARCHAR,
  usage_date DATE,
  location VARCHAR,
  time_spent INTEGER
);
`,
    mySolution: null,
    systemSolution: `WITH consolidated_usage AS (
    SELECT 
        u.user_id, 
        DATE_FORMAT(u.registration_date, '%Y-%m') AS registration_month,  
        SUM(CASE 
            WHEN usg.usage_date <= DATE_ADD(u.registration_date, INTERVAL 1 MONTH) THEN usg.time_spent 
            ELSE 0 
        END) AS m1_time_spent,
        SUM(CASE 
            WHEN usg.usage_date > DATE_ADD(u.registration_date, INTERVAL 1 MONTH) 
                 AND usg.usage_date <= DATE_ADD(u.registration_date, INTERVAL 2 MONTH) THEN usg.time_spent 
            ELSE 0 
        END) AS m2_time_spent,
        SUM(CASE 
            WHEN usg.usage_date > DATE_ADD(u.registration_date, INTERVAL 2 MONTH) 
                 AND usg.usage_date <= DATE_ADD(u.registration_date, INTERVAL 3 MONTH) THEN usg.time_spent 
            ELSE 0 
        END) AS m3_time_spent
    FROM users u
    LEFT JOIN usage_data usg ON u.user_id = usg.user_id  
    GROUP BY u.user_id, DATE_FORMAT(u.registration_date, '%Y-%m')
)

SELECT 
    registration_month, 
    COUNT() AS total_users,  
    IFNULL(ROUND(SUM(CASE WHEN m1_time_spent >= 30 THEN 1 ELSE 0 END)  100.0 / COUNT(), 2), 0) AS m1_retention,  
    IFNULL(ROUND(SUM(CASE WHEN m2_time_spent >= 30 THEN 1 ELSE 0 END)  100.0 / COUNT(), 2), 0) AS m2_retention,  
    IFNULL(ROUND(SUM(CASE WHEN m3_time_spent >= 30 THEN 1 ELSE 0 END)  100.0 / COUNT(), 2), 0) AS m3_retention  
FROM consolidated_usage  
GROUP BY registration_month;`,
    starterCode: `-- Cohort Retention\n-- Write your solution here\nSELECT *\nFROM users;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    sampleData: `DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT,
  source_city VARCHAR,
  destination_city VARCHAR
);

DROP TABLE IF EXISTS airports;

CREATE TABLE airports (
  port_code VARCHAR,
  city_name VARCHAR
);

DROP TABLE IF EXISTS flights;

CREATE TABLE flights (
  flight_id VARCHAR,
  start_port VARCHAR,
  end_port VARCHAR,
  start_time DATETIME,
  end_time DATETIME
);
`,
    mySolution: null,
    systemSolution: `WITH user_start_ports AS (
    SELECT u.user_id, a.port_code, a.city_name AS start_city
    FROM users u
    JOIN airports a ON a.city_name = u.source_city
),

-- Get all airports for each user's destination city
user_end_ports AS (
    SELECT u.user_id, a.port_code, a.city_name AS end_city
    FROM users u
    JOIN airports a ON a.city_name = u.destination_city
),

-- Get all valid direct flights for users from any source airport to any destination airport
direct_routes AS (
    SELECT 
        sp.user_id,
        sp.start_city AS trip_start_city,
        NULL AS middle_city,  -- Direct flights have no stopover city
        ep.end_city AS trip_end_city,
        TIMESTAMPDIFF(MINUTE, f.start_time, f.end_time) AS trip_time , -- Total time of journey
        CAST(f.flight_id AS CHAR) AS flight_ids -- Only one flight ID
    FROM flights f
    JOIN user_start_ports sp ON f.start_port = sp.port_code
    JOIN user_end_ports ep ON f.end_port = ep.port_code AND sp.user_id = ep.user_id
),

-- Get all valid one-stop flight routes
-- A valid connection must: 
-- 1. land and depart from the same airport
-- 2. second flight must start after (or at) the end time of the first flight
-- 3. total trip must start from user's source city and end at their destination city
one_stop_routes AS (
    SELECT 
        sp.user_id,
        sp.start_city AS trip_start_city,
        mid.city_name AS middle_city,  -- Stopover city
        ep.end_city AS trip_end_city,
        TIMESTAMPDIFF(MINUTE, f1.start_time, f2.end_time) AS trip_time,  -- Total time of journey
        CONCAT(f1.flight_id, ';', f2.flight_id) AS flight_ids  -- Combined flight IDs
    FROM flights f1
    JOIN flights f2 
        ON f1.end_port = f2.start_port
        AND f1.end_time <= f2.start_time
    JOIN user_start_ports sp ON f1.start_port = sp.port_code
    JOIN user_end_ports ep ON f2.end_port = ep.port_code AND sp.user_id = ep.user_id
    JOIN airports mid ON f1.end_port = mid.port_code  -- Determine middle city from flight connection
)

-- Combine direct and one-stop routes
SELECT  FROM direct_routes
UNION ALL
SELECT  FROM one_stop_routes
ORDER BY user_id, trip_time;`,
    starterCode: `-- Flight Planner System\n-- Write your solution here\nSELECT *\nFROM users;`,
    businessImpact: `This analysis enables data-driven decisions and operational efficiency improvements.`,
    optimizationTips: [],
    edgeCases: [
      "Handle NULL values appropriately",
      "Check for duplicate records",
      "Verify JOIN conditions",
      "Test with empty result sets"
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
    mySolution: null,
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
    mySolution: null,
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
    mySolution: null,
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
    mySolution: null,
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
    mySolution: null,
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
    mySolution: null,
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
    mySolution: null,
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
    mySolution: null,
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
