# SITE-ARCHITECTURE.md

## هدف سند

این سند معماری محصول آموزشی را تعریف می‌کند تا Curriculum بدون تغییرات پراکنده در کد پیاده‌سازی شود.

اصول:
- Full-Stack only در فاز فعلی.
- Persian-first و RTL.
- Offline-first.
- Content-driven.
- TypeScript-first.
- پروژه‌محور.
- قابلیت توسعه بدون بازنویسی هسته.
- Lesson، Exercise، Quiz، Playground و Project باید موجودیت‌های جدا ولی قابل اتصال باشند.

---

# 1. Product Areas

```text
Public
├── Home
├── Roadmap
├── Courses
├── Projects
└── About

Learning
├── Course
├── Module
├── Lesson
├── Exercise
├── Quiz
├── Challenge
├── Playground
└── Progress

Projects
├── Project Catalog
├── Project Detail
├── Project Workspace
├── Checkpoints
└── Journey

Account
├── Register
├── Login
├── Profile
├── Progress
└── Settings

Admin / Content
├── Content Management
├── Course Management
├── Project Management
└── User Progress
```

---

# 2. Route Map

## Public

```text
/
 /roadmap
 /courses
 /courses/[course]
 /projects
 /projects/[project]
```

## Learning

```text
/learn/[course]
/learn/[course]/[module]
/learn/[course]/[module]/[lesson]
/learn/[course]/[module]/[lesson]/exercise
/learn/[course]/[module]/[lesson]/quiz
/learn/[course]/[module]/[lesson]/challenge
```

## Project

```text
/projects/[project]
/projects/[project]/workspace
/projects/[project]/checkpoint/[checkpoint]
/journeys/[journey]
/journeys/[journey]/checkpoint/[checkpoint]
```

## Account

```text
/register
/login
/profile
/progress
/settings
```

## Future Admin

```text
/admin
/admin/courses
/admin/modules
/admin/lessons
/admin/projects
/admin/users
```

---

# 3. Homepage

Homepage باید Learning Platform باشد، نه فقط معرفی سایت.

## Sections

1. Hero
2. Continue Learning
3. Full-Stack Roadmap
4. Current Progress
5. Featured Projects
6. Journey Projects
7. Recent Lessons
8. Practice CTA

## مثال ساختار

```text
Hero
  ↓
Continue Learning
  ↓
Roadmap
  ↓
Current Project
  ↓
Featured Projects
  ↓
Journey Projects
```

---

# 4. Roadmap Page

Route:

```text
/roadmap
```

نمایش:

```text
Full-Stack Developer

✓ Web Foundations
✓ HTML
→ CSS
○ JavaScript
○ TypeScript
○ Browser
...
```

هر Module:

- title
- description
- estimated lesson count
- progress
- completed projects
- locked/unlocked state

---

# 5. Course Page

مثلاً:

```text
/courses/javascript
```

ساختار:

```text
Course Header
Course Description
Progress

Modules
├── Fundamentals
├── Intermediate
├── Advanced
└── Projects

Exercises
Quizzes
Challenges
Projects
```

---

# 6. Lesson Page

Route:

```text
/learn/javascript/core/variables
```

Layout:

```text
┌──────────────────────────────────────────┐
│ Header                                   │
├─────────────┬────────────────────────────┤
│ Sidebar     │ Lesson Content             │
│             │                            │
│ Modules     │ Explanation                │
│ Lessons     │ Example                    │
│             │ Playground                 │
│             │ Exercise                   │
│             │ Quiz                       │
│             │ Challenge                  │
│             │ Project Connection          │
│             │                            │
│             │ Previous | Next            │
└─────────────┴────────────────────────────┘
```

---

# 7. Lesson Content Model

Lesson نباید مستقیماً داخل Component نوشته شود.

محتوا باید Data-driven باشد.

مثال مفهومی:

