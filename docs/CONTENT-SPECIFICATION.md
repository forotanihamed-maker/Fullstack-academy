# CONTENT SPECIFICATION
## Persian Offline Full-Stack Learning Platform

Version: 1.0
Status: Ready for implementation
Language: Persian (fa-IR)
Primary audience: Students learning web development without reliable global internet access

---

# 1. Purpose

این سند، قرارداد تولید محتوای آموزشی پلتفرم است. هدف این است که هر درس، تمرین، آزمون، چالش و پروژه ساختار مشخص، قابل اعتبارسنجی و قابل توسعه داشته باشد.

الگوی اصلی یادگیری:

Lesson → Example → Try It → Exercise → Quiz → Challenge → Mini Project → Skill Project → Journey Project

اصل مهم:
- محتوای آموزشی باید Original باشد.
- از W3Schools فقط از نظر الگوی آموزشی، خردکردن مطالب، مثال‌محوری و تمرین‌محوری الهام گرفته می‌شود.
- متن، مثال، تمرین، سؤال و پروژه نباید کپی محتوای W3Schools باشد.

---

# 2. Global Content Model

هر ماژول دارای این ساختار است:

Module
├── Overview
├── Learning Objectives
├── Lessons
├── Exercises
├── Quizzes
├── Challenges
├── Projects
├── Checkpoints
└── Prerequisites

هر Lesson می‌تواند به این موارد متصل شود:
- Example
- Playground
- Exercise
- Quiz
- Challenge
- Project
- Prerequisite lesson
- Next lesson

---

# 3. Lesson Schema

حداقل فیلدهای هر درس:

```ts
type Lesson = {
  id: string
  slug: string
  moduleId: string
  title: string
  shortDescription: string
  order: number

  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedMinutes: number

  prerequisites: string[]
  objectives: string[]
  concepts: string[]

  content: Section[]
  examples: Example[]
  playgrounds?: Playground[]
  exercises?: Exercise[]
  quizzes?: Quiz[]
  challenges?: Challenge[]

  relatedLessons?: string[]
  relatedProjects?: string[]
  nextLesson?: string
}
```

---

# 4. Lesson Structure

هر درس باید تا حد امکان این ترتیب را حفظ کند:

1. عنوان
2. چرا این موضوع مهم است؟
3. هدف درس
4. مفهوم اصلی
5. Syntax / API
6. مثال ساده
7. مثال واقعی‌تر
8. Try It
9. نکات مهم
10. اشتباهات رایج
11. Exercise
12. Quiz
13. Challenge
14. خلاصه
15. Next Step

برای درس‌های کوتاه می‌توان بعضی بخش‌ها را حذف کرد، اما ترتیب ذهنی حفظ شود.

---

# 5. Writing Rules

## زبان

- فارسی ساده و دقیق
- اصطلاح فنی انگلیسی در کنار معادل فارسی در اولین استفاده
- کد و نام API همیشه انگلیسی
- از ترجمه‌های مصنوعی اصطلاحات رایج پرهیز شود

مثال:

«DOM یا Document Object Model، ساختار درختی سند HTML است.»

نه:

«مدل شیء سند» بدون ذکر DOM.

## سبک

- پاراگراف کوتاه
- هر مفهوم در یک بخش
- مثال قبل از توضیح طولانی
- توضیح از ساده به پیچیده
- هر درس فقط یک هدف آموزشی اصلی داشته باشد

## ممنوع

- متن‌های طولانی بدون مثال
- تعریف‌های دایره‌ای
- اصطلاحات بدون مثال
- پروژه‌هایی که هنوز مهارت‌های لازم آموزش داده نشده‌اند
- کپی یا بازنویسی نزدیک محتوای سایت‌های دیگر

---

# 6. Difficulty Model

### Beginner
دانش‌آموز با موضوع آشنا نیست.

ویژگی:
- مثال بسیار ساده
- راهنمایی زیاد
- خطاهای قابل پیش‌بینی
- بدون وابستگی زیاد

### Intermediate
دانش‌آموز مفهوم را می‌داند و باید ترکیب مفاهیم را یاد بگیرد.

ویژگی:
- مثال واقعی‌تر
- راهنمایی کمتر
- چند مفهوم در یک تمرین
- Debugging

### Advanced
تمرکز روی معماری، trade-off، امنیت، performance و production.

