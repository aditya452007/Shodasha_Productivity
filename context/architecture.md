# Architecture Context

## Stack

| Layer      | Technology                              | Role                              |
| ---------- | --------------------------------------- | --------------------------------- |
| Framework  | [Framework — e.g., Next.js 16 + TypeScript] | [Role — e.g., SSR/SSG React framework] |
| UI         | [UI Stack — e.g., Tailwind CSS v4 + shadcn/ui] | Styling system + component primitives |
| Animation  | [Animation Libs — e.g., Framer Motion + GSAP] | Scroll reveals, micro-interactions |
| CMS        | [CMS — e.g., Payload CMS] (Phase 2)    | Headless content management       |
| Forms      | [Form Libs — e.g., react-hook-form + zod] | Form validation & submission      |
| Icons      | [Icon Set — e.g., lucide-react]        | Icon system                       |
| Fonts      | [Fonts — e.g., Geist Sans + Geist Mono] | Primary and monospace typefaces   |

## System Boundaries

- `src/app/` — Next.js App Router pages and layouts (server components by default)
- `src/components/` — All React components (organized by domain/page)
- `src/components/ui/` — shadcn/ui primitives (buttons, inputs, dialogs, etc.)
- `src/lib/` — Utility functions, API clients, configuration
- `src/context/` — Agent context files
- `src/public/` — Static assets (images, videos)
- `src/Component_Docs/` — Reference documentation for components

## Storage Model

[Describe storage — database, CMS, static files, etc.]

## Auth and Access Model

[Describe auth — authentication, authorization, public vs private routes]

## Invariants

1. [Invariant 1 — e.g., All components are server-renderable by default]
2. [Invariant 2 — e.g., Animations only affect transform and opacity]
3. [Invariant 3 — e.g., All colors use CSS custom properties — no hardcoded values]
4. [Invariant 4 — e.g., Every animation has a prefers-reduced-motion fallback]
5. [Invariant 5 — e.g., Components stay single-purpose and under 300 lines]
