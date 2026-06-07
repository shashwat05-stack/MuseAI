'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

// Deterministic pseudo-random waveform from a seed string
function bars(seed: string, count: number): number[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    const base = (h % 1000) / 1000
    const env = Math.sin((i / count) * Math.PI) * 0.6 + 0.4
    out.push(Math.max(0.12, base * env))
  }
  return out
}

export function Waveform({
  seed = 'aurora',
  count = 64,
  active = false,
  className,
}: {
  seed?: string
  count?: number
  active?: boolean
  className?: string
}) {
  const data = useMemo(() => bars(seed, count), [seed, count])
  return (
    <div
      className={cn('flex h-16 items-center gap-[3px]', className)}
      aria-hidden="true"
    >
      {data.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-full bg-primary/70"
          style={{
            height: `${v * 100}%`,
            transformOrigin: 'center',
            animation: active
              ? `eq-bar ${0.8 + (i % 5) * 0.12}s ease-in-out ${(i % 7) * 0.05}s infinite`
              : 'none',
          }}
        />
      ))}
    </div>
  )
}
