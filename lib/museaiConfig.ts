/**
 * MuseAI Application Configuration
 * Custom configurations replacing legacy base44 configurations.
 */

export const MUSEAI_CONFIG = {
  appName: 'MuseAI',
  tagline: 'Emotion-Aware AI Music Studio',
  version: '1.0.0',
  defaultVolume: 0.8,
  
  // Storage keys for local session persistence
  storageKeys: {
    user: 'museai_user_profile',
    token: 'museai_access_token',
    likedSongs: 'museai_liked_song_ids',
    recentPlays: 'museai_recent_song_ids',
    customPlaylists: 'museai_custom_playlists',
  },

  // Mock API configuration
  apiEndpoints: {
    studio: '/api/studio',
    mood: '/api/mood',
  },

  // Core metadata
  metadata: {
    title: 'MuseAI — Emotion-Aware AI Music',
    description: 'Stream, discover, and create music with MuseAI, an emotion-aware AI that understands how you feel.',
    themeColor: '#0c1418',
  }
};
