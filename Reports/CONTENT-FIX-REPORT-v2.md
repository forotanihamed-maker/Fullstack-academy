# CSS Medium Vertical Slice — Fix v2

## Problem
YAML frontmatter in CSS lessons contained unquoted `:` characters in title values. `gray-matter`/YAML therefore parsed lines such as `title: Background: رنگ، تصویر و گرادیان` as invalid YAML and raised `YAMLException`.

## Fixed files
- `content/02-css/06-background.md`
- `content/02-css/10-flexbox.md`
- `content/02-css/11-grid.md`

Their `title` values are now quoted.

## QA
- Content validator: PASS — 0 warnings.
- Scanned all Markdown frontmatter for the same `title`/`description` pattern: no remaining matches.
- Typecheck/build were not run in the packaging environment because project dependencies are not installed there.

## Local cleanup before testing
```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item lib\content.js -Force -ErrorAction SilentlyContinue
Remove-Item lib\projects.js -Force -ErrorAction SilentlyContinue
npm run typecheck
npm run content:validate
npm run build
```

Do not manually create `lib/content.js`; the source of truth is `lib/content.ts`.
