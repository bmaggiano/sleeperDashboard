import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { NextRequest, NextResponse } from 'next/server'
import redisClient from '@/lib/redis/redisClient'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import { streamObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { ffDataSchema } from './schema'
import { createSqlQuery } from './queryHelpers'
import { calculateFantasyPoints } from './fantasyPointsHelper'
import fetchAndFilterStories from '@/app/playerCompare/recentNews'
import { getPlayerStats } from '../../utils'

const years = [
  'nflverse_play_by_play_2023',
  'nflverse_play_by_play_2022',
  'nflverse_play_by_play_2021',
]

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

  const player1NewsStories = await redisClient?.get(`player-news:${playerId1}`)
  const player2NewsStories = await redisClient?.get(`player-news:${playerId2}`)

  console.log(player1NewsStories)

  const cacheKey = `player-comparison:${playerId1}:${playerId2}`
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

  const result = await streamObject({
    model: openai('gpt-4o-mini'),
    seed: 100,
    schema: ffDataSchema,
    system: `You are a fantasy football expert. You are an expert at analyzing player stats and making decisions based on that analysis. Users using this tool will be relying on you to provide accurate assessments of player stats and make informed decisions.`,
    prompt: `Compare the following two players based on their stats, availability and any recent news/stories:\n\nPlayer 1 (${player1.full_name}): ${JSON.stringify(combinedStats?.[0]?.player1, null, 2)}\n\nPlayer 2 (${player2.full_name}): ${JSON.stringify(combinedStats?.[0]?.player2, null, 2)}\n\nStories:\n\nPlayer 1 Stories:\n${player1NewsStories}\n\nPlayer 2 Stories:\n${player2NewsStories}\n\n. If a recent article suggests that a player is not healthy for their upcoming game, give more consideration to the healthy player. Consider the number of games played and the availability of each player as well as providing a detail for that player from a recent story if one is provided. You MUST provide some sort of info from the recent story provided for either player. Also take into consideration previous seasons that should be included in this data. Provide a quick comparison and categorize the players into the following: explanation (brief couple one sentence max), safe_pick, risky_pick, and recommended_pick. With the recommended pick, can you also include a percentage of certainty (0-100)? If the decision is a toss-up, return 'undecided' instead of 'recommended_pick'.`,
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
