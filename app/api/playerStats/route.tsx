import { NextResponse, NextRequest } from 'next/server'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  // Extract query parameters from the URL
  const { searchParams } = new URL(request.url)
  const playerId1 = searchParams.get('playerId')?.trim() || ''
  // Check if playerId exists
  if (!playerId1) {
    return NextResponse.json(
      { error: 'Player ID is required' },
      { status: 400 }
    )
  }

  const [player1] = await Promise.all([getPlayerDetails(playerId1.trim())])

  // Fetch player stats from the database since playerId is not unique, we need to use a raw query
  const playerStats1 = await prisma.$queryRaw`
  SELECT * FROM nflverse_player_stats_2024 WHERE player_id = ${player1?.gsis_id?.trim()}
`

  // Handle case where player stats are not found
  if (!playerStats1) {
    return NextResponse.json(
      { error: 'Player stats not found' },
      { status: 404 }
    )
  }

  // Return player stats as JSON response
  return NextResponse.json({ playerStats1 })
}
