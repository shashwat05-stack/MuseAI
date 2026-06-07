'use client'

import {
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react'
import Image from 'next/image'
import { Equalizer } from '@/components/equalizer'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/lib/music-data'
import { cn } from '@/lib/utils'
import { usePlayer } from './player-provider'

function Scrubber({
  value,
  onChange,
  className,
  ariaLabel,
}: {
  value: number
  onChange: (ratio: number) => void
  className?: string
  ariaLabel: string
}) {
  return (
    <div
      role="slider"
      aria-label={ariaLabel}
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      className={cn(
        'group relative h-1.5 cursor-pointer rounded-full bg-muted',
        className,
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        onChange((e.clientX - rect.left) / rect.width)
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onChange(Math.min(1, value + 0.05))
        if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 0.05))
      }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary"
        style={{ width: `${value * 100}%` }}
      />
      <div
        className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow transition-opacity group-hover:opacity-100"
        style={{ left: `calc(${value * 100}% - 6px)` }}
      />
    </div>
  )
}

export function PlayerBar() {
  const {
    current,
    isPlaying,
    progress,
    elapsed,
    volume,
    shuffle,
    repeat,
    likes,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
  } = usePlayer()

  if (!current) return null
  const liked = likes.has(current.id)

  return (
    <footer className="glass-strong fixed inset-x-0 bottom-0 z-40 border-t border-border md:left-64">
      {/* mobile progress line */}
      <div className="md:hidden">
        <div className="h-0.5 w-full bg-muted">
          <div
            className="h-full bg-primary"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 px-3 py-2.5 md:px-5 md:py-3">
        {/* track info */}
        <div className="flex min-w-0 items-center gap-3 md:w-72">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-md md:size-12">
            <Image
              src={current.cover || '/placeholder.svg'}
              alt={`${current.title} cover`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{current.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {current.artist}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={() => toggleLike(current.id)}
            className="hidden shrink-0 md:inline-flex"
          >
            <Heart
              className={cn(
                'size-4',
                liked && 'fill-primary text-primary',
              )}
            />
          </Button>
        </div>

        {/* controls */}
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Shuffle"
              onClick={toggleShuffle}
              className={cn('hidden sm:inline-flex', shuffle && 'text-primary')}
            >
              <Shuffle className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous"
              onClick={prev}
            >
              <SkipBack className="size-5 fill-current" />
            </Button>
            <Button
              size="icon"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="size-10 rounded-full"
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 fill-current" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next"
              onClick={next}
            >
              <SkipForward className="size-5 fill-current" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Repeat"
              onClick={toggleRepeat}
              className={cn('hidden sm:inline-flex', repeat && 'text-primary')}
            >
              <Repeat className="size-4" />
            </Button>
          </div>
          <div className="hidden w-full max-w-xl items-center gap-2 sm:flex">
            <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground">
              {formatTime(elapsed)}
            </span>
            <Scrubber
              value={progress}
              onChange={seek}
              ariaLabel="Seek"
              className="flex-1"
            />
            <span className="w-10 text-[11px] tabular-nums text-muted-foreground">
              {formatTime(current.duration)}
            </span>
          </div>
        </div>

        {/* right side */}
        <div className="hidden items-center gap-2 md:flex md:w-72 md:justify-end">
          <Equalizer active={isPlaying} className="mr-1" />
          <Button variant="ghost" size="icon-sm" aria-label="Queue">
            <ListMusic className="size-4" />
          </Button>
          <Volume2 className="size-4 text-muted-foreground" />
          <Scrubber
            value={volume}
            onChange={setVolume}
            ariaLabel="Volume"
            className="w-24"
          />
        </div>

        {/* mobile play already covered; mobile like */}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={liked ? 'Unlike' : 'Like'}
          onClick={() => toggleLike(current.id)}
          className="md:hidden"
        >
          <Heart className={cn('size-5', liked && 'fill-primary text-primary')} />
        </Button>
      </div>
    </footer>
  )
}
