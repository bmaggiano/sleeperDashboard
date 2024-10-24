import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'

export async function POST(req: Request) {
  const body = await req.json()
  const session = await getServerSession(authOptions)
  const { leagueId, sleeperUserId } = body

  // Check if leagueId is provided
  if (!leagueId) {
    return NextResponse.json(
      { error: 'League ID is required' },
      { status: 400 }
    )
  }

  // Ensure user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch the user based on the session email
  const user = await db.user.findUnique({
    where: { email: session?.user?.email as string },
    select: { id: true, dailyLimit: true }, // Selecting user ID to associate the league
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  try {
    // Add league to the user's leagues
    await db.league.create({
      data: {
        leagueId: leagueId,
        user: {
          connect: { id: user.id }, // Connect league to the user's ID
        },
      },
    })

    await db.user.update({
      where: {
        id: user.id, // The unique identifier of the user
      },
      data: {
        sleeperUserId: sleeperUserId, // Update the sleeperUserId
      },
    })

    return NextResponse.json(
      { message: 'League added successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error adding league:', error)
    return NextResponse.json({ error: 'Failed to add league' }, { status: 500 })
  }
}
