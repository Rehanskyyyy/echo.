'use client'

import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { Howl } from 'howler'

type Song = {
  id: string
  title: string
  artist: string
  src: string
  thumbnail: string
}

type PlayerContextType = {
  currentSong: Song | null
  isPlaying: boolean
  playSong: (song: Song, playlist?: Song[]) => void
  pause: () => void
  seekTo: (time: number) => void
  getCurrentTime: () => number
  getSound: () => Howl | null
  duration: number
  playNext: () => void
  playPrevious: () => void
  playlist: Song[]
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayer must be used within PlayerProvider')
  return context
}

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const [sound, setSound] = useState<Howl | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)

  // 🎯 REFS TO TRACK CURRENT VALUES RELIABLY
  const soundRef = useRef<Howl | null>(null)
  const playlistRef = useRef<Song[]>([])
  const currentSongRef = useRef<Song | null>(null)

  // 🎯 KEEP REFS IN SYNC WITH STATE
  useEffect(() => {
    soundRef.current = sound
  }, [sound])

  useEffect(() => {
    playlistRef.current = playlist
  }, [playlist])

  useEffect(() => {
    currentSongRef.current = currentSong
  }, [currentSong])

  const seekTo = (time: number) => {
    if (sound) sound.seek(time)
  }

  const getCurrentTime = () => {
    return sound ? (sound.seek() as number) : 0
  }

  const getSound = () => sound

  const pause = () => {
    if (sound && isPlaying) {
      sound.pause()
      setIsPlaying(false)
    }
  }

  const playSong = (song: Song, newPlaylist: Song[] = []) => {
    // Resume if same song
    if (currentSong?.id === song.id && sound && !isPlaying) {
      sound.play()
      setIsPlaying(true)
      return
    }

    // 🎯 CRITICAL: Always unload previous sound FIRST
    if (soundRef.current) {
      soundRef.current.unload()
      soundRef.current = null
      setSound(null)
    }

    const updatedPlaylist = newPlaylist.length > 0 ? newPlaylist : playlist
    const index = updatedPlaylist.findIndex(s => s.id === song.id)

    const newSound = new Howl({
      src: [song.src],
      html5: true,
      onload: () => setDuration(newSound.duration()),
      onend: () => {
        setIsPlaying(false)

        setTimeout(() => {
          // 🎯 USE REFS FOR RELIABLE ACCESS TO CURRENT VALUES
          const currentPlaylist = playlistRef.current
          const currentSongInCallback = currentSongRef.current

          // Make sure this is still the active sound and song
          if (soundRef.current === newSound && currentSongInCallback?.id === song.id) {
            const currentSongIndex = currentPlaylist.findIndex(s => s.id === song.id)

            if (currentSongIndex !== -1 && currentSongIndex < currentPlaylist.length - 1) {
              const nextSong = currentPlaylist[currentSongIndex + 1]
              playSong(nextSong, currentPlaylist)
            } else if (currentSongIndex === currentPlaylist.length - 1) {
              const firstSong = currentPlaylist[0]
              playSong(firstSong, currentPlaylist)
            }
          }
        }, 100)
      },
    })

    // 🎯 UPDATE REFS IMMEDIATELY
    soundRef.current = newSound
    playlistRef.current = updatedPlaylist
    currentSongRef.current = song

    // 🎯 UPDATE STATE
    setSound(newSound)
    setCurrentSong(song)
    setPlaylist(updatedPlaylist)
    setCurrentIndex(index)

    // Save to "Listen Again"
    fetch('/api/listen/save', {
      method: 'POST',
      body: JSON.stringify({ songId: song.id }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(err => console.error('❌ Save error:', err))

    // 🎯 PLAY AND UPDATE STATE
    newSound.play()
    setIsPlaying(true)
  }

  const playNext = () => {
    if (playlist.length === 0 || currentIndex === -1) return

    const nextIndex = (currentIndex + 1) % playlist.length
    const nextSong = playlist[nextIndex]
    if (nextSong) playSong(nextSong, playlist)
  }

  const playPrevious = () => {
    if (playlist.length === 0 || currentIndex === -1) return

    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length
    const prevSong = playlist[prevIndex]
    if (prevSong) playSong(prevSong, playlist)
  }

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload()
      }
    }
  }, [])

  // Toggle play/pause on clicking spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && currentSong) {
        e.preventDefault()
        if (isPlaying) {
          pause()
        } else {
          playSong(currentSong, playlist)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSong, isPlaying, playlist])


  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        pause,
        seekTo,
        getCurrentTime,
        getSound,
        duration,
        playNext,
        playPrevious,
        playlist,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
