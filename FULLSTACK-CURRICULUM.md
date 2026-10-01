# FULLSTACK-CURRICULUM.md

## هدف سند

این سند مرجع آموزشی پلتفرم فارسی و آفلاین آموزش Full-Stack است.

هدف محصول:
- تجربه آموزشی شبیه W3Schools از نظر ساختار آموزشی، نه کپی محتوا.
- محتوای اصلی و فارسی.
- تمرکز فعلی فقط روی Full-Stack Web Development.
- آموزش مرحله‌ای از صفر تا ساخت و استقرار محصول Full-Stack.
- وجود مثال، Playground، Exercise، Quiz و Challenge در مسیر.
- تفاوت اصلی محصول: تعداد زیاد پروژه‌ها و مهم‌تر از آن، **Project Journey**؛ یعنی پروژه‌های اصلی در طول مسیر تکامل پیدا می‌کنند.

اصل مهم:
> دانشجو نباید فقط Tutorial تمام کند؛ باید در طول مسیر دائماً محصول بسازد.

---

# 1. اصول آموزشی

## 1.1 ساختار هر Lesson

هر Lesson ترجیحاً شامل این بخش‌هاست:

1. هدف درس
2. توضیح ساده
3. مثال پایه
4. Try It / Playground
5. نکات مهم
6. مثال تکمیلی
7. Exercise
8. Quiz
9. Challenge
10. ارتباط با پروژه
11. Next Lesson

## 1.2 سطوح

- Beginner: مفهوم جدید با مثال ساده
- Intermediate: ترکیب چند مفهوم و حل مسئله
- Advanced: معماری، edge case، performance، security و production concerns

## 1.3 قانون پروژه

هر چند Lesson یک خروجی عملی دارد:

Lesson → Exercise → Challenge → Mini Project → Skill Project → Journey Project

## 1.4 قانون تکرار

یک مفهوم فقط یک بار آموزش داده نمی‌شود. در پروژه‌های بعدی دوباره استفاده و عمیق‌تر می‌شود.

---

# 2. نقشه کلی مسیر

```text
00 Web Foundations
01 HTML
02 CSS
03 JavaScript Fundamentals
04 JavaScript Browser / DOM
05 TypeScript
06 Async JavaScript
07 HTTP / APIs
08 Git / GitHub
09 React + TypeScript
10 Frontend Architecture
11 Node.js + TypeScript
12 Express + TypeScript
13 SQL
14 PostgreSQL
15 Prisma
16 Authentication / Authorization
17 Security
18 Testing
19 Docker
20 Deployment
21 CI/CD
```

---

# 3. Project System

## Micro Projects

پروژه‌های کوچک برای تثبیت یک یا چند مفهوم:

- Counter
- Calculator
- Digital Clock
- Modal
- Accordion
- Form Validator
- Todo
- Quiz
- Timer
- Notes
- Expense Tracker

## Skill Projects

پروژه‌های چندمرحله‌ای برای ترکیب مهارت‌ها:

- Personal Portfolio
- Responsive Landing Page
- Admin Dashboard
- Blog UI
- Movie Explorer
- Weather Dashboard
- Countries Explorer
- Shopping Cart
- React Dashboard
- Blog API
- Task API
- E-commerce API
- Authentication API

## Journey Projects

پروژه‌های اصلی که در طول Curriculum رشد می‌کنند:

### Journey A — فروشگاه اینترنتی

```text
HTML
→ CSS
→ Responsive
→ JavaScript
→ TypeScript
→ React
→ API
→ Node
→ Express
→ PostgreSQL
→ Prisma
→ Authentication
→ Testing
→ Docker
→ Deployment
→ CI/CD
```

### Journey B — پلتفرم آموزش

موجودیت‌های اصلی:
- User
- Course
- Lesson
- Progress
- Quiz
- Result
- Role
- Permission

### Journey C — مدیریت پروژه

موجودیت‌های اصلی:
- User
- Team
- Project
- Task
- Comment
- Notification
- Role
- Permission

### Journey D — Blog Platform

- Posts
- Categories
- Comments
- Users
- Search
- Pagination
- Admin
- Authentication
- Authorization
- Upload

### Journey E — SaaS Dashboard

- Authentication
- Dashboard
- Teams
- Users
- Roles
- Permissions
- Settings
- API
- Database
- Testing
- Docker
- CI/CD

---

# 4. Curriculum تفصیلی

## 00 — Web Foundations

### Lessons

1. اینترنت چیست؟
2. Website چیست؟
3. Browser چیست؟
4. Frontend چیست؟
5. Backend چیست؟
6. Database چیست؟
7. Full-Stack چیست؟
8. Client و Server
9. URL
10. HTTP در حد مقدماتی
11. VS Code
12. Browser DevTools
13. Terminal
14. ساختار یک پروژه وب

