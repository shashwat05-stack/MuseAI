'use client'

import {
  Activity,
  Heart,
  Loader2,
  Moon,
  Send,
  Sparkles,
  Waves,
} from 'lucide-react'
import { useState } from 'react'
import { usePlayer } from '@/components/player/player-provider'
import { SongRow } from '@/components/song-row'
import { Button } from '@/components/ui/button'
import { getSong, type Song } from '@/lib/music-data'

type MoodResult = {
  emotion: string
  intensity: number
  summary: string
  therapyApproach: string
  moodTags: string[]
  energyTarget: number
  songIds: string[]
}

const SUGGESTIONS = [
  "I'm exhausted but can't switch my brain off.",
  'I need motivation to get through a workout.',
  'Feeling a little down and lonely tonight.',
  "I'm in a great mood, give me something fun.",
]

function Biometric({
  icon: Icon,
  label,
  value,
  unit,
  tone,
}: {
  icon: typeof Heart
  label: string
  value: string
  unit?: string
  tone?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
      {tone && <p className="text-xs text-primary">{tone}</p>}
    </div>
  )
}

export function MoodContent() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MoodResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { playSong } = usePlayer()

  async function analyze(input: string) {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      })
      if (!res.ok) throw new Error('failed')
      const data = (await res.json()) as MoodResult
      setResult(data)
    } catch {
      setError('MuseAI could not read your mood right now. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const recommended: Song[] = result
    ? result.songIds.map((id) => getSong(id)).filter((s): s is Song => Boolean(s))
    : []

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 md:px-8">
      {/* Biometrics row (simulated wearable data) */}
      <section>
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="size-4 text-primary" />
          Live signals from your connected wearable
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Biometric
            icon={Heart}
            label="Heart rate"
            value="68"
            unit="bpm"
            tone="Resting · calm"
          />
          <Biometric
            icon={Waves}
            label="HRV"
            value="54"
            unit="ms"
            tone="Balanced"
          />
          <Biometric
            icon={Activity}
            label="Stress"
            value="Low"
            tone="Down 12% today"
          />
          <Biometric
            icon={Moon}
            label="Sleep"
            value="7h 12m"
            tone="Good recovery"
          />
        </div>
      </section>

      {/* Input */}
      <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Tell MuseAI how you feel</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe your mood in your own words. MuseAI reads the emotion and
          builds a session to gently shift it.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-end gap-2 rounded-xl border border-input bg-background p-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  analyze(text)
                }
              }}
              rows={2}
              placeholder="e.g. I'm feeling tired and a bit anxious about tomorrow..."
              className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button
              size="icon"
              aria-label="Analyze mood"
              disabled={loading || !text.trim()}
              onClick={() => analyze(text)}
              className="rounded-lg"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setText(s)
                  analyze(s)
                }}
                className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Result */}
      {result && (
        <section className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Detected emotion
              </p>
              <p className="mt-1 text-3xl font-semibold">{result.emotion}</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Intensity</span>
                <span>{result.intensity}/10</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${result.intensity * 10}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Session energy target</span>
                <span>{result.energyTarget}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-chart-2"
                  style={{ width: `${result.energyTarget}%` }}
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {result.summary}
            </p>
            <div className="rounded-lg border border-border bg-card/60 p-3">
              <p className="text-xs font-medium text-primary">
                How this set helps
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {result.therapyApproach}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.moodTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Your healing session</h3>
              <Button
                size="sm"
                className="rounded-full"
                onClick={() =>
                  recommended[0] && playSong(recommended[0], recommended)
                }
              >
                Play session
              </Button>
            </div>
            <div className="flex flex-col">
              {recommended.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={i}
                  queue={recommended}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
