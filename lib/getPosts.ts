import postsData from "./posts.json";

export type Post = {
  id: string;
  date: string;
  title: string;
};

export const getPosts = () => postsData.posts.map((post): Post => post)