import { Redis } from "@upstash/redis"

let redis: Redis | null = null
let initializationAttempted = false

// Lazy initialization function
function getRedisClient(): Redis | null {
  // Only attempt initialization once
  if (initializationAttempted) {
    return redis
  }

  initializationAttempted = true

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  // Don't log warnings during build time (when NODE_ENV is not development/production with server)
  const isBuildTime = process.env.NODE_ENV === undefined || process.env.NEXT_PHASE === 'phase-production-build'

  if (!url || !token) {
    if (!isBuildTime) {
      console.warn('⚠️  Redis environment variables are not set properly')
      console.warn('   Please create a .env.local file with:')
      console.warn('   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io')
      console.warn('   UPSTASH_REDIS_REST_TOKEN=your-redis-token')
    }
    return null
  }

  if (!url.startsWith('https://')) {
    if (!isBuildTime) {
      console.warn('⚠️  Invalid Redis URL format detected')
      console.warn(`   Expected: URL starting with 'https://'`)
      console.warn(`   Received: "${url.substring(0, 50)}${url.length > 50 ? '...' : ''}"`)
      console.warn('   Redis features will be disabled.')
      console.warn('   Please check your UPSTASH_REDIS_REST_URL environment variable.')
    }
    return null
  }

  try {
    const config = { url, token }
    redis = new Redis(config)
    if (!isBuildTime) {
      console.log('✅ Redis connection initialized successfully')
    }
    return redis
  } catch (error) {
    if (!isBuildTime) {
      console.warn('⚠️  Failed to initialize Redis client:', error)
    }
    return null
  }
}

// Export the lazy initialization function instead of the client directly
export default getRedisClient
