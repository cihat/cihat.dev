import type { Post } from "@/types";
import { PostListItem } from "./PostListItem";
import { getYear } from "@/lib/utils";

interface PostListProps {
  posts: Post[];
}

/**
 * Renders a list of blog posts grouped by year
 */
export function PostList({ posts }: PostListProps) {
  if (!posts.length) {
    return (
      <p className="flex justify-center items-center text-center text-xl mt-12 font-semibold">
        Not found
      </p>
    );
  }

  return (
    <ul>
      {posts.map((post, i) => {
        const year = getYear(post.date);
        const isFirstOfYear = !posts[i - 1] || getYear(posts[i - 1].date) !== year;
        const isLastOfYear = !posts[i + 1] || getYear(posts[i + 1].date) !== year;

        return (
          <PostListItem
            key={post.id}
            post={post}
            year={year.toString()}
            isFirstOfYear={isFirstOfYear}
            isLastOfYear={isLastOfYear}
          />
        );
      })}
    </ul>
  );
}

