# Copilot Instructions

## Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint via Next.js

# E2E tests (Playwright) — auto-starts dev server
npx playwright test                        # All tests
npx playwright test src/app/login/login.e2e.ts  # Single test file
npx playwright test --headed              # With browser UI
```

> No unit test runner is configured. All tests are Playwright E2E (`*.e2e.ts`).

## Architecture

**Next.js 15 App Router** portfolio with a CMS-style admin panel backed by Firebase.

### Route structure

- `src/app/` — Public-facing portfolio pages (home, about, projects, publications, credentials, resume)
- `src/app/admin/` — Protected CRUD admin panel (mirrors the public sections)
- `src/app/api/auth/` — Server-side auth API routes (`login`, `logout`, `me`) using **Firebase Admin SDK**
- `src/app/login/` — Login page with AES-GCM encrypted credential submission

### Data layer

```
useProjects() / useCredentials() / etc.   ← domain-specific hooks
        ↓
useCollection<T>(collectionName)          ← React Query wrapper (src/hooks/useCollection.ts)
        ↓
getAll<T>() / add<T>() / update<T>()      ← generic Firestore CRUD (src/lib/firebase/firestore-crud.ts)
        ↓
Firebase Firestore (client SDK)
```

Each domain also has a dedicated CRUD module in `src/lib/firebase/` (e.g. `projects-crud.ts`, `site-config-crud.ts`).

### Auth flow

- Middleware (`src/middleware.ts`) guards `/admin/**` — checks only for cookie presence, does **not** verify the token
- Actual token verification happens in `/api/auth/me` (Firebase Admin SDK)
- `AdminLayout` calls `useAuth()` on the client as a second check and redirects if unauthenticated
- Login page sends AES-GCM encrypted `{ payload }` (not plaintext credentials) to `/api/auth/login`

### Client-side providers (`src/providers/Providers.tsx`)

Wraps the entire app in this order:
`ErrorBoundary → Redux Provider → QueryClientProvider → MUI ThemeProvider`

Returns `null` during SSR to avoid hydration mismatches — this is intentional.

### State management

- **Redux** (`src/redux/`) — theme only (`themeSlice`, `navigationSlice`)
- **React Query** — all server data (Firestore collections)
- **Firebase Storage** — images and files; only `firebasestorage.googleapis.com` is allowed in `next.config.ts`

## Key Conventions

### TypeScript & types

- Domain interfaces live in `data/data.type.ts`: `IProject`, `ICredential`, `IPublication`, `IExperience`
- MUI theme is augmented in `types/theme.d.ts` — adds a `social` palette key and custom typography variants

### Custom MUI typography variants

Use these via `<Typography variant="...">`:

| Variant | Font |
|---|---|
| `codeLike` | Space Grotesk / Merriweather Sans, bold 40px |
| `professional` | DM Mono |
| `playful` | Sacramento (cursive) |
| `handWritten` | Caveat |
| `caligrapghy` | Lavishly Yours (note: typo in source) |

### Firestore data access pattern

Always use the domain-specific hooks (`useProjects`, `useCredentials`, etc.) in components. Use `useCollection<T>` only for new collections without a dedicated hook. The generic CRUD in `firestore-crud.ts` is the lowest level — use it in `src/lib/firebase/*-crud.ts` files.

### `siteConfig` Firestore collection

Global site settings (resume URLs + active index, profile image URL) are stored in `siteConfig/{resume|profile}` and accessed via `src/lib/firebase/site-config-crud.ts`.

### Environment variables

Two sets of Firebase credentials exist:

| Prefix | SDK | Used in |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Client SDK | Browser (auth, Firestore, Storage) |
| `FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY` | Admin SDK | API routes only |

`NEXT_PUBLIC_ENCRYPT_SECRET` / `ENCRYPT_SECRET` are used for AES-GCM login encryption. `ALLOWED_ADMIN_EMAIL` / `NEXT_PUBLIC_ADMIN_EMAIL` gate admin access.

### E2E test conventions

- Test files use the `*.e2e.ts` extension inside `src/`
- Use `page.route(...)` to mock API/Firebase calls — do not rely on real credentials in tests
- The Playwright config auto-starts the dev server; tests assume `baseURL: http://localhost:3000`
