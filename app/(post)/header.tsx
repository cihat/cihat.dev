"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { useRef, useEffect } from 'react'
import { ago } from "time-ago";
import useSWR from "swr";
import type { Post } from "@/types";
import { Badge } from "@/components/ui/badge";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function Header({ posts }: { posts: Post[] }) {
  const segments = useSelectedLayoutSegments();
  const initialPost = posts.find(
    post => post.id === segments[segments.length - 1]
  );
  const { data: post, mutate } = useSWR(
    `/api/post-detail?id=${initialPost?.id ?? ""}`,
    fetcher,
    {
      fallbackData: initialPost,
      refreshInterval: 5000,
    }
  );

  if (initialPost == null) return <></>;

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
              >
                @chtslk
              </a>
            </span>

            <span className="mx-2">|</span>
          </div>
          <span>{post.minuteToRead} mins</span>
          &nbsp;|&nbsp;

          {/* since we will pre-render the relative time, over time it
           * will diverge with what the user relative time is, so we suppress the warning.
           * In practice this is not an issue because we revalidate the entire page over time
           * and because we will move this to a server component with template.tsx at some point */}
          <span suppressHydrationWarning={true}>
            {post.date} ({ago(post.date, true)} ago)
          </span>
          &nbsp;|&nbsp;
          <Badge className="ml-2">
            {post.category}
          </Badge>
        </div>
        <span className="pr-1.5">
          <Views
            id={post.id}
            mutate={mutate}
            defaultValue={post.viewsFormatted}
          />
        </span>
      </div>
    </>
  );
}

function Views({ id, mutate, defaultValue }) {
  const views = defaultValue;
  const didLogViewRef = useRef(false);

  useEffect(() => {
    if ("development" === process.env.NODE_ENV) return;
    if (!didLogViewRef.current) {
      const url = "/api/post-detail?incr=1&id=" + encodeURIComponent(id);
      fetch(url)
        .then(res => res.json())
        .then(obj => {
          mutate(obj);
        })
        .catch(console.error);
      didLogViewRef.current = true;
    }
  });

  return <>{views != null ? <span>{views} views</span> : null}</>;
}
