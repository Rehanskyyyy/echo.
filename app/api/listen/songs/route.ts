import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { connectToDB } from '@/lib/mongodb'
import ListenedSong from '@/models/ListenedSong'
import { allSongs } from '@/lib/songs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json([], { status: 200 })

  const email = (session.user as { email?: string })?.email
  if (!email) return NextResponse.json([], { status: 200 })

  await connectToDB()

  const listened = await ListenedSong.find({ userId: email }).sort({ updatedAt: -1 })

  const listenedIdsInOrder = listened.map(item => item.songId)

  const filteredSongs = listenedIdsInOrder
    .map(id => allSongs.find(song => song.id === id))
    .filter(Boolean)

  return NextResponse.json(filteredSongs)
}