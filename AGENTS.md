# Romanos Oito — Agent Guidelines

## Stack
- **React 18** + **Vite 5** + **TypeScript 5**
- **Supabase** (DB, Auth, Storage) — client at `src/integrations/supabase/client.ts`
- **shadcn/ui** + Radix UI — components at `src/components/ui/`
- **TanStack React Query** for server state
- **React Hook Form + Zod** for forms
- **Stripe** for payments
- **Tailwind CSS 3** for styling
- **Vitest + Testing Library** for tests (NOT Jest)

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on **port 8080** |
| `npm run build` | Production build → `/dist` |
| `npm run lint` | ESLint |
| `npm run test` | Run all vitest tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Run e2e tests only |

## Architecture

### Entry Point
- `src/main.tsx` → `src/App.tsx` (BrowserRouter)

### Directory Structure
```
src/
├── components/
│   ├── admin/       # Admin panel pages (behind ProtectedRoute)
│   ├── form/        # Form sections + schema.ts + types.ts
│   ├── oikos/       # Oikos event landing page + useOikosForm hook
│   └── ui/          # shadcn/ui generated components
├── config/          # constants.ts, inscricaoMapper.ts (form→DB mapping)
├── hooks/           # useAuth, useLotes, use-toast
├── integrations/    # Supabase client (auto-generated, DO NOT EDIT)
├── lib/             # utils, storage, metaPixel
├── pages/           # Route pages
├── services/        # Business logic: auth, cupons, eventos, inscricoes, lotes
└── test/            # Factories, setup, tests
```

### Service Layer Pattern
All Supabase DB operations go through service files in `src/services/`:
- `auth.service.ts` — sign-in, sign-out, session, admin check
- `cupons.service.ts` / `cuponsServo.service.ts` — coupon CRUD
- `eventos.service.ts` / `lotes.service.ts` — event/lot CRUD
- `inscricoes.service.ts` — subscription CRUD + external API call

### Two Inscricao Insertion Paths
1. **`InscricoesService.insert()`** — signs in anonymously, POSTs to `/api/subscription/` with Bearer token. **Response is NOT handled** (incomplete implementation).
2. **`InscricoesService.insertInscricao()`** — inserts directly to Supabase via `supabase.from("inscricoes").insert()`. **This is the working path** used by `useOikosForm`.

### Important: No API Proxy
- `fetch("/api/subscription/")` goes to a **relative URL** — no proxy configured in `vite.config.ts` or `nginx.conf`
- In dev, this will 404 unless the API is served on the same host:port
- Nginx config has no `proxy_pass` directives (static-only deployment)

## Environment Variables
- **Supabase**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (not `VITE_SUPABASE_ANON_KEY`)
- **Stripe**: `VITE_STRIPE_KEY` (secret), `VITE_STRIPE_PUBLIC_KEY`
- **Pix**: `VITE_PIX_KEY`, `VITE_PIX_RECEIVER_NAME`
- Supabase client is auto-generated at `src/integrations/supabase/client.ts` — **DO NOT EDIT**

## Testing
- Framework: **Vitest** with jsdom environment
- Setup: `src/test/setup.ts` (adds `@testing-library/jest-dom`, `matchMedia` polyfill)
- Pattern: `*.test.{ts,tsx}` or `*.spec.{ts,tsx}` in `src/`
- Factories available in `src/test/factories/`
- CI workflow (`.github/workflows/ci-cd.yml`) runs on PR to `main` (tests currently commented out)

## Branch Workflow
```
feat/* or fix/* → develop → main (production)
```
- PRs to `develop` trigger CI (security audit + build)
- Never push directly to `main`
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)

## Key Gotchas
- **Path alias**: `@/` maps to `src/` (configured in vite + tsconfig)
- **Dev port**: 8080 (not the default 5173)
- **Storage bucket**: `Comprovantes_OIKOS` for payment receipts
- **Oikos event ID**: hardcoded in `src/config/constants.ts`
- **Admin routes**: guarded by `ProtectedRoute` component (checks `user_roles` table)
- **`.env` file exists** in repo root with test credentials (do not commit real keys)
