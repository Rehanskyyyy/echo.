'use client'

import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '@/context/PlayerContext'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { formatTime } from '@/utils/formatTime'

const PlayerBar = () => {
  const { currentSong, isPlaying, playSong, pause, getSound, playNext, playPrevious, playlist } = usePlayer()
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sound = getSound()
    if (sound) {
      setDuration(sound.duration())
    }
  }, [currentSong, getSound])

  useEffect(() => {
    const interval = setInterval(() => {
      const sound = getSound()
      if (sound && isPlaying) {
        setProgress(sound.seek() as number)
        setDuration(sound.duration()) // keep it in sync
      }
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying, getSound])

  const handleToggle = () => {
    if (!currentSong) return
    isPlaying ? pause() : playSong(currentSong, playlist) // Pass the playlist
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.min(1, Math.max(0, clickX / rect.width))
    const newTime = percent * duration

    const sound = getSound()
    if (sound) {
      sound.seek(newTime)
      setProgress(newTime)
    }
  }

  if (!currentSong) return null

  return (
    <div className="w-full bg-zinc-900/80 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl text-white space-y-2">
      {/* Song Info */}
      <div className="text-center space-y-0.5">
        <h3 className="truncate">{currentSong.title}</h3>
        <p className="text-sm text-zinc-400 truncate">{currentSong.artist}</p>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-6">
        <button onClick={() => playPrevious()} className="hover:text-purple-400 transition">
          <SkipBack size={20} />
        </button>

        <button
          onClick={handleToggle}
          className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button onClick={() => playNext()} className="hover:text-purple-400 transition">
          <SkipForward size={20} />
        </button>
      </div>

      {/* Seekbar */}
      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <span className="text-sm text-white inline-block min-w-[30px] text-right">
          {formatTime(progress)}
        </span>

        <div
          onClick={handleSeek}
          className="relative flex-1 h-6 cursor-pointer" // makes larger clickable area
        >
          {/* Invisible large hit area */}
          <div className="absolute inset-0 flex items-center">
            {/* Visual bar */}
            <div className="relative w-full h-1 bg-zinc-700 group">
              <div
                className="absolute top-0 left-0 h-full bg-purple-400 transition-all"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full transition-all duration-200"
                style={{ left: `calc(${(progress / duration) * 100}% - 6px)` }}
              />
            </div>
          </div>
        </div>

        <span className="text-sm text-white inline-block min-w-[29px] text-left">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}

export default PlayerBar
