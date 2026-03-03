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


## Skill: Using react-bits Animations

### Animation library sources

When looking for ready-made animated React components, check these first:

| Library | URL | Notes |
|---|---|---|
| **react-bits** | https://reactbits.dev/ | MIT licensed, copy-paste model, Three.js / CSS / Framer Motion components |
| GitHub source | https://github.com/DavidHDev/react-bits | Raw TypeScript files, browse `src/ts-default/` |

**react-bits** is a MIT-licensed library of high-quality animated React components. Components are **copied directly into the project** (not installed as an npm package) — this gives full control and zero runtime dependency overhead.

### How to find a component

1. Browse categories at https://reactbits.dev/ (Backgrounds, Text, UI, Components, etc.)
2. Locate the TypeScript source on GitHub:
   - `src/ts-default/<Category>/<Name>/<Name>.tsx`
   - `src/ts-default/<Category>/<Name>/<Name>.css` (if it exists)
   - Example: `src/ts-default/Backgrounds/LiquidEther/LiquidEther.tsx`
3. Fetch raw file URLs:
   ```
   https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-default/<Category>/<Name>/<Name>.tsx
   https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-default/<Category>/<Name>/<Name>.css
   ```

### How to integrate into any React/Next.js project

#### Step 1 — Download the source files

```bash
# In the project root, save to your components/animations directory
curl -o src/components/animations/MyAnimation.tsx \
  https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-default/<Category>/<Name>/<Name>.tsx

curl -o src/components/animations/MyAnimation.css \
  https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-default/<Category>/<Name>/<Name>.css
```

Or with PowerShell (Windows):
```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-default/<Category>/<Name>/<Name>.tsx" -OutFile "src\components\animations\MyAnimation.tsx"
```

#### Step 2 — Fix the CSS import path

The downloaded file imports `'./ComponentName.css'`. If you renamed the CSS file or placed it elsewhere, update the import path at the top of the `.tsx` file.

#### Step 3 — Check peer dependencies

Most react-bits animation components depend on one or more of:

| Dependency | Install command |
|---|---|
| `three` | `npm install three @types/three` |
| `@react-three/fiber` | `npm install @react-three/fiber` |
| `@react-three/drei` | `npm install @react-three/drei` |
| `framer-motion` | `npm install framer-motion` |
| `gsap` | `npm install gsap` |

Check the component's imports to determine which are needed.

#### Step 4 — Usage patterns

**Pattern A: Standalone renderer (e.g. LiquidEther, Aurora)**
The component manages its own `WebGLRenderer` internally — render it as a plain `<div>`:
```tsx
import LiquidEther from "@/components/animations/LiquidEther";

// Full-viewport fixed background
<LiquidEther
  style={{ position: "fixed", inset: 0, zIndex: -1, width: "100vw", height: "100vh" }}
  colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
  autoDemo
/>
```

**Pattern B: R3F Canvas component (e.g. MovingStars, Particles)**
The component uses `useFrame` / R3F hooks — must be rendered inside `<Canvas>`:
```tsx
import { Canvas } from "@react-three/fiber";
import MyParticles from "@/components/animations/MyParticles";

<Canvas style={{ position: "fixed", inset: 0, zIndex: -1 }}>
  <Suspense fallback={null}>
    <MyParticles />
  </Suspense>
</Canvas>
```

**Pattern C: DOM/CSS animation (e.g. text effects, scroll animations)**
Plain React component — use directly inline:
```tsx
import FancyText from "@/components/animations/FancyText";
<FancyText text="Hello World" />
```

#### Step 5 — Next.js specific: SSR guard

All react-bits components use browser APIs (`window`, `document`, `ResizeObserver`). In Next.js App Router:
- Add `"use client"` at the top if not already present
- The component must be rendered in a Client Component — do not use in Server Components directly
- For `<Canvas>` wrappers, wrapping in `dynamic(() => import(...), { ssr: false })` is safest

#### Step 6 — Theming integration

To switch animations based on MUI theme mode (light/dark):
```tsx
"use client";
import { useAppTheme } from "@/hooks/useAppTheme"; // reads from Redux themeSlice
const { palette: { mode } } = useAppTheme();
return mode === "dark" ? <DarkAnimation /> : <LightAnimation />;
```

### Example: LiquidEther as a full-viewport background (this project)

```
src/sharedComponents/animations/backgroundAnimations/
  LiquidEther.tsx   ← copied from react-bits (Pattern A)
  LiquidEther.css   ← companion styles
  MovingStars.tsx   ← custom R3F component (Pattern B)
  Scenebackground.tsx ← switches between them based on theme mode
```

`Scenebackground.tsx` is placed in root layout so the animation is always in the background behind all page content (`position: fixed; z-index: -1`).


- Test files use the `*.e2e.ts` extension inside `src/`
- Use `page.route(...)` to mock API/Firebase calls — do not rely on real credentials in tests
- The Playwright config auto-starts the dev server; tests assume `baseURL: http://localhost:3000`
