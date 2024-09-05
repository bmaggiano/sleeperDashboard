import { NextRequest, NextResponse } from 'next/server'
import { createSqlQueryVsTeam } from './queryHelper'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import db from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Extract query params from the URL
  const playerId = searchParams.get('playerId')
  const team = searchParams.get('team')

  const player1 = await getPlayerDetails(playerId || '')

  const playerGsis = player1?.gsis_id?.trim() || ''

  if (!playerGsis || !team) {
    return NextResponse.json(
      { error: 'Missing required query parameters' },
      { status: 400 }
    )
  }

  // Hardcoded years
  const years: string[] = [
    // Specify type for years
    'nflverse_play_by_play_2023',
    'nflverse_play_by_play_2022',
    'nflverse_play_by_play_2021',
  ]

  // Create an array of promises for querying each year
  const queries = years.map((year) => {
    const sqlQuery = createSqlQueryVsTeam(playerGsis, team, year)
    return db.$queryRaw<any>(sqlQuery) // Specify type for query result
  })

  try {
    // Execute all queries in parallel
    const results = await Promise.all(queries)

    // Combine results
    const combinedResult = results.reduce(
      (acc: any, result: any[]) => {
        // Specify types for accumulator and result
        if (result && result.length > 0) {
          const stats = result[0]
          acc.total_rec_yards += Number(stats.total_rec_yards) || 0
          acc.total_rush_yards += Number(stats.total_rush_yards) || 0
          acc.total_air_yards += Number(stats.total_air_yards) || 0
          acc.total_yac += Number(stats.total_yac) || 0
          acc.total_tds += Number(stats.total_tds) || 0
          acc.total_receptions += Number(stats.total_receptions) || 0
          acc.total_pass_attempts += Number(stats.total_pass_attempts) || 0
          acc.total_pass_completions +=
            Number(stats.total_pass_completions) || 0
          acc.total_pass_yards += Number(stats.total_pass_yards) || 0
          acc.total_pass_tds += Number(stats.total_pass_tds) || 0
          acc.total_interceptions += Number(stats.total_interceptions) || 0
          acc.weeks += Number(stats.weeks) || 0
          acc.longest_play = Math.max(
            acc.longest_play,
            Number(stats.longest_play) || 0
          )
        }
        return acc
      },
      {
        longest_play: 0,
        total_rec_yards: 0,
        total_rush_yards: 0,
        total_air_yards: 0,
        total_yac: 0,
        total_tds: 0,
        total_receptions: 0,
        total_pass_attempts: 0,
        total_pass_completions: 0,
        total_pass_yards: 0,
        total_pass_tds: 0,
        total_interceptions: 0,
        weeks: 0,
      }
    )

    // Compute average stats
    const weeks = combinedResult.weeks || 1 // Avoid division by zero

    // Helper function to round a number to 2 decimal places
    const roundToTwoDecimals = (num: number) => Number(num.toFixed(2))

    const stats = {
      longestPlay: roundToTwoDecimals(combinedResult.longest_play / weeks),
      totalRecYards: roundToTwoDecimals(combinedResult.total_rec_yards / weeks),
      totalRushYards: roundToTwoDecimals(
        combinedResult.total_rush_yards / weeks
      ),
      totalAirYards: roundToTwoDecimals(combinedResult.total_air_yards / weeks),
      totalYac: roundToTwoDecimals(combinedResult.total_yac / weeks),
      totalTds: roundToTwoDecimals(combinedResult.total_tds / weeks),
      totalReceptions: roundToTwoDecimals(
        combinedResult.total_receptions / weeks
      ),
      totalPassAttempts: roundToTwoDecimals(
        combinedResult.total_pass_attempts / weeks
      ),
      totalYardsPerReception:
        combinedResult.total_receptions > 0
          ? roundToTwoDecimals(
              combinedResult.total_rec_yards / combinedResult.total_receptions
            )
          : 0,
      totalPassCompletions: roundToTwoDecimals(
        combinedResult.total_pass_completions / weeks
      ),
      totalPassYards: roundToTwoDecimals(
        combinedResult.total_pass_yards / weeks
      ),
      totalPassTds: roundToTwoDecimals(combinedResult.total_pass_tds / weeks),
      totalInterceptions: roundToTwoDecimals(
        combinedResult.total_interceptions / weeks
      ),
      totalWeeks: combinedResult.weeks,
    }

    console.log(stats)
    // Return the stats in the response
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching player stats:', error)
    return NextResponse.json(
      { error: 'Error fetching player stats' },
      { status: 500 }
    )
  }
}
