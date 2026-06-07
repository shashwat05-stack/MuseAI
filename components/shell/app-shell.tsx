import type { ReactNode } from 'react'
import { PlayerBar } from '@/components/player/player-bar'
import { MobileNav } from '@/components/shell/mobile-nav'
import { Sidebar } from '@/components/shell/sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:pl-64">
        {/* padding bottom accounts for player bar + mobile nav */}
        <div className="min-h-screen pb-44 md:pb-28">{children}</div>
      </main>
      <PlayerBar />
      <MobileNav />
    </div>
  )
}
