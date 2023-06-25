import { Posts } from "./posts";
import { getPosts } from "@/lib/get-posts";
import { RandomQuote } from '@/components/ui/quote'
import getQuote from "@/lib/fetch-stoic-quote"

export default async function Home() {
  const posts = await getPosts();
  const quote = await getQuote()

  return (
    <div className="flex flex-col">
      <Posts posts={posts} />
      <RandomQuote quote={quote}/>
    </div>
  )
}