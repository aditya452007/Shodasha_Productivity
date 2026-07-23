# ADR-0001: Premium Component Libraries Over All-in-One Kit

**Date:** 2026-07-23

**Status:** Accepted

## Context

Shodasha needs a React component library for its Tauri desktop UI. Initial draft specified Mantine v7 — a mature, comprehensive all-in-one kit with 120+ components, built-in charts, and dark mode.

During design exploration, the user evaluated Mantine alongside newer premium/animated libraries (Kibo UI, Animata, Smooth UI, HeroUI, Dice UI, COSS UI, Cult UI, Fancy Components, Motion Primitives) and made a decisive call: Mantine was "not premium/animated enough" and visually "generic."

## Decision

Replace Mantine v7 with a **per-component selection** from a curated set of premium React libraries:

| Library | Role |
|---------|------|
| Kibo UI | Kanban board, Contribution Graph (heatmap), Ticker, Calendar, Color Picker |
| Animata | Charts (bar, donut, ring, gauge), Widgets, Skeleton variants, buttons |
| Smooth UI | Number flow, animated inputs, select, toggle |
| HeroUI | Tabs, card, toast, modal, drawer, table, form controls, pagination |
| Dice UI | Data table, color picker, combobox, gauge, tags |
| COSS UI | Empty state, command palette, alert, breadcrumb, scroll area |
| Cult UI | Direction-aware tabs, buttons, heatmap (hero-heatmap) |
| Fancy Components | Marquee, stacking cards, number ticker |
| Motion Primitives | Dialog, morphing dialog, popover, accordion |

No single library is the "default." Every component type is evaluated independently across libraries.

## Rationale

1. **Animation quality** — premium libraries ship with spring-based, interruptible animations using Motion/GSAP. Mantine relies on CSS transitions, which feel less fluid.
2. **Visual distinctiveness** — Mantine renders a recognizable "design system" look. A curated mix of premium components avoids the generic appearance the user rejected.
3. **Editorial minimal design** — the target aesthetic (clean, spaced, breathing room) is better served by libraries like Smooth UI and Animata than by a dense component kit.
4. **No lock-in** — swapping individual components is easier than migrating an entire app off a monolithic kit.
5. **All are free/MIT** — no licensing cost.

## Trade-offs

| Pro | Con |
|-----|-----|
| Higher visual polish and animation quality | No single design system — must manually harmonize styles |
| More flexibility to pick the best for each need | More libraries to install and maintain |
| Modern, distinctive aesthetic | Less documentation cohesion across libraries |
| Avoids "Mantine look" | Some library APIs are less mature/documente |

## Status

- [x] Decision made
- [ ] Component docs fetched from each library
- [ ] Theme tokens defined to harmonize across libraries
