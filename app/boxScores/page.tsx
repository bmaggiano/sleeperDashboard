'use server'
import { Suspense } from 'react'
import GameLogsClient from './boxScoresClient'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import db from '@/lib/db'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
  withBack?: boolean
}

export default async function GameLogs({
  searchParams,
  withBack = true,
}: Props) {
  const playerId = Array.isArray(searchParams.playerId)
    ? searchParams.playerId[0]
    : (searchParams.playerId as string | undefined)

  let playerStatsFromNewJson: any = { error: 'Player ID is required' }

  if (playerId) {
    try {
      const player = await getPlayerDetails(playerId.trim())

      if (player?.gsis_id) {
        // Fetch player stats from the database directly
        const playerStats1 = await db.$queryRaw`
          SELECT * FROM nflverse_player_stats_2024 WHERE player_id = ${player.gsis_id.trim()}
        `

        playerStatsFromNewJson = { playerStats1 }
      } else {
        playerStatsFromNewJson = { error: 'Player not found' }
      }
    } catch (error) {
      console.error('Error fetching player stats:', error)
      playerStatsFromNewJson = { error: 'Failed to fetch player stats' }
    }
  }

  return (
    <div className="my-4">
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <GameLogsClient withBack={withBack} data={playerStatsFromNewJson} />
    </div>
  )
}
