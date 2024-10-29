import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const session = await getServerSession(authOptions)
  const { leagueId, sleeperUserId } = body

  if (!leagueId || !sleeperUserId) {
    return NextResponse.json(
      { error: 'League ID and Sleeper user ID is required' },
      { status: 400 }
    )
  }

  console.log('from check claim', session)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: {
      email: session?.user?.email as string,
      sleeperUserId: sleeperUserId,
    },
    select: { id: true, leagues: true, sleeperUserId: true }, // Selecting user ID to associate the league
  })

  console.log(user)
  console.log(session)

  if (!user || !session) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const league = await db.league.findFirst({
    where: { userId: user.id, leagueId: leagueId }, // Use leagueId instead of id
    select: { id: true },
  })

  if (!league) {
    return NextResponse.json({ error: 'League not found' }, { status: 404 })
  }

  return NextResponse.json({ sleeperUserId: user.sleeperUserId })
}
