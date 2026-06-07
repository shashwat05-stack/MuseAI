'use client'

import { Heart } from 'lucide-react'
import { usePlayer } from '@/components/player/player-provider'
import { PlaylistCard } from '@/components/media-cards'
import { SongRow } from '@/components/song-row'
import { playlists, songs } from '@/lib/music-data'

export function LibraryContent() {
  const { likes } = usePlayer()
  const liked = songs.filter((s) => likes.has(s.id))

  return (
    <div className="flex flex-col gap-10 px-4 pb-8 md:px-8">
      <section>
        <div className="mb-4 flex items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-card p-5">
          <span className="flex size-16 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Heart className="size-8 fill-primary" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Playlist
            </p>
            <h2 className="text-2xl font-semibold">Liked Songs</h2>
            <p className="text-sm text-muted-foreground">
              {liked.length} song{liked.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          {liked.length > 0 ? (
            liked.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} queue={liked} />
            ))
          ) : (
            <p className="py-6 text-sm text-muted-foreground">
              Songs you like will collect here. Tap the heart on any track.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold tracking-tight">
          Your playlists
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {playlists.map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