```ts
type Lesson = {
  id: string
  slug: string
  title: string
  courseId: string
  moduleId: string
  level: "beginner" | "intermediate" | "advanced"
  order: number
  content: string
  examples?: Example[]
  exercises?: Exercise[]
  quiz?: Quiz
  challenge?: Challenge
  projectLinks?: string[]
  prerequisites?: string[]
}
```

---

# 8. Content Directory

ساختار پیشنهادی:

```text
content/
├── 00-web-foundations/
├── 01-html/
├── 02-css/
├── 03-javascript/
├── 04-browser/
├── 05-typescript/
├── 06-async/
├── 07-api/
├── 08-git/
├── 09-react/
├── 10-frontend-architecture/
├── 11-node/
├── 12-express/
├── 13-sql/
├── 14-postgresql/
├── 15-prisma/
├── 16-auth/
├── 17-security/
├── 18-testing/
├── 19-docker/
├── 20-deployment/
└── 21-cicd/
```

---

# 9. Lesson Directory

هر Lesson:

```text
01-variables/
├── lesson.md
├── examples/
│   ├── basic.ts
│   └── example-2.ts
├── exercises.json
├── quiz.json
├── challenge.json
└── playground.json
```

در صورت نیاز:

```text
assets/
```

---

# 10. Projects Directory

پروژه‌ها نیز Content هستند:

```text
projects/
├── micro/
├── skill/
└── journeys/
```

مثال:

```text
projects/
└── journeys/
    └── ecommerce/
        ├── project.md
        ├── requirements.json
        ├── checkpoints/
        │   ├── 01-html.json
        │   ├── 02-css.json
        │   ├── 03-javascript.json
        │   ├── 04-typescript.json
        │   ├── 05-react.json
        │   ├── 06-api.json
        │   ├── 07-backend.json
        │   ├── 08-database.json
        │   ├── 09-auth.json
        │   ├── 10-testing.json
        │   ├── 11-docker.json
        │   ├── 12-deployment.json
        │   └── 13-cicd.json
        └── assets/
```

---

# 11. Playground

Playground باید تا حد ممکن محلی باشد.

## Frontend Playground

برای:
- HTML
- CSS
- JavaScript
- TypeScript
- React

## اجرای کد

اصول:
- Sandbox
- محدود کردن دسترسی
- timeout
- جلوگیری از دسترسی غیرضروری به سیستم
- خروجی قابل مشاهده
- Console output

در فاز اول، Playground را ساده نگه می‌داریم و بعد قابلیت‌های آن را توسعه می‌دهیم.

---

# 12. Exercise Engine

Exercise باید Data-driven باشد.

مثال:

```ts
type Exercise = {
  id: string
  type:
    | "multiple-choice"
    | "fill-blank"
    | "code"
    | "true-false"
    | "reorder"
  title: string
  instructions: string
  starterCode?: string
  expected?: unknown
  hints?: string[]
}
```

---

# 13. Quiz Engine

Quiz مدل جداگانه داشته باشد:

```ts
type Quiz = {
  id: string
  lessonId: string
  questions: QuizQuestion[]
}
```

Question:

```ts
type QuizQuestion = {
  id: string
  type: "single" | "multiple" | "true-false"
  question: string
  options?: string[]
  answer: string | string[]
  explanation?: string
}
```

پاسخ صحیح باید در سمت Client قابل استخراج نباشد اگر Quiz به حساب کاربری/ارزیابی واقعی وابسته باشد.

---

# 14. Progress System

Progress یکی از اجزای اصلی محصول است.

## موارد قابل ذخیره

- Lesson completed
- Exercise completed
- Quiz result
- Challenge status
- Project checkpoint
- Course progress
- Journey progress

مدل مفهومی:

```ts
type UserProgress = {
  userId: string
  lessonId: string
  status: "started" | "completed"
  updatedAt: string
}
```

---

# 15. Project Checkpoint System

هر Journey چند Checkpoint دارد.

مثلاً:

