import postsData from "./posts.json";
import getRedisClient from "./redis";
import commaNumber from 'comma-number'
import type { Post } from "@/types";

type Views = {
  [key: string]: string
}

// In-memory cache - çok daha uzun süre
let postsCache: Post[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 saat (development ve production için)

export const getPostsWithViewData = async (): Promise<Post[]> => {
  // Check cache first - her zaman cache kullan
  const now = Date.now();
  if (postsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 Using cached posts data');
    return postsCache;
  }

  console.log('🔄 Fetching fresh posts data...');
  let allViews: null | Views = null
  
  // Development'ta Redis'i devre dışı bırak
  if (process.env.NODE_ENV === 'production') {
    const redis = getRedisClient()
    if (redis) {
      try {
        // Timeout ile Redis çağrısını sınırla
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redis timeout')), 500) // Timeout'u daha da kısalt
        );
        
        const redisPromise = redis.hgetall("views");
        
        allViews = await Promise.race([redisPromise, timeoutPromise]) as Views;
      } catch (error) {
        console.warn('⚠️  Failed to fetch views from Redis:', error)
      }
    }
  }
  
  const posts = postsData.posts.map((post: Post) => {
    const views = Number(allViews?.[post.id] ?? 0)
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views)
    }
  })

  // Update cache
  postsCache = posts;
  cacheTimestamp = now;
  console.log('✅ Posts data cached for 1 hour');

  return posts
}

export const getPosts = () => {
  return postsData.posts
}
