"use client";

import { useRef, useEffect, useMemo, useState } from 'react'
import { ago } from "time-ago";
import type { Post } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === '1';

export function Header({ initialPost }: { initialPost: Post | undefined }) {
  if (DEBUG) console.log('🎯 Header MOUNTED - initialPost:', initialPost ? `ID: ${initialPost.id}, Title: ${initialPost.title}` : 'undefined');

  const pathname = usePathname();
  const currentId = useMemo(() => {
    if (!pathname) return undefined;
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1];
  }, [pathname]);

  // Use only the server-provided initial data; do not fetch client-side
  const post = initialPost && initialPost.id === currentId ? initialPost : undefined;

  if (DEBUG) console.log('🎯 Header render - post:', post ? `ID: ${post.id}, Title: ${post.title}` : 'undefined');

  // Prevent stale UI: don't render until the initial data matches current route id
  if (!currentId || !post || post.id !== currentId) {
    if (DEBUG) console.log('⚠️  Header: returning empty - waiting for correct post data');
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
            defaultValue={post.viewsFormatted}
          />
        </span>
      </div>
    </>
  );
}

function Views({ id, defaultValue }) {
  const [views, setViews] = useState<string | number | null>(defaultValue ?? null);
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
    
    // Prevent multiple increments within the same session
    const viewedKey = `viewed:${id}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(viewedKey) === '1') {
      if (DEBUG) console.log('🛑 Skipping view increment (already viewed this session):', id);
      didLogViewRef.current = true;
      return;
    }

    if (!didLogViewRef.current) {
      const url = "/api/post-detail?incr=1&id=" + encodeURIComponent(id);
      if (DEBUG) console.log('📊 Incrementing view count for:', id);
      fetch(url)
        .then(res => res.json())
        .then(obj => {
          if (DEBUG) console.log('✅ View count updated:', obj.views);
          // Update local state with the latest view count
          setViews(obj.viewsFormatted ?? obj.views ?? defaultValue ?? null);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(viewedKey, '1');
          }
        })
        .catch((error) => {
          if (DEBUG) console.error('❌ Failed to update view count:', error);
        });
      didLogViewRef.current = true;
    }
  }, [id, defaultValue]);

  return <>{views != null ? <span>{views} views</span> : null}</>;
}
