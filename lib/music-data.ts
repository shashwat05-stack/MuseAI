export type Song = {
  id: string
  title: string
  artist: string
  artistId: string
  album: string
  cover: string
  duration: number // seconds
  genre: string
  mood: string[]
  bpm: number
  plays: number
  audioUrl: string
  aiGenerated?: boolean
}

export type Artist = {
  id: string
  name: string
  image: string
  monthlyListeners: number
  genre: string
  verified: boolean
  bio: string
  followers?: number
  totalStreams?: number
  country?: string
  label?: string
  banner?: string
}

export type Playlist = {
  id: string
  title: string
  description: string
  cover: string
  songIds: string[]
  curatedBy: string
  accent: string
}

export const artists: Artist[] = [
  {
    id: 'aria',
    name: 'ARIA',
    image: '/artists/aria.png',
    banner: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=1200&q=80',
    monthlyListeners: 24800000,
    followers: 890000,
    totalStreams: 114800000,
    genre: 'Electronic',
    verified: true,
    country: 'United States',
    label: 'Neon Records',
    bio: 'Boundary-pushing electronic producer crafting cinematic, emotive soundscapes for the late-night drive.',
  },
  {
    id: 'koto',
    name: 'Koto Bloom',
    image: '/artists/koto.png',
    banner: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=1200&q=80',
    monthlyListeners: 12300000,
    followers: 430000,
    totalStreams: 46000000,
    genre: 'Lo-Fi',
    verified: true,
    country: 'Japan',
    label: 'Ambient House',
    bio: 'Lo-fi architect blending dusty samples, warm keys and rain-soaked atmospheres.',
  },
  {
    id: 'lumen',
    name: 'Lumen',
    image: '/artists/lumen.png',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
    monthlyListeners: 18500000,
    followers: 650000,
    totalStreams: 86500000,
    genre: 'Indie Pop',
    verified: true,
    country: 'Sweden',
    label: 'Daylight Music',
    bio: 'Indie-pop voice known for shimmering hooks and heart-on-sleeve songwriting.',
  },
  {
    id: 'luna',
    name: 'Luna Waves',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
    monthlyListeners: 2400000,
    followers: 890000,
    totalStreams: 48000000,
    genre: 'Electronic',
    verified: true,
    country: 'United States',
    label: 'Neon Records',
    bio: 'Luna Waves is an electronic music producer and DJ known for her ethereal soundscapes and hypnotic beats. With over 2.4 million monthly listeners, she has carved a unique niche blending ambient textures with deep electronic grooves.',
  },
  {
    id: 'neon',
    name: 'Neon Pulse',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
    monthlyListeners: 1800000,
    followers: 650000,
    totalStreams: 31000000,
    genre: 'EDM',
    verified: true,
    country: 'Germany',
    label: 'Ultra Records',
    bio: 'Neon Pulse brings electrifying energy to every stage. Known for festival-ready anthems and cinematic drops, this Berlin-based producer has headlined major festivals worldwide.',
  },
  {
    id: 'aria_echoes',
    name: 'Aria & The Echoes',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
    monthlyListeners: 3200000,
    followers: 1400000,
    totalStreams: 72000000,
    genre: 'Indie',
    verified: false,
    country: 'United Kingdom',
    label: 'Indie Wave',
    bio: 'Aria & The Echoes is a British indie-pop act whose soul-stirring vocals and introspective lyrics have earned them a devoted global following.',
  },
  {
    id: 'zen',
    name: 'Zen Collective',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=1200&q=80',
    monthlyListeners: 950000,
    followers: 430000,
    totalStreams: 19000000,
    genre: 'Lo-Fi',
    verified: false,
    country: 'Japan',
    label: 'Ambient House',
    bio: 'Zen Collective crafts lo-fi beats designed for studying, relaxing, and finding calm in chaos.',
  },
  {
    id: 'midnight',
    name: 'The Midnight',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
    monthlyListeners: 5100000,
    followers: 2100000,
    totalStreams: 110000000,
    genre: 'Indie',
    verified: true,
    country: 'United States',
    label: 'Counter Records',
    bio: 'The Midnight are masters of nostalgic synthwave and emotional indie-pop. Their cinematic sound transports listeners to neon-lit cityscapes.',
  },
  {
    id: 'synthex',
    name: 'Synthex',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&q=80',
    monthlyListeners: 1200000,
    followers: 510000,
    totalStreams: 24000000,
    genre: 'Electronic',
    verified: false,
    country: 'Canada',
    label: 'Digital Grid',
    bio: 'Synthex is a boundary-pushing electronic artist blending industrial textures with melodic synth leads.',
  },
]

