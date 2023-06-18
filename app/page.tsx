import Container from "@/components/ui/container";
import { Posts } from "./posts";
import { getPosts } from "@/lib/getPosts";

export default async function Home() {
  const posts = await getPosts();

  return <Posts posts={posts} />
}