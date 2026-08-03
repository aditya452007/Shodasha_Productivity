# Shodasha Productivity Engine

> A local-first, privacy-focused desktop productivity tracker that fuses passive Windows activity tracking, habit tracking, and kanban task management into a single, beautiful desktop app.

Shodasha runs entirely offline on your Windows machine — no cloud, no accounts, no data leaving your computer. It answers the question: *"What did I work on, for how long, and am I getting better?"*

---

## ✨ Features

| Feature | Description |
|---|---|
| **Kanban Board** | Drag-and-drop task management with customizable columns |
| **Habit Tracking** | Daily habit check-ins with calendar heatmaps and streak tracking |
| **Passive Time Tracking** | Automatically tracks which apps/windows are in focus (no manual timers) |
| **Interactive Dashboard** | Today's progress, focus score, time distribution charts, recent activity |
| **Timeline Analytics** | Daily timeline, weekly charts, app usage breakdown, productivity index |
| **Focus Target Engine** | Set daily focus goals with real-time progress rings |
| **Habit–Task Linking** | Completing a habit auto-completes its linked task (and vice versa) |
| **Background Tray** | Minimizes to system tray with near-zero CPU overhead |
| **Notifications** | In-app toast alerts paired with native OS notifications |
| **Warm Dark Theme** | Eye-strain-reduced linens and espresso palette with contrast options |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Desktop Shell** | [Tauri v2](https://v2.tauri.app/) (Rust) |
| **Frontend** | [Next.js 16](https://nextjs.org/) (static export) + [React 19](https://react.dev/) |
| **Language** | TypeScript, Rust |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animation** | [Motion](https://motion.dev/) (Framer Motion) + [GSAP](https://gsap.com/) |
| **State** | [Zustand](https://github.com/pmndrs/zustand) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Drag & Drop** | [@dnd-kit](https://dndkit.com/) |
| **Database** | SQLite (via `rusqlite`) |
| **Background Tracker** | Rust (Windows `GetForegroundWindow` polling) |

---

## Installation

### From Releases (Recommended)

1. Go to the [Releases page](https://github.com/aditya452007/Shodasha_Productivity/releases)
2. Download the latest `.msi` installer
3. Run the installer — Shodasha will launch and sit in your system tray

### Build from Source

```bash
# Prerequisites: Node.js 20+, Rust toolchain (MSVC), Windows

# Clone
git clone https://github.com/aditya452007/Shodasha_Productivity.git
cd Shodasha_Productivity

# Install frontend dependencies
npm install

# Build the full desktop app (release)
npm run build:all

# Or run in development mode
npm run tauri:dev
```

---

## Project Structure

```
Shodasha_Productivity/
├── src/                # Next.js frontend (React + TypeScript)
│   ├── app/            # Route pages (Dashboard, Board, Habits, Timeline, Settings)
│   ├── components/     # Reusable UI components
│   ├── stores/         # Zustand state stores
│   └── lib/            # Utilities and helpers
├── src-tauri/          # Tauri Rust shell (commands, SQLite, embedded background tracker thread)
│   └── src/            # Tauri commands, SQLite database layer
├── .github/workflows/  # CI/CD pipelines
└── context/            # Project design and architecture docs
```

---

## Development

```bash
# Start Next.js dev server (browser-only)
npm run dev

# Start full Tauri desktop app with hot reload
npm run tauri:dev

# Lint & typecheck
npm run lint
npm run typecheck

# Build everything for production
npm run build:all
```

---

## Privacy

**100% offline.** Shodasha stores all your activity data, tasks, and habits in a local SQLite database on your machine. No data is ever sent to a server, cloud, or third party. The app never phones home.

---

## License

[MIT](LICENSE)
