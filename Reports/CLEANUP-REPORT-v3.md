# Cleanup Report v3

## Fixed
- Moved project content loading into `lib/projects.ts`.
- Updated `/projects`, `/projects/[slug]`, and section pages to import project loaders from `lib/projects`.
- Removed project loader exports from `lib/content.ts` so there is one source of truth.
- This avoids the persistent module/export mismatch observed during Next.js build.
- Prisma lazy-loading fix from v2 is retained.
- `app/not-found.tsx` fix from v2 is retained.

## Verification performed
- ZIP integrity check: passed.
- Static source inspection: all project imports point to `lib/projects`.

## User-side verification
Run from the extracted project:

```powershell
Remove-Item -Recurse -Force .next
npm run typecheck
npm run content:validate
npm run build
```

Do not reuse the old `.next` directory. This is important because the previous build had stale module-resolution artifacts.
