# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Context

VirtuQuest is an educational planning platform integrating BNCC (Brazilian
National Common Curricular Base), Bloom's Taxonomy, and Intellectual Virtues.
The system enables multi-level pedagogical planning (lesson → unit → semester →
year) with AI-powered assistance.

**Tech Stack**: Next.js 15.5.4 (App Router), TypeScript (strict mode), Tailwind
CSS, shadcn/ui, Zustand, React Hook Form + Zod, Recharts, pnpm

**Backend**: N8N workflow automation via HTTP webhooks

## Development Commands

### Primary Commands

```bash
pnpm dev              # Start development server with Turbo
pnpm build            # Production build
pnpm type-check       # TypeScript validation
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format with Prettier
pnpm test             # Run Vitest tests
pnpm test:ui          # Run tests with UI
```

### Running Single Tests

```bash
npx vitest src/components/ui/like-button.test.tsx
npx vitest --ui src/components/ui/like-button.test.tsx
```

## Architecture Overview

### Frontend Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── (auth)/             # Protected routes (future)
│   └── api/                # API routes (N8N proxy)
├── core/
│   ├── domain/             # Business logic (BNCC, Bloom, Virtudes)
│   └── infrastructure/     # External integrations
│       ├── n8n/           # N8N client with resilience patterns
│       ├── resilience/    # Retry, circuit breaker, timeout
│       └── cache/         # Educational catalog caching
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── educational/       # Domain-specific components
│   └── layouts/           # Layout components
├── lib/                   # Utilities and helpers
├── stores/                # Zustand state management
├── styles/                # Global styles and design tokens
└── types/                 # TypeScript type definitions
```

### Path Aliases

- `@/*` → `./src/*`
- `@/app/*` → `./src/app/*`
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/core/*` → `./src/core/*`
- `@/stores/*` → `./src/stores/*`

### N8N Integration Pattern

The application communicates with N8N via typed HTTP webhooks. Use the
centralized client:

```typescript
import { n8nClient, N8N_ENDPOINTS } from '@/core/infrastructure/n8n';

// Automatic retry, circuit breaker, and timeout handling
const plan = await n8nClient.createPlan(planData);
```

**Key Features**:

- Circuit breaker per endpoint (prevents cascading failures)
- Exponential backoff retry (3 attempts)
- Configurable timeouts
- Immutable catalog caching (BNCC, Bloom, Virtues)
- Comprehensive error hierarchy

Available endpoints are typed in `src/core/infrastructure/n8n/endpoints.ts`

### Environment Variables

Validated via Zod schema in `src/lib/env.ts`. Required variables:

**Server-side**:

- `N8N_BASE_URL` - N8N instance URL
- `N8N_WEBHOOK_SECRET` - Webhook validation secret
- `JWT_SECRET` - JWT signing secret (min 32 chars)
- `JWT_REFRESH_SECRET` - Refresh token secret (min 32 chars)

**Client-side**:

- `NEXT_PUBLIC_APP_URL` - Application public URL
- Feature flags: `NEXT_PUBLIC_ENABLE_AI_ASSISTANT`,
  `NEXT_PUBLIC_ENABLE_GAMIFICATION`, etc.

Generate secrets: `openssl rand -base64 32`

## Code Standards

### TypeScript Configuration

- **Strict mode enabled** - All type safety checks active
- **No unchecked indexed access** - Array/object access is strictly typed
- **No unused locals/parameters** - Keep code clean
- Use path aliases consistently

### Commit Conventions

Follow Conventional Commits (enforced by Husky + commitlint):

```
<type>(<scope>): <subject>

Valid types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert

Valid scopes: planner, bncc, bloom, virtudes, auth, n8n, domain, ui, store, api,
telemetry, ai, assessment, calendar, approval, gamification, integration, config, deps
```

**Examples**:

- `feat(planner): add BNCC selector component`
- `fix(n8n): resolve circuit breaker timeout issue`
- `docs(api): update N8N integration guide`

### Linting & Formatting

- **Prettier** - Auto-formats on save (configured in `.prettierrc`)
- **ESLint** - Next.js config with TypeScript rules
- **lint-staged** - Pre-commit hooks format all staged files

## Testing

### Vitest Configuration

- Environment: jsdom
- Globals enabled
- CSS imports supported
- React Testing Library setup

### Test Location

Co-locate tests: `component-name.test.tsx` next to `component-name.tsx`

## Important Notes

### Constitution Reference

The project constitution is in `.specify/memory/constitution.md` (currently a
template). Refer to it for project-specific principles once populated.

### Documentation

- **Full specs**: `docs/development/SPECS.md` (3782 lines)
- **N8N integration**: `docs/development/N8N_INTEGRATION_GUIDE.md`
- **Pedagogical foundations**: `docs/fundamentos/` (BNCC theory, Bloom taxonomy,
  competency frameworks)
- **Design system**: `docs/design-system/`
- **Dependency versions**: `docs/development/DEPENDENCY_VERSIONS.md` (pending
  team confirmation on some major versions)

### shadcn/ui Components

Install via: `npx shadcn@latest add <component-name>`

Configuration in `components.json`. Already installed: button, card, dialog,
form, input, select, table, tabs, toast, badge, tooltip, command, sheet,
skeleton.

### Next.js 15 Features

- **Typed routes** enabled (`typedRoutes: true`)
- **Turbo mode** in dev server
- **Standalone output** for production
- **Server Actions** allowed from localhost
- **Optimized imports** for lucide-react, recharts, framer-motion

### Git Workflow

- Pre-commit: Prettier auto-formatting
- Commit-msg: Conventional Commits validation
- Main branch: `master`
