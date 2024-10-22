import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { NextRequest } from 'next/server'
import redisClient from '@/lib/redis/redisClient'
import { getPlayerDetails } from '@/lib/sleeper/helpers'
import fetchAndFilterStories from '@/app/compare/recentNews'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  const context = await request.json()
  const { playerId1, playerId2 } = context

  if (!playerId1 || !playerId2) {
    return NextResponse.json(
      { error: 'Both Player IDs are required' },
      { status: 400 }
    )
  }

  // Define cache keys
  const cacheKey1 = `player-news:${playerId1}`
  const cacheKey2 = `player-news:${playerId2}`

  // Check if player1's news is cached
  const player1NewsCache = await redisClient?.get(cacheKey1)
  const player2NewsCache = await redisClient?.get(cacheKey2)

  let player1Stories, player2Stories

  // Parse cache data to ensure it's an array of objects
  if (player1NewsCache) {
    try {
      player1Stories = JSON.parse(player1NewsCache)
      if (!Array.isArray(player1Stories)) {
        throw new Error('Invalid data format')
      }
    } catch (error) {
      console.error('Error parsing player1 cache:', error)
      player1Stories = [] // Fallback to empty array if parsing fails
    }
  } else {
    const player1Details = await getPlayerDetails(playerId1.trim())
    if (!player1Details) {
      return NextResponse.json({ error: 'Player 1 not found' }, { status: 404 })
    }
    player1Stories = await fetchAndFilterStories(
      Number(player1Details.espn_id),
      player1Details.team || ''
    )
    if (!Array.isArray(player1Stories)) {
      player1Stories = [] // Ensure it's an array even if empty
    }
    // Cache player 1 stories
    await redisClient?.set(
      cacheKey1,
      JSON.stringify(player1Stories),
      'EX',
      3600
    ) // Cache for 1 hour
  }

  // Parse cache data to ensure it's an array of objects
  if (player2NewsCache) {
    try {
      player2Stories = JSON.parse(player2NewsCache)
      if (!Array.isArray(player2Stories)) {
        throw new Error('Invalid data format')
      }
    } catch (error) {
      console.error('Error parsing player2 cache:', error)
      player2Stories = [] // Fallback to empty array if parsing fails
    }
  } else {
    const player2Details = await getPlayerDetails(playerId2.trim())
    if (!player2Details) {
      return NextResponse.json({ error: 'Player 2 not found' }, { status: 404 })
    }
    player2Stories = await fetchAndFilterStories(
      Number(player2Details.espn_id),
      player2Details.team || ''
    )
    if (!Array.isArray(player2Stories)) {
      player2Stories = [] // Ensure it's an array even if empty
    }
    // Cache player 2 stories
    await redisClient?.set(
      cacheKey2,
      JSON.stringify(player2Stories),
      'EX',
      3600
    ) // Cache for 1 hour
  }

  // Return both players' stories together as arrays of objects
  return NextResponse.json({
    player1Stories,
    player2Stories,
  })
}
