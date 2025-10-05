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

// Helper function to return posts without views (fallback)
function getStaticPosts(): Post[] {
  return postsData.posts.map((post: Post) => ({
    ...post,
    views: 0,
    viewsFormatted: '0'
  }));
}

export const getPostsWithViewData = async (): Promise<Post[]> => {
  // During build time or if Redis is unavailable, return static data
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
  const skipRedis = process.env.SKIP_REDIS === 'true';
  
  if (isBuildTime || skipRedis) {
    console.log('⚡ Using static posts data (skipping Redis)');
    return getStaticPosts();
  }

  // Check in-memory cache first
  const now = Date.now();
  if (postsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 Using cached posts data');
    return postsCache;
  }

  console.log('🔄 Fetching posts with view data...');
  
  // Fetch all views from Redis with timeout and error handling
  // Use aggressive timeout (300ms) to prevent CPU timeout on edge workers
  const allViews = await executeRedisCommand<Views|null>(
    (redis) => redis.hgetall("views"),
    null, // Return null on failure
    300 // 300ms timeout
  );

  // If Redis failed, return static data
  if (!allViews) {
    console.log('⚠️  Redis unavailable, using static data');
    return getStaticPosts();
  }
  
  // Map posts with view data
  const posts = postsData.posts.map((post: Post) => {
    const views = Number(allViews[post.id] ?? 0)
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
