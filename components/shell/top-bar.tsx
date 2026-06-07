'use client'

import { Bell, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function TopBar({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const getUserInitials = () => {
    if (!user?.name) return 'GU'
    return user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 py-4 md:px-8 md:py-6 glass border-b border-border/10">
      <div className="min-w-0">
        <h1 className="truncate text-balance text-2xl font-semibold tracking-tight md:text-3xl font-heading">
          {title ?? (user ? `${greeting()}, ${user.name}` : greeting())}
        </h1>
        {subtitle && (
          <p className="mt-1 text-pretty text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="hidden sm:inline-flex rounded-full">
          <Bell className="size-5" />
        </Button>

        {user ? (
          <div className="flex items-center gap-3">
            <span 
              title={user.email}
              className="flex size-9 items-center justify-center rounded-full gradient-primary text-sm font-semibold text-white shadow-md glow-primary cursor-pointer select-none"
            >
              {getUserInitials()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              title="Sign Out"
              onClick={logout}
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => router.push('/login')}
            className="rounded-full px-5 py-2 gradient-primary text-white text-xs font-semibold glow-primary"
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  )
}
