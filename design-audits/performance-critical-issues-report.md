# Shodasha — Performance Critical Issues Report

> **Date:** 2026-08-02
> **Method:** 3 parallel analysis agents (frontend / backend-SQLite / process-RAM) + web research on Next.js 16 and Tauri v2 performance best practices.
> **Scope:** Full stack — Next.js frontend, Tauri Rust shell, SQLite, background tracker, process lifecycle.

---

## 1. User complaints → root causes

| Complaint | Root cause | Severity |
|---|---|---|
| **App opens a terminal instead of GUI; closing terminal kills app** | Debug builds are console-subsystem; autostart registers the debug exe; tracker.exe debug build pops a console | **P0** |
| **Takes time to load UI history** | Every Tauri command re-opens SQLite + replays 25+ migration/seed statements; unindexed full-table orphan-close at boot; full-table loads shipped to JS | **P0** |
| **Consumes too much RAM** | Hidden WebView loads the entire app at boot (~300–500 MB); window hidden ≠ unloaded; release never used | **P0** |
| **Should run in background with minimal memory** | Autostart mode still creates + fully loads the hidden window; 5 background intervals keep running while hidden | **P0** |
| **SQLite: no indexes, overloading data, no lazy loading** | See §3 — missing indexes, SELECT * for all history, JS-side aggregation over 100k+ rows | **P0/P1** |
| **Duplicate code / duplicate logic** | Tracker logic duplicated (embedded thread vs standalone tracker.exe); dead components; duplicated streak/format helpers | **P1** |

---

## 2. P0 — Terminal opens instead of GUI (and closing it kills the app)

**Root cause chain (verified):**

1. `src-tauri/src/main.rs:2` and `tracker/src/main.rs:1` gate `windows_subsystem = "windows"` behind `not(debug_assertions)` → **only release builds are GUI-subsystem**.
2. `package.json:10` `"build:tracker": "cargo build --manifest-path tracker/Cargo.toml"` — **no `--release`** → debug build = console-subsystem → a terminal window pops when launched.
3. `lib.rs:41-44` re-registers autostart **on every launch** with `current_exe()` (commands.rs:227-228) → first run of a debug exe permanently wires `target/debug/shodasha.exe` into `HKCU\...\Run` → a console appears at every logon.
4. Closing the console sends `CTRL_CLOSE_EVENT` to the process tree → the app dies. This is exactly the reported behavior.
5. `target/release/tracker.exe` is a **0-byte placeholder** (bundled as a resource in tauri.conf.json:38); no launcher exists for tracker.exe anywhere — the Settings UI copy ("Runs tracker.exe silently on system boot", TrackingPreferences.tsx:171) is stale.

