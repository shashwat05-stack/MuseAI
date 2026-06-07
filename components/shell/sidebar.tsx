'use client'

import {
  BarChart3,
  Heart,
  Home,
  Library,
  type LucideIcon,
  Search,
  Sparkles,
  Waves,
  User,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { playlists } from '@/lib/music-data'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

type NavItem = { href: string; label: string; icon: LucideIcon }

const mainNav: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/library', label: 'Library', icon: Library },
]

const aiNav: NavItem[] = [
  { href: '/mood', label: 'Mood AI', icon: Waves },
  { href: '/studio', label: 'Create Studio', icon: Sparkles },
  { href: '/creator', label: 'Creator Hub', icon: BarChart3 },
]

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md glow-primary">
        <Waves className="size-5" />
      </span>
      <span className="font-heading text-lg font-bold tracking-tight">MuseAI</span>
    </Link>
  )
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground',
      )}
    >
      <Icon className="size-5 shrink-0" />
      {item.label}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const getUserInitials = () => {
    if (!user?.name) return 'U'
    return user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-4 border-r border-border bg-sidebar p-3 md:flex">
      <div className="pt-3">
        <Brand />
      </div>

      <nav className="flex flex-col gap-1 mt-2">
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
          AI Suite
        </p>
        {aiNav.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col border-t border-border/40 pt-4">
        <div className="flex items-center gap-2 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
          <Library className="size-3.5 text-primary" />
          Your Playlists
        </div>
        <div className="scrollbar-none flex flex-col gap-0.5 overflow-y-auto pr-1">
          <Link
            href="/library"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-foreground"
          >
            <span className="flex size-8 items-center justify-center rounded bg-primary/15 text-primary">
              <Heart className="size-4 fill-primary" />
            </span>
            <span className="font-medium">Liked Songs</span>
          </Link>
          
          {playlists.map((p) => (
            <Link
              key={p.id}
              href={`/playlist/${p.id}`}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent/50 hover:text-foreground',
                pathname === `/playlist/${p.id}`
                  ? 'text-primary bg-primary/5 border-l-2 border-primary pl-2.5 font-medium'
                  : 'text-muted-foreground',
              )}
            >
              <span className="truncate">{p.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="mt-auto border-t border-border/40 pt-4 pb-2">
        {user ? (
          <div className="flex items-center justify-between rounded-xl bg-card/40 border border-border/30 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-white">
                {getUserInitials()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              title="Log Out"
              className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-1">
            <p className="text-[10px] text-center text-muted-foreground">Sign in to save custom creations</p>
            <Link 
              href="/login"
              className="w-full text-center rounded-xl bg-primary text-primary-foreground py-2 text-xs font-semibold hover:bg-primary/95 transition-all shadow-md"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
