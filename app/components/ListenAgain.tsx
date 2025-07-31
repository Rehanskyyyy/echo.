'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Play, Pause } from 'lucide-react'
import { usePlayer } from '@/context/PlayerContext'
import { Song } from '@/types'

const ListenAgain = ({ username }: { username: string }) => {
    const [songs, setSongs] = useState<Song[]>([])
    const { currentSong, isPlaying, playSong, pause } = usePlayer()

    useEffect(() => {
        const fetchSongs = async () => {
            const res = await fetch('/api/listen/songs')
            const data = await res.json()
            setSongs(data)
        }
        fetchSongs()
    }, [])

    const handlePlayPause = (id: string) => {
        if (currentSong?.id === id && isPlaying) {
            pause()
        } else {
            const selected = songs.find((song) => song.id === id)
            if (selected) playSong(selected, songs)
        }
    }

    return (
        <section className="mb-6">
            <h2 className="text-2xl md:text-3xl tracking-tight mb-4">
                {songs.length > 0 ? `Listen again, ${username}` : `Let the music begin`}
            </h2>

            {songs.length > 0 && (
                <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {songs.map((song) => {
                        const isCurrent = currentSong?.id === song.id

                        return (
                            <div
                                key={song.id}
                                onClick={() => handlePlayPause(song.id)} // 📱 Tap support
                                className="group w-48 shrink-0 bg-zinc-800/40 backdrop-blur-md rounded-md p-3 hover:bg-zinc-700/50 transition-all duration-300"
                            >
                                <div className="relative mb-3 aspect-square w-full h-auto">
                                    <Image
                                        src={song.thumbnail}
                                        alt={`${song.title} by ${song.artist}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="rounded-md object-cover"
                                    />
                                    <div
                                        className={`absolute inset-0 bg-black/40 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            } transition-opacity duration-300 rounded-md flex items-center justify-center`}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation() // 🛑 Prevent parent click
                                                handlePlayPause(song.id)
                                            }}
                                            className="bg-white text-black rounded-full p-2 hover:scale-110 transition-transform duration-200 shadow-lg"
                                        >
                                            {isCurrent && isPlaying ? (
                                                <Pause className="w-4 h-4" />
                                            ) : (
                                                <Play className="w-4 h-4 ml-0.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3
                                        className={`text-md truncate transition-colors ${currentSong?.id === song.id && isPlaying
                                            ? 'text-purple-300'
                                            : 'text-white group-hover:text-purple-300'
                                            }`}
                                    >
                                        {song.title}
                                    </h3>
                                    <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export default ListenAgain
