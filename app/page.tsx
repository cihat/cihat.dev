import { Posts } from "./posts/posts";
import { getPostsWithViewData } from "@/lib/get-posts";
import { RandomQuote } from '@/components/ui/quote'
import Container from "@/components/ui/container";

export default async function Home() {
  const posts = await getPostsWithViewData();

  return (
    <Container className="flex flex-col sm:py-6 py-3 h-[calc(100vh-140px)]" as="main">
      <Posts posts={posts}/>
      <RandomQuote />
    </Container>
  )
}
