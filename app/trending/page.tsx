import { cache } from 'react'
import { getLeagueDetails, sleeperToESPNMapping } from '@/app/utils'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/options'
import db from '@/lib/db'
import { TrendingPlayersClient } from './trendingPlayersClient'
import LeagueSelectorClient from './leagueSelectorClient'
import TryPlayerCompareBanner from '../tryPlayerCompareBanner'

const cachedSleeperToESPNMapping = cache(sleeperToESPNMapping)

export default async function TrendingPlayers({
  leagueId,
  forCompare,
}: {
  leagueId?: string
  forCompare?: boolean
}) {
  const session = (await getServerSession(authOptions)) as {
    user: { id: string; name?: string; email?: string; image?: string } | null
  }

  const user = await db.user.findUnique({
    where: { id: session?.user?.id || '' },
    select: { id: true, leagues: true },
  })

  const league = user?.leagues || []
  const leagueDetails = await Promise.all(
    league.map(async (league: any) => {
      const leagueData = await getLeagueDetails(league.leagueId)
      return {
        id: league.leagueId,
        leagueId: league.leagueId,
        name: leagueData.name,
      }
    })
  )

  const allPlayers = await fetch(
    `https://api.sleeper.app/v1/league/${leagueId}/rosters`
  )
  const allPlayersData = await allPlayers.json()
  const rosterPlayers =
    allPlayersData &&
    allPlayersData.flatMap((roster: { players: any[] }) =>
      roster.players.filter((playerId) => playerId)
    )

  const trendingUp = await fetch(
    'https://api.sleeper.app/v1/players/nfl/trending/add'
  )
  const trendingUpData = await trendingUp.json()
  const trendingUpSorted = trendingUpData.sort(
    (a: any, b: any) => b.count - a.count
  )

  const trendingDown = await fetch(
    'https://api.sleeper.app/v1/players/nfl/trending/drop'
  )
  const trendingDownData = await trendingDown.json()
  const trendingDownSorted = trendingDownData.sort(
    (a: any, b: any) => b.count - a.count
  )

  const trendingUpPlayersData = await Promise.all(
    trendingUpSorted.map(async (playerData: any) => {
      const playerId = playerData.player_id
      const count = playerData.count
      const info = await cachedSleeperToESPNMapping(playerId)

      // Return player info only if they are not DEF or K
      return info?.position !== 'DEF' && info?.position !== 'K'
        ? { count, id: playerId, info }
        : null
    })
  )

  // Filter out null values after resolving all promises
  const trendingUpPlayers = trendingUpPlayersData.filter(
    (player) => player !== null
  )

  const trendingDownPlayersData = await Promise.all(
    trendingDownSorted.map(async (playerData: any) => {
      const playerId = playerData.player_id
      const count = playerData.count
      const info = await cachedSleeperToESPNMapping(playerId)

      // Return player info only if they are not DEF or K
      return info?.position !== 'DEF' && info?.position !== 'K'
        ? { count, id: playerId, info }
        : null
    })
  )
  // Filter out null values after resolving all promises
  const trendingDownPlayers = trendingDownPlayersData.filter(
    (player) => player !== null
  )

  const availablePlayersUp = trendingUpPlayers.filter(
    (upPlayer) => !rosterPlayers?.includes(upPlayer?.id)
  )

  const availablePlayersDown = trendingDownPlayers.filter(
    (downPlayer) => !rosterPlayers?.includes(downPlayer?.id)
  )

  const availablePlayersUpInfo = await Promise.all(
    availablePlayersUp.map(async (player: any) => {
      const info = await cachedSleeperToESPNMapping(player?.id)
      return {
        id: player?.id,
        info: info || null,
        count: player?.count,
      }
    })
  )

  const availablePlayersDownInfo = await Promise.all(
    availablePlayersDown.map(async (player: any) => {
      const info = await cachedSleeperToESPNMapping(player?.id)
      return {
        id: player?.id,
        info: info || null,
        count: player?.count,
      }
    })
  )

  return (
    <>
      {!forCompare && (
        <div className="pt-4">
          <TryPlayerCompareBanner />
        </div>
      )}
      {!forCompare && (
        <div className="flex items-center justify-between pt-4">
          <span className="text-lg font-semibold">
            {leagueId
              ? leagueDetails.find((league) => league.leagueId === leagueId)
                  ?.name
              : 'No league selected'}{' '}
          </span>
          <LeagueSelectorClient
            leagues={leagueDetails}
            currentLeauge={leagueId || ''}
          />
        </div>
      )}
      <TrendingPlayersClient
        forCompare={forCompare}
        availablePlayersUp={leagueId ? availablePlayersUpInfo : []}
        availablePlayersDown={leagueId ? availablePlayersDownInfo : []}
        trendingUpPlayers={trendingUpPlayers}
        trendingDownPlayers={trendingDownPlayers}
      />
    </>
  )
}
