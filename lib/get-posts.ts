import postsData from "./posts.json";
import type { Post } from "@/types";

// Simple function to get all posts with default view counts
export const getPosts = (): Post[] => {
  return postsData.posts.map((post) => ({
    ...post,
    views: 0,
    viewsFormatted: '0'
  }));
}
