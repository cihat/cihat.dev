"use client";

import { ago } from "time-ago";
import type { Post } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Header({ post }: { post: Post }) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-1 dark:text-gray-100">
        {post.title}
      </h1>

      <div className="flex text-xs text-gray-500 dark:text-gray-500">
        <div className="flex-grow">
          <div className="hidden md:inline">
            <span>
              <a
                href="https://twitter.com/chtslk"
                className="hover:text-gray-800 dark:hover:text-gray-400"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow @chtslk on Twitter"
              >
                @chtslk
              </a>
            </span>
            <span className="mx-2">|</span>
          </div>
          
          <span>{post.minuteToRead} mins</span>
          &nbsp;|&nbsp;
          
          <span suppressHydrationWarning={true}>
            {post.date} ({ago(post.date, true)} ago)
          </span>
          &nbsp;|&nbsp;
          
          <Link href={`/?category=${post.category}`} title={`View all posts in ${post.category} category`}>
            <Badge className="ml-2">
              {post.category}
            </Badge>
          </Link>
        </div>
      </div>
    </>
  );
}
