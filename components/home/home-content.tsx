'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Play, Pause, Sparkles, Waves, Zap, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePlayer } from '@/components/player/player-provider'
import { PlaylistCard, SongCard } from '@/components/media-cards'
import { SectionHeader } from '@/components/section-header'
import { Button, buttonVariants } from '@/components/ui/button'
import { getPlaylistSongs, playlists, songs, artists, type Song } from '@/lib/music-data'
import { cn } from '@/lib/utils'

const MOODS_LIST = [
  { name: 'chill', label: 'Chill', emoji: '☕', gradient: 'from-blue-600/20 to-teal-500/20', border: 'hover:border-blue-500/40' },
  { name: 'energetic', label: 'Energetic', emoji: '⚡', gradient: 'from-amber-600/20 to-orange-500/20', border: 'hover:border-amber-500/40' },
  { name: 'happy', label: 'Happy', emoji: '😊', gradient: 'from-yellow-600/20 to-amber-500/20', border: 'hover:border-yellow-500/40' },
  { name: 'sad', label: 'Sad', emoji: '😢', gradient: 'from-indigo-600/20 to-blue-500/20', border: 'hover:border-indigo-500/40' },
  { name: 'focused', label: 'Focused', emoji: '🎯', gradient: 'from-emerald-600/20 to-teal-500/20', border: 'hover:border-emerald-500/40' },
  { name: 'peaceful', label: 'Peaceful', emoji: '🕊️', gradient: 'from-sky-600/20 to-indigo-500/20', border: 'hover:border-sky-500/40' },
]

function MoodHero() {
  const featured = playlists[0]
  const { playSong, current, isPlaying, togglePlay } = usePlayer()
  const featuredSongs = getPlaylistSongs(featured)
  const isFeaturedPlaying = current && featuredSongs.some(s => s.id === current.id) && isPlaying

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
      <div className="absolute inset-0">
        <Image
          src="/covers/midnight-drive.png"
          alt=""
          fill
          className="object-cover opacity-40 transition-transform duration-10000 hover:scale-105"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-card/30" />
      </div>
      <div className="relative flex flex-col gap-5 p-6 md:max-w-xl md:p-8">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
          <Sparkles className="size-3.5" />
          Tuned to your mood
        </span>
        <div>
          <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl font-heading">
            MuseAI sensed you&apos;re winding down
          </h2>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            Based on a slower listening pace and the late hour, here&apos;s a
            calm, focused set to ease into the evening.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            className="rounded-full px-5 gradient-primary text-white glow-primary font-semibold transition-all hover:scale-105 active:scale-95"
            onClick={() => {
              if (isFeaturedPlaying) {
                togglePlay()
              } else if (featuredSongs[0]) {
                playSong(featuredSongs[0], featuredSongs)
              }
            }}
          >
            {isFeaturedPlaying ? (
              <>
                <Pause className="size-4 fill-current mr-1.5" />
                Pause the mix
              </>
            ) : (
              <>
                <Play className="size-4 fill-current mr-1.5" />
                Play the mix
              </>
            )}
          </Button>
          <Link
            href="/mood"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'rounded-full px-5 hover:bg-secondary transition-all'
            )}
          >
            <Waves className="size-4 mr-1.5" />
            Open Mood AI
          </Link>
        </div>
      </div>
    </div>
  )
}

