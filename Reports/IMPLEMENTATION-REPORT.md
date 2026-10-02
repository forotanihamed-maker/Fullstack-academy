# Implementation Report — HTML Vertical Slice

Date: 2026-10-01
Status: Implemented; content validation passed.

## Scope

The next implementation step from the roadmap was implemented as a real vertical slice:

- Five first HTML lessons
- Structured lesson metadata
- Examples / playgrounds
- Exercises
- Quizzes
- Challenges
- Mini Project
- Lesson progress
- Project navigation
- Content validation

## Five lessons

1. HTML چیست و از کجا شروع کنیم؟
2. تگ، المان و ویژگی
3. عنوان‌ها، پاراگراف‌ها و لیست‌ها
4. لینک‌ها و تصویرها
5. HTML معنایی (Semantic HTML)

The existing educational text was preserved and augmented with structured metadata rather than replaced wholesale.

## New content

Each of the five lessons now has:

- objectives
- concepts
- difficulty
- estimated time
- prerequisites
- related project
- next lesson
- exercise
- quiz

Playgrounds are present for all five lessons.

Challenges were added to lessons 3 and 5.

## Mini Project

`html-foundations-site`

Project: «Mini Project: وب‌سایت آموزشگاه»

Three milestones:

1. ساخت صفحات
2. محتوا و ناوبری
3. Semantic Structure

The project is connected to the five lessons through prerequisites and relatedProjects.

## UI / application changes

- Added Challenge renderer.
- Lesson pages render challenges after exercises.
- HTML section page links to related projects.
- Project engine now exposes the new HTML mini project automatically.
- Lesson metadata is rendered by the existing lesson UI.

## Validation

Command:

`npm run content:validate`

Result:

`Content validation passed. 0 warning(s).`

The validator was strengthened to check:

- quiz shape and answer indexes
- exercise shape
- playground shape
- challenge shape
- existing section/project consistency

## Typecheck / Build limitation

`node_modules` is not present in the supplied project workspace.

`npm ci --offline` was attempted but failed because the npm cache does not contain the required packages (`@prisma/client` and dependencies).

A normal dependency installation was also attempted but did not complete within the execution window.

Therefore this report does **not** claim that `tsc` or `next build` passed. Running them after a successful `npm ci` is the next technical verification gate.

The TypeScript command was run without dependencies and consequently produced only missing-module errors; these are environment/dependency errors, not presented as application compile failures.

## Files added / changed

### Added

- `components/Challenge.tsx`
- `content/01-html/01-intro.exercise.json`
- `content/01-html/02-elements.exercise.json`
- `content/01-html/03-text.exercise.json`
- `content/01-html/04-links-images.exercise.json`
- `content/01-html/05-semantic.exercise.json`
- `content/01-html/01-intro.playground.json`
- `content/01-html/02-elements.playground.json`
- `content/01-html/03-text.playground.json`
- `content/01-html/04-links-images.playground.json`
- `content/01-html/05-semantic.playground.json`
- `content/01-html/03-text.challenge.json`
- `content/01-html/05-semantic.challenge.json`
- `content/projects/html-foundations-site.json`

### Changed

- `lib/content.ts`
- `components/LessonView.tsx`
- `app/[slug]/page.tsx`
- `app/lessons.css`
- `scripts/validate-content.mjs`
- first five HTML Markdown files: frontmatter/metadata added

## Educational flow now available

`Lesson → Example/Playground → Exercise → Quiz → Challenge → Project`

The next slice can reuse exactly this structure for CSS and then JavaScript without changing the content contract.

## Next gate

After dependency installation and build verification:

1. QA the five HTML lessons in browser.
2. Verify playgrounds and exercises manually.
3. Verify mobile layout.
4. Add project milestone progress.
5. Start CSS vertical slice.
