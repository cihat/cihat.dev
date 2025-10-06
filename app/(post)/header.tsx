"use client";

import { useRef, useEffect, useState } from 'react'
import { ago } from "time-ago";
import useSWR, { mutate as globalMutate } from "swr";
import type { Post } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function Header({ initialPost }: { initialPost: Post | undefined }) {
  console.log('🎯 Header render - initialPost:', initialPost ? `ID: ${initialPost.id}, Title: ${initialPost.title}` : 'undefined');
  
  // Track the current post ID to detect changes
  const [currentPostId, setCurrentPostId] = useState(initialPost?.id);
  
  // Clear SWR cache when post changes
  useEffect(() => {
    if (initialPost?.id && initialPost.id !== currentPostId) {
      console.log('🔄 Post changed from', currentPostId, 'to', initialPost.id);
      // Clear the old post's cache
      if (currentPostId) {
        globalMutate(`/api/post-detail?id=${currentPostId}`, undefined, { revalidate: false });
      }
      // Update current post ID
      setCurrentPostId(initialPost.id);
    }
  }, [initialPost?.id, currentPostId]);
  
  const { data: post, mutate } = useSWR(
    initialPost ? `/api/post-detail?id=${initialPost.id}` : null,
    fetcher,
    {
      fallbackData: initialPost,
      refreshInterval: 5000,
      revalidateOnMount: true,
      dedupingInterval: 0, // Disable deduplication to prevent stale cache
      keepPreviousData: false, // Don't show previous post data when navigating
      revalidateOnFocus: false, // Prevent revalidation on focus
    }
  );

  console.log('🎯 Header render - post:', post ? `ID: ${post.id}, Title: ${post.title}` : 'undefined');

  if (initialPost == null || !post) {
    console.log('⚠️  Header: returning empty - initialPost or post is null');
    return <></>;
  }
  
  // Double-check that we're showing the correct post
  if (post.id !== initialPost.id) {
    console.warn('⚠️  Post ID mismatch! Expected:', initialPost.id, 'Got:', post.id);
    // Force re-fetch the correct post
    mutate(initialPost);
    return <></>;
  }

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
                title="Follow @chtslk on Twitter"
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
          <Link href={`/?category=${post.category}`} title={`View all posts in ${post.category} category`}>
            <Badge className="ml-2">
              {post.category}
            </Badge>
          </Link>
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
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip if no ID (shouldn't happen, but safety check)
    if (!id) return;
    
    // Reset the ref if the post ID has changed
    if (lastIdRef.current !== id) {
      didLogViewRef.current = false;
      lastIdRef.current = id;
    }
    
    // Remove the development check - we want to track views in all environments
    if (!didLogViewRef.current) {
      const url = "/api/post-detail?incr=1&id=" + encodeURIComponent(id);
      console.log('📊 Incrementing view count for:', id);
      fetch(url)
        .then(res => res.json())
        .then(obj => {
          console.log('✅ View count updated:', obj.views);
          mutate(obj);
        })
        .catch((error) => {
          console.error('❌ Failed to update view count:', error);
        });
      didLogViewRef.current = true;
    }
  }, [id, mutate]);

  return <>{views != null ? <span>{views} views</span> : null}</>;
}
