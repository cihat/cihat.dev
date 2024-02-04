"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "./ui/container";
import type { Post, Pagination } from "@/types";
import { getPosts } from "@/lib/get-posts";

export default function Pagination() {
  const [pagination, setPagination] = useState<Pagination>({ prev: null, next: null });
  const path = usePathname();

  useEffect(() => {
    function init() {
      const posts = getPosts();
      const currentBlog = path.split("/")[2];
      const currentBlogIndex = posts.findIndex((post) => post.id === currentBlog);
      let prevBlog;
      let nextBlog;

      if (currentBlogIndex === 0) {
        prevBlog = null;
        nextBlog = posts[currentBlogIndex + 1];
      } else if (currentBlogIndex === posts.length - 1) {
        prevBlog = posts[currentBlogIndex - 1];
        nextBlog = null;
      } else {
        prevBlog = posts[currentBlogIndex - 1];
        nextBlog = posts[currentBlogIndex + 1];
      }

      setPagination({ prev: prevBlog, next: nextBlog })
    }

    init();

    return () => {
      setPagination({ prev: null, next: null });
    }
  }, [path])

  return (
    <Container className="flex justify-between flex-wrap items-center mt-6 mx-0 min-h-[28px] top-animation">
      {pagination?.prev && (
        <Link href={`/${pagination?.prev?.date.split(" ")[2]}/${pagination.prev.id}`} legacyBehavior>
          <a className="text-gray-800 dark:text-gray-300 hover:underline mr-auto cursor-pointer text-lg font-bold">
            ← {pagination.prev.title}
          </a>
        </Link>
      )}
      {pagination?.next && (
        <Link href={`/${pagination?.next?.date.split(" ")[2]}/${pagination.next.id}`} legacyBehavior>
          <a className="text-gray-800 dark:text-gray-300 hover:underline ml-auto cursor-pointer text-lg mt-6 sm:mt-0 font-bold">
            {pagination.next.title} →
          </a>
        </Link>
      )}
    </Container>
  );
}
