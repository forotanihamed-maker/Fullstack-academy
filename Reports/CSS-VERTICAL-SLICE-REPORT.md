# CSS Vertical Slice — Implementation Report

## Source basis

Implemented from the supplied `Frontend-Ch03-CSS.pdf`, preserving its early-course order and terminology:

1. CSS چیست و چگونه اضافه می‌شود
2. Selectorها
3. رنگ‌ها
4. واحدها
5. Box Model

The implementation also uses the source's beginner project brief: «استایل‌دهی صفحه معرفی شخصی».

## Changes

- Reworked the first five CSS lessons to align with the supplied chapter.
- Added lesson metadata: objectives, concepts, prerequisites, difficulty and navigation.
- Added a Playground, Exercise and Quiz for each of the five lessons.
- Added a CSS challenge for the personal-profile styling task.
- Added `css-personal-profile` Skill Project with three milestones.
- Updated the E-commerce Journey CSS milestone to reference the five CSS lessons.
- Kept the project offline-first: no lesson depends on external CDN content for its core operation.

## Source-specific details included

- External/Internal/Inline CSS
- Selector and declaration terminology
- Combinators and attribute selectors
- `:hover`, `:focus-visible`, `:nth-child`, `::before`
- Hex/RGB/HSL and contrast guidance
- `px`, `%`, `rem`, `em`, `vw`, `vh`, `ch`, plus `dvh`/`svh`
- Box Model and `box-sizing: border-box`
- Margin collapse and logical properties
- Personal-profile project constraints: external CSS, no Grid/Flexbox, rem spacing/font sizing, contrast, focus/hover, no styling with IDs, 200% zoom

## QA

`node scripts/validate-content.mjs`:

`Content validation passed. 0 warning(s).`

TypeScript/build were not executed in this container because the exported project does not include `node_modules`. The user's previous project version had already passed `npm run typecheck` and `npm run build`; the new content should be rechecked on the user's machine.
