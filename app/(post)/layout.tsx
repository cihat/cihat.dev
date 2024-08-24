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
    <Container as="article" className="flex flex-col mb-10 py-6 min-h-screen text-gray-800 dark:text-gray-300 left-animation">
      <Header posts={posts} />
      {children}
      {<Comment />}
      <Pagination />
      <ClapsButton />
    </Container>
  );
}
