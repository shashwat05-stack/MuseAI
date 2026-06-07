'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Waves, Loader2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { requestResetPassword } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await requestResetPassword(email)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Request failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute inset-0 aurora-bg opacity-30" />
      <div className="absolute -top-40 -left-40 size-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-chart-2/20 blur-3xl" />

      <div className="glass relative z-10 w-full max-w-md rounded-2xl border border-white/5 bg-card/40 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-xl gradient-primary text-white shadow-lg glow-primary">
            <Waves className="size-6" />
          </div>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-foreground">
            Reset Password
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {submitted ? 'Check your inbox' : 'We will send you instructions to reset your password'}
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {!submitted ? (
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

            <Button
              type="submit"
              className="w-full rounded-xl gradient-primary font-semibold text-white glow-primary mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Requesting...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        ) : (
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              A recovery link and token have been sent to <strong>{email}</strong>. For quick testing, you can proceed directly to the reset screen.
            </p>
            <Button
              onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
              className="w-full rounded-xl gradient-primary font-semibold text-white glow-primary"
            >
              Go to Reset Form
            </Button>
          </div>
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
    </div>
  )
}
