# Audit Report — Existing Full-Stack Academy

## Scope
این Audit پروژه‌ی موجود `app-typescript-auth` را با اسناد نهایی پروژه مقایسه می‌کند:
- FULLSTACK-CURRICULUM
- SITE-ARCHITECTURE
- CONTENT-SPECIFICATION
- IMPLEMENTATION-ROADMAP
- QA-CONTENT-GOVERNANCE

## Executive Summary

پروژه‌ی موجود یک MVP قابل تشخیص دارد: Next.js + TypeScript، Markdown content، Quiz، Exercise، Playground، Prisma/PostgreSQL و ثبت‌نام.

اما قبل از این اصلاح، ساختار آن هنوز با معماری نهایی فاصله داشت. مهم‌ترین شکاف‌ها:

1. curriculum واقعی با curriculum نهایی یکسان نبود.
2. content loader بدون type model مشخص کار می‌کرد.
3. content validation وجود نداشت.
4. پروژه‌ها و Journey engine در content model وجود نداشت.
5. progress آموزشی وجود نداشت.
6. Exercise کد دانشجو را با `new Function` در context اصلی صفحه اجرا می‌کرد.
7. authentication فقط registration بود و session/login هنوز وجود ندارد.
8. وابستگی‌های npm در محیط Audit نصب نبودند؛ تلاش برای `npm ci` به timeout خورد، بنابراین build نهایی در این محیط قابل تأیید نیست.
9. محتوای فعلی HTML/CSS از نظر حجم شروع خوبی دارد، اما هنوز طبق Content Specification به lessonهای کامل با metadata، challenge و project mapping تبدیل نشده است.

---

# 1. What Was Already Good

- Next.js + React + TypeScript انتخاب شده بود.
- محتوای Markdown از UI جدا بود.
- Quiz و Exercise و Playground وجود داشت.
- Playground از iframe sandbox استفاده می‌کرد.
- Prisma schema اولیه وجود داشت.
- ثبت‌نام با validation و password hashing پیاده‌سازی شده بود.
- responsive layout و RTL در نظر گرفته شده بود.
- HTML و CSS محتوای اولیه‌ی قابل استفاده داشتند.

---

# 2. Critical Issues Found

## P0 — Unsafe Exercise Execution

قبل از اصلاح، `components/Exercise.tsx` از `new Function(...)` مستقیماً در context اصلی React استفاده می‌کرد.

این با اصل sandboxing سازگار نبود و اجرای کد دانشجو نباید در application context اصلی انجام شود.

### اصلاح
Exercise اکنون داخل iframe با `sandbox="allow-scripts"` اجرا می‌شود و نتیجه با `postMessage` برمی‌گردد.

---

## P0 — Build Verification Blocked by Missing Dependencies

در اولین typecheck، خطاهای متعدد `Cannot find module` دیده شد؛ علت این بود که `node_modules` وجود نداشت.

تلاش برای `npm ci` انجام شد، اما عملیات در محیط اجرایی به timeout خورد.

بنابراین:
- content validation تأیید شده است.
- static source audit انجام شده است.
- build/typecheck نهایی هنوز باید در محیطی با دسترسی نصب dependency اجرا شود.

این مورد به‌عنوان limitation گزارش ثبت شده و نباید به‌عنوان «build موفق» گزارش شود.

---

## P1 — Curriculum Drift

`content/sections.json` قدیمی شامل Next.js و ترتیب متفاوتی از مسیر نهایی بود.

### اصلاح
فهرست canonical به مسیر زیر تغییر کرد:

Web Foundations
→ HTML
→ CSS
→ JavaScript
→ Browser/DOM
→ TypeScript
→ Async JS
→ HTTP/API
→ Git/GitHub
→ React
→ Frontend Architecture
→ Node
→ Express
→ SQL
→ PostgreSQL
→ Prisma
→ Auth
→ Security
→ Testing
→ Docker
→ Deployment
→ CI/CD

---

## P1 — Weak Content Model

قبل از اصلاح، loader عمدتاً title/content/quiz/exercise/playground را برمی‌گرداند و metadata استاندارد lesson وجود نداشت.

