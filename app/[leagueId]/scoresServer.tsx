import { getServerSession } from 'next-auth/next'
import { getMatchups } from '../utils'
import { ScoreClient } from './scoresClient'
import { cookies } from 'next/headers'
import { authOptions } from '../api/auth/[...nextauth]/options'
import { headers } from 'next/headers'
import db from '@/lib/db'

async function ScoresComponent({
  leagueId,
  week,
}: {
  leagueId: string
  week: number
}) {
  const fetchUrl =
    process.env.VERCEL_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://sleeper-dashboard.vercel.app'

  const session = await getServerSession(authOptions)
  const cookieStore = cookies()
  const sessionTokenCookie =
    process.env.VERCEL_ENV === 'development'
      ? cookieStore.get('next-auth.session-token')
      : cookieStore.get('__Secure-next-auth.session-token')
  console.log('-----------')
  console.log('-----------')
  console.log('sessionTokenCookie', sessionTokenCookie)
  console.log('-----------')
  console.log('-----------')
  console.log('-----------')
  let sessionToken = sessionTokenCookie?.value

  const authCheck = async (leagueId: any, sleeperUserId: any) => {
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
          AND: [
            { email: session.user.email },
            { sleeperUserId: sleeperUserId },
          ],
        },
        select: {
          id: true,
          leagues: true,
          sleeperUserId: true,
        },
      })

      console.log('Found user:', user)

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

      console.log('Found league:', league)

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

  const scores = await getMatchups({ weekIndex: week, leagueId })
  const claimedChecks = scores.map((score: any) =>
    authCheck(score.league_id, score.owner_id)
  )

  // Wait for all claims to resolve
  const claimedResults = await Promise.all(claimedChecks)

  // Add claimed status to matchups
  const updatedMatchups = scores.map((score: any, index: number) => ({
    ...score,
    claimed: claimedResults[index], // Add the claimed status
  }))

  const isUnclaimed = updatedMatchups.every((matchup: any) => !matchup.claimed)

  return <ScoreClient scoresData={updatedMatchups} isUnclaimed={isUnclaimed} />
}

export default ScoresComponent