ویژگی:
- مسئله بازتر
- راهنمایی محدود
- نیاز به طراحی
- سناریوهای واقعی

---

# 7. Example Schema

```ts
type Example = {
  id: string
  title: string
  description?: string

  language: "html" | "css" | "javascript" | "typescript" |
            "jsx" | "tsx" | "json" | "sql" | "bash"

  code: string
  expectedOutput?: string
  explanation: string[]
}
```

قانون:
هر مفهوم جدید حداقل یک مثال عملی داشته باشد.

---

# 8. Playground Schema

```ts
type Playground = {
  id: string
  title: string

  files: {
    name: string
    language: string
    code: string
  }[]

  starterFile?: string
  expectedBehavior?: string
  hints?: string[]
}
```

Playground باید تا حد امکان:
- مستقل باشد
- سریع اجرا شود
- بدون اینترنت کار کند
- خروجی قابل مشاهده داشته باشد

---

# 9. Exercise Schema

```ts
type Exercise = {
  id: string
  title: string
  prompt: string

  difficulty: "easy" | "medium" | "hard"

  starterCode?: string

  expectedAnswer?: string
  acceptedAnswers?: string[]

  hints?: string[]
  solution?: string

  skills: string[]
}
```

سطح تمرین:

### Easy
یک مفهوم

### Medium
دو یا سه مفهوم

### Hard
ترکیب چند مفهوم + Debugging

---

# 10. Quiz Schema

```ts
type Quiz = {
  id: string
  question: string

  type: "single" | "multiple" | "true-false"

  options: {
    id: string
    text: string
  }[]

  correct: string[]
  explanation: string
}
```

قانون:
- سؤال باید یک هدف مشخص داشته باشد.
- گزینه غلط باید plausible باشد.
- سؤال نباید فقط حفظیات بی‌ارزش باشد.
- explanation همیشه وجود داشته باشد.

---

# 11. Challenge Schema

```ts
type Challenge = {
  id: string
  title: string
  brief: string

  requirements: string[]
  constraints?: string[]

  starterFiles?: string[]
  hints: string[]

  acceptanceCriteria: string[]
  skills: string[]
}
```

Challenge باید با پروژه‌های آینده ارتباط داشته باشد.

---

# 12. Project Schema

```ts
type Project = {
  id: string
  slug: string
  title: string

  type:
    | "micro"
    | "skill"
    | "journey"
    | "capstone"

  description: string
  difficulty: "beginner" | "intermediate" | "advanced"

  prerequisites: string[]
  technologies: string[]
  skills: string[]

  requirements: string[]
  milestones: Milestone[]

  deliverables: string[]
  acceptanceCriteria: string[]

  extensionIdeas?: string[]
}
```

---

# 13. Milestone Schema

```ts
type Milestone = {
  id: string
  title: string
  description: string

  requiredLessons: string[]
  requiredSkills: string[]

  tasks: string[]
  checkpoint?: string
}
```

Journey Project باید milestone محور باشد.

---

# 14. Checkpoint

بعد از هر بخش مهم یک Checkpoint قرار گیرد.

مثال:

HTML Foundations Checkpoint

دانش‌آموز باید بتواند:
- ساختار HTML بسازد
- لینک و تصویر ایجاد کند
- فرم ایجاد کند
- جدول بسازد
- semantic HTML را توضیح دهد

اگر حداقل معیارها برآورده نشد:
- پیشنهاد مرور درس‌های مربوط
- تمرین اضافی
- سپس ادامه مسیر

---

# 15. Content Quality Rules

هر درس قبل از انتشار باید این موارد را پاس کند:

- [ ] هدف مشخص دارد
- [ ] prerequisite مشخص دارد
- [ ] مثال دارد
- [ ] تمرین دارد
- [ ] quiz دارد
- [ ] خلاصه دارد
- [ ] next step دارد
- [ ] کد اجراپذیر است
- [ ] مثال‌ها مستقل‌اند
- [ ] متن فارسی واضح است
- [ ] اصطلاحات فنی consistent هستند
- [ ] هیچ dependency اینترنتی غیرضروری ندارد
- [ ] ارتباط با پروژه مشخص است

---

# 16. Content IDs

الگوی پیشنهادی:

