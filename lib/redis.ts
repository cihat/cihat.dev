import { Redis } from "@upstash/redis"

const config = {
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
} as any

const redis = new Redis(config)

export default redis