import { SearchContent } from '@/components/search/search-content'
import { AppShell } from '@/components/shell/app-shell'
import { TopBar } from '@/components/shell/top-bar'

export default function Page() {
  return (
    <AppShell>
      <TopBar title="Search" />
      <SearchContent />
    </AppShell>
  )
}