### Project

**Project 0 — Personal Intro Page**

خروجی:
- صفحه شخصی ساده
- HTML اولیه
- شناخت ساختار پروژه

---

# 5. HTML

## 01 — HTML Fundamentals

### Lessons

1. HTML چیست؟
2. Document Structure
3. html / head / body
4. Title
5. Headings
6. Paragraphs
7. Comments
8. Text Formatting
9. Links
10. Images
11. Lists
12. Tables
13. Forms
14. Input
15. Button
16. Select
17. Textarea
18. Label
19. Attributes

### Intermediate

20. Semantic HTML
21. Header
22. Nav
23. Main
24. Section
25. Article
26. Aside
27. Footer
28. Figure
29. Audio
30. Video
31. iframe
32. data-* attributes
33. dialog
34. template

### Accessibility

35. alt
36. labels
37. keyboard accessibility
38. semantic structure
39. ARIA مقدماتی

### SEO

40. title
41. meta description
42. headings
43. semantic structure
44. links

### Projects

- Project 1: Personal Profile
- Project 2: Article / Blog Page
- Project 3: Product Page
- Project 4: Registration Form
- Project 5: Multi-page Business Website

### Journey

**Store Journey v1 — HTML-only Store**

---

# 6. CSS

## 02 — CSS Fundamentals

### Lessons

1. CSS چیست؟
2. Syntax
3. Selectors
4. Class
5. ID
6. Colors
7. Background
8. Fonts
9. Text
10. Units
11. Width / Height
12. Margin
13. Padding
14. Border
15. Box Model
16. Display
17. Overflow
18. Position
19. z-index

## Layout

20. Flexbox
21. Flex Direction
22. Alignment
23. Gap
24. Grid
25. Grid Columns / Rows
26. Responsive Layout
27. Media Queries
28. Mobile First

## Advanced

29. Cascade
30. Specificity
31. Inheritance
32. Pseudo Classes
33. Pseudo Elements
34. CSS Variables
35. calc
36. min / max / clamp
37. Transition
38. Transform
39. Animation
40. Container Queries
41. CSS Architecture
42. Responsive Accessibility

### Projects

- Project 6: Landing Page
- Project 7: Responsive Portfolio
- Project 8: Admin Dashboard
- Project 9: Responsive Blog
- Project 10: Product Page
- Project 11: Responsive Store

### Journey

**Store Journey v2 — Responsive HTML/CSS Store**

---

# 7. JavaScript Fundamentals

## 03 — JavaScript Core

### Lessons

1. JavaScript چیست؟
2. Variables
3. let
4. const
5. Data Types
6. Strings
7. Numbers
8. Boolean
9. null / undefined
10. Operators
11. Comparisons
12. Conditions
13. if / else
14. switch
15. for
16. while
17. Functions
18. Parameters
19. Return
20. Scope مقدماتی

## Intermediate

21. Arrays
22. Objects
23. Array methods
24. map
25. filter
26. reduce
27. find
28. some / every
29. sort
30. forEach
31. Callbacks
32. Higher-order functions

## Deep JavaScript

33. Scope
34. Closure
35. Hoisting
36. this
37. Execution Context
38. Call Stack
39. Event Loop
40. Microtask / Macrotask
41. Modules
42. import / export
43. Destructuring
44. Spread
45. Rest
46. Optional Chaining
47. Nullish Coalescing

### Projects

- Project 12: Calculator
- Project 13: Counter / Timer
- Project 14: Todo
- Project 15: Quiz App
- Project 16: Expense Tracker
- Project 17: Notes App
- Project 18: Shopping Cart

### Journey

**Store Journey v3 — Interactive JavaScript Store**

ویژگی‌ها:
- Product data
- Cart
- Quantity
- Total
- Filtering
- LocalStorage

---

# 8. Browser / DOM

## 04 — Browser APIs

### Lessons

1. DOM چیست؟
2. Selecting Elements
3. Creating Elements
4. Updating Elements
5. Classes
6. Attributes
7. Events
8. Event Listener
9. Forms
10. Form Validation
11. Event Bubbling
12. Event Delegation
13. localStorage
14. sessionStorage
15. Browser APIs
16. URL / Location
17. Timers

### Projects

- Project 19: Advanced Todo
- Project 20: Form Validation App
- Project 21: Notes App with Storage
- Project 22: Shopping Cart with Storage

---

# 9. TypeScript

## 05 — TypeScript

### Lessons

1. TypeScript چیست؟
2. Type Inference
3. Primitive Types
4. Arrays
5. Tuples
6. Objects
7. Type Aliases
8. Interfaces
9. Union Types
10. Intersection Types
11. Literal Types
12. Optional Properties
13. readonly
14. Function Types
15. Generic Functions
16. Generics
17. Narrowing
18. Type Guards
19. Utility Types
20. Type-safe data structures

