import { DashboardContent } from "./dashboard-content"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col p-6">
      <DashboardContent />
      <div className="mt-auto pt-8 font-mono text-xs text-muted-foreground">
        (Press <kbd>d</kbd> to toggle dark mode)
      </div>
    </div>
  )
}
