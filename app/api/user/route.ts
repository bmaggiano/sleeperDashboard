import db from '@/lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'
import { Session } from 'next-auth'

interface ExtendedSession extends Session {
  user: {
    id: string // Add the id property
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export const GET = async (req: Request) => {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  // Check if there is an active session
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        leagues: true,
      }, // Use a colon here for object property assignment
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