```text
E-commerce

Checkpoint 1
HTML structure

Checkpoint 2
CSS / Responsive

Checkpoint 3
JavaScript

Checkpoint 4
TypeScript

Checkpoint 5
React

Checkpoint 6
API

Checkpoint 7
Backend

Checkpoint 8
Database

Checkpoint 9
Authentication

Checkpoint 10
Testing

Checkpoint 11
Docker

Checkpoint 12
Deployment

Checkpoint 13
CI/CD
```

هر Checkpoint باید داشته باشد:

- هدف
- Requirements
- Starter state
- Expected features
- Optional bonus
- Completion criteria

---

# 16. Navigation

## Desktop

```text
Top Header
├── Logo
├── Learn
├── Projects
├── Roadmap
├── Search
└── Account
```

## Lesson

```text
Left Sidebar
├── Course
├── Module
└── Lessons
```

در RTL، Sidebar در سمت راست قرار می‌گیرد.

---

# 17. Search

Search باید محلی باشد.

قابل جستجو:

- Lessons
- Courses
- Projects
- Concepts
- Exercises

هدف:
> دانشجو بدون اینترنت بتواند Documentation داخل پلتفرم را جستجو کند.

بعداً:
- fuzzy search
- tags
- filtering
- keyboard shortcut

---

# 18. Offline Architecture

اصل:

```text
Browser
   ↓
Next.js / Local App
   ↓
Local Content
   ↓
Local Assets
   ↓
Local Exercise Engine
   ↓
Local Playground
```

موارد وابسته به اینترنت تا حد امکان از مسیر اصلی Learning حذف می‌شوند.

## Assets

```text
public/
├── fonts/
├── icons/
├── images/
├── logos/
└── examples/
```

هیچ Lesson نباید برای نمایش محتوای اصلی خود به CDN خارجی وابسته باشد.

---

# 19. Authentication Architecture

در فاز آموزشی اولیه:
- Register
- Login
- Logout
- Session
- User profile
- Progress persistence

بعداً:
- Email verification
- Password reset
- Roles
- Permissions

User model مفهومی:

```ts
type User = {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}
```

---

# 20. Database Architecture

در نسخه Full-Stack نهایی:

```text
User
Course
Module
Lesson
Exercise
Quiz
Question
Project
Journey
Checkpoint
Progress
QuizAttempt
ProjectProgress
```

Relations باید بعد از تثبیت Content Model نهایی شوند.

---

# 21. Suggested Application Structure

ساختار پیشنهادی برای Next.js/TypeScript:

```text
app/
├── page.tsx
├── roadmap/
├── courses/
├── learn/
├── projects/
├── journeys/
├── login/
├── register/
├── profile/
├── progress/
└── api/
    └── ...

components/
├── layout/
├── navigation/
├── lesson/
├── playground/
├── exercise/
├── quiz/
├── project/
├── progress/
└── ui/

lib/
├── content/
├── auth/
├── db/
├── progress/
├── validation/
└── utils/

content/
├── courses/
└── projects/

public/
├── fonts/
├── icons/
├── images/
└── examples/
```

---

# 22. Core Components

## Layout

- AppShell
- Header
- Sidebar
- Footer
- Breadcrumbs

## Learning

- CourseHeader
- ModuleList
- LessonView
- LessonNavigation
- LessonProgress
- ConceptBox
- NoteBox
- WarningBox

## Practice

- Playground
- CodeEditor
- OutputPanel
- Exercise
- Quiz
- Challenge
- Hint

## Projects

- ProjectCard
- ProjectOverview
- RequirementsList
- CheckpointList
- CheckpointView
- ProjectProgress
- JourneyTimeline

---

# 23. Design System

رنگ و ظاهر باید ساده و آموزشی باشد.

اصول:

- خوانایی بالا
- RTL-first
- Code-first
- Contrast مناسب
- Responsive
- Mobile-friendly
- Accessibility

Typography:

- Persian UI font محلی
- Monospace font محلی برای code

