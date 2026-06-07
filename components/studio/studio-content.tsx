'use client'

import {
  Download,
  Loader2,
  Music2,
  Pause,
  Play,
  Share2,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { useState } from 'react'
import { Waveform } from '@/components/waveform'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SongResult = {
  title: string
  concept: string
  structure: { section: string; lines: string[] }[]
  production: {
    bpm: number
    key: string
    instruments: string[]
    vocalStyle: string
  }
}

const GENRES = [
  'Pop',
  'Lo-Fi',
  'EDM',
  'Hip-Hop',
  'Bollywood',
  'Rock',
  'R&B',
  'Ambient',
]
const MOODS = [
  'Uplifting',
  'Romantic',
  'Melancholic',
  'Energetic',
  'Dreamy',
  'Dark',
]
const LANGUAGES = ['English', 'Hindi', 'Spanish', 'Korean', 'French']

const STAGES = [
  'Interpreting your brief',
  'Writing lyrics',
  'Composing melody',
  'Arranging instruments',
  'Rendering vocals',
]

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {label}
    </button>
  )
}

export function StudioContent() {
  const [prompt, setPrompt] = useState('')
  const [genre, setGenre] = useState('Pop')
  const [mood, setMood] = useState('Uplifting')
  const [language, setLanguage] = useState('English')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [result, setResult] = useState<SongResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)

  async function generate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setStage(0)
    const interval = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1))
    }, 1400)
    try {
      const res = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, genre, mood, language }),
      })
      if (!res.ok) throw new Error('failed')
      const data = (await res.json()) as SongResult
      setResult(data)
      setPlaying(true)
    } catch {
      setError('MuseAI could not compose that right now. Try again.')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 px-4 pb-8 md:px-8 lg:grid-cols-[400px_1fr]">
      {/* Controls */}
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wand2 className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold leading-tight">Text to song</h2>
            <p className="text-xs text-muted-foreground">
              Describe it. MuseAI composes it.
            </p>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="A romantic late-night song about chasing city lights, with warm piano and emotional vocals..."
          className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
        />

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Genre
          </p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <Chip
                key={g}
                label={g}
                active={genre === g}
                onClick={() => setGenre(g)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Mood
          </p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <Chip
                key={m}
                label={m}
                active={mood === m}
                onClick={() => setMood(m)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Language
          </p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <Chip
                key={l}
                label={l}
                active={language === l}
                onClick={() => setLanguage(l)}
              />
            ))}
          </div>
        </div>

        <Button
          size="lg"
          className="rounded-xl"
          disabled={loading || !prompt.trim()}
          onClick={generate}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? 'Composing...' : 'Generate song'}
        </Button>
      </div>

      {/* Output */}
      <div className="min-h-[400px] rounded-2xl border border-border bg-card p-5 md:p-6">
        {!result && !loading && (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Music2 className="size-7" />
            </span>
            <p className="max-w-xs text-sm text-muted-foreground">
              Your generated track, lyrics, and production sheet will appear
              here.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-6">
            <Waveform seed={prompt || 'loading'} active className="w-full max-w-md" />
            <div className="flex flex-col items-center gap-2">
              {STAGES.map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    'flex items-center gap-2 text-sm transition-colors',
                    i < stage
                      ? 'text-muted-foreground'
                      : i === stage
                        ? 'text-foreground'
                        : 'text-muted-foreground/40',
                  )}
                >
                  {i < stage ? (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      ✓
                    </span>
                  ) : i === stage ? (
                    <Loader2 className="size-4 animate-spin text-primary" />
                  ) : (
                    <span className="size-4 rounded-full border border-border" />
                  )}
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {result && !loading && (
          <div className="flex flex-col gap-6">
            {/* generated track player */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  className="size-12 shrink-0 rounded-full"
                  aria-label={playing ? 'Pause' : 'Play'}
                  onClick={() => setPlaying((p) => !p)}
                >
                  {playing ? (
                    <Pause className="size-5 fill-current" />
                  ) : (
                    <Play className="size-5 fill-current" />
                  )}
                </Button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-semibold">
                    {result.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    AI generated · {genre} · {result.production.bpm} BPM ·{' '}
                    {result.production.key}
                  </p>
                </div>
              </div>
              <Waveform
                seed={result.title}
                active={playing}
                className="mt-4"
              />
              <div className="mt-3 flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Download className="size-3.5" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Share2 className="size-3.5" />
                  Publish
                </Button>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {result.concept}
            </p>

            {/* production sheet */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Tempo</p>
                <p className="font-semibold">{result.production.bpm} BPM</p>
              </div>
              <div className="rounded-lg border border-border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Key</p>
                <p className="font-semibold">{result.production.key}</p>
              </div>
              <div className="col-span-2 rounded-lg border border-border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Vocals</p>
                <p className="truncate font-semibold">
                  {result.production.vocalStyle}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {result.production.instruments.map((inst) => (
                <span
                  key={inst}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {inst}
                </span>
              ))}
            </div>

            {/* lyrics */}
            <div>
              <h3 className="mb-3 font-semibold">Lyrics</h3>
              <div className="flex flex-col gap-4">
                {result.structure.map((sec, i) => (
                  <div key={i}>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {sec.section}
                    </p>
                    <div className="text-sm leading-relaxed">
                      {sec.lines.map((line, j) => (
                        <p key={j} className="text-foreground/90">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