function QuickPicks() {
  const { playSong, current, isPlaying, togglePlay } = usePlayer()
  const picks = useMemo(() => songs.slice(0, 6), [])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {picks.map((song) => {
        const isCurrent = current?.id === song.id
        return (
          <div
            key={song.id}
            className={cn(
              "group flex items-center gap-3 overflow-hidden rounded-xl bg-card/40 border border-border/40 p-1.5 pr-3 text-left transition-all hover:bg-card hover:border-border",
              isCurrent && "border-primary/20 bg-primary/5"
            )}
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={song.cover || '/placeholder.svg'}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn("truncate text-sm font-semibold", isCurrent && "text-primary")}>{song.title}</p>
              <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
            </div>
            
            <button
              type="button"
              onClick={() => (isCurrent ? togglePlay() : playSong(song, picks))}
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-200 shadow-md",
                isCurrent ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
              )}
            >
              {isCurrent && isPlaying ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}

function QuickPlayRow() {
  const { playSong, current, isPlaying, togglePlay } = usePlayer()
  const router = useRouter()

  const QUICK_ITEMS = [
    { id: 'p1', name: 'Daily Mix 1', gradient: 'from-violet-600/20 to-purple-800/20', hoverBorder: 'hover:border-violet-500/30', emoji: '🎵' },
    { id: 'p2', name: 'Weekly Discovery', gradient: 'from-pink-600/20 to-rose-700/20', hoverBorder: 'hover:border-pink-500/30', emoji: '🔥' },
    { id: 'p3', name: 'Deep Focus Flow', gradient: 'from-emerald-600/20 to-teal-700/20', hoverBorder: 'hover:border-emerald-500/30', emoji: '🎯' },
    { id: 'p4', name: 'Workout Surge', gradient: 'from-red-600/20 to-orange-600/20', hoverBorder: 'hover:border-red-500/30', emoji: '💪' },
    { id: 'p5', name: 'Rainy Evening', gradient: 'from-cyan-600/20 to-blue-700/20', hoverBorder: 'hover:border-cyan-500/30', emoji: '🌙' },
    { id: 'p6', name: 'Sleep Drift', gradient: 'from-sky-600/20 to-indigo-700/20', hoverBorder: 'hover:border-sky-500/30', emoji: '✨' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {QUICK_ITEMS.map((item) => {
        const playlist = playlists.find(p => p.id === item.id) || playlists[0]
        const playlistSongs = getPlaylistSongs(playlist)
        const isCurrentPlaylist = current && playlistSongs.some(s => s.id === current.id)
        const isCurrentPlaylistPlaying = isCurrentPlaylist && isPlaying

        return (
          <div
            key={item.id}
            onClick={() => router.push(`/playlist/${item.id}`)}
            className={cn(
              "group relative flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br border border-border/40 text-left transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 cursor-pointer shadow-sm",
              item.gradient,
              item.hoverBorder,
              isCurrentPlaylist && "border-primary/40"
            )}
          >
            <div className="flex size-12 shrink-0 items-center justify-center bg-black/10 text-xl font-semibold select-none">
              {item.emoji}
            </div>
            
            <div className="flex-1 min-w-0 pr-2 py-2">
              <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation() // Prevent navigating to playlist page when clicking play button
                if (isCurrentPlaylistPlaying) {
                  togglePlay()
                } else if (playlistSongs.length > 0) {
                  playSong(playlistSongs[0], playlistSongs)
                }
              }}
              className={cn(
                "absolute right-2 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-200 shadow-md",
                isCurrentPlaylistPlaying ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
              )}
            >
              {isCurrentPlaylistPlaying ? (
                <Pause className="size-3.5 fill-current" />
              ) : (
                <Play className="size-3.5 fill-current ml-0.5" />
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function HomeContent() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  
  const madeForYou = playlists.slice(0, 5)
  const discovery = songs.slice(2, 8)

  const filteredSongs = useMemo(() => {
    if (!selectedMood) return []
    return songs.filter(s => s.mood.includes(selectedMood.toLowerCase()))
  }, [selectedMood])

  return (
    <div className="flex flex-col gap-10 px-4 pb-12 md:px-8">
      {/* Mood Hero Card */}
      <MoodHero />

      {/* Quick Play Row */}
      <section>
        <h2 className="mb-3 text-xl font-bold tracking-tight font-heading flex items-center gap-1.5">
          <Zap className="size-4 text-primary fill-primary" />
          Quick Play
        </h2>
        <QuickPlayRow />
      </section>

      {/* Jump back in */}
      <section>
        <h2 className="mb-3 text-xl font-bold tracking-tight font-heading">
          Jump back in
        </h2>
        <QuickPicks />
      </section>

      {/* Mood Intelligence feelings dashboard */}
      <section className="rounded-3xl border border-border bg-card/60 p-5 md:p-6 backdrop-blur-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <SectionHeader 
            title="Mood Intelligence" 
            subtitle="Let AI find the perfect soundtrack for how you feel" 
          />
          {selectedMood && (
            <button
              onClick={() => setSelectedMood(null)}
              className="flex items-center gap-1.5 self-start text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all rounded-full px-3.5 py-1.5"
            >
              <RefreshCw className="size-3" />
              Reset Mood Vibes
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5 sm:grid-cols-6">
          {MOODS_LIST.map((m) => {
            const isSelected = selectedMood === m.label
            return (
              <button
                key={m.name}
                onClick={() => setSelectedMood(m.label)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3.5 rounded-2xl border bg-gradient-to-br transition-all hover:scale-105 active:scale-95 duration-200 shadow-sm",
                  m.gradient,
                  m.border,
                  isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20 scale-105"
                    : "border-border/60"
                )}
              >
                <span className="text-3xl select-none">{m.emoji}</span>
                <span className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", isSelected && "text-primary")}>
                  {m.label}
                </span>
              </button>
            )
          })}
        </div>

        {selectedMood && (
          <div className="mt-6 border-t border-border/40 pt-6 animate-fade-in">
            <h3 className="mb-4 text-base font-bold text-foreground">
              ⚡ {selectedMood} Vibes Recommendations
            </h3>
            {filteredSongs.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No matching tracks found for this vibe. Try another feeling!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {filteredSongs.map(song => (
                  <SongCard key={song.id} song={song} queue={filteredSongs} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Made for you playlists */}
      <section>
        <SectionHeader title="Made for you" href="/library" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {madeForYou.map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </div>
      </section>

      {/* Dynamic Artists section */}
      <section>
        <SectionHeader title="Popular Artists" href="/search" />
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {artists.slice(0, 6).map((a) => (
            <Link
              key={a.id}
              href={`/artist/${a.id}`}
              className="group flex flex-col items-center text-center gap-2.5 rounded-2xl border border-transparent p-2.5 hover:border-border hover:bg-card/40 transition-all duration-300"
            >
              <div className="relative aspect-square w-24 overflow-hidden rounded-full shadow-md md:w-28 ring-2 ring-transparent group-hover:ring-primary/45 transition-all">
                <Image
                  src={a.image}
                  alt={a.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="112px"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold group-hover:text-primary transition-colors">{a.name}</p>
                <p className="truncate text-[10px] text-muted-foreground uppercase tracking-wider">{a.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Weekly discovery */}
      <section>
        <SectionHeader title="Weekly discovery" href="/search" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {discovery.map((s) => (
            <SongCard key={s.id} song={s} queue={discovery} />
          ))}
        </div>
      </section>

      {/* Text-to-song studio banner */}
      <Link
        href="/studio"
        className="group flex items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6 transition-all hover:bg-primary/10 hover:border-primary/40 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md glow-primary">
            <Sparkles className="size-6" />
          </span>
          <div>
            <p className="font-semibold text-foreground">Create a song from a single prompt</p>
            <p className="text-sm text-muted-foreground">
              Describe a vibe and let MuseAI compose lyrics, a concept, and a
              full arrangement.
            </p>
          </div>
        </div>
        <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
