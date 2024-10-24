import MatchupCard from '@/components/ui/matchupCard'
import { Matchup } from '@/lib/definitions'
import MatchupCardSkeleton from '@/components/ui/matchupCardSkeleton'

const renderSkeletons = () => {
  return Array.from({ length: 8 }, (_, i) => (
    <div key={`skeleton-${i}`}>
      <MatchupCardSkeleton />
    </div>
  ))
}

const renderMatchupCards = (
  matchups: Matchup[] | null,
  isUnclaimed?: boolean
) => {
  if (!matchups) return <MatchupCardSkeleton />

  const cards = []
  for (let i = 0; i < matchups.length; i += 2) {
    cards.push(
      <MatchupCard
        key={i}
        team1={matchups[i]}
        team2={matchups[i + 1] || null}
        withVsLink
        isUnclaimed={isUnclaimed || false}
      />
    )
  }
  return cards
}

export default function Scoreboard({
  scoresData,
  isUnclaimed,
}: {
  scoresData: Matchup[] | null
  isUnclaimed?: boolean
}) {
  if (!scoresData) return renderSkeletons()

  return <div>{renderMatchupCards(scoresData, isUnclaimed)}</div>
}
