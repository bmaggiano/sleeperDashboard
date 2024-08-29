import { z } from 'zod'
import { ESPNPlayerSchema, ESPNPlayer } from '@/lib/sleeper/schemas'

const ESPN_API_BASE_URL =
  'https://sports.core.api.espn.com/v3/sports/football/nfl'

export async function getESPNPlayerInfo(
  playerId: string
): Promise<ESPNPlayer | null> {
  try {
    const positivePlayerId = playerId.startsWith('-')
      ? playerId.slice(1)
      : playerId
    const response = await fetch(
      `${ESPN_API_BASE_URL}/athletes/${positivePlayerId}`
    )

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Player with ID ${positivePlayerId} not found`)
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const playerData = await response.json()
    const imageUrl = `https://a.espncdn.com/i/headshots/nfl/players/full/${positivePlayerId}.png`
    const parsedPlayer = ESPNPlayerSchema.parse({
      ...playerData,
      imageUrl,
    })

    return parsedPlayer
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Zod validation error:', error.errors)
      return null
    }
    console.error('Error fetching ESPN player info:', error)
    return null
  }
}
