import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { connectToDB } from '@/lib/mongodb'
import ListenedSong from '@/models/ListenedSong'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    console.log('No session')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { songId } = await req.json()
  await connectToDB()

  await ListenedSong.updateOne(
    { userId: session.user.email, songId },
    {
      $set: { updatedAt: new Date() },
      $setOnInsert: { userId: session.user.email, songId }
    },
    { upsert: true }
  )

  return NextResponse.json({ success: true })
}