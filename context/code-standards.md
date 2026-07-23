# Code Standards

## General

- Keep components small and single-purpose (max ~300 lines)
- Fix root causes — do not layer workarounds
- Do not mix unrelated concerns in one component or route

## TypeScript

- Strict mode is required throughout the project
- Avoid `any` — use explicit interfaces or narrowly scoped types
- Validate unknown external input at system boundaries (Tauri IPC)
- Prefer `interface` over `type` for object shapes; use `type` for unions, intersections, and aliases

## Framework (Next.js Static Export)

- All pages are static — no server components, no SSR, no API routes
- Use `'use client'` on every page since all interactivity is client-side
- No metadata/SEO needed — this is a desktop app, not a website
- Routes: `src/app/page.tsx` (Dashboard), `src/app/board/page.tsx`, `src/app/habits/page.tsx`, `src/app/timeline/page.tsx`, `src/app/settings/page.tsx`

## Styling

- Use Tailwind CSS utility classes
- Theme tokens defined in `tailwind.config.ts` — no hardcoded color values
- Prefer Tailwind `dark:` variants for dark mode
- Avoid inline styles — use Tailwind classes or CSS modules for complex cases

## Animation

- Animate only `transform` and `opacity` — never layout properties
- Never animate from `scale(0)` — start from `scale(0.95)` with `opacity: 0`
- Never use `ease-in` for UI animations — use `ease-out` with custom cubic-bezier
- UI animations stay under 300ms; entry animations under 500ms
- Respect `prefers-reduced-motion` on every animated element
- Use Motion (Framer Motion) for React animations, GSAP for complex timeline/scroll

## File Organization

- `src/app/` — Next.js pages (one per tab)
- `src/app/layout.tsx` — Root layout (tab bar, providers, theme)
- `src/components/` — React components organized by domain (board/, habits/, timeline/, dashboard/, settings/)
- `src/stores/` — Zustand stores (taskStore, habitStore, timeEntryStore, uiStore)
- `src/lib/` — Utilities, database helpers, configuration
- `src/lib/db.ts` — SQLite database initialization and queries
- `Feature_docs/` — Component documentation markdown fetched from libraries

## Pre-Commit Checks (Every Feature Unit)

1. Lint passes (`npm run lint`)
2. Typecheck passes (`npm run typecheck`)
3. Build passes (`npm run build`)
4. `context/progress-tracker.md` is updated with completed work
5. All animations have `prefers-reduced-motion` fallbacks
6. No hardcoded colors — all values use CSS variable tokens (`var(--*)`)
7. Both light and dark modes render correctly
8. Anti-slop gates pass (see `context/ai-workflow-rules.md` § Design Execution):
   - No italic headings or display text
   - No purple/blue gradient accents
   - No glassmorphism or backdrop-blur
   - No `scale(0)` or `ease-in` animations
   - No pure black `#000000` or pure white `#ffffff`
   - No emoji in UI (use lucide-react)
   - Single accent color (emerald) locked across all pages
