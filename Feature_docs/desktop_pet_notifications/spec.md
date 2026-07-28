# Feature Spec: Desktop Pet Notification Service

## 1. Overview & Objectives

Deliver Shodasha notifications through **OpenPets** desktop pets — animated characters that sit on the user's screen and react to app events. This transforms flat toast/OS notifications into a warm, engaging experience while keeping CPU/RAM overhead near zero.

### Key Goals:

1. **Direct Local IPC Integration** — Shodasha talks to OpenPets via its Windows named pipe. No subprocess, no npm, no extra daemon. Zero overhead when not sending a notification.

2. **Fallback Delivery Chain** — OpenPets → Web Notification API → silent (configurable per notification type). Shodasha works fully without OpenPets installed.

3. **Pet Browser in Settings** — Users browse and select from their installed OpenPets pets directly within Shodasha Settings, with a "Test" button to see the pet in action.

4. **Time-Based Reminders** — Tasks and habits get optional duration/deadline fields. The pet nudges the user when time is running out on an incomplete item.

---

## 2. System Architecture

```
Shodasha App (Tauri + Next.js)
│
├─ Frontend (React/Zustand)
│  ├─ notificationStore.ts    (extended: pet preferences per type)
│  ├─ DesktopPetSettings.tsx  (pet browser, selector, test button)
│  └─ Tasks/Habits modals     (time/deadline fields)
│
├─ Rust Backend (Tauri commands)
│  ├─ openpets_discover()     → read discovery file, return status
│  ├─ openpets_say()          → send message to pet via named pipe
│  ├─ openpets_react()        → set pet reaction animation
│  ├─ openpets_list_pets()    → enumerate installed pets
│  └─ openpets_set_pet()      → persist preferred pet ID
│
└─ Notification Engine
   ├─ background timer        (60s tick for time-based reminders)
   ├─ event triggers          (idle, habit, focus goal, streak, error)
   └─ delivery dispatch       (pet → Web Notification → silent)
              │
              ▼
   OpenPets Desktop App (separate process)
   ├─ Named pipe: \\.\pipe\openpets-<user-sid>
   ├─ Discovery: %APPDATA%\OpenPets\runtime\ipc.json
   └─ Renders: animated pet sprite with speech bubble
```

### IPC Protocol

OpenPets exposes a **line-delimited JSON** protocol over a Windows named pipe:

**Request:**
```json
{"version":1,"token":"<discovery-token>","method":"pet.say","params":{"message":"Time for your habit!","reaction":"waiting"}}
```

**Response:**
```json
{"ok":true,"data":{...}}
```

- Connect timeout: 2s
- Response timeout: 3s
- Max message: 16 KB
- Connection is open → send → receive → close (one-shot)

---

## 3. Phased Implementation

### Phase 1 — Rust IPC Client (src-tauri/src/services/openpets_client.rs)

**Discovery (`openpets_discover`):**
- Read `%APPDATA%\OpenPets\runtime\ipc.json`
- Validate JSON structure: `{ pid, platform, pipeName, token, version }`
- Send `hello` method to verify pipe is live
- Return `{ available: true, defaultPet, appVersion }` or `{ available: false }`

**Send Message (`openpets_say`):**
- Read discovery file (cache for 30s to avoid repeated reads)
- Open named pipe, send `pet.say` with `{ message, reaction? }`
- Handle: pipe not found, token mismatch, timeout, pet paused
- Return success/failure

**React (`openpets_react`):**
- Same flow, send `pet.react` with `{ reaction }`
- Reactions: `idle`, `thinking`, `working`, `editing`, `running`, `testing`, `waiting`, `waving`, `success`, `error`, `celebrating`

**List Pets (`openpets_list_pets`):**
- Send `pets.list` to OpenPets
- Return `[{ id, displayName, previewUrl, isDefault }]`

**Set Target Pet (`openpets_set_pet`):**
- Store preferred pet ID in Shodasha's `settings` SQLite table
- Future `openpets_say` calls include `pet_id` param to target specific pet

