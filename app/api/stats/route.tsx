import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { NextRequest } from 'next/server'
import redisClient from '@/lib/redis/redisClient'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import { getPlayerStats } from '../../utils'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  //   if (!session || !session.user) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  //   }

  //   const user = await db.user.findUnique({
  //     where: { email: session.user.email as string },
  //     select: { dailyLimit: true } as any,
  //   })

  //   if (!user || user.dailyLimit <= 0) {
  //     return NextResponse.json({ error: 'Daily limit reached' }, { status: 403 })
  //   }

  const context = await request.json()
  const { playerId1, playerId2 } = context

  if (!playerId1 || !playerId2) {
    return NextResponse.json(
      { error: 'Both Player IDs are required' },
      { status: 400 }
    )
  }

  const cacheKey = `player-comparison-stats:${playerId1}:${playerId2}`
  const cachedResponse = await redisClient?.get(cacheKey)
  if (cachedResponse) {
    return NextResponse.json(JSON.parse(cachedResponse))
  }

  const [player1, player2] = await Promise.all([
    getPlayerDetails(playerId1.trim()),
    getPlayerDetails(playerId2.trim()),
  ])

  if (!player1 || !player2) {
    return NextResponse.json(
      { error: 'One or both players not found' },
      { status: 404 }
    )
  }
  const player1Gsis = player1.gsis_id?.trim() || ''
  const player2Gsis = player2.gsis_id?.trim() || ''

  const [player1Stats, player2Stats] = await Promise.all([
    getPlayerStats(player1Gsis, {
      full_name: player1.full_name || '',
      position: player1.position || '',
      team: player1.team || '',
    }),
    getPlayerStats(player2Gsis, {
      full_name: player2.full_name || '',
      position: player2.position || '',
      team: player2.team || '',
    }),
  ])

  const combinedStats = {
    player1: player1Stats,
    player2: player2Stats,
  }

  await redisClient?.set(cacheKey, JSON.stringify([combinedStats]), 'EX', 3600) // Cache for 1 hour

  return NextResponse.json([combinedStats])
}
