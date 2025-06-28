import postsData from "./posts.json";
import getRedisClient from "./redis";
import commaNumber from 'comma-number'
import type { Post } from "@/types";

type Views = {
  [key: string]: string
}

export const getPostsWithViewData = async (): Promise<Post[]> => {
  let allViews: null | Views = null
  
  // Redis bağlantısı varsa views verilerini al
  const redis = getRedisClient()
  if (redis) {
    try {
      allViews = await redis.hgetall("views")
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

  return posts
}

export const getPosts = () => {
  return postsData.posts
}
