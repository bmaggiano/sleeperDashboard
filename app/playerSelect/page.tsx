'use server'
import redisClient from '@/lib/redis/redisClient'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/options'
import db from '@/lib/db'
import {
  combineUserAndRosterInfoCard,
  getLeagueDetails,
  sleeperToESPNMapping,
} from '../utils'
import UsersPlayers from './playerSelectClient'
import Unauthenticated from '../unauthenticated'
import NoLeaguesFoundEmpty from '../noLeaguesFoundEmpty'
import TrendingPlayers from '../trending/page'

export default async function PlayerSelect() {
  const session = (await getServerSession(authOptions)) as {
    user: { id: string; name?: string; email?: string; image?: string } | null
  }

  // Check if there is an active session
  if (!session || !session.user || !session.user.id) {
    return <Unauthenticated />
  }

  const userData = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      leagues: true,
    },
  })

  if (!userData) {
    return <NoLeaguesFoundEmpty />
  }

  const cacheKey = `user-leagues:${userData.id}`
  const cachedLeagues = await redisClient?.get(cacheKey)
  // if (cachedLeagues) {
  //   const cachedData = JSON.parse(cachedLeagues)
  //   return (
  //     <div>
  //       <UsersPlayers userPlayers={cachedData} />
  //     </div>
  //   )
  // }

  if (!userData.leagues || userData.leagues.length === 0) {
    return (
      <>
        <UsersPlayers userPlayers={[]} />
        <NoLeaguesFoundEmpty />
      </>
    )
  }

  // Define sortedUniquePlayers outside the block to ensure availability
  let sortedUniquePlayers: any[] = []

  if (userData?.leagues && userData.leagues.length > 0) {
    const leaguePromises = userData.leagues.map(async (league: any) => {
      const leagueDetails = await getLeagueDetails(league.leagueId)
      const rosterInfo = await combineUserAndRosterInfoCard(league.leagueId)
      const rosterMatch = rosterInfo.find(
        (roster: any) => roster.owner_id === userData.sleeperUserId
      )

      let playerDetails: any[] = []
      if (rosterMatch?.players) {
        playerDetails = await Promise.all(
          rosterMatch.players.map(async (player: any) => {
            const info = await sleeperToESPNMapping(player)
            return { player, info }
          })
        )
      }

      const userLeaguesData = {
        leagueDetails,
        players: playerDetails,
      }
      return userLeaguesData
    })

    const allLeaguesData = await Promise.all(leaguePromises)

    const uniquePlayerMap = new Map()
    allLeaguesData.forEach((league) => {
      league.players.forEach((player: any) => {
        if (
          !uniquePlayerMap.has(player.player) &&
          player.info.position !== 'DEF' &&
          player.info.position !== 'K'
        ) {
          uniquePlayerMap.set(player.player, player)
        }
      })
    })

    const positionOrder = ['QB', 'WR', 'RB', 'TE']
    sortedUniquePlayers = Array.from(uniquePlayerMap.values()).sort(
      (a, b) =>
        positionOrder.indexOf(a.info.position) -
        positionOrder.indexOf(b.info.position)
    )

    await redisClient?.set(
      cacheKey,
      JSON.stringify(sortedUniquePlayers),
      'EX',
      60 * 60 * 24
    )
  }

  // return <div>{<UsersPlayers userPlayers={sortedUniquePlayers} />}</div>

  return (
    <>
      <UsersPlayers userPlayers={sortedUniquePlayers} />
      <TrendingPlayers forCompare={true} />
    </>
  )
}
