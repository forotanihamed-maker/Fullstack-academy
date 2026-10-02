# IMPLEMENTATION ROADMAP
## Full-Stack Persian Offline Learning Platform

Status: Pre-implementation specification

---

# 1. Target Stack

Frontend / Platform:
- Next.js
- TypeScript
- React
- CSS

Content:
- Markdown / structured JSON
- Local content repository

Backend:
- Next.js API routes initially
- Node.js + TypeScript architecture

Database:
- PostgreSQL
- Prisma

Authentication:
- Application-owned auth
- Secure password hashing
- Session/token strategy defined before production

Testing:
- Unit
- Integration
- E2E

DevOps:
- Docker
- Docker Compose
- CI/CD

---

# 2. Product Architecture

```text
App Shell
├── Header
├── Sidebar
├── Lesson Navigation
├── Main Content
├── Practice Panel
├── Progress Panel
└── Project Panel
```

Routes:

```text
/
 /learn
 /learn/[module]
 /learn/[module]/[lesson]
 /projects
 /projects/[project]
 /journeys
 /journeys/[journey]
 /practice
 /progress
 /login
 /register
 /profile
 /admin
```

---

# 3. Content Architecture

```text
content/
  00-web-foundations/
  01-html/
  02-css/
  03-javascript/
  04-browser/
  05-typescript/
  06-async-js/
  07-http-api/
  08-git/
  09-react/
  10-frontend-architecture/
  11-node/
  12-express/
  13-sql/
  14-postgresql/
  15-prisma/
  16-auth/
  17-security/
  18-testing/
  19-docker/
  20-deployment/
  21-cicd/
```

Per module:

```text
module/
  module.json
  lessons/
  exercises/
  quizzes/
  challenges/
  projects/
```

---

# 4. Database Core

Initial entities:

```text
User
Profile
Progress
LessonProgress
ExerciseAttempt
QuizAttempt
ProjectProgress
ProjectSubmission
JourneyProgress
Achievement
Session
```

Later:

```text
Course
Enrollment
Certificate
Notification
```

---

# 5. Content vs User Data

Content is version-controlled and mostly static.

User data belongs in PostgreSQL.

Content:
- Lessons
- Examples
- Exercises
- Quizzes
- Challenges
- Project definitions

Database:
- users
- progress
- attempts
- project state
- submissions
- achievements

---

# 6. Progress Model

Lesson status:

```text
locked
available
in-progress
completed
```

Exercise:

```text
not-started
attempted
passed
```

Project:

```text
not-started
in-progress
milestone-complete
submitted
completed
```

---

# 7. Progress Calculation

Never use only lesson count.

Track:

```text
lesson completion
exercise completion
quiz score
challenge completion
project milestone completion
journey completion
```

Suggested visual:

```text
Module Progress
Lessons     ███████░░░
Practice    █████░░░░░
Projects    ████░░░░░░
```

---

# 8. Lesson UI

Desktop:

```text
┌────────────┬─────────────────────────────┐
│ Sidebar    │ Lesson                      │
│            │                             │
│ Module     │ Explanation                 │
│ Lessons    │ Example                     │
│ Progress   │                             │
│            │ ┌─────────────────────────┐ │
│            │ │ Playground              │ │
│            │ └─────────────────────────┘ │
│            │                             │
│            │ Exercise                   │
│            │ Quiz                       │
│            │ Challenge                  │
└────────────┴─────────────────────────────┘
```

Mobile:
- Sidebar becomes drawer
- Content full width
- Code blocks horizontally scrollable
- Practice panels stack vertically

---

# 9. Project Engine

A project is not one page of instructions.

It consists of:

```text
Project
├── Brief
├── Requirements
├── Milestones
├── Starter
├── Hints
├── Acceptance Criteria
├── Submission
└── Reflection
```

Each milestone should link back to lessons.

---

# 10. Journey Engine

Example:

```text
E-commerce Journey

M1 HTML
  ↓
M2 CSS
  ↓
M3 JavaScript
  ↓
M4 TypeScript
  ↓
M5 React
  ↓
M6 API
  ↓
M7 Express
  ↓
M8 PostgreSQL
  ↓
M9 Prisma
  ↓
M10 Auth
  ↓
M11 Security
  ↓
M12 Testing
  ↓
M13 Docker
  ↓
M14 Deployment
  ↓
M15 CI/CD
```

Important:
The student does not start a new unrelated project at every stage.

The same product evolves.

---

# 11. Playground Architecture

Phase 1:
- HTML/CSS/JS browser sandbox
- iframe or isolated execution

Phase 2:
- TypeScript compilation in browser or controlled local runner

Phase 3:
- React/TSX playground

Phase 4:
- Backend playgrounds using local server/runtime

Security:
- Never execute arbitrary student code inside the main server process.
- Use sandboxed execution.
- Separate preview runtime from application runtime.

---

# 12. Exercise Engine

Support:

- Multiple choice
- Fill in code
- Predict output
- Fix code
- Write code
- Drag/order where useful

Every exercise returns:

```text
pass/fail
feedback
hints
next action
```

Do not reveal the full solution immediately unless requested.

---

# 13. Quiz Engine

Quiz should support:

- single answer
- multiple answer
- true/false

After submission:

```text
Score
Correct answers
Explanation
Recommended review
```

---

# 14. Offline Strategy

The application should be usable from a local network or local machine.

Required:

- Local assets
- Local fonts where licensing permits
- Local content
- Local icons
- Local examples
- No required external analytics
- No required external CDN

Optional network features:
- sync
- GitHub integration
- external API projects
- deployment helpers

