import Redis, { RedisOptions } from "ioredis";
import { PlayersIdMappingsSchema } from "./schemas";
import { z } from "zod";

function getRedisConfiguration(): {
    url: string;
    host: string;
    port: number;
    password: string;
    username: string;
} {
    return {
        url: process.env.REDIS_URL ?? "",
        host: process.env.REDIS_HOST ?? "",
        port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
        password: process.env.REDIS_PASSWORD ?? "",
        username: process.env.REDIS_USER ?? "",
    };
}

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
                    console.error(`[Redis] Could not connect after ${times} attempts`);
                    return null; // Stop retrying
                }
                return Math.min(times * 200, 3000);
            },
            tls: config.url?.startsWith("rediss://")
                ? { rejectUnauthorized: false }
                : undefined,
            connectTimeout: 10000,
        };

        const redis = new Redis(options);

        redis.on("connect", () => console.log("[Redis] Client connected"));
        redis.on("ready", () => console.log("[Redis] Client ready"));
        redis.on("error", (error: unknown) => {
            console.error("[Redis] Client error", error);
        });
        redis.on("close", () => console.log("[Redis] Client closed"));
        redis.on("reconnecting", () => console.log("[Redis] Client reconnecting"));

        return redis;
    } catch (e) {
        console.error("[Redis] Could not create a Redis instance", e);
        return null;
    }
}

const redisClient = createRedisInstance();

async function connectToRedis() {
    if (!redisClient) {
        console.error("[Redis] Redis client is not initialized");
        return;
    }
    try {
        await redisClient.ping();
    } catch (error) {
        console.error("[Redis] Failed to connect:", error);
    }
}

export async function getPlayerIdMappingsFromRedis(
    key: string
): Promise<z.infer<typeof PlayersIdMappingsSchema>[string] | null> {
    if (!redisClient) {
        console.error("[Redis] Redis client is not initialized");
        return null;
    }
    try {
        await connectToRedis();
        const data = await redisClient.hgetall(`player_id_mappings:${key}`);
        if (Object.keys(data).length > 0) {
            const parsedData = PlayersIdMappingsSchema.parse({ [key]: data })[key];

            return {
                sleeper_id: key,
                ...parsedData,
            };
        }
        return null;
    } catch (error) {
        console.error("[Redis] Error getting player ID mappings:", error);
        return null;
    }
}