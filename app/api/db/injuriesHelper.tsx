import redisClient from '@/lib/redis/redisClient'
import prisma from '@/lib/db'

export async function getPlayerInjuries(playerId: string) {
  const cacheKey = `injury:${playerId}`

  // Check Redis Cache first
  const cachedResponse = await redisClient?.get(cacheKey)
  if (cachedResponse) {
    return JSON.parse(cachedResponse)
  }

  try {
    // Fetch from Prisma if not cached, ordered by date_modified DESC
    const injuries =
      await prisma.$queryRaw`SELECT * FROM injuries WHERE gsis_id = ${playerId} ORDER BY date_modified DESC`

    console.log(injuries)

    // Cache the result in Redis for 1 hour
    await redisClient?.set(cacheKey, JSON.stringify(injuries), 'EX', 3600)

    return injuries
  } catch (error) {
    console.error('Error fetching player injuries:', error)
    throw new Error('Could not fetch player injuries')
  }
}
