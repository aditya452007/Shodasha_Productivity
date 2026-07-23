export default function BoardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
        Kanban Board
      </h1>
      <p className="text-sm text-[var(--text-secondary)]">
        Organize and track your tasks across custom workflow columns.
      </p>
    </div>
  )
}
