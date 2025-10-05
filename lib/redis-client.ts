"use client"

import { Redis } from "@upstash/redis"

let redisClient: Redis | null = null

/**
 * Client-side Redis instance
 * Uses NEXT_PUBLIC_ prefixed env vars that are exposed to the browser
 * ⚠️ Only use for read operations or non-sensitive increments
 */
export function getRedisClient(): Redis | null {
  // Return existing client if available
  if (redisClient) {
    return redisClient
  }

  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return null
  }

  const url = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL
  const token = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    console.warn('⚠️  Client-side Redis credentials not available')
    return null
  }

  if (!url.startsWith('https://')) {
    console.warn('⚠️  Invalid Redis URL format for client')
    return null
  }

  try {
    redisClient = new Redis({
      url,
      token,
      automaticDeserialization: true,
    })
    
    console.log('✅ Client-side Redis initialized')
    return redisClient
  } catch (error) {
    console.warn('⚠️  Failed to initialize client Redis:', error)
    return null
  }
}

/**
 * Execute Redis command from client with timeout and error handling
 */
export async function executeClientRedisCommand<T>(
  command: (client: Redis) => Promise<T>,
  fallback: T,
  timeoutMs: number = 3000
): Promise<T> {
  const redis = getRedisClient()
  
  if (!redis) {
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
    
    return result
  } catch (error) {
    console.warn('⚠️  Client Redis command failed:', error)
    return fallback
  }
}
