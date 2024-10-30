import { getServerSession } from 'next-auth/next'
import { getMatchups } from '../utils'
import { ScoreClient } from './scoresClient'
import { cookies } from 'next/headers'
import { authOptions } from '../api/auth/[...nextauth]/options'
import { headers } from 'next/headers'

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
  const checkClaimedLeague = async (leagueId: string, ownerId: any) => {
    try {
      const res = await fetch(`${fetchUrl}/api/checkClaimedLeague`, {
        method: 'POST',
        body: JSON.stringify({ leagueId, sleeperUserId: ownerId }),
        headers: headers(),
        credentials: 'include',
        cache: 'no-store',
      })

      if (res.ok) {
        const data = await res.json()
        console.log(data)
        return data
      } else {
        return false
      }
    } catch (error) {
      console.error('Error checking league:', error)
      return false
    }
  }
  const scores = await getMatchups({ weekIndex: week, leagueId })
  const claimedChecks = scores.map((score: any) =>
    checkClaimedLeague(score.league_id, score.owner_id)
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