Modules:
`html`
`css`
`javascript`
`browser`
`typescript`
`async-js`
`http-api`
`git`
`react`
`frontend-architecture`
`node`
`express`
`sql`
`postgresql`
`prisma`
`auth`
`security`
`testing`
`docker`
`deployment`
`cicd`

Lesson:
`html-001`
`html-002`

Exercise:
`html-ex-001`

Quiz:
`html-q-001`

Challenge:
`html-ch-001`

Project:
`journey-ecommerce`

---

# 17. Module Template

هر ماژول باید دارای:

```text
Module Overview
├── What You Will Learn
├── Prerequisites
├── Lessons
├── Practice
├── Checkpoint
├── Projects
└── Next Module
```

---

# 18. Full-Stack Curriculum

## 00 Web Foundations

موضوعات:
- Internet چیست؟
- Browser چیست؟
- Server چیست؟
- Client/Server
- URL
- Domain
- DNS
- HTTP/HTTPS
- Request/Response
- Static/Dynamic Web
- Frontend/Backend/Database
- JSON

پروژه:
- بررسی و ساخت یک درخواست ساده HTTP
- Mini Web Request Explorer

---

# 19. HTML Module

## HTML-001 — HTML چیست؟
## HTML-002 — ساختار سند HTML
## HTML-003 — Elements
## HTML-004 — Headings و Paragraphs
## HTML-005 — Text Formatting
## HTML-006 — Links
## HTML-007 — Images
## HTML-008 — Lists
## HTML-009 — Tables
## HTML-010 — Forms
## HTML-011 — Input Types
## HTML-012 — Form Validation
## HTML-013 — Audio و Video
## HTML-014 — iframe و Embed
## HTML-015 — Semantic HTML
## HTML-016 — Accessibility Basics
## HTML-017 — SEO Basics
## HTML-018 — HTML Project

### HTML Project
ساخت یک وب‌سایت چندصفحه‌ای برای یک آموزشگاه.

Pages:
- Home
- Courses
- Course Detail
- About
- Contact
- Registration

---

# 20. CSS Module

## CSS-001 — CSS چیست؟
## CSS-002 — Syntax
## CSS-003 — Selectors
## CSS-004 — Colors
## CSS-005 — Units
## CSS-006 — Box Model
## CSS-007 — Margin/Padding
## CSS-008 — Borders
## CSS-009 — Typography
## CSS-010 — Display
## CSS-011 — Position
## CSS-012 — Flexbox
## CSS-013 — Grid
## CSS-014 — Responsive Design
## CSS-015 — Media Queries
## CSS-016 — Variables
## CSS-017 — Transitions
## CSS-018 — Transforms
## CSS-019 — Animations
## CSS-020 — Component Styling
## CSS-021 — Accessibility
## CSS-022 — CSS Project

Projects:
- Landing Page
- Responsive Portfolio
- Dashboard UI

---

# 21. JavaScript Fundamentals

## JS-001 — JavaScript چیست؟
## JS-002 — Variables
## JS-003 — Data Types
## JS-004 — Operators
## JS-005 — Conditions
## JS-006 — Loops
## JS-007 — Functions
## JS-008 — Scope
## JS-009 — Arrays
## JS-010 — Objects
## JS-011 — Destructuring
## JS-012 — Spread/Rest
## JS-013 — String Methods
## JS-014 — Array Methods
## JS-015 — Date/Time
## JS-016 — Error Handling
## JS-017 — Modules
## JS-018 — JSON
## JS-019 — Local Storage
## JS-020 — Debugging
## JS-021 — JS Project

Projects:
- Calculator
- Todo
- Quiz App
- Expense Tracker

---

# 22. Browser / DOM

## DOM
- DOM Tree
- Select Elements
- Modify Content
- Modify Styles
- Attributes
- Create Elements
- Remove Elements
- Events
- Event Delegation
- Forms
- Validation
- LocalStorage
- SessionStorage
- Browser APIs
- URL API
- History API
- Clipboard API
- Fetch introduction

Projects:
- Notes App
- Shopping Cart
- Weather UI
- Interactive Dashboard

---

# 23. TypeScript

