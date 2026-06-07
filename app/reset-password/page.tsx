'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Waves, Loader2, ArrowLeft } from 'lucide-react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { resetPassword } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !token.trim() || !newPassword.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await resetPassword(email, token, newPassword)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass relative z-10 w-full max-w-md rounded-2xl border border-white/5 bg-card/40 p-8 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-xl gradient-primary text-white shadow-lg glow-primary">
          <Waves className="size-6" />
        </div>
        <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-foreground">
          New Password
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {success ? 'Password reset successfully!' : 'Enter your reset token and new password'}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success ? (
        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary text-center">
          Success! Redirecting you to login...
        </div>
      ) : (
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
            <label htmlFor="token" className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Reset Token
            </label>
            <input
              id="token"
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. MUSEAI123"
              className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background/50 px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      )}

      <div className="mt-6 flex justify-center">
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute inset-0 aurora-bg opacity-30" />
      <div className="absolute -top-40 -left-40 size-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-chart-2/20 blur-3xl" />

      <Suspense fallback={
        <div className="glass relative z-10 w-full max-w-md rounded-2xl border border-white/5 bg-card/40 p-8 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
