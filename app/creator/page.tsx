import { AppShell } from "@/components/shell/app-shell"
import { TopBar } from "@/components/shell/top-bar"
import { StudioDashboard } from "@/components/studio/studio-dashboard"

export default function CreatorPage() {
  return (
    <AppShell>
      <TopBar title="Creator Studio" />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <StudioDashboard />
      </div>
    </AppShell>
  )
}