### Project

**Project 23 — JavaScript Todo → TypeScript Todo**

اصل:
> دانشجو پروژه قبلی را migrate می‌کند، نه اینکه پروژه‌ای کاملاً جدا بسازد.

### Journey

**Store Journey v4 — TypeScript Store**

---

# 10. Async JavaScript

## 06 — Async

### Lessons

1. Synchronous vs Asynchronous
2. Callback
3. Promise
4. then
5. catch
6. finally
7. Promise Chaining
8. Promise.all
9. Promise.allSettled
10. Promise.race
11. Promise.any
12. async / await
13. try / catch
14. Sequential Requests
15. Parallel Requests

### Project

**Project 24 — Async Dashboard**

ویژگی‌ها:
- Loading
- Success
- Error
- Empty
- Retry
- Parallel requests

---

# 11. HTTP / API

## 07 — HTTP and APIs

### Lessons

1. Client / Server
2. HTTP
3. Request
4. Response
5. Endpoint
6. REST
7. JSON
8. GET
9. POST
10. PUT
11. PATCH
12. DELETE
13. Headers
14. Query Params
15. Request Body
16. Status Codes
17. fetch
18. response.ok
19. Error Handling
20. CORS
21. Authentication Concepts
22. API Keys
23. Tokens
24. Pagination
25. Filtering
26. Searching
27. Debouncing
28. Request Cancellation

### Projects

- Project 25: Countries Explorer
- Project 26: Weather Dashboard
- Project 27: Movie Explorer
- Project 28: API Dashboard

### Offline Requirement

برای محیط بدون اینترنت:
- API exercises باید Mock API یا Dataset محلی داشته باشند.
- تمرین نباید برای تکمیل Lesson به اینترنت عمومی وابسته باشد.

---

# 12. Git / GitHub

## 08 — Version Control

### Lessons

1. Git چیست؟
2. Repository
3. init
4. status
5. add
6. commit
7. log
8. branch
9. checkout / switch
10. merge
11. pull
12. push
13. clone
14. .gitignore
15. GitHub
16. README
17. Pull Request
18. Branch Workflow

### Rule

از این مرحله هر Skill Project یک Repository مستقل دارد.

---

# 13. React + TypeScript

## 09 — React Fundamentals

### Lessons

1. React چیست؟
2. Vite
3. Project Structure
4. Components
5. JSX
6. Props
7. State
8. Events
9. Conditional Rendering
10. Lists
11. Keys
12. Forms

## Hooks

13. useState
14. useEffect
15. useRef
16. useContext
17. useReducer
18. useMemo
19. useCallback
20. Custom Hooks

## Application

21. React Router
22. API Calls
23. Loading States
24. Error States
25. Empty States
26. Reusable Components
27. Forms
28. Component Composition

### Projects

- Project 29: React Todo
- Project 30: React Dashboard
- Project 31: React Movie App
- Project 32: React Admin Panel
- Project 33: React E-commerce

### Journey

**Store Journey v5 — React + TypeScript Store**

---

# 14. Frontend Architecture

## 10

### Lessons

1. Project Architecture
2. Folder Structure
3. Feature-based Architecture
4. Shared Components
5. Design System
6. Component Reuse
7. State Management
8. Context
9. Zustand
10. Server State
11. TanStack Query
12. API Layer
13. Error Architecture
14. Loading Architecture
15. Form Architecture
16. Authentication Architecture
17. Performance
18. Accessibility
19. SEO
20. Maintainability

### Project

**Project 34 — Production-style Dashboard**

---

# 15. Node.js + TypeScript

## 11

### Lessons

1. Node.js چیست؟
2. Runtime
3. npm
4. package.json
5. Modules
6. ESM
7. CommonJS
8. Filesystem
9. Path
10. Environment Variables
11. HTTP
12. Async I/O
13. Event Loop

### Projects

- Project 35: CLI Tool
- Project 36: Basic HTTP Server

---

# 16. Express + TypeScript

## 12

### Lessons

1. Express
2. Server
3. Routes
4. Request
5. Response
6. Middleware
7. Controllers
8. Services
9. Utils
10. Validation
11. Error Handling
12. REST API
13. API Structure
14. HTTP Status Design

### Architecture

```text
src/
├── routes/
├── controllers/
├── services/
├── middleware/
├── models/
├── utils/
└── app.ts
```

### Projects

- Project 37: Blog API
- Project 38: Task Management API
- Project 39: E-commerce API

---

# 17. SQL

## 13

### Lessons

