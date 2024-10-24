'use client'

import Scoreboard from '../scoreboard'

export function ScoreClient({
  scoresData,
  isUnclaimed,
}: {
  scoresData: any
  isUnclaimed: boolean
}) {
  return (
    <div>
      <Scoreboard scoresData={scoresData} isUnclaimed={isUnclaimed} />
    </div>
  )
}
