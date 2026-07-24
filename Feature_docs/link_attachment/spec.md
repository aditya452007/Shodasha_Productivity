# Feature Spec: Optional External Link Attachment for Habits and Tasks

## 1. Overview & Goal

Enhance **Shodasha** habits and Kanban tasks by allowing users to optionally attach a website or application URL (e.g. `https://github.com`, `https://duolingo.com`, `https://notion.so/my-doc`).

When a habit or task has a URL attached:
- A standardized **External Link Icon Button** (Lucide `ExternalLink` — square with top-right arrow `↗`) is displayed next to the habit or task title.
- Clicking the link icon button redirects the user directly to their **default system web browser** without altering any task status or completion state.
- The user can access the target URL in their browser to complete their work/habit and return to check it off.
- Items without a URL attached will not show the link icon, maintaining a clean, clutter-free interface.

---

## 2. Interface Visualization & Wireframes

### A. Board Page (`KanbanCard.tsx`)
```
┌─────────────────────────────────────────────────────────────┐
│ ⠿ [✓]                                                   ⋯  │
│                                                             │
│ Finish Quarterly Code Review                                │
│ Review PRs on GitHub repository                             │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│ ⏱️ 45m logged  | 🔗 github.com ↗  | 📅 Today  | #code     │
└─────────────────────────────────────────────────────────────┘
```
*Note: Clicking `🔗 github.com ↗` opens `https://github.com/org/repo` in the user's default browser.*

### B. Habit Tracker Table (`HabitCalendar.tsx`)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Habit                        │ S │ M │ T │ W │ T │ F │ S │ Rate          │
├──────────────────────────────┼───┼───┼───┼───┼───┼───┼───┼───────────────┤
│ ● Daily Duolingo Lesson ↗    │ 🟢│ 🟢│ 🟢│ ⚪│ ⚪│ ⚪│ ⚪│ 43%           │
│ ● 30m Deep Reading           │ 🟢│ 🟢│ 🟢│ 🟢│ ⚪│ ⚪│ ⚪│ 57%           │
└──────────────────────────────┴───┴───┴───┴───┴───┴───┴───┴───────────────┘
```
*Note: `↗` is displayed only for habits that have a non-empty `url` set.*

### C. Dashboard Daily Habits Widget (`HabitQuickToggle.tsx`)
```
┌─────────────────────────────────────────────────────────────┐
│ Daily Habits                                      2026-07-24│
│ ─────────────────────────────────────────────────────────── │
│ ● Daily Duolingo Lesson   [ ↗ ]                      [ ✓ ]  │
│ ● 30m Deep Reading                                   [   ]  │
└─────────────────────────────────────────────────────────────┘
```

### D. Task Modal & Habit Modal (`TaskModal.tsx` & `AddHabitModal.tsx`)
```
┌─────────────────────────────────────────────────────────────┐
│ Web Link / URL (Optional)                                   │
│ ┌───────────────────────────────────────────┬─────────────┐ │
│ │ https://github.com/user/project           │ Open Link ↗ │ │
│ └───────────────────────────────────────────┴─────────────┘ │
│ Attach a web link to open directly in your default browser  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model & Architecture

### A. Database Schema (`data.db`)
- `tasks`: Add `url TEXT` (nullable)
- `habits`: Add `url TEXT` (nullable)

### B. Rust DTOs & Repositories (`src-tauri/src/`)
- `TaskDb`: Add `pub url: Option<String>`
- `HabitDb`: Add `pub url: Option<String>`
- SQLite queries updated to read/write `url` column.

### C. Zustand Stores & IPC Wrappers
- `Task` interface in `taskStore.ts`: Add `url?: string`
- `Habit` interface in `habitStore.ts`: Add `url?: string`
- `createTaskInDb`, `updateTaskInDb`, `createHabitInDb`, `updateHabitInDb` updated to pass `url`.

### D. Utility & Browser Redirection (`src/lib/utils/url.ts`)
- `openExternalUrl(url: string)` helper:
  - Validates and prepends `https://` if protocol is missing.
  - Calls Tauri's `@tauri-apps/plugin-shell` `open(url)` if running in Tauri native context.
  - Falls back gracefully to `window.open(url, '_blank')`.

---

## 4. Success Criteria

1. User can enter a web URL when creating or editing a Habit or Kanban Task.
2. If provided, the URL is saved to SQLite and restored on app launch.
3. Habit rows/cards and Task cards render a standard square-with-arrow link icon (`ExternalLink`) iff a URL is attached.
4. Clicking the link icon opens the default browser without triggering drag/drop or toggling completion state.
5. All TypeScript typechecks, ESLint checks, and Rust cargo builds pass with 0 errors.