## TS-001 — Why TypeScript
## TS-002 — Setup
## TS-003 — Primitive Types
## TS-004 — Arrays/Tuples
## TS-005 — Objects
## TS-006 — Type Aliases
## TS-007 — Interfaces
## TS-008 — Union/Intersection
## TS-009 — Literal Types
## TS-010 — Functions
## TS-011 — Generics
## TS-012 — Utility Types
## TS-013 — Narrowing
## TS-014 — Enums / alternatives
## TS-015 — Modules
## TS-016 — tsconfig
## TS-017 — DOM typing
## TS-018 — Async typing
## TS-019 — Error typing
## TS-020 — TS Project

Journey transition:
Todo JavaScript → Todo TypeScript

---

# 24. Async JavaScript

- Callbacks
- Promises
- async/await
- Promise.all
- Promise.race
- Error handling
- AbortController
- Async patterns
- Loading/error states

Project:
- API Explorer
- Search Application

---

# 25. HTTP / API

- HTTP methods
- Status codes
- Headers
- Request body
- JSON
- REST
- CRUD
- Query params
- Path params
- Authentication concepts
- API errors
- Pagination
- Filtering
- Sorting

Project:
- REST API Client

---

# 26. Git / GitHub

- Repository
- init
- clone
- add
- commit
- status
- log
- branch
- merge
- conflict
- pull
- push
- remote
- pull request
- conventional commits
- .gitignore

Project:
- Version control for Journey Project

---

# 27. React + TypeScript

- React concept
- Components
- JSX/TSX
- Props
- State
- Events
- Forms
- Lists
- Conditional rendering
- Hooks
- useState
- useEffect
- useMemo
- useCallback
- useRef
- Custom hooks
- Context
- Routing
- Data fetching
- Error/loading states

Projects:
- React Todo
- React Dashboard
- Product Catalog
- Shopping Cart

Journey:
Todo JS → Todo TS → React Todo

---

# 28. Frontend Architecture

- Feature-based architecture
- Component boundaries
- UI vs domain logic
- API layer
- State management
- Form architecture
- Validation
- Error boundaries
- Loading states
- Empty states
- Reusable components
- Design system basics
- Environment variables
- Frontend security basics

Project:
- Production-style React Dashboard

---

# 29. Node.js + TypeScript

- Node runtime
- npm
- package.json
- modules
- filesystem
- path
- environment variables
- process
- events
- streams
- HTTP server
- async patterns
- logging
- configuration

Project:
- CLI Task Manager
- HTTP API server

---

# 30. Express + TypeScript

- Express setup
- Routes
- Controllers
- Middleware
- Request/Response
- Validation
- Error handling
- Services
- Repositories
- Logging
- API structure
- REST conventions
- Pagination
- Filtering
- Authentication middleware

Projects:
- Blog API
- Task API
- E-commerce API

---

# 31. SQL

- Relational model
- Tables
- Primary key
- Foreign key
- SELECT
- INSERT
- UPDATE
- DELETE
- WHERE
- ORDER BY
- GROUP BY
- JOIN
- Aggregate functions
- Subqueries
- Transactions
- Index basics

Project:
- Design database for E-commerce

---

# 32. PostgreSQL

- PostgreSQL setup
- schemas
- data types
- constraints
- indexes
- relationships
- migrations
- transactions
- performance basics

Project:
- Production-style relational database

---

# 33. Prisma

- Prisma setup
- schema
- models
- relations
- migrations
- CRUD
- filtering
- pagination
- transactions
- seed
- Prisma Client
- repository patterns

Project:
- Convert E-commerce API to PostgreSQL + Prisma

---

# 34. Authentication / Authorization

- Authentication vs Authorization
- Registration
- Login
- Password hashing
- Sessions
- Cookies
- JWT concepts
- Refresh tokens
- Logout
- Roles
- Permissions
- Protected routes
- Frontend auth state

Project:
- Authentication API
- Authenticated dashboard

---

# 35. Security

- Password security
- Input validation
- XSS
- CSRF
- SQL injection
- CORS
- Secure cookies
- Rate limiting
- Secrets
- Environment variables
- Security headers
- Dependency security
- Logging
- Threat modeling basics

Project:
- Security hardening of Journey E-commerce

---

# 36. Testing

- Unit testing
- Integration testing
- API testing
- Component testing
- E2E testing
- Test fixtures
- Mocking
- Coverage
- Test strategy

Project:
- Test Journey API and frontend

---

# 37. Docker