---

# 15. PWA / Offline

Recommended:

```text
Service Worker
Cache:
- app shell
- content
- static assets
- selected project files
```

Offline-first priority:

1. Read lessons
2. Run simple playgrounds
3. Complete exercises
4. Save progress locally
5. Sync when online

---

# 16. Local Progress Sync

Use:

```text
localStorage / IndexedDB
        ↓
Offline queue
        ↓
Server sync
        ↓
Conflict resolution
```

Do not make login mandatory for learning.

---

# 17. Accessibility

Minimum:

- keyboard navigation
- semantic HTML
- visible focus
- labels for inputs
- sufficient contrast
- reduced-motion support
- screen-reader-friendly headings
- code blocks accessible by keyboard

---

# 18. Search

Phase 1:
- local client-side search

Index:
- lesson title
- description
- concepts
- tags
- project names

Later:
- server-side full text search

---

# 19. Navigation

Every lesson must provide:

```text
Previous
Current
Next
```

And contextual:

```text
Prerequisites
Related lessons
Related projects
```

---

# 20. Components

Core components:

```text
AppShell
Header
Sidebar
LessonView
LessonNavigation
CodeBlock
Playground
Exercise
Quiz
Challenge
ProjectCard
ProjectView
JourneyView
ProgressBar
Checkpoint
Search
Breadcrumbs
```

---

# 21. Admin / Content Tools

Future admin capabilities:

- content preview
- schema validation
- lesson ordering
- quiz validation
- broken-link validation
- project dependency validation
- draft/published state

Content authors should not need database migrations to edit lessons.

---

# 22. Validation CLI

Create:

```bash
npm run content:validate
```

Checks:

- duplicate IDs
- missing fields
- invalid references
- invalid quiz answers
- broken project links
- broken lesson links
- missing prerequisites
- invalid language blocks

---

# 23. Development Phases

## Phase A — Foundation

- clean project structure
- content loader
- route structure
- lesson renderer
- navigation

## Phase B — Practice

- playground
- exercises
- quizzes
- challenges

## Phase C — Projects

- project engine
- milestones
- Journey engine

## Phase D — Progress

- local progress
- database progress
- sync

## Phase E — Auth

- registration
- login
- sessions
- protected progress

## Phase F — Full-Stack backend

- PostgreSQL
- Prisma
- API
- repositories
- services

## Phase G — Production

- testing
- Docker
- deployment
- CI/CD

---

# 24. Current ZIP Migration Strategy

Do not rewrite everything at once.

Step 1:
Audit current project.

Step 2:
Map existing files to target architecture.

Step 3:
Preserve working components where compatible.

Step 4:
Refactor content loading.

Step 5:
Refactor lesson routes.

Step 6:
Upgrade exercise/playground engines.

Step 7:
Add project/journey engine.

Step 8:
Add progress.

Step 9:
Add auth/database.

Step 10:
Add production tooling.

---

# 25. Audit Checklist for Existing ZIP

Before code changes:

- [ ] package.json
- [ ] Next.js version
- [ ] React version
- [ ] TypeScript configuration
- [ ] CSS architecture
- [ ] route architecture
- [ ] content loader
- [ ] lesson parser
- [ ] playground implementation
- [ ] exercise implementation
- [ ] quiz implementation
- [ ] Prisma schema
- [ ] auth implementation
- [ ] database connection
- [ ] error handling
- [ ] mobile UI
- [ ] accessibility
- [ ] build
- [ ] lint
- [ ] typecheck

---

# 26. Build Gates

No phase moves forward until:

### Gate 1
App builds.

### Gate 2
Five HTML lessons work.

### Gate 3
Exercises and quizzes work.

### Gate 4
Playground works offline.

### Gate 5
Project milestones work.

### Gate 6
Progress persists.

### Gate 7
Auth works.

### Gate 8
Database works.

### Gate 9
Journey project works end-to-end.

### Gate 10
Production build + Docker + CI passes.

---

# 27. First Implementation Target

The first real release target should be:

```text
Web Foundations
+
HTML
+
CSS
+
Basic JavaScript
```

with:

- lesson navigation
- code examples
- playground
- exercises
- quizzes
- mini projects
- local progress

Do not wait for the entire Full-Stack curriculum before releasing this slice.

---

# 28. First Journey Slice

Build the first part of E-commerce:

```text
HTML product pages
      ↓
CSS responsive shop
      ↓
JS cart
      ↓
TS typed cart
      ↓
React cart
```

This validates the core educational idea before backend complexity is introduced.

---

# 29. Release Strategy

Release in vertical slices.

Bad:

```text
Write 500 lessons
then build UI
```

Good:

```text
5 lessons
+ playground
+ exercise
+ quiz
+ project
+ progress
+ QA
```

Then repeat.

---

# 30. Immediate Next Development Sequence

1. Audit current ZIP
2. Establish target folder structure
3. Implement content schema
4. Implement content validator
5. Convert first five HTML lessons
6. Improve lesson UI
7. Verify playground
8. Add exercise/quiz flow
9. Add first mini project
10. Add first Journey milestone
11. Add local progress
12. Run build/typecheck/lint
13. Only then scale content

---

# 31. Non-Negotiable Product Principles

1. Learning first.
2. Project-driven progression.
3. Same project evolves across technologies.
4. Offline by default.
5. Original Persian content.
6. Practice is part of every lesson.
7. Progress is meaningful, not decorative.
8. No technology is taught without a reason to use it.
9. Production practices appear gradually.
10. The final goal is shipping a real application.