**Graceful Degradation:**
- If discovery file doesn't exist → return unavailable
- If pipe connection fails → return unavailable (no retry)
- If any error → log to `tauri.log` at `debug` level, return unavailable
- Frontend never blocks on pet delivery

### Phase 2 — Notification Service Wiring

**Extend `src/lib/notifications.ts`:**
- Add `OpenPetsDelivery` class implementing `DeliveryChannel`
- Method `send(notification)`:
  1. Call `invoke('openpets_discover')` — if unavailable, skip to fallback
  2. Map notification type to appropriate reaction:
     - habit_reminder → `waiting`
     - idle_alert → `idle`
     - focus_goal_reached → `celebrating`
     - task_deadline → `thinking`
     - streak_milestone → `celebrating`
     - error → `error`
     - daily_summary → `success`
  3. Call `invoke('openpets_say', { message, reaction })`
  4. If fails, fall through to Web Notification

**Extend `src/stores/notificationStore.ts`:**
- Add per-type delivery preference: `{ habit: 'pet' | 'web' | 'silent', idle: ... }`
- Default: habit → pet, idle → pet, focus_goal → pet, streak → pet, daily_summary → pet, task_deadline → pet, error → web
- Persist to SQLite `settings` table

**Wire Existing Triggers:**
| Trigger | Source | Pet Reaction |
|---|---|---|
| Idle > threshold | `tracker_service` idle detection | `idle` + "You've been idle for X min" |
| Habit reminder | `background tick` in notificationStore | `waiting` + "Time for: {habit name}" |
| Daily summary | `end-of-day` or manual | `success` + "Today: Xh Ym focus, Z tasks done" |
| Focus goal reached | `timeEntryStore` daily goal check | `celebrating` + "Focus goal hit!" |
| Task deadline | Phase 4 timer | `thinking` + "{task} due in X min" |
| Streak milestone | `achievements.ts` | `celebrating` + "X-day streak!" |
| Error | `db.ts` error handler | `error` + "Something went wrong" |

### Phase 3 — Pet Browser in Settings

**Component: `DesktopPetSettings.tsx`**
- New section in Settings under "Notifications" or a new "Desktop Pet" tab
- States:
  - **Loading**: Skeleton placeholder while fetching pet list
  - **OpenPets not installed**: Info panel "Install OpenPets to get started" with link to openpets.dev
  - **OpenPets not running**: "OpenPets is installed but not running" with launch hint
  - **No pets installed**: "No pets found — install one from OpenPets tray"
  - **Pets available**: Grid of pet cards with preview image, name, "Select" button, "Test" button
- Selected pet highlighted with emerald accent border
- "Send test notification" button → sends `openpets_say` with "Hello from Shodasha! 👋" and `waving` reaction
- Per-notification-type delivery preference toggles (pet / web notification / silent)

### Phase 4 — Time-Based Reminders

**Database Migration (v2):**
```sql
ALTER TABLE tasks ADD COLUMN duration_minutes INTEGER;
ALTER TABLE tasks ADD COLUMN deadline_time TEXT;      -- HH:MM
ALTER TABLE tasks ADD COLUMN reminder_minutes INTEGER; -- nudge before deadline
ALTER TABLE habits ADD COLUMN target_time TEXT;        -- HH:MM (do before this)
ALTER TABLE habits ADD COLUMN reminder_minutes INTEGER;
ALTER TABLE habit_records ADD COLUMN target_time TEXT; -- per-instance override
```

**Task/Habit Modal Updates:**
- `TaskModal.tsx`: Add "Duration (minutes)" and "Deadline time" (time picker) fields when "Time tracking" is toggled
- `AddHabitModal.tsx`: Add "Target time" (time picker) field

**Background Reminder Timer:**
- New module `src/lib/reminderTimer.ts`
- Starts on app init, runs every 60 seconds
- Checks:
  1. Incomplete tasks with `deadline_time` approaching within `reminder_minutes`
  2. Incomplete tasks with `duration_minutes` elapsed since creation
  3. Habits not yet checked off with `target_time` approaching
- Dispatches pet notification via notificationStore
- Tracks which reminders have been sent to avoid spam (cooldown per item: 15 min)

