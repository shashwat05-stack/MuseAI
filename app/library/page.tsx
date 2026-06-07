import { LibraryContent } from '@/components/library/library-content'
import { AppShell } from '@/components/shell/app-shell'
import { TopBar } from '@/components/shell/top-bar'

export default function Page() {
  return (
    <AppShell>
      <TopBar title="Your Library" />
      <LibraryContent />
    </AppShell>
  )
}
