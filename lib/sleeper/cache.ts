import redisClient from '../redis/redisClient'
import { PlayersIdMappingsSchema } from './schemas'
import { z } from 'zod'

export async function getPlayerIdMappingsFromRedis(
  key: string
): Promise<z.infer<typeof PlayersIdMappingsSchema>[string] | null> {
  if (!redisClient) {
    console.error('[Redis] Redis client is not initialized')
    return null
  }
  try {
    const data = await redisClient.hgetall(`player_id_mappings:${key}`)
    if (Object.keys(data).length > 0) {
      const parsedData = PlayersIdMappingsSchema.parse({ [key]: data })[key]

      return {
        sleeper_id: key,
        ...parsedData,
      }
    }
    return null
  } catch (error) {
    console.error('[Redis] Error getting player ID mappings:', error)
    return null
  }
}
