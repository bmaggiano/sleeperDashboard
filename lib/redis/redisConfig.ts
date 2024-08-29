export function getRedisConfiguration(): {
  url: string
  host: string
  port: number
  password: string
  username: string
} {
  return {
    url: process.env.REDIS_URL ?? '',
    host: process.env.REDIS_HOST ?? '',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD ?? '',
    username: process.env.REDIS_USER ?? '',
  }
}
