import Redis, { RedisOptions } from 'ioredis'
import { getRedisConfiguration } from './redisConfig' // Assuming you move the configuration function to its own file

// Function to create and configure a Redis instance
export function createRedisInstance(config = getRedisConfiguration()) {
  try {
    const options: RedisOptions = {
      host: config.url ? new URL(config.url).hostname : config.host,
      port: config.url ? parseInt(new URL(config.url).port, 10) : config.port,
      username: config.username,
      password: config.password,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 5,
      retryStrategy: (times: number) => {
        if (times > 3) {
          console.error(`[Redis] Could not connect after ${times} attempts`)
          return null // Stop retrying
        }
        return Math.min(times * 200, 3000)
      },
      tls: config.url?.startsWith('rediss://')
        ? { rejectUnauthorized: false }
        : undefined,
      connectTimeout: 10000,
    }

    const redis = new Redis(options)

    redis.on('connect', () => console.log('[Redis] Client connected'))
    redis.on('ready', () => console.log('[Redis] Client ready'))
    redis.on('error', (error: unknown) => {
      console.error('[Redis] Client error', error)
    })
    redis.on('close', () => console.log('[Redis] Client closed'))
    redis.on('reconnecting', () => console.log('[Redis] Client reconnecting'))

    return redis
  } catch (e) {
    console.error('[Redis] Could not create a Redis instance', e)
    return null
  }
}

// Create a Redis client instance
const redisClient = createRedisInstance()

// Export the Redis client instance for global use
export default redisClient
