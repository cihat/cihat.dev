import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/types";

interface PostListItemProps {
  post: Post;
  year: string;
  isFirstOfYear: boolean;
  isLastOfYear: boolean;
}

/**
 * Individual post list item component with year grouping
 */
export function PostListItem({ post, year, isFirstOfYear, isLastOfYear }: PostListItemProps) {
  return (
    <li>
      <Link
        href={`/${new Date(post.date).getFullYear()}/${post.path}`}
        title={`Read ${post.title} - ${post.minuteToRead} minute read`}
        prefetch={false}
        scroll={true}
      >
        <span
          className={`flex px-2 transition-[background-color] hover:bg-gray-100 dark:hover:bg-[#242424] active:bg-gray-200 dark:active:bg-[#222] border-y border-gray-200 dark:border-[#313131]
            ${!isFirstOfYear ? "border-t-0" : ""}
            ${isLastOfYear ? "border-b-0" : ""}
          `}
        >
          <div className={`py-2 flex grow items-center justify-between ${!isFirstOfYear ? "ml-14" : ""}`}>
            {isFirstOfYear && (
              <span className="w-14 inline-block self-start shrink-0 text-gray-500 dark:text-gray-500">
                {year}
              </span>
            )}
            
            <div className="flex flex-col grow">
              <div>
                <span className="grow dark:text-gray-100 font-semibold">{post.title}</span>
                &nbsp;|&nbsp;
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {post.minuteToRead} mins
                </span>
              </div>
              
              <div>
                {Array.isArray(post.category) ? (
                  post.category.map((cat, idx) => (
                    <Badge key={idx} className="mr-2">{cat}</Badge>
                  ))
                ) : (
                  <Badge className="mr-2">{post.category}</Badge>
                )}
                <span className="text-xs">{post.date}</span>
              </div>
            </div>
          </div>
        </span>
      </Link>
    </li>
  );
}

