import { Redis } from "@upstash/redis"

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

// Environment değişkenlerini kontrol et
if (!url || !token) {
  console.warn('⚠️  Redis environment variables are not set properly')
  console.warn('   Please create a .env.local file with:')
  console.warn('   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io')
  console.warn('   UPSTASH_REDIS_REST_TOKEN=your-redis-token')
}

// URL formatını kontrol et ve geçersiz URL durumunda null döndür
let redis: Redis | null = null

if (url && token) {
  if (url.startsWith('https://')) {
    // Geçerli URL formatı
    try {
      const config = {
        url,
        token
      }
      redis = new Redis(config)
      console.log('✅ Redis connection initialized successfully')
    } catch (error) {
      console.warn('⚠️  Failed to initialize Redis client:', error)
    }
  } else {
    // Geçersiz URL formatı - Base64 encoded veya yanlış format
    console.warn('⚠️  Invalid Redis URL format detected')
    console.warn(`   Expected: URL starting with 'https://'`)
    console.warn(`   Received: "${url.substring(0, 50)}${url.length > 50 ? '...' : ''}"`)
    console.warn('   Redis features will be disabled.')
    console.warn('   Please check your UPSTASH_REDIS_REST_URL environment variable.')
  }
} else {
  console.warn('⚠️  Redis client not initialized due to missing configuration')
}

export default redis