- Images
- Containers
- Dockerfile
- .dockerignore
- Volumes
- Networks
- Environment variables
- Docker Compose
- PostgreSQL container
- Multi-stage builds

Project:
- Containerize full-stack application

---

# 38. Deployment

- Production build
- Environment configuration
- Database deployment
- Domain concepts
- HTTPS
- Reverse proxy concepts
- Logs
- Backups
- Monitoring basics

Project:
- Deploy Journey application

---

# 39. CI/CD

- Pipeline concept
- GitHub Actions
- Install
- Lint
- Typecheck
- Test
- Build
- Docker build
- Deployment workflow
- Secrets
- Environment separation

Final:
- Automated pipeline for capstone

---

# 40. Micro Project Catalog

1. Counter
2. Calculator
3. Digital Clock
4. Modal
5. Accordion
6. Tabs
7. Form Validator
8. Todo
9. Quiz
10. Timer
11. Notes
12. Expense Tracker
13. Password Strength UI
14. Search Filter
15. Pagination UI
16. Shopping Cart
17. Theme Switcher
18. Dashboard Widgets

هر پروژه باید حداقل یک مهارت جدید + یک مهارت قبلی را ترکیب کند.

---

# 41. Skill Project Catalog

1. Portfolio
2. Landing Page
3. Responsive Dashboard
4. Blog UI
5. Movie Explorer
6. Weather Dashboard
7. Countries Explorer
8. Shopping Cart
9. React Dashboard
10. Blog API
11. Task API
12. E-commerce API
13. Authentication API

---

# 42. Journey Project A — E-commerce

این پروژه ستون اصلی مسیر Full-Stack است.

### Stage 1 — HTML
- Home
- Product list
- Product detail
- Cart page
- Checkout form

### Stage 2 — CSS
- Responsive layout
- Product cards
- Header
- Navigation
- Cart UI

### Stage 3 — JavaScript
- Cart state
- Search
- Filter
- Sort
- Form validation

### Stage 4 — TypeScript
- Product type
- Cart types
- Order types
- Utility functions

### Stage 5 — React
- Components
- State
- Routing
- Product data
- Cart

### Stage 6 — API
- Fetch products
- Loading/error states

### Stage 7 — Node/Express
- Product API
- Cart API
- Order API

### Stage 8 — PostgreSQL
Entities:
- User
- Product
- Category
- Cart
- CartItem
- Order
- OrderItem

### Stage 9 — Prisma
- schema
- migrations
- seed
- repositories

### Stage 10 — Auth
- register
- login
- logout
- roles

### Stage 11 — Security
- validation
- secure cookies/tokens
- rate limiting
- CORS
- security headers

### Stage 12 — Testing
- unit
- integration
- E2E

### Stage 13 — Docker
- frontend
- backend
- database

### Stage 14 — Deployment
- production configuration
- database
- HTTPS

### Stage 15 — CI/CD
- lint
- typecheck
- test
- build
- deploy

---

# 43. Journey Project B — LMS

Entities:
- User
- Course
- Lesson
- Enrollment
- Progress
- Quiz
- Question
- Result
- Role

Features:
- Course catalog
- Course detail
- Enrollment
- Lesson progress
- Quiz
- Dashboard
- Admin management

---

# 44. Journey Project C — Project Management

Entities:
- User
- Team
- Project
- Task
- Comment
- Notification
- Role
- Permission

Features:
- Teams
- Projects
- Kanban
- Tasks
- Comments
- Roles
- Notifications

---

# 45. Journey Project D — Blog Platform

Entities:
- User
- Post
- Category
- Tag
- Comment
- Like

Features:
- Editor
- Posts
- Search
- Categories
- Tags
- Comments
- Authentication
- Admin

---

# 46. Journey Project E — SaaS Dashboard

Entities:
- User
- Organization
- Membership
- Subscription
- Project
- Usage
- Invoice
- Role

Features:
- Multi-tenant architecture
- Dashboard
- Team management
- Usage
- Roles
- Billing concepts

---

# 47. Final Capstone

Student chooses one:

- E-commerce
- LMS
- Project Management
- Blog
- SaaS Dashboard

Minimum requirements:
- React + TypeScript
- Node.js + TypeScript
- Express
- PostgreSQL
- Prisma
- Authentication
- Authorization
- Validation
- Error handling
- Testing
- Docker
- Deployment
- CI/CD

