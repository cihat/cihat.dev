import { Posts } from "./posts";
import { getPostsWithViewData } from "@/lib/get-posts";
import { RandomQuote } from '@/components/ui/quote'
import Container from "@/components/ui/container";

export default async function Home() {
  const posts = await getPostsWithViewData();

  return (
    <Container className="flex flex-col h-[75vh] py-6" as="main">
      <Posts posts={posts}/>
      <RandomQuote />
    </Container>
  )
}