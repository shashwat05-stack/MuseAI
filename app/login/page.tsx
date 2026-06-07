'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Waves, Loader2, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await login(email, password)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 aurora-bg opacity-30" />
      <div className="absolute -top-40 -left-40 size-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-chart-2/20 blur-3xl" />

      {/* Login Card */}
      <div className="glass relative z-10 w-full max-w-md rounded-2xl border border-white/5 bg-card/40 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-xl gradient-primary text-white shadow-lg glow-primary">
            <Waves className="size-6" />
          </div>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your MuseAI account
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background/50 px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background/50 px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl gradient-primary font-semibold text-white glow-primary mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-white/10" />
          <span className="relative bg-[#0c1418] px-3 text-xs uppercase text-muted-foreground">
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setEmail('guest@museai.com')
              setPassword('guestpass')
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background/30 py-2.5 text-xs font-semibold text-foreground hover:bg-background/60 transition-colors"
          >
            Fill Demo Creds
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 py-2.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            <Sparkles className="size-3.5" />
            Guest Access
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
