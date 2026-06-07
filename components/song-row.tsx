'use client'

import { Heart, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import { Equalizer } from '@/components/equalizer'
import { usePlayer } from '@/components/player/player-provider'
import { Button } from '@/components/ui/button'
import { formatPlays, formatTime, type Song } from '@/lib/music-data'
import { cn } from '@/lib/utils'

export function SongRow({
  song,
  index,
  queue,
}: {
  song: Song
  index?: number
  queue?: Song[]
}) {
  const { current, isPlaying, playSong, togglePlay, likes, toggleLike } =
    usePlayer()
  const isCurrent = current?.id === song.id
  const liked = likes.has(song.id)

  return (
    <div
      className={cn(
        'group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60 md:grid-cols-[24px_1fr_minmax(0,160px)_auto_64px]',
        isCurrent && 'bg-muted/40',
      )}
    >
      <button
        type="button"
        onClick={() => (isCurrent ? togglePlay() : playSong(song, queue))}
        className="flex size-6 items-center justify-center text-sm text-muted-foreground"
        aria-label={isCurrent && isPlaying ? 'Pause' : `Play ${song.title}`}
      >
        {isCurrent && isPlaying ? (
          <Equalizer active className="hidden md:flex" />
        ) : (
          <>
            <span className="tabular-nums group-hover:hidden">
              {typeof index === 'number' ? index + 1 : ''}
            </span>
            <Play className="hidden size-3.5 fill-current group-hover:block" />
          </>
        )}
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
          <Image
            src={song.cover || '/placeholder.svg'}
            alt=""
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              'truncate text-sm font-medium',
              isCurrent && 'text-primary',
            )}
          >
            {song.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {song.artist}
          </p>
        </div>
      </div>

      <span className="hidden truncate text-sm text-muted-foreground md:block">
        {song.album}
      </span>

      <span className="hidden text-xs tabular-nums text-muted-foreground md:block">
        {formatPlays(song.plays)}
      </span>

      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={liked ? 'Unlike' : 'Like'}
          onClick={() => toggleLike(song.id)}
          className={cn(
            'opacity-0 transition-opacity group-hover:opacity-100',
            liked && 'opacity-100',
          )}
        >
          <Heart
            className={cn('size-4', liked && 'fill-primary text-primary')}
          />
        </Button>
        <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
          {formatTime(song.duration)}
        </span>
      </div>
    </div>
  )
}