**Pet Delivery for Reminders:**
- Task due in 15min → `thinking` + "{task name} due soon"
- Task due in 5min → `working` + "{task name} due any minute"
- Task overdue → `error` + "{task name} is overdue"
- Habit target approaching → `waiting` + "Habit '{name}' should be done by {time}"
- Duration elapsed → `idle` + "You started {task} {duration} ago — still working?"

### Phase 5 — Polish & Verify

**Edge States:**
- OpenPets uninstalled mid-session → degrade gracefully
- Pet window closed/hidden → OpenPets queues messages (pet shows them when visible)
- Multiple rapid notifications → batch into one pet message (debounce 2s)
- Discovery token rotated (OpenPets restarted) → re-read discovery file on next send

**Reduced Motion:**
- Pet reactions respect `prefers-reduced-motion` — OpenPets handles this internally
- Shodasha's timer UI (countdowns) respects reduced-motion: static numbers, no pulse

**Verification:**
- `npm run lint` — 0 errors
- `npm run typecheck` — 0 errors
- `npm run build` — 0 errors
- `cargo check` — 0 errors
- `progress-tracker.md` updated

---

## 4. Open Questions

- What rate limit for pet messages? Proposal: max 1 per 10s per notification type
- Should pet messages persist across Shodasha restarts? (OpenPets doesn't persist them — they're ephemeral by design)
- Duration/deadline time fields: relative vs absolute picker UX in modals?

---

## 5. Success Criteria

1. Pet notification appears on desktop within 500ms of trigger
2. Zero CPU usage from Shodasha when not sending notifications (no polling)
3. All 7 notification types deliverable through pet, each with appropriate reaction
4. Fallback to Web Notification API works transparently when OpenPets is unavailable
5. Time-based reminders fire within 60s of the deadline threshold
6. User can select any installed OpenPets pet from Shodasha Settings
7. `progress-tracker.md` updated

---

## 6. Files to Create / Modify

### Create
- `src-tauri/src/services/openpets_client.rs` — IPC client for OpenPets named pipe
- `src-tauri/src/commands/openpets.rs` — Tauri command wrappers
- `src/components/settings/DesktopPetSettings.tsx` — Pet browser/selector
- `src/lib/reminderTimer.ts` — Background timer for time-based reminders

### Modify
- `src-tauri/src/commands.rs` — Register new OpenPets commands
- `src-tauri/src/lib.rs` — Register modules
- `src-tauri/capabilities/default.json` — Add OpenPets command permissions
- `src/lib/notifications.ts` — Add OpenPets delivery channel
- `src/stores/notificationStore.ts` — Pet delivery preferences
- `src/stores/taskStore.ts` — Duration/deadline fields
- `src/stores/habitStore.ts` — Target time fields
- `src/components/board/TaskModal.tsx` — Time fields in task form
- `src/components/habits/AddHabitModal.tsx` — Time field in habit form
- `src/app/settings/page.tsx` — Add Desktop Pet section
- `context/progress-tracker.md` — Track progress

---

## 7. Notification Type → Reaction Mapping

| Notification Type | Reaction | Message Template |
|---|---|---|
| Idle alert | `idle` | "You've been idle for {minutes} min" |
| Habit reminder | `waiting` | "Time to {habit_name}!" |
| Daily summary | `success` | "Today: {focus_hours}h focus, {tasks_done} tasks, {habits_done}/{total_habits} habits" |
| Focus goal reached | `celebrating` | "🎯 {hours}h focus goal smashed!" |
| Task deadline | `thinking` | "{task_name} is due in {minutes} min" |
| Task overdue | `error` | "{task_name} is overdue!" |
| Streak milestone | `celebrating` | "{days}-day streak for {habit_name}!" |
| Duration elapsed | `working` | "Still working on {task_name}? Started {duration} ago" |
| System error | `error` | "Something went wrong — check logs" |
| Habit target approaching | `waiting` | "{habit_name} should be done by {time}" |
| Test | `waving` | "Hello from Shodasha!" |