### اصلاح
`lib/content.ts` اکنون مدل‌های typed برای:
- Lesson
- LessonSummary
- Project
- Milestone

دارد و metadataهای زیر را پشتیبانی می‌کند:
- difficulty
- estimatedMinutes
- objectives
- concepts
- prerequisites
- relatedLessons
- relatedProjects
- nextLesson

---

## P1 — No Content Validation

قبل از اصلاح command اعتبارسنجی محتوای مستقل وجود نداشت.

### اصلاح
اضافه شد:

```bash
npm run content:validate
```

این validator فعلاً موارد زیر را بررسی می‌کند:
- JSON validity
- section IDs
- duplicate IDs
- project required fields
- duplicate milestone IDs
- lesson auxiliary JSON files
- frontmatter warnings

نتیجه‌ی فعلی:

```text
Content validation passed. 0 warning(s).
```

---

## P1 — No Project Engine

قبل از اصلاح پروژه‌ها در مدل content وجود نداشتند.

### اصلاح
یک Project model و صفحه‌ی project اضافه شد و اولین Journey واقعی ثبت شد:

`journey-ecommerce`

Milestones فعلی:
1. HTML
2. CSS
3. JavaScript
4. TypeScript
5. React

مراحل Backend، Database، Auth، Security، Testing، Docker، Deployment و CI/CD در curriculum تعریف شده‌اند و در مرحله‌ی بعد به milestoneهای اجرایی Journey اضافه می‌شوند.

---

## P1 — No Local Learning Progress

قبل از اصلاح completion درس وجود نداشت.

### اصلاح
`LessonProgress` اضافه شد.

نسخه‌ی فعلی:
- localStorage
- per-device
- offline-friendly

نسخه‌ی بعدی باید به مدل PostgreSQL و sync متصل شود.

---

# 3. Authentication Status

Registration موجود بود و validation + bcrypt داشت.

اما هنوز موارد زیر وجود ندارند:
- Login
- Session
- Logout
- Password reset
- Email verification
- Role/Permission
- Protected progress API

این‌ها عمداً در این مرحله کامل نشده‌اند تا قبل از توسعه‌ی backend authentication، مدل content و project architecture تثبیت شود.

---

# 4. Content Status

محتوای HTML و CSS فعلی قابل استفاده است، اما هنوز تمام استاندارد Content Specification را ندارد.

به‌طور خاص باید به تدریج اضافه شود:
- objectives
- concepts
- prerequisites
- explicit challenge
- project mapping
- consistent quiz/exercise schema
- checkpoint
- next lesson

بنابراین محتوای فعلی «Draft/Existing Content» محسوب می‌شود، نه محتوای نهایی production.

---

# 5. Architecture Status

### Implemented / Started
- Next.js app shell
- RTL
- Sidebar
- Lesson routes
- Markdown loader
- Playground
- Quiz
- Exercise
- Project route
- Project content model
- Local lesson progress
- Content validator

### Not Yet Implemented
- Journey progress engine
- Database progress
- Auth session
- Login
- Authorization
- Search
- PWA/service worker
- IndexedDB offline queue
- React/TSX playground
- backend sandbox runtime
- tests
- Docker
- CI/CD

---

# 6. Recommended Next Vertical Slice

بعد از این Audit، بهترین ادامه‌ی فنی این است:

1. تکمیل پنج درس اول HTML طبق Content Specification.
2. افزودن Example/Exercise/Quiz/Challenge استاندارد.
3. اتصال آن‌ها به اولین milestone فروشگاه.
4. تکمیل local progress برای lesson + exercise + quiz + milestone.
5. افزودن content validation عمیق‌تر.
6. سپس migration تدریجی CSS و JavaScript.
7. بعد از تثبیت frontend learning loop، ورود به TypeScript/React.

---

# 7. Final Status

این پروژه اکنون از یک MVP پراکنده به یک پایه‌ی معماری‌شده‌تر نزدیک شده است، اما هنوز «نسخه نهایی Full-Stack Academy» نیست.

مهم‌ترین تصمیم درست در این مرحله این است که توسعه‌ی محتوا و کد به صورت Vertical Slice ادامه پیدا کند، نه اینکه ابتدا تمام curriculum ساخته شود.
