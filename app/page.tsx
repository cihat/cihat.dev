import { Posts } from "./posts";
import { getPosts } from "@/lib/get-posts";
import { RandomQuote } from '@/components/ui/quote'
import Container from "@/components/ui/container";

export default async function Home() {
  const posts = await getPosts();

  return (
    <Container className="flex min-h-screen flex-col py-6" as="main">
      <Posts posts={posts}/>
      <RandomQuote />
    </Container>
  )
}