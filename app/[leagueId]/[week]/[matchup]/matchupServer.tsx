// @ts-nocheck

'use server'

import { getMatchupsWithMatchupID, sleeperToESPNMapping } from '@/app/utils'
import MatchupDetails from '@/app/matchupDetails'
import { cache, Suspense } from 'react'
import { checkClaimedLeague } from '@/app/utils'

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

  const processedData = await Promise.all(
    data.map(
      async (team: {
        league_id: string
        owner_id: any
        starters: string[]
        starters_points: { [x: string]: any }
        players: any[]
        players_points: { [x: string]: any }
      }) => {
        // Perform claimed league check for this specific team
        const claimed = await checkClaimedLeague(team.league_id, team.owner_id)

        const starters = await Promise.all(
          team.starters.map(
            async (playerId: string, index: string | number) => {
              const info = await cachedSleeperToESPNMapping(playerId)
              return {
                id: playerId,
                points: team.starters_points[index],
                info: info || null, // Handle potential null value
                claimed, // Pass claimed status to starters
              }
            }
          )
        )

        const bench = await Promise.all(
          team.players
            .filter((playerId: any) => !team.starters.includes(playerId))
            .map(async (playerId: string) => {
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
      }
    )
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
        <MatchupDetails
          teamOne={processedData[0]}
          teamTwo={processedData[1]}
          isUnclaimed={isUnclaimed}
        />
      </Suspense>
    </div>
  )
}
