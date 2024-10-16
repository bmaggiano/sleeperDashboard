import fetchAndFilterStories from '@/app/playerCompare/recentNews'
import redisClient from '@/lib/redis/redisClient'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { propsResSchema } from './schema'
import { streamObject } from 'ai'
import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import teamMap from '../../parlai/teamMap'
import getOpponentTeamAvg from './opponentTeamAvg'

interface User {
  dailyLimit: number
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = (await db.user.findUnique({
    where: { email: session.user.email as string },
    select: { dailyLimit: true } as any,
  })) as User | null

  // Check for valid user and dailyLimit
  if (!user || typeof user.dailyLimit !== 'number' || user.dailyLimit <= 0) {
    return NextResponse.json({ error: 'Daily limit reached' }, { status: 403 })
  }

  const context = await request.json()
  const { playerId, playerName, playerTeam, opponentTeam, prop } = context

  if (!playerId || !playerName || !playerTeam || !opponentTeam || !prop) {
    return NextResponse.json(
      { success: false, message: 'Missing required parameters' },
      { status: 400 }
    )
  }

  const currentData: { [key: string]: any }[] = await db.$queryRaw`
    SELECT * FROM "nflverse_player_stats_2024" WHERE player_display_name = ${playerName}
  `

  const sortedCurrentData = currentData.sort(
    (a, b) => Number(b.week) - Number(a.week)
  )
  const getTeamAbbr = (team: string) => {
    return teamMap[team as keyof typeof teamMap] || team // Cast team to the correct type
  }

  const teamAbbr = getTeamAbbr(opponentTeam)

  // Use Prisma's tagged template literal for raw queries
  const results: { [key: string]: any }[] = await db.$queryRaw`
    SELECT * FROM "nflverse_player_stats_2024" WHERE player_display_name = ${playerName} AND opponent_team = ${teamAbbr}
    UNION
    SELECT * FROM "nflverse_player_stats_2023" WHERE player_display_name = ${playerName} AND opponent_team = ${teamAbbr}
    UNION
    SELECT * FROM "nflverse_player_stats_2022" WHERE player_display_name = ${playerName} AND opponent_team = ${teamAbbr}
    UNION
    SELECT * FROM "nflverse_player_stats_2021" WHERE player_display_name = ${playerName} AND opponent_team = ${teamAbbr}
  `
  if (results.length === 0 && currentData.length === 0) {
    return NextResponse.json({
      success: false,
      message: 'No data found.',
    })
  }
  // Initialize sums and count
  const statsSum = {
    carries: 0,
    rushing_yards: 0,
    rushing_tds: 0,
    rushing_fumbles: 0,
    rushing_fumbles_lost: 0,
    rushing_first_downs: 0,
    rushing_epa: 0,
    receptions: 0,
    targets: 0,
    receiving_yards: 0,
    receiving_tds: 0,
    receiving_fumbles: 0,
    receiving_fumbles_lost: 0,
    receiving_air_yards: 0,
    receiving_yards_after_catch: 0,
    receiving_first_downs: 0,
    receiving_epa: 0,
    fantasy_points: 0,
    fantasy_points_ppr: 0,
  }

  // Sum the values
  results.forEach((result) => {
    statsSum.carries += parseFloat(result.carries)
    statsSum.rushing_yards += parseFloat(result.rushing_yards)
    statsSum.rushing_tds += parseFloat(result.rushing_tds)
    statsSum.rushing_fumbles += parseFloat(result.rushing_fumbles)
    statsSum.rushing_fumbles_lost += parseFloat(result.rushing_fumbles_lost)
    statsSum.rushing_first_downs += parseFloat(result.rushing_first_downs)
    statsSum.rushing_epa += parseFloat(result.rushing_epa || '0')
    statsSum.receptions += parseFloat(result.receptions)
    statsSum.targets += parseFloat(result.targets)
    statsSum.receiving_yards += parseFloat(result.receiving_yards)
    statsSum.receiving_tds += parseFloat(result.receiving_tds)
    statsSum.receiving_fumbles += parseFloat(result.receiving_fumbles)
    statsSum.receiving_fumbles_lost += parseFloat(result.receiving_fumbles_lost)
    statsSum.receiving_air_yards += parseFloat(result.receiving_air_yards)
    statsSum.receiving_yards_after_catch += parseFloat(
      result.receiving_yards_after_catch
    )
    statsSum.receiving_first_downs += parseFloat(result.receiving_first_downs)
    statsSum.receiving_epa += parseFloat(result.receiving_epa || '0')
    statsSum.fantasy_points += parseFloat(result.fantasy_points)
    statsSum.fantasy_points_ppr += parseFloat(result.fantasy_points_ppr)
  })

