'use server'
import { Suspense } from 'react'
import GameLogsClient from './boxScoresClient'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
  withBack?: boolean
}

export default async function GameLogs({
  searchParams,
  withBack = true,
}: Props) {
  const { playerId, p2Id } = searchParams
  const fetchUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://sleeper-dashboard.vercel.app'

  const playerStatsFromNew = await fetch(
    `${fetchUrl}/api/playerStats?playerId=${playerId}&playerId2=${p2Id}`,
    {
      cache: 'no-store',
    }
  )

  const playerStatsFromNewJson = await playerStatsFromNew.json()
  return (
    <div className="my-4">
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <GameLogsClient withBack={withBack} data={playerStatsFromNewJson} />
    </div>
  )
}
