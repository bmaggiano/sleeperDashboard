import { getPlayerIdMappingsFromRedis } from '@/lib/sleeper/cache'
import { getIndividualMatchup, getPlayerDetails } from '@/lib/sleeper/helpers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const playerId = searchParams.get('pid') || null

  console.log(playerId)

  if (playerId) {
    const player = await getPlayerDetails(playerId, true)
    return NextResponse.json(player)
  }

  return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
}
