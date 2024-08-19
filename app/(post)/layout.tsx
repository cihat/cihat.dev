import { Header } from "./header";
import { getPostsWithViewData } from "@/lib/get-posts";
import ClapsButton from "@/components/claps";
import Container from "@/components/ui/container";
import Pagination from "@/components/pagination";
import Comment from "@/components/comment";

export const revalidate = 60;

export default async function Layout({ children }) {
  const posts = await getPostsWithViewData();

  return (
    <article className="text-gray-800 dark:text-gray-300 left-animation">
      <Container className="flex flex-col mb-10 py-6">
        <Header posts={posts} />
        {children}
        {<Comment />}
        <Pagination />
        <ClapsButton
          url={"https://twitter.com/chtslk/status/1681445140261642240"}
        />
      </Container>
    </article>
  );
}