---

# 48. Project Acceptance Criteria

هر پروژه باید:

- [ ] Functional requirements داشته باشد
- [ ] Technical requirements داشته باشد
- [ ] UI requirements داشته باشد
- [ ] Error states داشته باشد
- [ ] Empty states داشته باشد
- [ ] Validation داشته باشد
- [ ] Responsive باشد
- [ ] قابل اجرا بدون اینترنت در مرحله آموزشی باشد
- [ ] README داشته باشد
- [ ] ساختار فایل مشخص داشته باشد

برای پروژه‌های backend:
- [ ] API contract
- [ ] validation
- [ ] error format
- [ ] database schema
- [ ] seed data
- [ ] tests

---

# 49. Offline-First Content Rules

چون مخاطب ممکن است اینترنت نداشته باشد:

- همه محتوای اصلی باید local باشد.
- مثال‌ها نباید برای نمایش اولیه به CDN نیاز داشته باشند.
- وابستگی‌های آموزشی باید تا حد امکان local باشند.
- APIهای خارجی فقط در پروژه‌هایی استفاده شوند که هدف درس آن‌ها API است.
- اگر پروژه خارجی است، باید fallback یا mock داشته باشد.
- آموزش باید بدون login خارجی قابل مطالعه باشد.
- progress باید بتواند local ذخیره شود و بعداً sync شود.

---

# 50. Content Production Order

ترتیب تولید محتوا:

Phase 1:
- Web Foundations
- HTML
- CSS

Phase 2:
- JavaScript
- Browser/DOM
- TypeScript

Phase 3:
- Async JS
- HTTP/API
- Git

Phase 4:
- React
- Frontend Architecture

Phase 5:
- Node
- Express
- SQL
- PostgreSQL
- Prisma

Phase 6:
- Auth
- Security
- Testing

Phase 7:
- Docker
- Deployment
- CI/CD

---

# 51. First Production Batch

برای اینکه قبل از تولید هزاران صفحه کیفیت را بررسی کنیم:

### HTML
5 درس اول:
1. HTML چیست؟
2. ساختار سند
3. Elements
4. Headings/Paragraphs
5. Text Formatting

### همراه:
- 5 Examples
- 5 Playgrounds
- 10 Exercises
- 10 Quiz questions
- 2 Challenges
- 1 Mini Project

بعد از تأیید UX، همین استاندارد برای کل curriculum استفاده شود.

---

# 52. Content Validation Pipeline

قبل از انتشار:

1. Markdown validation
2. Frontmatter validation
3. Broken link check
4. Code block language check
5. Duplicate ID check
6. Quiz answer validation
7. Exercise schema validation
8. Project dependency validation
9. Lesson prerequisite validation
10. Next/previous lesson validation
11. Playground validation
12. Offline dependency validation

---

# 53. Definition of Done — Lesson

یک Lesson زمانی Done است که:

- متن نهایی است
- مثال اجرا می‌شود
- Playground اجرا می‌شود
- Exercise دارد
- Quiz دارد
- Challenge دارد یا دلیل مشخصی برای نداشتن آن وجود دارد
- prerequisite ثبت شده
- next lesson ثبت شده
- پروژه مرتبط مشخص است
- validation پاس شده
- mobile layout بررسی شده

---

# 54. Definition of Done — Module

یک Module زمانی Done است که:

- همه lessonها کامل‌اند
- checkpoint دارد
- حداقل یک project دارد
- prerequisiteها درست‌اند
- progression منطقی است
- skill mapping ثبت شده
- content validation پاس شده

---

# 55. Definition of Done — Journey

Journey زمانی Done است که:

- milestoneها مشخص‌اند
- هر milestone به درس‌ها وصل است
- project state بین milestoneها حفظ می‌شود
- acceptance criteria دارد
- testing stage دارد
- deployment stage دارد
- final README template دارد

---

# 56. Golden Rule

دانش‌آموز نباید فقط «درس بخواند».

در هر بخش باید این چرخه تکرار شود:

Learn
→ See
→ Try
→ Solve
→ Debug
→ Build
→ Extend
→ Ship

این اصل باید در طراحی UI، محتوا، progress، پروژه‌ها و ارزیابی حفظ شود.
