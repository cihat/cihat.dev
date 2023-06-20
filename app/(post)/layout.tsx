import { Header } from "./header";
import { getPosts } from "@/lib/getPosts";
import ClapsButton from "@/components/claps";

export const revalidate = 60;

export default async function Layout({ children }) {
  const posts = await getPosts();

  return (
    <article className="text-gray-800 dark:text-gray-300 mb-10">
      <Header posts={posts} />
      {children}
      <ClapsButton url={"https://twitter.com/chtslk/status/1671133617748049921"} />
    </article>
  );
}