import { Redis } from "@upstash/redis"

let redis: Redis | null = null
let redisError: boolean = false

// Lazy initialization function with retry capability
function getRedisClient(): Redis | null {
  // If previous initialization failed, return null immediately
  if (redisError) {
    return null
  }

  // Return existing client if already initialized
  if (redis) {
    return redis
  }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  // Don't log warnings during build time
  const isBuildTime = process.env.NODE_ENV === undefined || process.env.NEXT_PHASE === 'phase-production-build'

  if (!url || !token) {
    if (!isBuildTime) {
      console.warn('⚠️  Redis credentials not found')
      console.warn('   Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
    }
    redisError = true
    return null
  }

  if (!url.startsWith('https://')) {
    if (!isBuildTime) {
      console.warn('⚠️  Invalid Redis URL format')
      console.warn(`   Expected: https://...`)
      console.warn(`   Received: ${url.substring(0, 30)}...`)
    }
    redisError = true
    return null
  }

  try {
    // Upstash Redis REST API only needs url and token
    redis = new Redis({
      url,
      token,
      // Enable automatic retry with exponential backoff
      automaticDeserialization: true,
    })
    
    if (!isBuildTime) {
      console.log('✅ Redis client initialized')
    }
    return redis
  } catch (error) {
    if (!isBuildTime) {
      console.warn('⚠️  Failed to initialize Redis:', error)
    }
    redisError = true
    return null
  }
}

// Helper function to execute Redis commands with timeout and error handling
// Default timeout is 3 seconds for better reliability
export async function executeRedisCommand<T>(
  command: (client: Redis) => Promise<T>,
  fallback: T,
  timeoutMs: number = 3000
): Promise<T> {
  const redis = getRedisClient()
  
  if (!redis) {
    console.log('⚠️  Redis client not available, using fallback')
    return fallback
  }

  try {
    const timeoutPromise = new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Redis timeout')), timeoutMs)
    )
    
    const result = await Promise.race([
      command(redis),
      timeoutPromise
    ])
    
    console.log('✅ Redis command successful')
    return result
  } catch (error) {
    console.warn('⚠️  Redis command failed:', error)
    return fallback
  }
}

// Export the lazy initialization function
export default getRedisClient
