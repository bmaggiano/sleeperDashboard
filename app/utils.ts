'use server'

import { cache } from 'react'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import { getESPNPlayerInfo } from '@/lib/espn'
import db from '@/lib/db'
import { createSqlQuery } from '../app/api/db/queryHelpers'
import { calculateFantasyPoints } from '../app/api/db/fantasyPointsHelper'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/options'

const years = [
  'nflverse_play_by_play_2024',
  'nflverse_play_by_play_2023',
  'nflverse_play_by_play_2022',
  'nflverse_play_by_play_2021',
]

export const isLoggedIn = async () => {
  const session = await getServerSession(authOptions)
  return !!session
}

export const getDailyLimit = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return false
  }

  const user = await db.user.findUnique({
    where: { email: session.user?.email as string },
    select: { dailyLimit: true },
  })

  if (!user) {
    return false
  }
  return { dailyLimit: user.dailyLimit }
}

export const checkClaimedLeague = async (leagueId: any, sleeperUserId: any) => {
  const session = await getServerSession(authOptions)
  try {
    if (!leagueId || !sleeperUserId) {
      return false
    }

    // If no session, return unauthorized with more detailed error
    if (!session || !session.user) {
      console.log('No session or email found')
      return false
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

    if (!user) {
      return false
    }

    // Find the specific league
    const league = await db.league.findFirst({
      where: {
        userId: user.id,
        leagueId: leagueId,
      },
      select: { id: true },
    })

    if (!league) {
      return false
    }

    return {
      success: true,
      sleeperUserId: user.sleeperUserId,
    }
  } catch (error) {
    console.error('API Error:', error)
    return false
  }
}

export async function getPlayerStats(
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
      const [result] = (await db.$queryRaw(query.playerStats)) as any

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
            totalYardsPerRec:
              parseFloat(
                (
                  Number(result.total_rec_yards) /
                  Number(result.total_receptions)
                ).toFixed(2)
              ) || 0,
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
            totalYardsPerRec: 0,
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

const LEAGUE_DEFAULT_YEAR = 2025

export const getTotalWeeks = cache(async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!response.ok) throw new Error('Failed to fetch league weeks')
    const leagueWeeks = await response.json()
    return leagueWeeks.settings.leg
  } catch (error: any) {
    return 0
  }
})

export const getCurrentWeek = cache(async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!response.ok) throw new Error('Failed to fetch league weeks')
    const leagueData = await response.json()
    let recentWeek = leagueData?.settings?.leg
    if (recentWeek > leagueData?.settings?.playoff_week_start)
      recentWeek = 'winners'
    return recentWeek
  } catch (error: any) {
    return { index: 0, week: 'Week 1' }
  }
})

export const getLeagueWeeks = cache(async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!response.ok) throw new Error('Failed to fetch league weeks')
    const leagueWeeks = await response.json()
    const leagueWeekNum = leagueWeeks.settings.playoff_week_start - 1
    const leagueWeeksArray = Array.from({ length: leagueWeekNum }, (_, i) => ({
      index: i + 1,
      week: `Week ${i + 1}`,
    }))
    leagueWeeksArray.push({
      index: leagueWeekNum + 1,
      week: 'Winners Bracket',
    })
    return leagueWeeksArray
  } catch (error: any) {
    return []
  }
})

export const getLeagueName = cache(async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!response.ok) throw new Error('Failed to fetch league info')
    const leagueInfo = await response.json()
    return leagueInfo.name
  } catch (error: any) {
    return { error: error.message }
  }
})

export const getLeagueByUserId = cache(async (username: string) => {
  try {
    // First, get the user ID from the username
    const userResponse = await fetch(
      `https://api.sleeper.app/v1/user/${username}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!userResponse.ok) throw new Error('Failed to fetch user info')
    const userData = await userResponse.json()
    const userId = userData.user_id

    const currentYear = LEAGUE_DEFAULT_YEAR
    let leagues = []

    // Try current year first
    const currentYearResponse = await fetch(
      `https://api.sleeper.app/v1/user/${userId}/leagues/nfl/${currentYear}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (currentYearResponse.ok) {
      leagues = await currentYearResponse.json()
    }

    // If no results for current year, try LEAGUE_DEFAULT_YEAR
    if (leagues.length === 0) {
      const fallbackResponse = await fetch(
        `https://api.sleeper.app/v1/user/${userId}/leagues/nfl/${LEAGUE_DEFAULT_YEAR}`,
        { next: { revalidate: 3600 } } // Cache for 1 hour
      )
      if (fallbackResponse.ok) {
        leagues = await fallbackResponse.json()
      }
    }

    return leagues
  } catch (error: any) {
    return []
  }
})

