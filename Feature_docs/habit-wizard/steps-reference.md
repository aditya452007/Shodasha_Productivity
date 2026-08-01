# Component: Steps (wizard stepper reference)

- **Library**: Ant Design Steps (free, MIT) + Cult UI Intro Disclosure (free, MIT — closest Cult equivalent)
- **URLs**:
  - https://ant.design/components/steps
  - https://www.cult-ui.com/docs/components/intro-disclosure (Cult UI has no standalone `Steps` component — 404 confirmed; Intro Disclosure is their multi-step onboarding pattern)
- **Fetched by**: opencode, Aug 2026

## Design language to replicate (Ant Design Steps)

- Numbered circular step indicators (`iconSize` 32 medium / 24 small) joined by connector lines
- Three statuses per step: `finish` (filled primary circle with white checkmark), `process` (current — highlighted/filled circle, count as number), `wait` (muted outline)
- `current` prop: zero-based index of the active step; `status` of previous steps auto-set to `finish`
- Optional `percent` progress ring on the current step; `onChange` makes steps clickable
- Design tokens: `colorPrimary` for finish/process, `colorFillTertiary` for connectors, `colorTextDisabled` for wait labels, `borderRadius` 6

## Cult UI Intro Disclosure (pattern reference)

- Multi-step onboarding dialog; **progress tracking with step indicators**
- **Animated transitions between steps** (motion)
- Keyboard navigation support
- Customizable actions per step
- "Don't show again" persistence (not needed for habit wizard)

## Decision

Neither library is installed in this project (no antd; shadcn-style custom components + `motion` + lucide are the convention). Bundling antd (~1MB+) for one stepper is unjustified for a Tauri desktop app. Implement a bespoke `StepsHeader` inside `AddHabitModal` following Ant's visual language (numbered circles → filled check on complete, connectors fill via motion, current step highlighted) + Cult's animated step transitions, with `prefers-reduced-motion` guards.

## Adaptation into AddHabitModal

- 4 steps: Basics (title + color) → Category (select / create) → Priority (priority + linked task) → Schedule (reminder time + URL)
- Direction-aware slide transitions (AnimatePresence), success screen with spring check + sparkles
- Step completion feedback: filled circle + connector animation + short toast; final success screen with "Done" CTA
