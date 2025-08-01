'use client'

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { internationalBops, bestOfBollywood, punjabiBangers } from "@/lib/songs"
import PlayerBar from "./components/PlayerBar"
import SongCard from "./components/SongCard"
import ListenAgain from "./components/ListenAgain"
import { shuffleArray } from '@/utils/shuffleArray'

export default function Home() {
  const { data: session, status } = useSession()
  const [showEmail, setShowEmail] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [playingSong, setPlayingSong] = useState<string | null>(null)
  const shuffledInternational = useRef(shuffleArray([...internationalBops])).current
  const shuffledBollywood = useRef(shuffleArray([...bestOfBollywood])).current
  const shuffledPunjabi = useRef(shuffleArray([...punjabiBangers])).current

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setShowEmail(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout: () => Promise<void> = async () => {
    setLoggingOut(true)
    await signOut()
  }

  const username = session?.user?.name?.split(" ")[0] || "User"
  const listenedSongs = internationalBops

  const handlePlayPause = (id: string) => {
    setPlayingSong(prev => (prev === id ? null : id))
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-white border-t-transparent border-b-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <div className="h-[100dvh] w-full text-white relative overflow-hidden">

        {/* Fixed Top Left Logo */}
        <h1 className="fixed z-10 top-6 left-6 text-5xl text-white tracking-tight">echo.</h1>

        {/* Fixed Profile Box */}
        <div
          ref={boxRef}
          onClick={() => setShowEmail(!showEmail)}
          className="z-20 fixed top-6 right-6 flex items-center bg-zinc-800 py-[8] pl-3 pr-5 rounded-full transition-all duration-300 overflow-hidden max-w-fit group"
        >
          <Image
            src={session?.user?.image || '/FallbackPFP/avatartion.png'}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full shrink-0"
          />
          <span className="ml-3 font-medium">{username}</span>
          <span className={`transition-all duration-500 whitespace-nowrap truncate ${showEmail ? "opacity-100 w-[160px] ml-2" : "opacity-0 w-0 ml-0"} sm:group-hover:opacity-100 sm:group-hover:w-[160px] sm:group-hover:ml-2 block sm:inline-block`}>
            ({session?.user?.email})
          </span>
        </div>

        {/* Only this part scrolls */}
        <div className="absolute top-28 bottom-40 left-0 right-0 overflow-y-auto px-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto">

            {/* Heading */}
            <ListenAgain username={username} />

            {/* International Bops */}
            <section className="mb-12 mt-10">
              <h2 className="text-xl md:text-2xl mb-4">International Bops</h2>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pb-2">
                <div className="flex gap-6">
                  {[...Array(5)].map((_, rowIndex) => (
                    <div key={rowIndex} className="flex flex-col gap-4 min-w-[280px]">
                      {[...Array(4)].map((_, colIndex) => {
                        const i = rowIndex * 4 + colIndex
                        const song = shuffledInternational[i]
                        if (!song) return null

                        return (
                          <SongCard key={song.id} song={song} playlist={shuffledInternational} />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </section>



            {/* Best of Bollywood */}
            <section className="mb-12 mt-10">
              <h2 className="text-xl md:text-2xl mb-4">Blockbuster Beats</h2>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pb-2">
                <div className="flex gap-6">
                  {[...Array(5)].map((_, rowIndex) => (
                    <div key={rowIndex} className="flex flex-col gap-4 min-w-[280px]">
                      {[...Array(4)].map((_, colIndex) => {
                        const i = rowIndex * 4 + colIndex
                        const song = shuffledBollywood[i]
                        if (!song) return null
                        return (
                          <SongCard key={song.id} song={song} playlist={shuffledBollywood} />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Punjabi Bangers */}
            <section className="mb-12 mt-10">
              <h2 className="text-xl md:text-2xl mb-4">Desi Hip-Hop</h2>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pb-2">
                <div className="flex gap-6">
                  {[...Array(5)].map((_, rowIndex) => (
                    <div key={rowIndex} className="flex flex-col gap-4 min-w-[280px]">
                      {[...Array(4)].map((_, colIndex) => {
                        const i = rowIndex * 4 + colIndex
                        const song = shuffledPunjabi[i]
                        if (!song) return null
                        return (
                          <SongCard key={song.id} song={song} playlist={shuffledPunjabi} />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Other sections... same structure */}
            {/* You can keep adding Hot Hits, Bollywood, etc. just like this */}

            {/* When no songs are there */}
            {listenedSongs.length === 0 && (
              <div className="text-center py-16">
                <div className="text-zinc-400 text-lg mb-4">No songs added yet.</div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-16 w-full z-30 px-6">
          <PlayerBar />
        </div>

        {/* Wrapper for positioning both */}
        <div className="fixed inset-x-0 bottom-1 px-4 pb-2 z-40">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between relative w-full">

            {/* Footer Text */}
            <footer className="text-[11px] sm:text-sm text-zinc-800 bg-white px-4 py-1 rounded-md sm:rounded-full sm:static absolute left-0 bottom-0">
              <span>© echo.</span>
              <span className="hidden sm:inline"> | </span>
              <span className="sm:inline block">
                You&apos;re lookin&apos; at <a target="_blank" href="https://x.com/Rehanskyyyy" className="underline">Rehan&apos;s</a> work
              </span>
            </footer>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-xs sm:text-sm px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 disabled:opacity-60 sm:static absolute right-0 bottom-0"
            >
              {loggingOut && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loggingOut ? "Logging out..." : "Logout"}
            </button>

          </div>
        </div>

      </div>
    </>
  )
}
