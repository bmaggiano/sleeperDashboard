import { getMatchups } from '../utils'
import { ScoreClient } from './scoresClient'

async function ScoresComponent({
  leagueId,
  week,
}: {
  leagueId: string
  week: number
}) {
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