export const getLeagueDetails = cache(async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!response.ok) throw new Error('Failed to fetch league info')
    const leagueInfo = await response.json()
    return leagueInfo
  } catch (error: any) {
    return { error: error.message }
  }
})

const getUsersInfo = cache(async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/users`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!response.ok) throw new Error('Failed to fetch user info')
    const userInfo = await response.json()
    return userInfo
  } catch (error: any) {
    return { error: error.message }
  }
})

const getRosterInfo = cache(async (leagueId: string) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/rosters`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!response.ok) throw new Error('Failed to fetch roster info')
    const rosterInfo = await response.json()
    return rosterInfo
  } catch (error: any) {
    return { error: error.message }
  }
})

export const getChampionInfo = cache(async (leagueId: string) => {
  // owner id on rosters is user id on users
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!response.ok) throw new Error('Failed to fetch champion info')
    const championInfo = await response.json()
    const rosterInfo = await getRosterInfo(leagueId)
    const userInfo = await getUsersInfo(leagueId)
    const champion = rosterInfo.find(
      (roster: any) =>
        roster.roster_id == championInfo.metadata.latest_league_winner_roster_id
    )
    const user = userInfo.find((user: any) => user.user_id == champion.owner_id)
    const championObj = {
      ...champion,
      user: { ...user }, // Nest the user object inside championObj
    }
    return championObj
  } catch (error: any) {
    return
  }
})

