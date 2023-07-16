import { Header } from "./header";
import { getPosts } from "@/lib/get-posts";
import ClapsButton from "@/components/claps";
import Container from "@/components/ui/container";

export const revalidate = 60;

export default async function Layout({ children }) {
  const posts = await getPosts();

  return (
    <article className="text-gray-800 dark:text-gray-300 mb-10">
      <Container className="flex min-h-screen flex-col py-6" as="main">
        <Header posts={posts} />
        {children}
        <ClapsButton url={"https://twitter.com/chtslk/status/1667095892762021888"} />
      </Container>
    </article>
  );
}