export const songs: Song[] = [
  {
    id: 's1',
    title: 'Midnight Drive',
    artist: 'ARIA',
    artistId: 'aria',
    album: 'Neon Horizon',
    cover: '/covers/midnight-drive.png',
    duration: 218,
    genre: 'Electronic',
    mood: ['focused', 'calm', 'night', 'chill', 'relaxed'],
    bpm: 110,
    plays: 48200000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 's2',
    title: 'Golden Hour',
    artist: 'Lumen',
    artistId: 'lumen',
    album: 'Daylight',
    cover: '/covers/golden-hour.png',
    duration: 195,
    genre: 'Indie Pop',
    mood: ['happy', 'uplifting', 'calm', 'romantic', 'relaxed'],
    bpm: 102,
    plays: 33900000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 's3',
    title: 'Deep Focus',
    artist: 'Koto Bloom',
    artistId: 'koto',
    album: 'Flow State',
    cover: '/covers/deep-focus.png',
    duration: 242,
    genre: 'Lo-Fi',
    mood: ['focused', 'calm', 'relaxed', 'peaceful'],
    bpm: 88,
    plays: 27400000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 's4',
    title: 'Neon Pulse',
    artist: 'ARIA',
    artistId: 'aria',
    album: 'Neon Horizon',
    cover: '/covers/neon-pulse.png',
    duration: 201,
    genre: 'EDM',
    mood: ['energetic', 'motivated', 'happy', 'party'],
    bpm: 128,
    plays: 51700000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 's5',
    title: 'Rainy Window',
    artist: 'Koto Bloom',
    artistId: 'koto',
    album: 'Flow State',
    cover: '/covers/rainy-mood.png',
    duration: 188,
    genre: 'Lo-Fi',
    mood: ['sad', 'calm', 'night', 'relaxed', 'peaceful'],
    bpm: 76,
    plays: 19600000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: 's6',
    title: 'Sunrise Run',
    artist: 'Lumen',
    artistId: 'lumen',
    album: 'Daylight',
    cover: '/covers/sunrise-run.png',
    duration: 176,
    genre: 'Pop',
    mood: ['energetic', 'motivated', 'happy'],
    bpm: 134,
    plays: 22100000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
  {
    id: 's7',
    title: 'Lunar Tide',
    artist: 'ARIA',
    artistId: 'aria',
    album: 'Neon Horizon',
    cover: '/covers/lunar-tide.png',
    duration: 264,
    genre: 'Ambient',
    mood: ['calm', 'sleep', 'night', 'relaxed', 'peaceful'],
    bpm: 60,
    plays: 14800000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  },
  {
    id: 's8',
    title: 'Echoes',
    artist: 'Lumen',
    artistId: 'lumen',
    album: 'Daylight',
    cover: '/covers/echoes.png',
    duration: 209,
    genre: 'Indie Pop',
    mood: ['uplifting', 'calm', 'happy', 'romantic'],
    bpm: 96,
    plays: 30500000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
  {
    id: 's9',
    title: 'Midnight Bloom',
    artist: 'Luna Waves',
    artistId: 'luna',
    album: 'Celestial Dreams',
    cover: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&q=80',
    duration: 137,
    genre: 'Electronic',
    mood: ['chill', 'relaxed', 'calm', 'focused'],
    bpm: 95,
    plays: 12400000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  },
  {
    id: 's10',
    title: 'Solar Drift',
    artist: 'Neon Pulse',
    artistId: 'neon',
    album: 'Ultraviolet',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    duration: 132,
    genre: 'EDM',
    mood: ['energetic', 'party', 'happy', 'motivated'],
    bpm: 124,
    plays: 8900000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  },
  {
    id: 's11',
    title: 'City Lights',
    artist: 'The Midnight',
    artistId: 'midnight',
    album: 'Nocturnal',
    cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
    duration: 141,
    genre: 'Indie',
    mood: ['melancholic', 'chill', 'night', 'sad'],
    bpm: 105,
    plays: 24500000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  },
  {
    id: 's12',
    title: 'Pulse Wave',
    artist: 'Synthex',
    artistId: 'synthex',
    album: 'Digital Horizon',
    cover: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80',
    duration: 155,
    genre: 'Electronic',
    mood: ['energetic', 'motivated', 'party'],
    bpm: 120,
    plays: 6200000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  },
  {
    id: 's13',
    title: 'Raindrop Café',
    artist: 'Zen Collective',
    artistId: 'zen',
    album: 'Mind Space',
    cover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80',
    duration: 148,
    genre: 'Classical',
    mood: ['peaceful', 'relaxed', 'calm'],
    bpm: 72,
    plays: 15400000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  },
  {
    id: 's14',
    title: 'Neon Rush',
    artist: 'Neon Pulse',
    artistId: 'neon',
    album: 'Overdrive',
    cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80',
    duration: 160,
    genre: 'Trap',
    mood: ['angry', 'energetic', 'motivated'],
    bpm: 140,
    plays: 7800000,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  },
]

export const playlists: Playlist[] = [
  {
    id: 'p1',
    title: 'Daily Mix 1',
    description: 'A blend tuned to your recent listening — refreshed every morning.',
    cover: '/covers/midnight-drive.png',
    songIds: ['s1', 's4', 's9', 's11'],
    curatedBy: 'MuseAI',
    accent: 'var(--chart-1)',
  },
  {
    id: 'p2',
    title: 'Weekly Discovery',
    description: 'Fresh tracks the AI thinks you have not heard but will love.',
    cover: '/covers/echoes.png',
    songIds: ['s8', 's2', 's6', 's10'],
    curatedBy: 'MuseAI',
    accent: 'var(--chart-2)',
  },
  {
    id: 'p3',
    title: 'Deep Focus Flow',
    description: 'Minimal, distraction-free sound for deep work sessions.',
    cover: '/covers/deep-focus.png',
    songIds: ['s3', 's5', 's13', 's7'],
    curatedBy: 'MuseAI',
    accent: 'var(--chart-3)',
  },
  {
    id: 'p4',
    title: 'Workout Surge',
    description: 'High-BPM energy to push through every set.',
    cover: '/covers/sunrise-run.png',
    songIds: ['s4', 's6', 's12', 's14'],
    curatedBy: 'MuseAI',
    accent: 'var(--chart-4)',
  },
  {
    id: 'p5',
    title: 'Rainy Evening',
    description: 'Cozy, melancholic lo-fi for slow nights in.',
    cover: '/covers/rainy-mood.png',
    songIds: ['s5', 's7', 's9', 's11'],
    curatedBy: 'MuseAI',
    accent: 'var(--chart-5)',
  },
  {
    id: 'p6',
    title: 'Sleep Drift',
    description: 'Ambient textures that ease you into rest.',
    cover: '/covers/lunar-tide.png',
    songIds: ['s7', 's13', 's5'],
    curatedBy: 'MuseAI',
    accent: 'var(--chart-2)',
  },
]

export function getSong(id: string): Song | undefined {
  return songs.find((s) => s.id === id)
}

export function getArtist(id: string): Artist | undefined {
  return artists.find((a) => a.id === id)
}

export function getPlaylistSongs(playlist: Playlist): Song[] {
  return playlist.songIds
    .map((id) => getSong(id))
    .filter((s): s is Song => Boolean(s))
}

export function formatPlays(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return `${n}`
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
