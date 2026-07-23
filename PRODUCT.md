# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (React + Next.js UI wrapped in Tauri native shell for Windows desktop)

## Users

General audience — anyone who wants to understand and improve their digital productivity habits. Primary use case is an individual working on a personal Windows machine who wants to see where their time goes and feel a sense of growth from completing tasks.

## Product Purpose

A personal time management desktop application that merges task management (to-do lists, kanban board) with automatic desktop activity tracking. When the user completes a task, they check it off and immediately see their productivity growth reflected on a visual dashboard. The app runs entirely locally — no cloud servers, no data leaving the machine.

## Positioning

Most time trackers are passive logs or purely manual timers. This app fuses deliberate task completion with passive app-level activity tracking into a visual growth narrative — the user sees their progress as a story, not a spreadsheet. It answers "what did I work on, for how long, and am I getting better?"

## Operating Context

- Single Windows desktop machine
- App runs in the background, tracking active window / application names
- User interacts via a taskbar-accessible window
- No internet required; fully offline/local
- User switches between tasks naturally; the app infers context from active apps

## Capabilities and Constraints

Confirmed:
- Task list / to-do with checkboxes
- Visual board dashboard (kanban-style: To Do, In Progress, Done)
- Desktop activity tracking (detect which app is in focus and for how long)
- Time review/analytics dashboard showing where time was spent
- Task completion triggers visible "growth" feedback on the dashboard
- Fully local — no cloud sync, no server, no accounts

Undecided:
- Whether to support multiple "projects" or just a single workspace
- Whether tasks can have sub-tasks or tags
- Export format for reports (CSV, PDF, etc.)
- System tray / minimize-to-tray behavior
- Notification system (reminders, idle alerts)

## Brand Commitments

- Name: Shodasha (from repo name `Shodasha_Productivity`)
- No specific brand colors, voice, or visual identity committed yet

## Evidence on Hand

No real user data, testimonials, or benchmarks yet — the product is greenfield. Future work must never fabricate metrics or testimonials.

## Product Principles

1. **Local-first, private by default** — zero data leaves the machine. Trust is earned by architecture.
2. **Completion over collection** — the primary action is finishing tasks, not logging time. Time data serves the growth narrative, not the other way around.
3. **Passive + deliberate fusion** — automatic tracking meets intentional task management. The user shouldn't have to start/stop timers.
4. **Growth visibility** — the dashboard must make progress feel real, not just show numbers. The user should feel "I did more today."
5. **Start minimal, prove value** — ship with a kanban board + app tracking + a simple analytics view. Add projects, exports, reminders only after these prove useful.

## Accessibility & Inclusion

No specific accessibility requirements established yet. Standard web accessibility (keyboard navigation, screen reader support) applies as a floor.
