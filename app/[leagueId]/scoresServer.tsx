import { getMatchups } from '../utils'
import { ScoreClient } from './scoresClient'
import { checkClaimedLeague } from '../utils'

async function ScoresComponent({
  leagueId,
  week,
}: {
  leagueId: string
  week: number
}) {
  const scores = await getMatchups({ weekIndex: week, leagueId })
  const claimedChecks =
    scores.length > 0 &&
    scores?.map((score: any) =>
      checkClaimedLeague(score.league_id, score.owner_id)
    )

  // Wait for all claims to resolve
  const claimedResults = claimedChecks && (await Promise.all(claimedChecks))

  // Add claimed status to matchups
  const updatedMatchups =
    scores.length > 0 &&
    scores.map((score: any, index: number) => ({
      ...score,
      claimed: claimedResults[index], // Add the claimed status
    }))

  const isUnclaimed =
    updatedMatchups.length > 0 &&
    updatedMatchups.every((matchup: any) => !matchup.claimed)

  return <ScoreClient scoresData={updatedMatchups} isUnclaimed={isUnclaimed} />
}

export default ScoresComponent
