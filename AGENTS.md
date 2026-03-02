# AGENTS.md

## Cursor Cloud specific instructions

### Repository structure

This is a monorepo. The active application lives in `narnia/` (Next.js 16 + React 19). Other project directories referenced in `.cursor/` rules (hermes, atlas) belong to a separate codebase and are not present here.

### Narnia — Technical Health Monitor

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Jest |
| `npm run test:coverage` | Jest with coverage (gate: >= 80%) |

All commands run from `narnia/`.

### Running without external services

Set `AUTH_DISABLED=true` to bypass Keycloak authentication in development. External integrations (SonarCloud, GitHub, Sentry, Proteo) degrade gracefully to `"unknown"` status when not configured — the app runs fine without them.

### Key routes

- `/` — redirects to `/project-selector`
- `/project-selector` — project list UI
- `/dashboard/technical-health` — health dashboard with integration cards
- `/api/v1/health` — BFF health endpoint (JSON)
- `/api/v1/integrations/[provider]` — per-provider integration endpoint

### Gotchas

- The repo has both `package-lock.json` and `yarn.lock` in `narnia/`. Use **npm** (matches the lockfile used in CI and scripts in `package.json`).
- `.cursor/rules/` contains a portable rule kit shared across multiple projects. Rules referencing hermes/atlas/NestJS are not applicable to narnia.
- Jest coverage is collected only from `src/domain/`, `src/infrastructure/`, and `src/presentation/` (not `src/app/`). See `jest.config.mjs`.