const getMatchupInfo = cache(async (leagueId: string, weekIndex: number) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/matchups/${weekIndex}`,
      { cache: 'no-store' } // Cache for 1 hour
    )
    if (!response.ok) throw new Error('Failed to fetch matchup info')
    const matchupInfo = await response.json()
    return matchupInfo
  } catch (error: any) {
    return { error: error.message }
  }
})

const combineUserAndRosterInfo = (userInfo: any, rosterInfo: any) => {
  if (!userInfo || !rosterInfo) return []
  return rosterInfo.map((roster: any) => {
    const user = userInfo.find((user: any) => user.user_id === roster.owner_id)
    return {
      ...roster,
      user,
    }
  })
}

export const combineUserAndRosterInfoCard = cache(async (leagueId: string) => {
  const userInfo = await getUsersInfo(leagueId)
  const rosterInfo = await getRosterInfo(leagueId)
  return rosterInfo.map((roster: any) => {
    const user = userInfo.find((user: any) => user.user_id === roster.owner_id)
    return {
      ...roster,
      user,
    }
  })
})

const combineRosterAndMatchupInfo = (rosterInfo: any, matchupInfo: any) => {
  if (!rosterInfo || !matchupInfo) return []
  return matchupInfo.map((matchup: any) => {
    const roster = rosterInfo.find(
      (roster: any) => roster.roster_id === matchup.roster_id
    )
    return {
      ...matchup,
      ...roster,
    }
  })
}

export const getMatchupsWithMatchupID = cache(
  async ({
    weekIndex,
    leagueId,
    matchupId,
  }: {
    weekIndex: number
    leagueId: string
    matchupId: string
  }) => {
    const userInfo = await getUsersInfo(leagueId)
    if (userInfo?.error) return userInfo

    const rosterInfo = await getRosterInfo(leagueId)
    if (rosterInfo?.error) return rosterInfo

    const matchupInfo = await getMatchupInfo(leagueId, weekIndex)
    if (matchupInfo?.error) return matchupInfo

    const combinedUserAndRosterInfo = combineUserAndRosterInfo(
      userInfo,
      rosterInfo
    )
    const finalData = combineRosterAndMatchupInfo(
      combinedUserAndRosterInfo,
      matchupInfo
    )

    const matchupIdNumber = Number(matchupId)
    const filteredData = finalData.filter(
      (matchup: any) => matchup.matchup_id === matchupIdNumber
    )

    return filteredData
  }
)

export const getMatchups = cache(
  async ({ weekIndex, leagueId }: { weekIndex: number; leagueId: string }) => {
    const userInfo = await getUsersInfo(leagueId)
    if (userInfo?.error) return userInfo

    const rosterInfo = await getRosterInfo(leagueId)
    if (rosterInfo?.error) return rosterInfo

    const matchupInfo = await getMatchupInfo(leagueId, weekIndex)
    if (matchupInfo?.error) return matchupInfo

    const combinedUserAndRosterInfo = combineUserAndRosterInfo(
      userInfo,
      rosterInfo
    )
    const finalData = combineRosterAndMatchupInfo(
      combinedUserAndRosterInfo,
      matchupInfo
    )

    finalData.sort((a: any, b: any) => a.matchup_id - b.matchup_id)

    return finalData
  }
)

export const getWinnersBracket = cache(
  async ({ leagueId }: { leagueId: string }) => {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!response.ok) throw new Error('Failed to fetch winners bracket')
    const winnersBracket = await response.json()
    return winnersBracket
  }
)

export const matchBracketToMatchup = cache(
  async ({ leagueId, week }: { leagueId: string; week: number }) => {
    const winnersBracket = await getWinnersBracket({ leagueId })
    const matchupResults: any[] = [] // Array to store matchup results

    const numBracketLength = winnersBracket.length
    let roundsLength = winnersBracket[numBracketLength - 1].r

    // Start from the initial week
    let currentWeek = week

    // Iterate through rounds from the highest to the lowest
    while (roundsLength > 0) {
      // Get matchup details for the current week
      const matchupDetailsInfo = await getMatchups({
        weekIndex: currentWeek,
        leagueId,
      })

      // Filter for matchups corresponding to the current round
      for (const bracketMatchup of winnersBracket) {
        if (bracketMatchup.r === roundsLength) {
          // Find the corresponding teams
          const matchupTeam1 = matchupDetailsInfo.find(
            (matchup: any) => matchup.roster_id === bracketMatchup.t1
          )
          const matchupTeam2 = matchupDetailsInfo.find(
            (matchup: any) => matchup.roster_id === bracketMatchup.t2
          )
          if (matchupTeam1 && matchupTeam2) {
            const claimed1 = await checkClaimedLeague(
              leagueId,
              matchupTeam1.owner_id
            )
            const claimed2 = await checkClaimedLeague(
              leagueId,
              matchupTeam2.owner_id
            )
            matchupResults.push({
              round: roundsLength,
              week: currentWeek, // Include the current week in the result
              matchupId: bracketMatchup.m,
              team1: { ...matchupTeam1, claimed: claimed1 },
              team2: { ...matchupTeam2, claimed: claimed2 },
            })
          }
        }
      }
      // Move to the next round and week
      roundsLength--
      currentWeek--
    }

    return matchupResults // Return the array of matchup results
  }
)

export const sleeperToESPNMapping = cache(async (playerId: string) => {
  try {
    // Get player details from Sleeper
    const playerDetails = await getPlayerDetails(playerId)

    if (!playerDetails) {
      console.warn(`No player details found for Sleeper ID: ${playerId}`)
      return playerDetails
    }

    // Check if we have an ESPN ID
    if (!playerDetails.espn_info?.id) {
      console.warn(`No ESPN ID found for Sleeper ID: ${playerId}`)
      return playerDetails
    }

    // Get ESPN player info
    const espnInfo = await getESPNPlayerInfo(String(playerDetails.espn_id))

    if (!espnInfo) {
      console.warn(`No ESPN info found for ESPN ID: ${playerDetails.espn_id}`)
      return null
    }

    // Handle DEF position separately
    if (playerDetails.position === 'DEF') {
      return {
        sleeper_id: playerId,
        espn_id: playerDetails.espn_id,
        full_name: playerDetails.full_name,
        first_name: playerDetails.first_name,
        last_name: playerDetails.last_name,
        position: playerDetails.position,
        team: playerDetails.team,
        espn_full_name: espnInfo.fullName,
        espn_position: 'DEF',
        espn_team: playerDetails.team,
        image_url: espnInfo.imageUrl || null,
        jersey_number: null,
        age: null,
        height: null,
        weight: null,
      }
    }

    // Combine Sleeper and ESPN data for non-DEF players
    return {
      sleeper_id: playerId,
      espn_id: playerDetails.espn_id,
      full_name: playerDetails.full_name,
      first_name: playerDetails.first_name,
      last_name: playerDetails.last_name,
      position: playerDetails.position,
      team: playerDetails.team,
      espn_full_name: espnInfo.fullName,
      espn_position: espnInfo.position || playerDetails.position,
      espn_team: espnInfo.team?.abbreviation || playerDetails.team,
      image_url: espnInfo.imageUrl,
      jersey_number: espnInfo.jersey,
      age: null, // ESPN data doesn't include age
      height: null, // ESPN data doesn't include height
      weight: null, // ESPN data doesn't include weight
    }
  } catch (error) {
    console.error('Error in sleeperToESPNMapping:', error)
    return null
  }
})

export const calculateHeight = (height: string) => {
  // Parse the height string to get total inches
  let heightNum = parseInt(height)

  // Calculate feet and inches
  // Format the output without fractions
  return `${Math.floor(heightNum / 12)}'${heightNum % 12}`
}