1. Database چیست؟
2. Relational Database
3. Table
4. Row
5. Column
6. Primary Key
7. Foreign Key
8. Relationships
9. CRUD
10. SELECT
11. INSERT
12. UPDATE
13. DELETE
14. WHERE
15. ORDER BY
16. GROUP BY
17. Aggregate Functions
18. JOIN
19. Index
20. Transactions

### Project

**Project 40 — Database-driven Blog**

---

# 18. PostgreSQL

## 14

### Lessons

1. PostgreSQL چیست؟
2. Database creation
3. Tables
4. Constraints
5. Relationships
6. Querying
7. Indexing
8. Transactions
9. Practical schema design
10. Local development database

### Project

**Project 41 — PostgreSQL Task Manager**

---

# 19. Prisma

## 15

### Lessons

1. Prisma چیست؟
2. Schema
3. Models
4. Relations
5. Migrations
6. CRUD
7. Queries
8. Nested Relations
9. Transactions
10. Type-safe database access

### Project

**Project 42 — Task Management Backend**

---

# 20. Authentication / Authorization

## 16

### Lessons

1. Authentication
2. Authorization
3. Password Hashing
4. Cookies
5. Sessions
6. JWT
7. Access Tokens
8. Refresh Tokens
9. Protected Routes
10. Roles
11. Permissions
12. Logout
13. Password Reset
14. Email Verification

### Project

**Project 43 — Authentication System**

### Journey

Store / Blog / Education Platform به Authentication متصل می‌شوند.

---

# 21. Security

## 17

### Lessons

1. XSS
2. CSRF
3. SQL Injection
4. CORS
5. Password Security
6. Input Validation
7. Rate Limiting
8. Secrets
9. Environment Variables
10. Security Headers
11. Authentication Vulnerabilities

### Project

**Project 44 — Secure REST API**

---

# 22. Testing

## 18

### Lessons

1. Why Testing
2. Unit Testing
3. Component Testing
4. Integration Testing
5. API Testing
6. E2E Testing
7. Vitest
8. React Testing Library
9. Supertest
10. Playwright
11. Test Data
12. Mocking مقدماتی

### Project

**Project 45 — Test a Full-Stack Application**

---

# 23. Docker

## 19

### Lessons

1. Container چیست؟
2. Image چیست؟
3. Dockerfile
4. Build
5. Run
6. Ports
7. Volumes
8. Networks
9. Environment
10. Docker Compose
11. PostgreSQL Container

### Project

**Project 46 — Containerized Full-Stack App**

---

# 24. Deployment

## 20

### Lessons

1. Production vs Development
2. Build
3. Environment Variables
4. Domain
5. HTTPS
6. Frontend Deployment
7. Backend Deployment
8. Database Deployment
9. Logs
10. Production Configuration

### Project

**Project 47 — Deploy Full-Stack Application**

---

# 25. CI/CD

## 21

### Lessons

1. CI چیست؟
2. CD چیست؟
3. GitHub Actions
4. Automated Tests
5. Automated Build
6. Lint
7. Deployment Pipeline
8. Environment Management

### Final Project

**Project 48 — Full CI/CD Pipeline**

---

# 26. Final Capstone

## Final Project — Full-Stack Product

دانشجو یکی از این محصولات را انتخاب می‌کند:

- E-commerce
- Learning Management System
- Project Management
- Blog Platform
- SaaS Dashboard

### حداقل قابلیت‌ها

- React + TypeScript
- Backend TypeScript
- Express
- PostgreSQL
- Prisma
- Authentication
- Authorization
- Validation
- Error Handling
- Testing
- Docker
- Deployment
- CI/CD

### Capstone Evaluation

به جای نمره کلی، Checklist:

- Functionality
- Code Structure
- Type Safety
- UX
- Accessibility
- API Quality
- Database Design
- Authentication
- Security
- Testing
- Deployment
- Documentation

---

# 27. Project Progress Model

هر Journey وضعیت مستقل دارد:

```text
Not Started
In Progress
Checkpoint
Completed
```

مثال:

```text
Store Journey

HTML              ✓
CSS               ✓
JavaScript        ✓
TypeScript        ✓
React             65%
API               ○
Backend           ○
Database          ○
Auth              ○
Testing           ○
Docker             ○
Deployment         ○
CI/CD              ○
```

---

# 28. اصل Offline-first

تمام محتوای آموزشی باید بدون اینترنت قابل استفاده باشد:

- Lessons محلی
- Examples محلی
- Playground محلی
- Quiz محلی
- Exercise محلی
- Assets محلی
- Fonts محلی
- Icons محلی
- Mock APIs محلی
- Datasetهای آموزشی محلی

Internet فقط برای مواردی مثل GitHub/Deployment در مراحل مربوطه یک قابلیت تکمیلی است، نه شرط ادامه آموزش.
