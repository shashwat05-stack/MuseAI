'use client'

import React, { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Play, Pause, Heart, Clock, Music } from 'lucide-react'
import { AppShell } from '@/components/shell/app-shell'
import { usePlayer } from '@/components/player/player-provider'
import { playlists, getPlaylistSongs, formatPlays, formatTime } from '@/lib/music-data'
import { Button } from '@/components/ui/button'

export default function PlaylistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { playSong, current, isPlaying, likes, toggleLike } = usePlayer()

  const id = params.id as string
  const playlist = useMemo(() => playlists.find((p) => p.id === id) || playlists[0], [id])
  const playlistSongs = useMemo(() => getPlaylistSongs(playlist), [playlist])

  const isPlaylistPlaying = current && playlistSongs.some((s) => s.id === current.id) && isPlaying
  const isPlaylistLiked = likes.has(playlist.id)

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-12">
        {/* Header Section with gradient background */}
        <div 
          className="relative px-4 pt-16 pb-6 md:px-8 md:pt-24 md:pb-8 flex flex-col gap-6 md:flex-row md:items-end border-b border-border/10"
          style={{
            background: `linear-gradient(to bottom, color-mix(in srgb, ${playlist.accent || 'var(--primary)'} 25%, transparent), var(--background))`
          }}
        >
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="glass absolute top-4 left-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="size-5 text-white" />
          </button>

          {/* Cover image */}
          <div className="relative size-40 shrink-0 self-center overflow-hidden rounded-xl shadow-2xl md:size-48">
            <img 
              src={playlist.cover} 
              alt={playlist.title} 
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Playlist
            </p>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {playlist.title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
              {playlist.description}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground md:justify-start">
              <span className="font-semibold text-foreground">{playlist.curatedBy}</span>
              <span>•</span>
              <span>{playlistSongs.length} songs</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 px-4 py-6 md:px-8">
          <Button
            onClick={() => playlistSongs[0] && playSong(playlistSongs[0], playlistSongs)}
            className="size-12 rounded-full gradient-primary font-semibold text-white glow-primary hover:scale-105 active:scale-95"
          >
            {isPlaylistPlaying ? (
              <Pause className="size-5 fill-white text-white" />
            ) : (
              <Play className="size-5 fill-white text-white ml-0.5" />
            )}
          </Button>

          <button
            onClick={() => toggleLike(playlist.id)}
            className={`rounded-full border p-3 hover:scale-105 active:scale-95 transition-all
              ${isPlaylistLiked ? 'border-primary/45 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            <Heart className={`size-5 ${isPlaylistLiked ? 'fill-primary' : ''}`} />
          </button>
        </div>

        {/* Songs List */}
        <div className="px-4 md:px-8">
          {/* Table Header */}
          <div className="grid grid-cols-[30px_1fr_80px] sm:grid-cols-[30px_1fr_1fr_80px_60px] gap-4 px-4 py-2 border-b border-border/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="text-center">#</span>
            <span>Title</span>
            <span className="hidden sm:block">Album</span>
            <span className="hidden sm:block text-right">Plays</span>
            <span className="flex justify-end"><Clock className="size-4" /></span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/20 mt-1">
            {playlistSongs.map((song, i) => {
              const isCurrent = current?.id === song.id
              return (
                <div
                  key={song.id}
                  className={`group grid grid-cols-[30px_1fr_80px] sm:grid-cols-[30px_1fr_1fr_80px_60px] gap-4 items-center rounded-xl p-3 border border-transparent transition-colors hover:bg-card/60 hover:border-border/50
                    ${isCurrent ? 'bg-primary/5 border-primary/20' : ''}`}
                >
                  {/* Track number / Play icon */}
                  <div className="flex items-center justify-center text-center">
                    <span className="text-xs font-semibold text-muted-foreground group-hover:hidden">
                      {i + 1}
                    </span>
                    <button
                      onClick={() => playSong(song, playlistSongs)}
                      className="hidden text-primary group-hover:block"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="size-4 fill-current" />
                      ) : (
                        <Play className="size-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Title & Artist */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={song.cover} alt="" className="size-10 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-medium ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                        {song.title}
                      </p>
                      <button
                        onClick={() => router.push(`/artist/${song.artistId}`)}
                        className="truncate text-xs text-muted-foreground hover:underline text-left"
                      >
                        {song.artist}
                      </button>
                    </div>
                  </div>

                  {/* Album */}
                  <span className="hidden sm:block truncate text-sm text-muted-foreground">
                    {song.album}
                  </span>

                  {/* Plays */}
                  <span className="hidden sm:block text-right text-xs text-muted-foreground tabular-nums">
                    {formatPlays(song.plays)}
                  </span>

                  {/* Duration */}
                  <span className="text-right text-xs text-muted-foreground font-mono pr-2">
                    {formatTime(song.duration)}
                  </span>
                </div>
              )
            })}
            
            {playlistSongs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Music className="size-12 mb-3 opacity-30 text-primary" />
                <p className="text-sm">This playlist has no songs yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