از Google Fonts یا CDN خارجی برای UI اصلی استفاده نشود.

---

# 24. Code Blocks

Code Block باید امکانات زیر را داشته باشد:

- syntax highlighting
- copy
- language label
- line numbers در صورت نیاز
- responsive horizontal scroll
- اجرای کد در Playground در صورت پشتیبانی

---

# 25. Lesson UX

بالای Lesson:

```text
JavaScript
> Fundamentals
> Variables
```

وسط:

```text
Title
Goal
Explanation
Example
Try It
Exercise
Quiz
Challenge
```

پایین:

```text
Previous Lesson
Complete Lesson
Next Lesson
```

---

# 26. Project UX

صفحه پروژه:

```text
Project Title
Difficulty
Skills
Estimated effort

Goal

Requirements

Progress

Checkpoints

Resources

Start Project
```

Checkpoint:

```text
Objective

Requirements
□ ...
□ ...
□ ...

Hints

Bonus

Complete Checkpoint
```

---

# 27. Difficulty

هر Content باید Difficulty داشته باشد:

```ts
type Difficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
```

Projectها:

```ts
type ProjectDifficulty =
  | "easy"
  | "medium"
  | "hard"
  | "capstone"
```

---

# 28. Tags

برای Search و Recommendation:

```text
html
css
javascript
typescript
react
node
express
sql
postgresql
prisma
auth
security
testing
docker
deployment
```

مثال:

```text
Project:
E-commerce

tags:
react
typescript
api
postgresql
prisma
auth
```

---

# 29. Recommendation System — فاز بعد

بعداً سیستم بتواند بگوید:

```text
You completed:
JavaScript Arrays

Recommended:
→ Array Methods Challenge
→ Todo Project
→ Shopping Cart Project
```

یا:

```text
You are ready for:
TypeScript

Prerequisites:
✓ JavaScript Fundamentals
✓ Objects
✓ Arrays
✓ Functions
```

این سیستم فعلاً در فاز اول ساده و rule-based باشد.

---

# 30. Content IDs

IDها باید پایدار باشند.

مثال:

```text
course.javascript
module.javascript.fundamentals
lesson.javascript.variables
project.journey.ecommerce
checkpoint.ecommerce.typescript
```

از IDهای وابسته به ترتیب فایل‌ها استفاده نشود.

---

# 31. Content Validation

قبل از Build باید Content Validation انجام شود:

- Lesson ID unique
- slug unique
- prerequisite موجود
- projectLink معتبر
- Quiz answer معتبر
- exercise schema معتبر
- module وجود داشته باشد
- course وجود داشته باشد

---

# 32. TypeScript Content Contracts

تمام Content JSON باید Schema/Type مشخص داشته باشد.

مثلاً:

```text
content/
  lesson
  exercise
  quiz
  challenge
  project
  checkpoint
```

و TypeScript باید هنگام Load شدن آن‌ها را validate کند.

---

# 33. Rendering Strategy

Lesson content ترجیحاً Markdown-based باشد.

```text
Markdown
   ↓
Parser
   ↓
Sanitization
   ↓
Custom Components
   ↓
Rendered Lesson
```

برای عناصر تعاملی:

```text
:::playground
:::exercise
:::quiz
:::note
:::challenge
```

یا مدل structured content در صورت نیاز.

---

# 34. Project Code Separation

کد پروژه‌های آموزشی نباید با کد خود پلتفرم مخلوط شود.

سه محیط:

```text
Platform Code
Student Project Code
Playground Code
```

هر کدام sandbox و lifecycle خود را داشته باشند.

---

# 35. Backend Boundaries

APIهای اصلی:

```text
/api/auth/*
/api/progress/*
/api/quiz/*
/api/projects/*
/api/search/*
```

در آینده:

```text
/api/admin/*
```

---

# 36. Data Flow

## Lesson

