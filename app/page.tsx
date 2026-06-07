import { AppShell } from '@/components/shell/app-shell'
import { TopBar } from '@/components/shell/top-bar'
import { HomeContent } from '@/components/home/home-content'

export default function Page() {
  return (
    <AppShell>
      <TopBar subtitle="Here's what MuseAI has cued up for you." />
      <HomeContent />
    </AppShell>
  )
}
