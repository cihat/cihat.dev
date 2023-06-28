import postsData from "./posts.json";
import redis from "./redis";
import commaNumber from 'comma-number'
import type { Post } from "@/types";

type Views = {
  [key: string]: string
}

export const getPosts = async (): Promise<Post[]> => {
  const allViews: null | Views = await redis.hgetall("views")
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