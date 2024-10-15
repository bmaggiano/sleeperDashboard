import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { NextRequest } from 'next/server'
import redisClient from '@/lib/redis/redisClient'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import prisma from '@/lib/db'

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
  const { playerId1 } = context

  if (!playerId1) {
    return NextResponse.json(
      { error: 'Player IDs are required' },
      { status: 400 }
    )
  }

  const cacheKey = `injury:${playerId1}`
  const cachedResponse = await redisClient?.get(cacheKey)
  if (cachedResponse) {
    return NextResponse.json(JSON.parse(cachedResponse))
  }

  const player1 = await getPlayerDetails(playerId1.trim())

  if (!player1) {
    return NextResponse.json({ error: 'player not found' }, { status: 404 })
  }

  const injuries = await prisma.$queryRaw`
  SELECT * FROM nflverse_player_stats_2024 WHERE player_id = ${player1?.gsis_id?.trim()}`

  await redisClient?.set(cacheKey, JSON.stringify(injuries), 'EX', 3600) // Cache for 1 hour

  return NextResponse.json(injuries)
}
