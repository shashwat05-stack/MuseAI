'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Waves, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpMode, setOtpMode] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  const { register, verifyOtp } = useAuth()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await register(email, name)
      setOtpMode(true)
      setInfoMessage('A verification code has been sent to your email. Enter 123456 to verify!')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await verifyOtp(email, otpCode)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Use 123456.')
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
            {otpMode ? 'Enter Code' : 'Create Account'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {otpMode ? `We sent a code to ${email}` : 'Join MuseAI and compose your sound'}
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {infoMessage && (
          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {infoMessage}
          </div>
        )}

        {!otpMode ? (
          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background/50 px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary"
              />
            </div>

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
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Password
              </label>
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
                  Sending code...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
            <div>
              <label htmlFor="otp" className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                One-Time Passcode
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="mt-1.5 h-12 w-full text-center tracking-widest text-lg font-bold rounded-xl border border-input bg-background/50 px-3 outline-none focus-visible:border-primary"
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
                  Verifying...
                </>
              ) : (
                'Verify & Log In'
              )}
            </Button>
            
            <button
              type="button"
              onClick={() => {
                setOtpMode(false)
                setError(null)
                setInfoMessage(null)
              }}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-2"
            >
              ← Back to Registration
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
