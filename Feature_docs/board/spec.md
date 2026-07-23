# Feature Specification: Board (Kanban Task Management)

## Overview
The Board page (`/board`) is a core feature of Shodasha. It allows users to visually organize, create, edit, reorder, and drag-and-drop tasks across configurable Kanban columns (e.g., "To Do", "In Progress", "Done").

---

## Target Audience & Visitor Mode
- **Mode:** Operate — quick, tactile, drag-and-drop task management.
- **Vibe:** Clean editorial, high tactile feedback, spring animations on drop, no visual clutter.

---

## User Stories & Requirements

### 1. Kanban Columns
- **Default Columns:** "To Do", "In Progress", "Done".
- **Column Actions:**
  - Add a new column with a custom name.
  - Rename an existing column inline.
  - Delete a column (with confirmation dialog; tasks inside deleted column are moved to "To Do" or unassigned).
  - Reorder columns horizontally (optional or via position controls).

### 2. Task Cards
- Displays task `title`, `tags` (colored badges), `dueDate` (if set), and `linkedHabit` badge (if auto-completable).
- Action buttons on card hover: quick complete checkbox, edit modal trigger, delete.
- Tactile drag handles using `@dnd-kit`.

### 3. Drag & Drop Interaction (@dnd-kit/core + @dnd-kit/sortable)
- Smooth card dragging between columns and reordering within columns.
- Drop target highlight with accent border and subtle scale feedback.
- Moving a task to "Done" column automatically updates `status` to `'done'`.

### 4. Task Modal (Creation & Editing)
- Click card or "+ Add Task" button → opens animated slide-in modal or dialog.
- Fields: Title (required), Description (optional), Column/Status select, Due Date, Tags input (comma separated or tag pill adder), Linked Habit picker.
- Actions: Save changes, Delete Task, Close.

---

## Data Schema & Store Integration (`useTaskStore`)
- Entity definitions match `CONTEXT.md`.
- State operations: `addTask`, `moveTask`, `toggleTaskStatus`, `deleteTask`, `addColumn`, `renameColumn`, `deleteColumn`.
