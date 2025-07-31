'use client'

import Image from 'next/image'
import { Play, Pause } from 'lucide-react'
import { usePlayer } from '@/context/PlayerContext'
import { useEffect, useState } from 'react'

type Song = {
  id: string
  title: string
  artist: string
  src: string
  thumbnail: string
}

const SongCard = ({ song, playlist }: { song: Song; playlist: Song[] }) => {
  const { currentSong, isPlaying, playSong, pause } = usePlayer()

  const isThisSong = currentSong?.id === song.id
  const isThisPlaying = isThisSong && isPlaying
  const isThisPaused = isThisSong && !isPlaying

  const handleClick = () => {
    if (isThisPlaying) {
      pause()
    } else {
      playSong(song, playlist)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="relative flex items-center gap-3 bg-zinc-800/40 hover:bg-zinc-700/50 p-3 rounded-lg transition-all group"
    >
      <div className="relative w-[50px] h-[50px]">
        <Image
          src={song.thumbnail}
          alt={song.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-md object-cover"
        />

        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-md transition-opacity ${isThisPlaying || isThisPaused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          <div className="bg-white text-black rounded-full p-1 shadow-md">
            {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <h3 className={`text-md truncate ${isThisPlaying ? 'text-purple-300' : 'text-white'}`}>
          {song.title}
        </h3>
        <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
      </div>
    </div>
  )
}

export default SongCard