  // Calculate averages
  const statsCount = results.length
  const statsAvg = Object.fromEntries(
    Object.entries(statsSum).map(([key, value]) => [key, value / statsCount])
  )

  statsAvg.weeks = results.length

  try {
    const cacheKey1 = `player-news:${playerId}`

    // Check if player1's news is cached
    const player1NewsCache = await redisClient?.get(cacheKey1)

    let player1Stories

    // Parse cache data to ensure it's an array of objects
    if (player1NewsCache) {
      try {
        player1Stories = JSON.parse(player1NewsCache)
        if (!Array.isArray(player1Stories)) {
          throw new Error('Invalid data format')
        }
      } catch (error) {
        console.error('Error parsing player1 cache:', error)
        player1Stories = [] // Fallback to empty array if parsing fails
      }
    } else {
      const player1Details = await getPlayerDetails(playerId.trim())
      if (!player1Details) {
        return NextResponse.json(
          { error: 'Player 1 not found' },
          { status: 404 }
        )
      }
      player1Stories = await fetchAndFilterStories(
        Number(player1Details.espn_id),
        player1Details.team || ''
      )
      if (!Array.isArray(player1Stories)) {
        player1Stories = [] // Ensure it's an array even if empty
      }
      // Cache player 1 stories
      await redisClient?.set(
        cacheKey1,
        JSON.stringify(player1Stories),
        'EX',
        3600
      ) // Cache for 1 hour
    }

    const cacheKeyProp = `player-prop:${playerId}-${prop}`
    const playerProp = await redisClient?.get(cacheKeyProp)

    const defTeamAvg = await getOpponentTeamAvg(teamAbbr, 'RB')

    if (playerProp && player1Stories) {
      const result = await streamObject({
        model: openai('gpt-4o-mini'),
        seed: 100,
        schema: propsResSchema,
        system: `You are an expert at sports betting and finding value within player prop bets. Pretend you are down to your last dollar and you NEED to win this bet.`,
        prompt: `
    Given the current odds for ${playerName} vs ${opponentTeam}, I want you to analyze the prop bet given recent data, historical data, and recent team news to make an informed decision on if it is a good bet. 
    
    This is the data to consider:
    Player: ${playerName}
    Team news: ${player1Stories}
    Opposing team: ${opponentTeam}
    Prop: ${prop}
    Current odds from fanduel: ${playerProp}
    data for this year for player: ${JSON.stringify(sortedCurrentData)}
    historical data vs this team if available: ${JSON.stringify(statsAvg)}
    Opposing teams average stats allowed: ${JSON.stringify(defTeamAvg)}
    
    Please return the following:
    
    {
    prop: ${prop}
     overUnder: "Over" or "Under",
     certainty: 0-100,
     explanation: "Provide a brief explanation (2-3 sentences) and include any stats and/or snippets from ${player1Stories} team news to support your recommendation and convince me why your line of thinking is correct.",
    }
  `,
        onFinish: async ({ object }) => {
          await db.user.update({
            where: { email: session?.user?.email as string },
            data: { dailyLimit: { decrement: 1 } } as any,
          })
        },
      })
      return result.toTextStreamResponse()
    } else {
      return NextResponse.json({
        success: false,
        message: 'No matching game found.',
      })
    }
  } catch (error) {
    console.error('Error fetching odds data:', error)
    return NextResponse.json({
      success: false,
      message: 'Error fetching data.',
    })
  }
}
