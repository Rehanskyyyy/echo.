'use client'

import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '@/context/PlayerContext'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { formatTime } from '@/utils/formatTime'

const PlayerBar = () => {
  const { currentSong, isPlaying, playSong, pause, getSound, playNext, playPrevious, playlist } = usePlayer()
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragValue, setDragValue] = useState<number | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  // Fetch & update duration when song changes
  useEffect(() => {
    const sound = getSound()
    if (sound) {
      setDuration(sound.duration())
    }
  }, [currentSong, getSound])

  // Progress polling (every 500ms), paused during drag
  useEffect(() => {
    if (isDragging) return
    const interval = setInterval(() => {
      const sound = getSound()
      if (sound && isPlaying) {
        setProgress(sound.seek() as number)
        setDuration(sound.duration())
      }
    }, 500)
    return () => clearInterval(interval)
  }, [isPlaying, getSound, isDragging])

  // Play/Pause
  const handleToggle = () => {
    if (!currentSong) return
    isPlaying ? pause() : playSong(currentSong, playlist)
  }

  // Seek by tap/click anywhere on track
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.min(1, Math.max(0, clickX / rect.width))
    const newTime = percent * duration
    const sound = getSound()
    if (sound) {
      sound.seek(newTime)
      setProgress(newTime)
    }
  }

  // Live drag preview logic
  const updateDrag = (
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
  ) => {
    if (!barRef.current) return
    if ('preventDefault' in e && typeof e.preventDefault === 'function') e.preventDefault()
    let clientX
    if ('touches' in e && e.touches.length) {
      clientX = e.touches[0].clientX
    } else if ('changedTouches' in e && e.changedTouches.length) {
      clientX = e.changedTouches[0].clientX
    } else if ('clientX' in e) {
      clientX = e.clientX
    } else {
      return
    }
    const rect = barRef.current.getBoundingClientRect()
    const x = Math.min(Math.max(0, clientX - rect.left), rect.width)
    const percent = rect.width ? x / rect.width : 0
    setDragValue(percent * duration)
  }

  // ***** ULTRA-RELIABLE SEEK AT DROP POSITION *****
  function seekToEventPosition(e: MouseEvent | TouchEvent) {
    if (!barRef.current || !duration) return
    let clientX
    if ('touches' in e && e.touches.length) {
      clientX = e.touches[0].clientX
    } else if ('changedTouches' in e && e.changedTouches.length) {
      clientX = e.changedTouches[0].clientX
    } else if ('clientX' in e) {
      clientX = e.clientX
    } else {
      return
    }
    const rect = barRef.current.getBoundingClientRect()
    const x = Math.min(Math.max(0, clientX - rect.left), rect.width)
    const percent = rect.width ? x / rect.width : 0
    const newTime = percent * duration
    const sound = getSound()
    if (sound) {
      sound.seek(newTime)
      setProgress(newTime)
    }
  }

  // ---- thumb drag handlers ----
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    updateDrag(e)
    if (e.type === 'touchstart') {
      document.body.style.userSelect = 'none'
    }
  }
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    updateDrag(e)
  }
  const handleDragEnd = (e: MouseEvent | TouchEvent) => {
    seekToEventPosition(e) // THIS is the trick: seek at last finger/mouse pos!
    setIsDragging(false)
    setDragValue(null)
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
    document.removeEventListener('touchmove', handleDragMove)
    document.removeEventListener('touchend', handleDragEnd)
    document.body.style.userSelect = ''
  }
  const onThumbMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e)
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
  }
  const onThumbTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    handleDragStart(e)
    document.addEventListener('touchmove', handleDragMove, { passive: false })
    document.addEventListener('touchend', handleDragEnd)
  }

  const disableSeek = isDragging ? { pointerEvents: 'none' as const } : {}
  const previewTime = isDragging && dragValue !== null ? dragValue : progress
  const progressPercent = duration
    ? ((isDragging && dragValue !== null ? dragValue : progress) / duration) * 100
    : 0

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
          {formatTime(previewTime)}
        </span>
        <div
          ref={barRef}
          onClick={handleSeek}
          className="relative flex-1 h-6 cursor-pointer select-none"
          {...disableSeek}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="relative w-full h-1 bg-zinc-700 group">
              {/* Progress bar */}
              <div
                className="absolute top-0 left-0 h-full bg-purple-400"
                style={{ width: `${progressPercent}%` }}
              />
              {/* BIG hitbox draggable thumb */}
              <div
                className="absolute top-1/2"
                style={{
                  left: `${progressPercent}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  height: 24,
                  width: 24,
                  background: 'transparent',
                  cursor: 'pointer',
                  touchAction: 'none',
                }}
                onMouseDown={onThumbMouseDown}
                onTouchStart={onThumbTouchStart}
              >
                {/* Actual Thumb Dot */}
                <div
                  className="w-3 h-3 bg-purple-400 rounded-full"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
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