```text
URL
 ↓
Lesson Loader
 ↓
Content Validation
 ↓
Lesson Data
 ↓
Lesson Components
```

## Progress

```text
User
 ↓
Complete Lesson
 ↓
Progress API
 ↓
Database
 ↓
Roadmap / Project Progress
```

---

# 37. Offline Progress

در حالت بدون Backend:

```text
LocalStorage / IndexedDB
```

برای:
- Lesson completion
- Exercise state
- Local project progress

بعد از Login:

```text
Local Progress
      ↓
Sync
      ↓
Server Progress
```

Conflict resolution باید در فاز بعد طراحی شود.

---

# 38. Performance

هدف:
- سریع بودن Lesson navigation
- lazy loading برای editor
- lazy loading برای heavy playground
- cache content
- static content generation در صورت امکان
- کم کردن JavaScript غیرضروری

---

# 39. Accessibility

الزام:

- keyboard navigation
- focus states
- semantic HTML
- accessible forms
- labels
- readable contrast
- screen-reader friendly structure
- code blocks قابل استفاده با keyboard

---

# 40. Security

برای Platform:

- input validation
- XSS protection
- CSRF protection در صورت استفاده از cookie auth
- secure cookies
- password hashing
- rate limiting
- secret management
- sandboxing code execution
- عدم اعتماد به client progress

---

# 41. Development Phases

## Phase A — Content Engine

- Course
- Module
- Lesson
- Markdown
- Sidebar
- Navigation

## Phase B — Practice Engine

- Playground
- Exercise
- Quiz
- Challenge

## Phase C — Project Engine

- Projects
- Checkpoints
- Journey
- Project Progress

## Phase D — User System

- Register
- Login
- Progress
- Profile

## Phase E — Full-Stack Platform

- PostgreSQL
- Prisma
- API
- Auth
- Progress persistence

## Phase F — Production

- Testing
- Docker
- Deployment
- CI/CD

---

# 42. Definition of Done برای هر Lesson

یک Lesson زمانی کامل است که:

- [ ] Title
- [ ] Learning objective
- [ ] Original Persian explanation
- [ ] Example
- [ ] Playground یا مثال اجرایی در صورت مناسب بودن
- [ ] Exercise
- [ ] Quiz
- [ ] Challenge در صورت مناسب بودن
- [ ] Prerequisites
- [ ] Project connection
- [ ] Previous/Next navigation
- [ ] Metadata
- [ ] Content validation

---

# 43. Definition of Done برای هر Project

- [ ] Goal
- [ ] Difficulty
- [ ] Skills
- [ ] Requirements
- [ ] Starter state
- [ ] Checkpoints
- [ ] Completion criteria
- [ ] Optional bonus
- [ ] Related lessons
- [ ] Journey connection
- [ ] README specification

---

# 44. Definition of Done برای هر Journey

- [ ] Product definition
- [ ] Initial HTML version
- [ ] CSS version
- [ ] JavaScript version
- [ ] TypeScript migration
- [ ] React version
- [ ] API integration
- [ ] Backend
- [ ] Database
- [ ] Authentication
- [ ] Security
- [ ] Tests
- [ ] Docker
- [ ] Deployment
- [ ] CI/CD

---

# 45. Non-goals فاز فعلی

فعلاً وارد این حوزه‌ها نمی‌شویم:

- Mobile Development
- Native Apps
- Data Science
- Machine Learning
- Game Development
- DevOps مستقل خارج از نیاز Full-Stack
- زبان‌های برنامه‌نویسی غیرضروری برای مسیر Full-Stack

---

# 46. اصل نهایی معماری

پلتفرم باید به شکلی ساخته شود که اضافه کردن این موارد بدون تغییر هسته ممکن باشد:

```text
New Course
New Lesson
New Exercise
New Quiz
New Challenge
New Project
New Journey
```

یعنی:

> Content باید تا حد ممکن از Application Logic جدا باشد.

این اصل، مهم‌ترین تصمیم معماری Content Platform است.
