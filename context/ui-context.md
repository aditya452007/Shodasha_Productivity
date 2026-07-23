# UI Context — Design Language

## Theme

[Describe the design theme — dark/light, aesthetic direction, visual style]

## Colors

[Define color palette — use CSS custom properties for all values]

| Role            | CSS Variable         | Value                          |
| --------------- | -------------------- | ------------------------------ |
| Page background | `--bg-base`          | [value]                        |
| Surface         | `--bg-surface`       | [value]                        |
| Primary text    | `--text-primary`     | [value]                        |
| Muted text      | `--text-muted`       | [value]                        |
| Accent primary  | `--accent-primary`   | [value]                        |
| Border default  | `--border-default`   | [value]                        |
| Error           | `--state-error`      | [value]                        |
| Success         | `--state-success`    | [value]                        |

## Typography

| Role        | Font              | Variable        | Weight scale            |
| ----------- | ----------------- | --------------- | ----------------------- |
| Headings    | [Font]            | [CSS variable]  | [weight range]          |
| Body        | [Font]            | [CSS variable]  | [weight range]          |
| Code/mono   | [Font]            | [CSS variable]  | [weight range]          |

- Body line length: 65–75ch max
- Display headings: clamp() sizing
- Use `text-wrap: balance` on h1–h3

## Border Radius

| Context              | Value     |
| -------------------- | --------- |
| Inline / small UI    | [value]   |
| Cards / panels       | [value]   |
| Modals / overlays    | [value]   |
| Buttons              | [value]   |

## Component Library

[Describe component system — e.g., shadcn/ui, Radix UI, custom components]

## Layout Patterns

[Describe key layout patterns — page shell, navbar, hero, grids, footer]

## Icons

[Icon system — e.g., lucide-react, sizes convention]

## Motion

- Entry animations: [approach — e.g., Framer Motion useInView with staggered children]
- Scroll progress: [approach — e.g., GSAP ScrollTrigger]
- Micro-interactions: [approach — e.g., CSS transitions on hover/active]
- Custom easing: [cubic-bezier values]
- All motion respects `@media (prefers-reduced-motion: reduce)`
