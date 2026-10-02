# Cleanup Report — Full-Stack Academy

## Changes

### 1. Content loader / project API
The latest vertical-slice package already contains the canonical exports:
- `getProjects()`
- `getProject(slug)`

These are kept in `lib/content.ts` and are included in the clean package. The project pages import them from the canonical content loader.

### 2. Prisma / database build isolation
`app/api/auth/register/route.ts` no longer imports Prisma at module load time. Prisma is dynamically imported inside `POST()`.

This keeps the learning site build independent from an ungenerated Prisma client/database while preserving the registration implementation for the later database phase.

## QA

- `npm run content:validate` — PASS: 0 warnings.
- `npm run typecheck` — not run in this environment because dependency installation could not complete.
- `npm run build` — not run to completion in this environment for the same dependency-install limitation.

The user's local `npm run typecheck` from the current project had already passed before this cleanup.

## Next local verification

Run:

```powershell
npm run typecheck
npm run content:validate
npm run build
```

Expected result: the previous Prisma initialization failure should no longer occur during page-data collection. If `getProjects/getProject` warnings persist, the local working tree is not using the clean package's `lib/content.ts`.
