'use client'

import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePlayer } from '@/components/player/player-provider'
import {
  getPlaylistSongs,
  type Playlist,
  type Song,
} from '@/lib/music-data'

function PlayOverlay({ onPlay }: { onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        onPlay()
      }}
      aria-label="Play"
      className="absolute bottom-2 right-2 flex size-11 translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100"
    >
      <Play className="size-5 fill-current" />
    </button>
  )
}

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const { playSong } = usePlayer()
  const songs = getPlaylistSongs(playlist)
  return (
    <Link
      href={`/playlist/${playlist.id}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-transparent bg-card/40 p-3 transition-colors hover:border-border hover:bg-card"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={playlist.cover || '/placeholder.svg'}
          alt={playlist.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 45vw, 200px"
        />
        {songs.length > 0 && (
          <PlayOverlay onPlay={() => playSong(songs[0], songs)} />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{playlist.title}</p>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {playlist.description}
        </p>
      </div>
    </Link>
  )
}

export function SongCard({ song, queue }: { song: Song; queue?: Song[] }) {
  const { playSong } = usePlayer()
  return (
    <Link
      href={`/artist/${song.artistId}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-transparent bg-card/40 p-3 transition-colors hover:border-border hover:bg-card"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={song.cover || '/placeholder.svg'}
          alt={song.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 45vw, 200px"
        />
        <PlayOverlay onPlay={() => playSong(song, queue ?? [song])} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{song.title}</p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
      </div>
    </Link>
  )
}
