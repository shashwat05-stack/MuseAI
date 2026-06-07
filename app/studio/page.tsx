import { AppShell } from '@/components/shell/app-shell'
import { TopBar } from '@/components/shell/top-bar'
import { StudioContent } from '@/components/studio/studio-content'

export default function Page() {
  return (
    <AppShell>
      <TopBar
        title="Create Studio"
        subtitle="Turn a single prompt into a complete song — lyrics, arrangement and all."
      />
      <StudioContent />
    </AppShell>
  )
}
