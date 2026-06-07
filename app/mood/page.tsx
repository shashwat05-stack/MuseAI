import { MoodContent } from '@/components/mood/mood-content'
import { AppShell } from '@/components/shell/app-shell'
import { TopBar } from '@/components/shell/top-bar'

export default function Page() {
  return (
    <AppShell>
      <TopBar
        title="Mood AI"
        subtitle="MuseAI reads how you feel and turns it into the right music."
      />
      <MoodContent />
    </AppShell>
  )
}
