import postsData from "./posts.json";
import getRedisClient from "./redis";
import commaNumber from 'comma-number'
import type { Post } from "@/types";

type Views = {
  [key: string]: string
}

// In-memory cache
let postsCache: Post[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getPostsWithViewData = async (): Promise<Post[]> => {
  // Check cache first
  const now = Date.now();
  if (postsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return postsCache;
  }

  let allViews: null | Views = null
  
  // Redis bağlantısı varsa views verilerini al
  const redis = getRedisClient()
  if (redis) {
    try {
      // Timeout ile Redis çağrısını sınırla
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis timeout')), 1000)
      );
      
      const redisPromise = redis.hgetall("views");
      
      allViews = await Promise.race([redisPromise, timeoutPromise]) as Views;
    } catch (error) {
      console.warn('⚠️  Failed to fetch views from Redis:', error)
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

  return posts
}

export const getPosts = () => {
  return postsData.posts
}
