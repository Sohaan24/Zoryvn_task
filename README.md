# Zorvyn Finance Dashboard API

## Overview
This is a robust, secure RESTful API built for a Finance Dashboard system. It handles the backend logic for managing user roles, processing financial transactions (income and expenses), enforcing strict Role-Based Access Control (RBAC), and generating heavy data aggregations for dashboard analytics.

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Atlas) & Mongoose ODM
* **Security:** bcryptjs (Password Hashing), JWT-ready architecture.



## Architectural Decisions & Trade-offs

To ensure maintainability, security, and scalability, several deliberate architectural choices were made:

### 1. Separation of Concerns (Controller Pattern)
The application avoids "fat routes" by strictly separating routing logic from business logic. Routes are defined in the `/route` folder, while the actual database interactions and data formatting happen in the `/controller` folder. 

### 2. Centralized Error Handling (`wrapAsync`)
Instead of cluttering every controller with repetitive `try/catch` blocks, a custom `wrapAsync` utility function was implemented. This catches rejected promises and automatically forwards them to a **Global Error Handler** middleware in `server.js`, ensuring that the frontend always receives standardized, predictable JSON error responses.

### 3. Database-Level Aggregation (Dashboard API)
Calculating total income, total expenses, and monthly trends using standard `find()` queries and Javascript array methods (`reduce`, `filter`) is highly inefficient and consumes massive server RAM. 
* **Solution:** I implemented **MongoDB Aggregation Pipelines** (`$match`, `$group`, `$sum`, `$year`, `$month`) in the `summaryController`. This offloads the heavy mathematical calculations directly to the database layer, returning only the final, lightweight compiled metrics to the Node server.

### 4. Data Validation (Mongoose vs. External Libraries)
* **Decision:** Leveraged Mongoose's built-in schema validation (including custom validator functions for matching specific categories to "income" or "expense" types) rather than adding an external library like Joi.
* **Reasoning:** Mongoose perfectly handles data integrity for this scope. This keeps the application lightweight and adheres to the DRY (Don't Repeat Yourself) principle by maintaining a single source of truth for data rules.

### 5. Trade-off: Pagination Limits
* **Decision:** On the `GET /api/records` endpoint, a hard limit of `.limit(30)` was applied.
* **Reasoning:** Executing unbounded `find()` queries is a massive memory risk that can crash a server if a user has thousands of records. Given the prototype scope of this assignment, I prioritized server stability and security over building out full offset/cursor-based pagination logic.

---

## Core Features Implemented

* **Strict RBAC Middleware:** Users are categorized as `Viewer`, `Analyst`, or `Admin`. The `authorizeRoles` middleware intercepts requests and explicitly denies access (`403 Forbidden`) if a user's role lacks permissions for that specific route.
* **Dynamic Filtering:** The Records API supports dynamic query parameter filtering (e.g., `?type=expense&category=Food`).
* **Secure Data Storage:** Passwords are automatically hashed using `bcryptjs` via a Mongoose `pre("save")` hook before hitting the database. The `select: false` property ensures password hashes are never accidentally leaked to frontend `GET` requests.

---

## Setup & Local Development

### 1. Installation
Clone the repository and install the required dependencies:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your MongoDB connection string and server port:
```text
PORT=3000
MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster.mongodb.net/finance_db
JWT_secret=your_super_secret_key
```

### 3. Start the Server
```bash
npm start
```
The server will run on `http://localhost:3000`.

---

## API Documentation Snapshot

### Users & Authentication
* `POST /api/users` - Create a new user (Hashes password automatically). **[Admin]**
* `GET /api/users` - Fetch all users (Excludes internal `__v` and password hashes). **[Admin]**
* `PATCH /api/users/:id/role` - Upgrade/downgrade a user's role. **[Admin]**
* `PATCH /api/users/:id` - Change active/inactive status. **[Admin]**
* `DELETE /api/users/:id` - Hard delete a user. **[Admin]**

### Financial Records
* `POST /api/records` - Create an income or expense record. **[Admin]**
* `GET /api/records` - View records. Supports filtering via `?type=` and `?category=`. **[Viewer, Analyst, Admin]**
* `PATCH /api/records/:id` - Update specific fields of a record. **[Admin]**
* `DELETE /api/records/:id` - Remove a record. **[Admin]**

### Analytics Dashboard
* `GET /api/dashboard/summary` - Returns aggregated metrics including Net Balance, Category Totals, Recent Activity (last 5 transactions), and Month-over-Month historical trends. **[Analyst, Admin]**
