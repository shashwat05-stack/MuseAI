'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SongCard } from '@/components/media-cards'
import { SongRow } from '@/components/song-row'
import { artists, songs } from '@/lib/music-data'
import { cn } from '@/lib/utils'

const GENRES = [
  'All',
  'Electronic',
  'Lo-Fi',
  'Indie Pop',
  'EDM',
  'Pop',
  'Ambient',
]

const BROWSE = [
  { label: 'Focus', color: 'var(--chart-3)' },
  { label: 'Workout', color: 'var(--chart-4)' },
  { label: 'Chill', color: 'var(--chart-1)' },
  { label: 'Sleep', color: 'var(--chart-2)' },
  { label: 'Happy', color: 'var(--chart-5)' },
  { label: 'Sad', color: 'var(--chart-2)' },
]

export function SearchContent() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('All')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return songs.filter((s) => {
      const matchesGenre = genre === 'All' || s.genre === genre
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q) ||
        s.mood.some((m) => m.includes(q))
      return matchesGenre && matchesQuery
    })
  }, [query, genre])

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 md:px-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Songs, artists, moods, genres, BPM..."
          className="h-12 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {GENRES.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGenre(g)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
              genre === g
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {!query && genre === 'All' ? (
        <>
          <section>
            <h2 className="mb-3 text-xl font-semibold tracking-tight">
              Browse moods
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {BROWSE.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => setQuery(b.label.toLowerCase())}
                  className="relative aspect-square overflow-hidden rounded-xl p-3 text-left"
                  style={{
                    background: `linear-gradient(140deg, ${b.color}, color-mix(in oklch, ${b.color} 40%, black))`,
                  }}
                >
                  <span className="text-sm font-semibold text-background">
                    {b.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold tracking-tight">
              Top artists
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {artists.map((a) => (
                <SongCard
                  key={a.id}
                  song={{
                    ...songs.find((s) => s.artistId === a.id)!,
                    title: a.name,
                    artist: a.genre,
                    cover: a.image,
                  }}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section>
          <h2 className="mb-3 text-xl font-semibold tracking-tight">
            {results.length} result{results.length === 1 ? '' : 's'}
          </h2>
          <div className="flex flex-col">
            {results.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} queue={results} />
            ))}
            {results.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No matches. Try a different mood or genre.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
