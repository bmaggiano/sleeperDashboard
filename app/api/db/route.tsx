import db from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import redisClient from '@/lib/redis/redisClient'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import { streamObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { ffDataSchema } from './schema'
import { createSqlQuery } from './queryHelpers'
import { calculateFantasyPoints } from './fantasyPointsHelper'

const years = [
  'nflverse_play_by_play_2023',
  'nflverse_play_by_play_2022',
  'nflverse_play_by_play_2021',
]

export async function POST(request: NextRequest) {
  const context = await request.json()
  const { playerId1, playerId2 } = context

  console.log(playerId1, playerId2)

  if (!playerId1 || !playerId2) {
    return NextResponse.json(
      { error: 'Both Player IDs are required' },
      { status: 400 }
    )
  }

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

  const player1Gsis = player1.gsis_id?.trim() || ''
  const player2Gsis = player2.gsis_id?.trim() || ''

  async function getPlayerStats(
    playerGsis: string,
    playerDetails: { full_name: string; position: string; team: string }
  ) {
    const playerStats: { [key: string]: { [key: string]: any } } = {
      details: {
        gsis_id: playerGsis,
        fullName: playerDetails.full_name,
        position: playerDetails.position,
        team: playerDetails.team,
      },
    }

    await Promise.all(
      years.map(async (year) => {
        const query = createSqlQuery(playerGsis, year)

        // Assuming result is an array with one object
        const [result] = (await db.$queryRaw(query.playerStats)) as any

        // Check if result is null or undefined, and handle it accordingly
        const stats = result
          ? {
              longestPlay: Number(result.longest_play) || 0,
              totalRecYards: Number(result.total_rec_yards) || 0,
              totalRushYards: Number(result.total_rush_yards) || 0,
              totalAirYards: Number(result.total_air_yards) || 0,
              totalYac: Number(result.total_yac) || 0,
              totalTds: Number(result.total_tds) || 0,
              totalReceptions: Number(result.total_receptions) || 0,
              weeks: Number(result.weeks) || 0,
              totalPassAttempts: Number(result.total_pass_attempts) || 0,
              totalPassCompletions: Number(result.total_pass_completions) || 0,
              totalPassYards: Number(result.total_pass_yards) || 0,
              totalPassTds: Number(result.total_pass_tds) || 0,
              totalInterceptions: Number(result.total_interceptions) || 0,
            }
          : {
              longestPlay: 0,
              totalRecYards: 0,
              totalRushYards: 0,
              totalAirYards: 0,
              totalYac: 0,
              totalTds: 0,
              totalReceptions: 0,
              weeks: 0,
              totalPassAttempts: 0,
              totalPassCompletions: 0,
              totalPassYards: 0,
              totalPassTds: 0,
              totalInterceptions: 0,
            }

        const fantasyPoints = calculateFantasyPoints({
          totalRecYards: stats.totalRecYards,
          totalRushYards: stats.totalRushYards,
          totalTds: stats.totalTds,
          totalReceptions: stats.totalReceptions,
          totalPassYards: stats.totalPassYards,
          totalPassTds: stats.totalPassTds,
          totalInterceptions: stats.totalInterceptions,
        })

        playerStats[year] = {
          ...stats,
          fantasyPoints,
        }
      })
    )

    return playerStats
  }

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

  const result = await streamObject({
    model: openai('gpt-4o-mini'),
    seed: 100,
    schema: ffDataSchema,
    system: `You are a fantasy football expert. You are an expert at analyzing player stats and making decisions based on that analysis. Users using this tool will be relying on you to provide accurate assessments of player stats and make informed decisions.`,
    prompt: `Compare the following two players based on their stats and availability:\n\nPlayer 1 (${player1.full_name}): ${JSON.stringify(combinedStats.player1, null, 2)}\n\nPlayer 2 (${player2.full_name}): ${JSON.stringify(combinedStats.player2, null, 2)}\n\nConsider the number of games played and the availability of each player. Also take into consideration previous seasons that should be included in this data. Provide a detailed comparison and categorize the players into the following: explanation (list the yards, touchdowns, games played, and provide a brief explanation), safe_pick, risky_pick, and recommended_pick. Please also compile their season stats that were provided and return playerOneRecYards, playerTwoRecYards, playerOneRushYards, playerTwoRushYards, playerOneTouchdowns, playerTwoTouchdowns, playerOneYardsAfterCatch, playerTwoYardsAfterCatch, playerOneAirYards, playerTwoAirYards, playerOneYardsPerReception, playerTwoYardsPerReception, playerOneReceptions, playerTwoReceptions, longestPlayOne, longestPlayTwo. If the player is a QB, return playerOnePassAttempt, playerTwoPassAttempt, playerOnePassCompletion, playerTwoPassCompletion, playerOneInterceptions, playerTwoInterceptions, playerOnePassYards, playerTwoPassYards, playerOnePassTouchdowns, playerTwoPassTouchdowns. With the recommended pick, can you also include a percentage of certainty (0-100)? If the decision is a toss-up, return 'undecided' instead of 'recommended_pick'.`,
    onFinish: async ({ object }) => {
      await redisClient?.set(cacheKey, JSON.stringify(object), 'EX', 3600) // Cache for 1 hour
    },
  })
  return result.toTextStreamResponse()
  // console.log("Final Stats:", combinedStats);
  // return NextResponse.json({ "hey": "this worked" });
}
