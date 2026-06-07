'use client'

import React, { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BadgeCheck,
  Play,
  Pause,
  Heart,
  Share2,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  Music2,
  Disc3,
  Users,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { AppShell } from '@/components/shell/app-shell'
import { usePlayer } from '@/components/player/player-provider'
import { artists, songs, formatPlays, formatTime } from '@/lib/music-data'
import { Button } from '@/components/ui/button'

const MOCK_ALBUMS = [
  { id: 'a1', title: 'Celestial Dreams', year: 2024, cover: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=300&q=80', tracks: 10 },
  { id: 'a2', title: 'Ultraviolet', year: 2023, cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80', tracks: 12 },
  { id: 'a3', title: 'Sunrise Sessions', year: 2023, cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80', tracks: 9 },
  { id: 'a4', title: 'Mind Space', year: 2022, cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&q=80', tracks: 14 },
]

function StatBadge({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex min-w-[100px] flex-col items-center gap-1 rounded-xl border border-border bg-card/60 px-4 py-3 backdrop-blur-sm">
      <Icon className="size-4 text-primary" />
      <span className="text-sm font-bold text-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  )
}

export default function ArtistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { playSong, current, isPlaying } = usePlayer()
  const [followed, setFollowed] = useState(false)
  const [activeTab, setActiveTab] = useState<'top-tracks' | 'albums' | 'about'>('top-tracks')

  const id = params.id as string
  const artist = useMemo(() => artists.find((a) => a.id === id) || artists[0], [id])
  const artistSongs = useMemo(() => songs.filter((s) => s.artistId === artist.id), [artist])

  const topTracks = artistSongs.slice(0, 5)
  const isArtistPlaying = current && artistSongs.some((s) => s.id === current.id) && isPlaying

  const TABS = [
    { id: 'top-tracks', label: 'Top Tracks', icon: TrendingUp },
    { id: 'albums', label: 'Albums', icon: Disc3 },
    { id: 'about', label: 'About', icon: Users },
  ] as const

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        {/* Hero Banner */}
        <div className="relative h-64 overflow-hidden md:h-80">
          <img
            src={artist.banner || 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=1200&q=80'}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-background" />

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="glass absolute top-4 left-4 p-2.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="size-5 text-white" />
          </button>

          {/* Share */}
          <button className="glass absolute top-4 right-4 p-2.5 rounded-full hover:bg-white/20 transition-colors">
            <Share2 className="size-5 text-white" />
          </button>
        </div>

        {/* Artist Info */}
        <div className="px-4 pb-6 md:px-8">
          <div className="relative z-10 -mt-14 mb-4 flex items-end gap-4">
            <img
              src={artist.image}
              alt={artist.name}
              className="size-24 rounded-full object-cover ring-4 ring-background shadow-2xl flex-shrink-0 md:size-28"
            />
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                  {artist.name}
                </h1>
                {artist.verified && <BadgeCheck className="size-6 text-primary flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {artist.genre} {artist.country ? `· ${artist.country}` : ''}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1 mb-5">
            <StatBadge icon={Users} label="Listeners" value={formatPlays(artist.monthlyListeners)} />
            <StatBadge icon={Heart} label="Followers" value={formatPlays(artist.followers || 120000)} />
            <StatBadge icon={TrendingUp} label="Streams" value={formatPlays(artist.totalStreams || 15000000)} />
            <StatBadge icon={Music2} label="Tracks" value={artistSongs.length.toString()} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              onClick={() => topTracks[0] && playSong(topTracks[0], artistSongs)}
              className="rounded-full gradient-primary px-6 py-2.5 font-semibold text-white glow-primary transition-all hover:scale-105 active:scale-95"
            >
              {isArtistPlaying ? (
                <>
                  <Pause className="size-4 fill-white mr-1.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="size-4 fill-white ml-0.5 mr-1.5" /> Play
                </>
              )}
            </Button>
            
            <button
              onClick={() => setFollowed((f) => !f)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border transition-all hover:scale-105 active:scale-95
                ${
                  followed
                    ? 'bg-primary/15 border-primary/40 text-primary'
                    : 'border-border text-foreground hover:border-primary/50 hover:bg-secondary'
                }`}
            >
              {followed ? (
                <>
                  <UserCheck className="size-4" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="size-4" /> Follow
                </>
              )}
            </button>

            <button className="rounded-full border border-border p-2.5 hover:border-primary/50 hover:bg-secondary transition-all">
              <MoreHorizontal className="size-5 text-muted-foreground" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-card border border-border rounded-xl p-1">
            {TABS.map(({ id: tid, label, icon: Icon }) => (
              <button
                key={tid}
                onClick={() => setActiveTab(tid)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    activeTab === tid
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'top-tracks' && (
            <div className="space-y-2">
              {topTracks.map((song, i) => {
                const isCurrent = current?.id === song.id
                return (
                  <div
                    key={song.id}
                    className={`group flex items-center gap-4 rounded-xl border border-transparent p-3 transition-colors hover:bg-card/60 hover:border-border/50
                      ${isCurrent ? 'bg-primary/5 border-primary/20' : ''}`}
                  >
                    <span className="w-5 text-center text-xs font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <button
                      onClick={() => playSong(song, artistSongs)}
                      className="relative size-12 shrink-0 overflow-hidden rounded-md"
                    >
                      <img src={song.cover} alt="" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isCurrent && isPlaying ? (
                          <Pause className="size-5 fill-white text-white" />
                        ) : (
                          <Play className="size-5 fill-white text-white ml-0.5" />
                        )}
                      </div>
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-medium ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                        {song.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{song.album}</p>
                    </div>
                    <div className="hidden text-right sm:block pr-4">
                      <p className="text-xs text-muted-foreground">{formatPlays(song.plays)} plays</p>
                    </div>
                    <span className="text-xs text-muted-foreground pr-2 font-mono">
                      {formatTime(song.duration)}
                    </span>
                  </div>
                )
              })}
              {topTracks.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No tracks available for this artist yet.
                </p>
              )}
            </div>
          )}

          {activeTab === 'albums' && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {MOCK_ALBUMS.map((album) => (
                <div key={album.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl aspect-square mb-2">
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 flex items-center justify-center group-hover:bg-black/40 transition-all">
                      <div className="opacity-0 rounded-full gradient-primary flex size-10 items-center justify-center shadow-lg glow-primary transition-opacity group-hover:opacity-100">
                        <Play className="size-4 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <p className="truncate text-sm font-semibold text-foreground">{album.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {album.year} · {album.tracks} tracks
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card/60 p-5 backdrop-blur-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                  Biography
                </h3>
                <p className="text-sm leading-relaxed text-foreground/90">{artist.bio}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Label', value: artist.label || 'Independent' },
                  { label: 'Country', value: artist.country || 'Global' },
                  { label: 'Genre', value: artist.genre },
                  { label: 'Monthly Listeners', value: formatPlays(artist.monthlyListeners) },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-border bg-card/60 p-4">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
