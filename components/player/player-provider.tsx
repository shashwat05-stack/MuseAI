'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { songs as allSongs, type Song } from '@/lib/music-data'

type PlayerContextValue = {
  current: Song | null
  queue: Song[]
  isPlaying: boolean
  progress: number // 0..1
  elapsed: number // seconds
  volume: number
  shuffle: boolean
  repeat: boolean
  likes: Set<string>
  playSong: (song: Song, queue?: Song[]) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  seek: (ratio: number) => void
  setVolume: (v: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  toggleLike: (id: string) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<Song | null>(allSongs[0] ?? null)
  const [queue, setQueue] = useState<Song[]>(allSongs)
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [likes, setLikes] = useState<Set<string>>(new Set(['s1', 's8']))

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize HTML5 Audio on the client side
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio
    audio.volume = volume

    const handleTimeUpdate = () => {
      setElapsed(audio.currentTime)
    }

    const handleEnded = () => {
      // Trigger next song when current one ends
      next()
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    // Sync source on startup
    if (current?.audioUrl) {
      audio.src = current.audioUrl
      audio.load()
    }

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Handle source changes when song updates
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current) return

    const wasPlaying = isPlaying

    // Change source
    audio.src = current.audioUrl
    audio.load()
    setElapsed(0)

    if (wasPlaying) {
      audio.play().catch((err) => {
        console.warn('Audio play failed:', err.message)
        setIsPlaying(false)
      })
    }
  }, [current])

  // Handle Play/Pause trigger
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Audio play failed:', err.message)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Handle Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const next = useCallback(() => {
    setCurrent((cur) => {
      if (!cur || queue.length === 0) return cur
      const idx = queue.findIndex((s) => s.id === cur.id)
      let nextIdx: number
      if (shuffle) {
        nextIdx = Math.floor(Math.random() * queue.length)
      } else {
        nextIdx = (idx + 1) % queue.length
      }
      return queue[nextIdx]
    })
    setElapsed(0)
  }, [queue, shuffle])

  const prev = useCallback(() => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      // If song played for more than 3 seconds, restart it
      audio.currentTime = 0
      setElapsed(0)
      return
    }

    setCurrent((cur) => {
      if (!cur || queue.length === 0) return cur
      const idx = queue.findIndex((s) => s.id === cur.id)
      const prevIdx = (idx - 1 + queue.length) % queue.length
      return queue[prevIdx]
    })
    setElapsed(0)
  }, [queue])

  const playSong = useCallback((song: Song, newQueue?: Song[]) => {
    if (newQueue) setQueue(newQueue)
    setCurrent(song)
    setElapsed(0)
    setIsPlaying(true)
  }, [])

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), [])
  
  const seek = useCallback(
    (ratio: number) => {
      const audio = audioRef.current
      if (!audio || !current) return
      const targetTime = Math.max(0, Math.min(1, ratio)) * current.duration
      audio.currentTime = targetTime
      setElapsed(targetTime)
    },
    [current],
  )
  
  const toggleShuffle = useCallback(() => setShuffle((s) => !s), [])
  const toggleRepeat = useCallback(() => setRepeat((r) => !r), [])
  const toggleLike = useCallback((id: string) => {
    setLikes((prev) => {
      const nextSet = new Set(prev)
      if (nextSet.has(id)) nextSet.delete(id)
      else nextSet.add(id)
      return nextSet
    })
  }, [])

  const value = useMemo<PlayerContextValue>(
    () => ({
      current,
      queue,
      isPlaying,
      progress: current ? elapsed / current.duration : 0,
      elapsed,
      volume,
      shuffle,
      repeat,
      likes,
      playSong,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
      toggleShuffle,
      toggleRepeat,
      toggleLike,
    }),
    [
      current,
      queue,
      isPlaying,
      elapsed,
      volume,
      shuffle,
      repeat,
      likes,
      playSong,
      togglePlay,
      next,
      prev,
      seek,
      toggleShuffle,
      toggleRepeat,
      toggleLike,
    ],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
