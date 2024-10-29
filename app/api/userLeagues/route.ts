import { NextResponse } from 'next/server'
import {
  combineUserAndRosterInfoCard,
  getLeagueDetails,
  sleeperToESPNMapping,
} from '../../utils'
import redisClient from '@/lib/redis/redisClient'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'
import db from '@/lib/db'
import { Session } from 'next-auth'

interface ExtendedSession extends Session {
  user: {
    id: string // Add the id property
    name?: string | null
    email?: string | null
    image?: string | null
    leagues?: any[]
    sleeperUserId?: string
  }
}

export const GET = async (request: Request) => {
  //   const response = await fetch(`/api/user`)
  //   const userData = await response.json()
  const session = (await getServerSession(authOptions)) as ExtendedSession

  // Check if there is an active session
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userData = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      leagues: true,
    }, // Use a colon here for object property assignment
  })

  if (!userData) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const cacheKey = `user-leagues:${userData.id}`
  const cachedLeagues = await redisClient?.get(cacheKey)
  if (cachedLeagues) {
    return NextResponse.json(JSON.parse(cachedLeagues))
  }

  if (!userData.leagues || userData.leagues.length === 0) {
    return NextResponse.json({ error: 'No leagues found' }, { status: 404 })
  }

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
    const sortedUniquePlayers = Array.from(uniquePlayerMap.values()).sort(
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

    return NextResponse.json(sortedUniquePlayers)
  }
}
