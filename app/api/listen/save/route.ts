import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDB } from '@/lib/mongodb'
import ListenedSong from '@/models/ListenedSong'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        console.log("No session")
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { songId } = await req.json()

    await connectToDB()

    await ListenedSong.updateOne(
        { userId: session.user.id, songId },
        {
            $set: { updatedAt: new Date() }, // 🆕 update time
            $setOnInsert: { userId: session.user.id, songId },
        },
        { upsert: true }
    )

    return NextResponse.json({ success: true })
}