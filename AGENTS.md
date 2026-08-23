<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Commands

| Command | What |
|---------|------|
| `npm run dev` | Dev server (Next.js 16 + Turbopack). Default port 3000. |
| `npm run build` | Production build. |
| `npm run start` | Serve production build. |
| `npm run lint` | ESLint v9 (flat config). |

No test, typecheck, format, codegen, or pre-commit scripts exist.

# Architecture

- **Single-page Next.js 16 App Router** app (Spanish UI, space-weather dashboard for rural Argentina). `app/page.tsx` is the entrypoint.
- **Map dual-implementation**: `NEXT_PUBLIC_USE_MAPLIBRE=1` env var picks MapLibre GL (`components/features/SolarMap.maplibre.client.tsx`); otherwise Leaflet+react-leaflet (`SolarMap.client.tsx`). `SolarMap.tsx` dynamically imports the chosen variant.
- **API proxy** at `app/api/solar/route.ts` — fetches NASA DONKI (FLR, GST) and NOAA Kp index. Uses `DEMO_KEY` (rate-limited). Set `NASA_API_KEY` env var for production.
- **Env pattern**: `.env.example` is the template. Duplicate to `.env.local` (gitignored) for actual values.
- **`@/*` alias** maps to project root (`./`), not `src/`.
- **Tailwind v4** via `@tailwindcss/postcss` (PostCSS plugin). Custom dark theme with gold accent (`--accent-fill: #C9B98F`, see `app/globals.css`). Uses v4 opacity modifier syntax (`bg-background/50`).
- **Fonts**: Geist Sans (body + display), Geist Mono (mono/stats), Cormorant Garamond (wordmark only) — set via `next/font` on `<html>` (`app/layout.tsx`), aliased to `--font-body`, `--font-display`, `--font-mono-stat`, `--font-wordmark`.

# Style conventions

- **File naming**: PascalCase for components, kebab-case for everything else.
- **Client components**: `"use client"` at top. Map leaf components have `.client.tsx` suffix (Next.js convention not required here but followed).
- **React imports**: No `import React` needed (Next.js 16 + React 19, automatic JSX transform).
