export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
        Settings & App Categorization
      </h1>
      <p className="text-sm text-[var(--text-secondary)]">
        Configure tracking options, categorize installed applications, and manage local SQLite data.
      </p>
    </div>
  )
}
