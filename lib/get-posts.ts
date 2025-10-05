import postsData from "./posts.json";
import { executeRedisCommand } from "./redis";
import commaNumber from 'comma-number'
import type { Post } from "@/types";

type Views = {
  [key: string]: string
}

// In-memory cache with configurable duration
let postsCache: Post[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export const getPostsWithViewData = async (): Promise<Post[]> => {
  // Check in-memory cache first
  const now = Date.now();
  if (postsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 Using cached posts data');
    return postsCache;
  }

  console.log('🔄 Fetching posts with view data...');
  
  // Fetch all views from Redis with timeout and error handling
  const allViews = await executeRedisCommand<Views|null>(
    (redis) => redis.hgetall("views"),
    {},
    2000 // 2 second timeout
  );
  
  // Map posts with view data
  const posts = postsData.posts.map((post: Post) => {
    const views = Number(allViews?.[post.id] ?? 0)
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views)
    }
  })

  // Update in-memory cache
  postsCache = posts;
  cacheTimestamp = now;
  console.log('✅ Posts data cached');

  return posts
}

export const getPosts = () => {
  return postsData.posts
}
