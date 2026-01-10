"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "./ui/container";
import type { Post, Pagination } from "@/types";

/**
 * Sorts posts by their created date (newest first)
 * This matches the default sort order on the home page
 */
function sortPostsByCreatedDate(posts: Post[]): Post[] {
  // Sort all posts by date (newest first) - this is the created date
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // newest first (descending)
  });
}

export default function Pagination() {
  const [pagination, setPagination] = useState<Pagination>({ prev: null, next: null });
  const path = usePathname();

  useEffect(() => {
    async function init() {
      // Fetch posts from API route instead of importing server-only module
      const response = await fetch('/api/posts');
      if (!response.ok) {
        setPagination({ prev: null, next: null });
        return;
      }
      const posts: Post[] = await response.json();
      
      // Sort posts by created date (newest first) - matches home page default sort
      const sortedPosts = sortPostsByCreatedDate(posts);
      
      // Extract year and slug from pathname (e.g., /2023/initial-blog-post or /2025/system-design/acid-properties)
      // Use (.+) to capture nested paths correctly
      const pathMatch = path.match(/^\/(\d{4})\/(.+)/);
      
      if (!pathMatch) {
        setPagination({ prev: null, next: null });
        return;
      }
      
      const [, year, slug] = pathMatch;
      // Remove trailing slash if present
      const normalizedSlug = slug.replace(/\/$/, '');
      
      // Find current post by matching both year and path for more accuracy
      // Handle nested paths correctly (e.g., system-design/acid-properties)
      const currentBlogIndex = sortedPosts.findIndex((post) => {
        return (post.path === normalizedSlug || post.path === slug) && post.link.includes(`/${year}/`);
      });
      
      if (currentBlogIndex === -1) {
        setPagination({ prev: null, next: null });
        return;
      }
      
      let prevBlog;
      let nextBlog;

      // Posts are sorted by created date (newest first)
      // Previous = newer post (index - 1, because newer posts come first)
      // Next = older post (index + 1, because older posts come later)
      if (currentBlogIndex === 0) {
        // First post (newest) - no previous
        prevBlog = null;
        nextBlog = sortedPosts[currentBlogIndex + 1];
      } else if (currentBlogIndex === sortedPosts.length - 1) {
        // Last post (oldest) - no next
        prevBlog = sortedPosts[currentBlogIndex - 1];
        nextBlog = null;
      } else {
        prevBlog = sortedPosts[currentBlogIndex - 1];
        nextBlog = sortedPosts[currentBlogIndex + 1];
      }

      setPagination({ prev: prevBlog, next: nextBlog });
    }

    init();

    return () => {
      setPagination({ prev: null, next: null });
    };
  }, [path]);

  return (
    <Container className="flex justify-between flex-wrap items-center mt-6 mx-0 min-h-[28px] top-animation">
      {pagination?.prev && (
        <Link 
          href={`/${pagination.prev.date.split(" ")[2]}/${pagination.prev.path}`} 
          className="text-gray-800 dark:text-gray-300 hover:underline mr-auto cursor-pointer text-lg font-bold"
          title={`Previous post: ${pagination.prev.title}`}
          prefetch={false}
        >
          ← {pagination.prev.title}
        </Link>
      )}
      {pagination?.next && (
        <Link 
          href={`/${pagination.next.date.split(" ")[2]}/${pagination.next.path}`} 
          className="text-gray-800 dark:text-gray-300 hover:underline ml-auto cursor-pointer text-lg mt-6 sm:mt-0 font-bold"
          title={`Next post: ${pagination.next.title}`}
          prefetch={false}
        >
          {pagination.next.title} →
        </Link>
      )}
    </Container>
  );
}
