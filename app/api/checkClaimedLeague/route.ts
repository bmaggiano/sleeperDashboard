import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    // Get the session with explicit configuration
    const session = await getServerSession(authOptions)
    const headersList = headers()

    // Debug logging
    console.log('Headers:', Object.fromEntries(headersList.entries()))
    console.log('Session in API:', session)

    const body = await req.json()
    const { leagueId, sleeperUserId } = body

    if (!leagueId || !sleeperUserId) {
      return NextResponse.json(
        { error: 'League ID and Sleeper user ID is required' },
        { status: 400 }
      )
    }

    // If no session, return unauthorized with more detailed error
    if (!session || !session.user?.email) {
      console.log('No session or email found')
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details: 'No valid session found',
        },
        {
          status: 401,
        }
      )
    }

    // Find user with both email and sleeperUserId
    const user = await db.user.findFirst({
      where: {
        AND: [{ email: session.user.email }, { sleeperUserId: sleeperUserId }],
      },
      select: {
        id: true,
        leagues: true,
        sleeperUserId: true,
      },
    })

    console.log('Found user:', user)

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
          details: 'No user found with matching email and sleeper ID',
        },
        {
          status: 404,
        }
      )
    }

    // Find the specific league
    const league = await db.league.findFirst({
      where: {
        userId: user.id,
        leagueId: leagueId,
      },
      select: { id: true },
    })

    console.log('Found league:', league)

    if (!league) {
      return NextResponse.json(
        {
          error: 'League not found',
          details: 'No league found for this user',
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json({
      success: true,
      sleeperUserId: user.sleeperUserId,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
      }
    )
  }
}
