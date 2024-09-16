'use server'
import { Suspense } from 'react'
import GameLogsClient from './boxScoresClient'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function GameLogs({ searchParams }: Props) {
  const { playerId1, playerId2 } = searchParams
  const fetchUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://sleeper-dashboard.vercel.app'

  const playerStatsFromNew = await fetch(
    `${fetchUrl}/api/playerStats?playerId=${playerId1}&playerId2=${playerId2}`
  )

  const playerStatsFromNewJson = await playerStatsFromNew.json()
  return (
    <div className="my-4">
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <GameLogsClient data={playerStatsFromNewJson} />
    </div>
  )
}