**Fixes:**
- **A1.** Build release: `"build:tauri": "tauri build"`, `"build:tracker": "cargo build --release --manifest-path tracker/Cargo.toml"`. Delete the 0-byte placeholder.
- **A2.** Bulletproof: make tracker GUI-subsystem in **all** profiles — `#![cfg_attr(windows, windows_subsystem = "windows")]` (it's headless; never wants a console).
- **A3.** `set_auto_start`: write-on-change (skip `RegSetValueExW` if the value already matches).
- **A4.** Update stale docs/copy (README.md:69, architecture.md, ADR-0002, TrackingPreferences.tsx:171).

---

## 3. P0 — SQLite: per-command connection churn + missing indexes + data overload

### 3.1 Every command re-opens the DB and replays migrations (CRITICAL)

`commands.rs` — all **32 DB commands** call `init_db()` (lines 21–266). Each call:
- `Connection::open` + 3 PRAGMAs (db.rs:17-24)
- `run_migrations()`: 9× `CREATE TABLE IF NOT EXISTS` + 2× `CREATE INDEX` + **9 failing `ALTER TABLE`** (db.rs:113-120) + **8 seed INSERTs** (db.rs:136-141) + schema_version SELECT

~25 statements per command, ~1.5–4 ms, **plus a log file append**. A dashboard load = ~7 commands = 10–25 ms of pure overhead on *every page load and every interaction*. The tracker thread (tracker_service.rs:212) correctly holds one long-lived connection — commands are the only offenders.

**Fix:** Tauri-managed `Mutex<Connection>` initialized once in `lib.rs:25`, migrate once. All 32 handlers take `tauri::State<DbState>` instead of calling `init_db()`. **~99% reduction in per-command latency.**

### 3.2 `synchronous=FULL` → fsync on every write (CRITICAL)

WAL is set but `synchronous` stays FULL (db.rs:20-24, tracker/db.rs:10-14) → every commit fsyncs. Tracker updates every 10 s = **1 fsync per 10 s, 24/7**, plus every command write.

**Fix:** `PRAGMA synchronous=NORMAL` (safe under WAL — no corruption, only last commit lost on power-cut; acceptable for a tracker), `journal_size_limit=67108864`.

### 3.3 Unindexed full-table scans at startup (HIGH)

`close_orphaned_entries` (tracker_service.rs:87-98) — `UPDATE ... WHERE end_time IS NULL` with **no index on `end_time`** → full scan. Runs **2× per launch** (lib.rs:28 + tracker_service.rs:216-217, same process!) + 1× on tray quit. Grows with table size.

**Fix:** `CREATE INDEX idx_time_entries_open ON time_entries(end_time) WHERE end_time IS NULL;` + keep ONE call site. O(N) → O(open rows).

### 3.4 Missing indexes (HIGH)

| Query | Columns | Index? |
|---|---|---|
| orphan close | `end_time IS NULL` | ❌ |
| prune | `start_time < ?` | ✅ (start_time) |
| day range overlap | `start_time <= ?`, `end_time >= ?` | ⚠️ end_time branch can't use index (OR) |
| habit records by date | `date` | ❌ |
| tasks board sort | `status, sort_order` | ❌ (tiny table — skip) |

```sql
CREATE INDEX IF NOT EXISTS idx_time_entries_end_time ON time_entries(end_time);
CREATE INDEX IF NOT EXISTS idx_time_entries_open     ON time_entries(end_time) WHERE end_time IS NULL;
CREATE INDEX IF NOT EXISTS idx_habit_records_date    ON habit_records(date);
```

### 3.5 Full-table loads + JS-side aggregation (HIGH)

- `get_habit_records` (habit_repo.rs:56-72): **every record ever recorded** — no date bound. ~365 rows/habit/year.
- `get_time_entries_range` (time_entry_repo.rs:45-71): ships `window_title` blobs for whole weeks; then `timeEntryStore.computeDerivedState` reduces **over every row in JS** for KPIs, categories, top-apps, daily bars, task-logged seconds.
- `get_all_tasks` (task_repo.rs:22-48): all columns incl. `description`/`url`/`tags` always.

**Fix:** push aggregates to SQL — e.g. `SELECT app_name, SUM(duration_seconds) ... WHERE start_time >= ?1 AND start_time < ?2 GROUP BY app_name`, `SELECT linked_task_id, SUM(duration_seconds) GROUP BY linked_task_id`, and bound habit records to `date >= ?`. Keep the full range fetch only for the stream/search widget. KPI computation O(rows in JS) → O(apps) in SQL.

### 3.6 RFC3339 TEXT dates: boundary bug + fragility (MEDIUM)

`get_time_entries_by_date`/`range` use `day_end = "{date}T23:59:59"` (time_entry_repo.rs:19,47) → a session at `23:59:59.5` is **excluded from its own day**. Any future writer with a different offset silently breaks ranges.

**Fix (safe):** half-open ranges `start_time < next-day-T00:00:00`. **Best:** epoch integer columns (`start_epoch`/`end_epoch`) with migration backfill + index; switch queries to `start_epoch >= ? AND start_epoch < ?`.

### 3.7 Unbatched writes (LOW-MED)

`save_settings` (settings_repo.rs:27-31) and `reorder_kanban_columns` (kanban_repo.rs:41-45) autocommit per row → N fsyncs. **Fix:** wrap in one transaction.

### 3.8 Startup maintenance every launch (MEDIUM)

`prune_old_time_entries(6)` runs on every launch (lib.rs:27) even when nothing to prune → thousands of WAL records. **Fix:** gate on a `lastPrunedAt` setting (once/day).

---

## 4. P0 — RAM: hidden window loads the whole app at boot

### 4.1 Idle memory profile

| Component | Idle RAM |
|---|---|
| Rust core (release) | ~15–30 MB |
| WebView2 (msedgewebview2.exe) | **~150–300 MB** |
| Frontend JS heap (recharts + motion + Next + Zustand) | ~30–80 MB |
| Debug exe overhead | +30–80 MB |
| **Total (debug, window open)** | **~350–500 MB** |

### 4.2 Root causes

1. **Window created at `Builder::run` even with `visible: false`** (tauri.conf.json:13-23) → WebView2 initializes and the full Next.js app (dashboard, recharts, motion) loads **hidden** at boot. Autostart "background mode" = the whole app minus visibility.
2. **Close-to-tray keeps everything resident** (lib.rs:107-112): `hide()` doesn't unload WebView2 or stop JS timers. All background intervals keep firing while hidden.
3. **recharts** (~400 KB gz) is statically bundled into the dashboard which loads at boot even when hidden.

### 4.3 Fixes (ranked)

1. **Don't create the window at all on `--autostart`** (and destroy on close-to-tray): build the WebView via `tauri::WebviewWindowBuilder` only on tray "show". Boot-time RAM drops to ~20–30 MB (Rust core only). **The single biggest win.**
2. **Pause JS when hidden**: gate all frontend intervals on `document.visibilityState` (the 15 s timeline refresh, 60 s notification check, 10 s phantom music-widget poll). Pattern already exists in AppInitializer.tsx:19-29.
3. **Release builds** (A1) remove debug bloat.
4. Lazy-import recharts widgets (next/dynamic) — or replace the ~6 simple charts with hand-rolled SVG.

---

## 5. P1 — Duplicate tracker logic; two potential writers

`tracker/src/main.rs` + `poller.rs` ≈ **95% copy** of `tracker_service.rs:203-324` (same Win32 poll, same entry SQL). The embedded thread (always runs, lib.rs:50) is a **strict superset** (gap entries, configurable interval, transient filtering, quit-close). If tracker.exe ever runs alongside (stale Run key, manual run):

- **duplicate `time_{millis}` rows** for the same session → analytics double-count;
- each writer's orphan-close **closes the other's open row**, then the other overwrites `end_time` → corrupt durations.

**Fix:** delete the `tracker/` crate, remove the resource from tauri.conf.json:37-39 and CI, fix the stale UI copy. Embedded thread covers 24/7 because the app is always resident in tray.

---

## 6. P1/P2 — Frontend rendering (verified against the older audit)

**Already fixed** (per verification report): timer interval leak, Immer records map, memoized KanbanCard/Column, motion-free BaseCard, notification interval cleanup.

**Still real:**

| Issue | Location | Cost |
|---|---|---|
| Components bypass memoized derived state, call un-memoized getters in render | timeEntryStore.ts:501-855; HabitAchievements.tsx:25; ActivePeriodsTimeline.tsx:9-11 + TimeSlotScheduleStripWidget.tsx:11 (`getActivePeriods` computed **twice per render**) | O(n)-O(n log n) per render |
| `getSubTasks` per card → O(n²) | kanban rendering | re-render churn |
| `HabitCalendar.tsx:252` — O(30) `getHabitHp` per cell (~18k iterations/render) | habits page | jank |
| 15 s timeline refresh + 60 s notification poll — **no visibility guard** | timeline/page.tsx:17-23, NotificationScheduler.tsx:11 | wasted CPU/RAM while hidden |
| `MusicPlayerWidget.tsx:46` — invokes non-existent `get_active_media_session` every 10 s (guaranteed error) | dashboard | failed IPC every 10 s |
| Dead code: TimelineStream, DraggableGrid, StreakDisplay, unused dashboard cards; canonical `calculateHabitStreak` + 5 inline duplicates; timer localStorage write per second; `persistAllSettings` writes all 8 fields | src/ | bundle + CPU + RAM |
| dnd-kit + recharts statically bundled in every page | board/page.tsx, dashboard | ~400+ KB gz |
| 5 `LivingFlameIcon` instances with `repeat: Infinity` framer loops; no `will-change` anywhere | components | main-thread load |
| `TaskModal.tsx:119` reads store non-reactively (stale logged time) | task modal | correctness + re-render |

**Fixes:** use the memoized derived fields (`filteredEntries`, `filteredKPIs`, `taskLoggedSecondsMap`) everywhere; `React.memo` + stable selectors; `next/dynamic` for KanbanBoard, charts, modals; delete dead components; gate intervals on visibility; convert infinite framer loops to CSS `@keyframes`; fix/remove the phantom media-session invoke.

---

## 7. Research distilled (Next.js 16 + Tauri v2)

**Next.js:**
- `next/dynamic` + `ssr:false` is the highest-impact bundle fix — charts/modals/editors cut initial JS 40–60% (real case: 412 KB → 185 KB first-load JS).
- Barrel imports defeat tree-shaking — use `optimizePackageImports` (Next has it built-in for lucide-react etc.).
- Audit `layout.tsx` — every import there is critical bundle on every page.
- Server Components ship zero JS — but in this Tauri static-export app the win is mostly dynamic-imports + bundle budget (target ≤130 KB gz/page).
- Add @next/bundle-analyzer + a CI bundle budget.

**Tauri/SQLite:**
- One DB file in OS app-data dir; WAL + `synchronous=NORMAL` + `busy_timeout≈5s` + `journal_size_limit` per connection.
- Pool of ≤2–3 connections (SQLite serializes writers; more doesn't help).
- Run migrations once at startup, never per query; versioned migrations, not `IF NOT EXISTS` replay.
- Batch multi-row writes in transactions.

---

## 8. Recommended execution order (by impact/effort)

| # | Fix | Effort | Payoff |
|---|---|---|---|
| 1 | Release builds + tracker GUI-subsystem always + autostart write-on-change + delete 0-byte exe | 30 min | Kills the terminal bug |
| 2 | Shared `Mutex<Connection>` (migrate once) | 2 h | −99% per-command latency; faster history load |
| 3 | `synchronous=NORMAL` + WAL pragmas (both crates) | 15 min | Kills 24/7 fsync churn |
| 4 | Missing indexes + single orphan-close call site | 30 min | Startup O(N) → O(rows open) |
| 5 | No window on autostart; destroy on close-to-tray; pause JS when hidden | 3–4 h | **−300 MB+ idle RAM**; true background mode |
| 6 | SQL aggregates + date-bound habit records | 4 h | History stays fast past 50k rows |
| 7 | Delete tracker/ crate + stale copy | 1 h | Prevents duplicate/corrupt data |
| 8 | Frontend: memoized getters, dynamic imports, dead-code removal, visibility-gated intervals | 1–2 days | Snappier UI, lower parse/RAM |

**Caching strategy (your idea, confirmed):** keep the Rust connection + WAL warm, keep frontend derived state memoized in Zustand, gate refresh on window show (re-query only when visible / on 60 s when visible), and move aggregation into SQL so "compute on open" is cheap. The tracker already keeps data in SQLite continuously — the app should *read* it lazily, never re-compute history in JS.
