//@ts-nocheck
// TODO: FIX TYPES

'use server'

import { getMatchupsWithMatchupID, sleeperToESPNMapping } from '@/app/utils'
import MatchupDetails from '@/app/matchupDetails'
import { cache, Suspense } from 'react'

const cachedSleeperToESPNMapping = cache(sleeperToESPNMapping)

export default async function MatchupServer({
  week,
  leagueId,
  matchup,
}: {
  week: string
  leagueId: string
  matchup: string
}) {
  const data = await getMatchupsWithMatchupID({
    weekIndex: Number(week),
    leagueId: leagueId,
    matchupId: matchup,
  })
  const fetchUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://sleeper-dashboard.vercel.app'

  const checkClaimedLeague = async (leagueId: string, ownerId: any) => {
    try {
      const res = await fetch(`${fetchUrl}/api/checkClaimedLeague`, {
        method: 'POST',
        body: JSON.stringify({ leagueId, sleeperUserId: ownerId }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        const data = await res.json()
        return data
      } else {
        return false
      }
    } catch (error) {
      console.error('Error checking league:', error)
      return false
    }
  }

  const processedData = await Promise.all(
    data.map(async (team) => {
      // Perform claimed league check for this specific team
      const claimed = await checkClaimedLeague(team.league_id, team.owner_id)

      const starters = await Promise.all(
        team.starters.map(async (playerId, index) => {
          const info = await cachedSleeperToESPNMapping(playerId)
          return {
            id: playerId,
            points: team.starters_points[index],
            info: info || null, // Handle potential null value
            claimed, // Pass claimed status to starters
          }
        })
      )

      const bench = await Promise.all(
        team.players
          .filter((playerId) => !team.starters.includes(playerId))
          .map(async (playerId) => {
            const info = await cachedSleeperToESPNMapping(playerId)
            return {
              id: playerId,
              points: team.players_points[playerId],
              info: info || null, // Handle potential null value
            }
          })
      )

      return {
        ...team,
        starters,
        bench,
        claimed, // Pass claimed status to the entire team
      }
    })
  )

  const isUnclaimed = processedData.every((matchup: any) => !matchup.claimed)

  return (
    <div>
      <Suspense
        fallback={
          <div className="w-full flex items-center justify-center">
            Loading...
          </div>
        }
      >
        {console.log(processedData)}
        <MatchupDetails
          teamOne={processedData[0]}
          teamTwo={processedData[1]}
          isUnclaimed={isUnclaimed}
        />
      </Suspense>
    </div>
  )
}
