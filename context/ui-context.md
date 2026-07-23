# UI Context — Design Language

## Design Audit (Hallmark pre-emit)

- **Mode:** Operate — user completes tasks, checks habits, reviews data
- **Genre:** Editorial (clean, restrained, content-forward)
- **Theme family:** Light-first neutral with emerald accent
- **Anti-slop gates applied:** No italic headers · No pure black/white · No purple gradients · No glassmorphism · Single accent locked · No placeholder-as-label · prefers-reduced-motion honored

## Theme

Light-first editorial. Clean off-white background with warm greys. Emerald accent for completion/growth signals. Dark mode is a true second citizen (not an afterthought).

## Colors

### Light mode

| Role | CSS Variable | Tailwind | Value | Notes |
|------|-------------|----------|-------|-------|
| Page background | `--bg-base` | `stone-50` | `#fafaf9` | Warm off-white, not pure white |
| Surface | `--bg-surface` | `white` | `#ffffff` | Cards, panels, modals |
| Surface hover | `--bg-surface-hover` | `stone-100` | `#f5f5f4` | Interactive surface states |
| Primary text | `--text-primary` | `stone-900` | `#1c1917` | Warm near-black, not pure |
| Secondary text | `--text-secondary` | `stone-600` | `#57534e` | |
| Muted text | `--text-muted` | `stone-400` | `#a8a29e` | |
| Accent | `--accent` | `emerald-600` | `#059669` | Primary CTA, active states |
| Accent hover | `--accent-hover` | `emerald-700` | `#047857` | |
| Accent muted | `--accent-muted` | `emerald-100` | `#d1fae5` | Subtle accent backgrounds |
| Border | `--border` | `stone-200` | `#e7e5e4` | |
| Border strong | `--border-strong` | `stone-300` | `#d6d3d1` | |
| Error | `--error` | `red-600` | `#dc2626` | |
| Success | `--success` | `emerald-600` | `#059669` | |

### Dark mode

| Role | CSS Variable | Tailwind | Value |
|------|-------------|----------|-------|
| Page background | `--bg-base` | `stone-950` | `#0c0a09` |
| Surface | `--bg-surface` | `stone-900` | `#1c1917` |
| Surface hover | `--bg-surface-hover` | `stone-800` | `#292524` |
| Primary text | `--text-primary` | `stone-100` | `#f5f5f4` |
| Secondary text | `--text-secondary` | `stone-400` | `#a8a29e` |
| Muted text | `--text-muted` | `stone-500` | `#78716c` |
| Accent | `--accent` | `emerald-500` | `#10b981` |
| Accent hover | `--accent-hover` | `emerald-400` | `#34d399` |
| Accent muted | `--accent-muted` | `emerald-950` | `#022c22` |
| Border | `--border` | `stone-800` | `#292524` |
| Border strong | `--border-strong` | `stone-700` | `#44403c` |
| Error | `--error` | `red-500` | `#ef4444` |
| Success | `--success` | `emerald-500` | `#10b981` |

### Habit category colors (same in both modes)

| Category | CSS Variable | Value |
|----------|-------------|-------|
| Health | `--habit-health` | `#059669` (emerald) |
| Learning | `--habit-learning` | `#7c3aed` (violet) |
| Work | `--habit-work` | `#d97706` (amber) |
| Personal | `--habit-personal` | `#e11d48` (rose) |

## Typography

| Role | Font | Variable | Weight scale | Notes |
|------|------|----------|-------------|-------|
| Display/headings | Cabinet Grotesk | `--font-display` | 500–700 | Geometric, premium, sans-serif |
| Body | Inter | `--font-body` | 400–600 | Highly readable at small sizes |
| Monospace/numbers | JetBrains Mono | `--font-mono` | 400–500 | For time tracking data |

- All headings are roman (no italic) — anti-slop rule
- Body line length: 65–75ch max
- Display headlines: clamp() sizing
- Use `text-wrap: balance` on h1–h3
- Fonts loaded via `next/font` (self-hosted) — no Google Fonts CDN links

## Anti-Slop Rules (Hard Blocked)

These patterns must never appear:

| Pattern | Why |
|---------|-----|
| Pure black `#000000` or pure white `#ffffff` | Kills depth, AI tell |
| Italic headings | One of the most reliable AI tells |
| Purple/blue gradient accents ("AI purple") | Overused default |
| Glassmorphism / backdrop-blur surfaces | Unnecessary in a data app |
| `ease-in` animations | Feels sluggish, wrong for UI |
| scale(0) entry animations | Should start at scale(0.95) |
| Hardcoded inline colors bypassing tokens | Must use `var(--*)` at all times |
| Emoji in UI | Replaced with lucide-react icons |

## Border Radius

| Context | Value |
|---------|-------|
| Inline / small UI | 6px |
| Cards / panels | 12px |
| Modals / overlays | 16px |
| Buttons | 8px |

All radii are consistent across the app. No mixed radius systems.

## Shadows

- Light mode: `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` for cards
- Elevated (modals): `0 4px 6px rgba(0,0,0,0.07), 0 10px 15px rgba(0,0,0,0.05)`
- Dark mode shadows: tinted to the surface hue, not pure black
- Never use pure-black drop shadows on light backgrounds

## Component Library

No single design system. Components selected per-need from verified premium libraries. All imported components restyled to match these tokens. See `Feature_docs/COMPONENT-LIBRARY-INDEX.md`.

## Layout Patterns

- Page shell: top tab bar + main content area (no sidebar)
- Fixed window ~1200×800
- Tab bar: app name left, tabs center, tracking status dot + theme toggle right
- Board: horizontal scroll if columns overflow
- Habits: vertical list of habits × horizontal calendar grid (scrollable months)
- Timeline: filter pills (Day/Week) top, chart area top, detail list below

## Icons

- Library: lucide-react
- Size: 20px inline UI, 24px tab bar, 16px dense contexts
- Outlined only (not filled)

## Motion

- Entry animations: Motion `useInView` with staggered children, spring transitions
- Duration: UI micro-interactions < 200ms, entry animations < 500ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for spring-like feel
- Animate only `transform` and `opacity` — never layout properties
- All motion respects `@media (prefers-reduced-motion: reduce)`
- Never animate from `scale(0)` — start from `scale(0.95)` with opacity

## Dark Mode

- Toggle available in tab bar
- Respects `prefers-color-scheme` as default
- Both modes designed together from the start (not retrofitted)
- Both modes pass WCAG AA contrast (4.5:1 body, 3:1 large text)
