import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { NextRequest, NextResponse } from 'next/server'
import redisClient from '@/lib/redis/redisClient'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import { streamObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { ffDataSchema } from './schema'
import prisma from '@/lib/db'
import { getPlayerInjuries } from './injuriesHelper'

interface User {
  dailyLimit: number
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Explicitly type the user object
  const user = (await db.user.findUnique({
    where: { email: session.user.email as string },
    select: { dailyLimit: true } as any,
  })) as User | null

  // Check for valid user and dailyLimit
  if (!user || typeof user.dailyLimit !== 'number' || user.dailyLimit <= 0) {
    return NextResponse.json({ error: 'Daily limit reached' }, { status: 403 })
  }

  const context = await request.json()
  const { playerId1, playerId2 } = context

  if (!playerId1 || !playerId2) {
    return NextResponse.json(
      { error: 'Both Player IDs are required' },
      { status: 400 }
    )
  }

  if (!redisClient) {
    return NextResponse.json(
      { error: 'Redis client not found' },
      { status: 500 }
    )
  }

  const cachedStatsKey = `player-comparison-stats:${playerId1}:${playerId2}`
  let parsedCachedStat = null
  const cachedStat = await redisClient?.get(cachedStatsKey)
  if (cachedStat) {
    try {
      parsedCachedStat = JSON.parse(cachedStat)
    } catch (error) {
      console.error('Error parsing cached stats:', error)
    }
  }

  const player1NewsStories = JSON.parse(
    (await redisClient?.get(`player-news:${playerId1}`)) || '[]'
  ).slice(0, 3)
  const player2NewsStories = JSON.parse(
    (await redisClient?.get(`player-news:${playerId2}`)) || '[]'
  ).slice(0, 3)

  const [id1, id2] = [playerId1, playerId2].sort()

  const cacheKey = `player-comparison:${id1}:${id2}`

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
  // Define combinedStats or use parsedCachedStat if available
  const combinedStats = parsedCachedStat || { player1: {}, player2: {} }

  const player1Injuries = await getPlayerInjuries(player1?.gsis_id ?? '')
  const player2Injuries = await getPlayerInjuries(player2?.gsis_id ?? '')

  const result = await streamObject({
    model: openai('gpt-4o-mini'),
    seed: 100,
    schema: ffDataSchema,
    system: `You are a fantasy football expert, skilled in analyzing player stats and making decisions based on recent performance and news.`,
    prompt: `
    Compare the following players based on their stats, availability, injuries if they're dealing with any, recent games, and recent news. Emphasize recent performance trends and consider stats from the last three games. Recency bias is encouraged.
  
    Player 1: (${player1.full_name}, Position: ${player1.position}, Team: ${player1.team})
    
    Player 1 stats: ${JSON.stringify(combinedStats?.[0]?.player1.nflverse_play_by_play_2024, null, 2)}
  
    Player 2: (${player2.full_name}, Position: ${player2.position}, Team: ${player2.team})
  
    Player 2 stats: ${JSON.stringify(combinedStats?.[0]?.player2.nflverse_play_by_play_2024, null, 2)}
  
    Player 1's team news:
    ${player1NewsStories}
  
    Player 2's team news:
    ${player2NewsStories}

    Player 1's injuries:
    ${player1Injuries}

    Player 2's injuries:
    ${player2Injuries}
    
    Please return the comparison in the following structured format:
    
    {
      "playerOneName": "${player1.full_name}",
      "playerTwoName": "${player2.full_name}",
      "playerOnePosition": "${player1.position}",
      "playerTwoPosition": "${player2.position}",
      "playerOneTeam": "${player1.team}",
      "playerTwoTeam": "${player2.team}",
      "explanation": "Provide a concise explanation (1-2 sentences) and include relevant stats or team news snippets to support your recommendation.",
      "recommended_pick": "Return the name of the recommended pick, if any.",
      "recommended_pick_espn_id": "If the recommended pick is ${player1.full_name}, return ${player1.espn_id}, or if it's ${player2.full_name}, return ${player2.espn_id}.",
      "certainty": "Provide a certainty percentage (0-100%) for the recommended pick.",
      "undecided": "Return 'undecided' if no clear recommendation can be made."
    }
    `,
    onFinish: async ({ object }) => {
      await redisClient?.set(cacheKey, JSON.stringify(object), 'EX', 3600) // Cache for 1 hour
      await db.user.update({
        where: { email: session?.user?.email as string },
        data: { dailyLimit: { decrement: 1 } } as any,
      })
    },
  })
  return result.toTextStreamResponse()
}
