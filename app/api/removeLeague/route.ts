import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'

export async function POST(req: Request) {
  const body = await req.json()
  const session = await getServerSession(authOptions)
  const { leagueId } = body

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
    select: { id: true }, // Selecting user ID to find the league
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  try {
    // Check if the league exists and belongs to the user
    const league = await db.league.findFirst({
      where: {
        leagueId: leagueId,
        userId: user.id, // Ensure the league belongs to the authenticated user
      },
    })

    if (!league) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 })
    }

    // Remove the league by deleting it from the database
    await db.league.delete({
      where: { id: league.id }, // Use the league ID to delete
    })

    return NextResponse.json(
      { message: 'League removed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error removing league:', error)
    return NextResponse.json(
      { error: 'Failed to remove league' },
      { status: 500 }
    )
  }
}
