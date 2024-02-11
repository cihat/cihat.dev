import { Posts } from "./posts/posts";
import { getPostsWithViewData } from "@/lib/get-posts";
import { RandomQuote } from '@/components/ui/quote'
import Container from "@/components/ui/container";

export default async function Home() {
  const posts = await getPostsWithViewData();

  return (
    <Container className="flex flex-col h-[calc(100vh-108px)] sm:h-[75vh] sm:py-6 py-3" as="main">
      <Posts posts={posts}/>
      <RandomQuote />
    </Container>
  )
}
