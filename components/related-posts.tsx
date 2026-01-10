"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "./ui/container";
import { Badge } from "./ui/badge";
import type { Post } from "@/types";

export default function RelatedPosts() {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const path = usePathname();

  useEffect(() => {
    async function init() {
      // Fetch posts from API route
      const response = await fetch('/api/posts');
      if (!response.ok) {
        setRelatedPosts([]);
        return;
      }
      const posts: Post[] = await response.json();
      
      // Extract year and slug from pathname (e.g., /2023/initial-blog-post or /2025/system-design/acid-properties)
      const pathMatch = path.match(/^\/(\d{4})\/(.+)/);
      
      if (!pathMatch) {
        setRelatedPosts([]);
        return;
      }
      
      const [, year, slug] = pathMatch;
      const normalizedSlug = slug.replace(/\/$/, '');
      
      // Find current post
      const currentPost = posts.find((post) => {
        return (post.path === normalizedSlug || post.path === slug) && post.link.includes(`/${year}/`);
      });
      
      if (!currentPost) {
        setRelatedPosts([]);
        return;
      }
      
      // Extract current post categories (handle both string and array)
      const currentCategories = Array.isArray(currentPost.category) 
        ? currentPost.category.map(c => c.toLowerCase())
        : [currentPost.category.toLowerCase()];
      
      // Filter related posts:
      // 1. Same category (any match if array)
      // 2. Not Personal category
      // 3. Not current post
      const related = posts
        .filter((post) => {
          // Exclude current post
          if (post.path === currentPost.path && post.link === currentPost.link) {
            return false;
          }
          
          // Get post categories
          const postCategories = Array.isArray(post.category)
            ? post.category.map(c => c.toLowerCase())
            : [post.category.toLowerCase()];
          
          // Exclude Personal category
          if (postCategories.some(c => c === 'personal')) {
            return false;
          }
          
          // Check if any category matches
          return postCategories.some(cat => currentCategories.includes(cat));
        })
        .sort((a, b) => {
          // Sort by date (newest first)
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        })
        .slice(0, 6); // Limit to 6 posts
      
      setRelatedPosts(related);
    }

    init();
  }, [path]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <Container className="mt-12 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Related Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedPosts.map((post) => {
          const year = new Date(post.date).getFullYear().toString();
          const postCategories = Array.isArray(post.category) ? post.category : [post.category];
          
          return (
            <Link
              key={post.id}
              href={`/${year}/${post.path}`}
              className="block p-4 rounded-lg border border-gray-200 dark:border-[#313131] hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 line-clamp-2">
                {post.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {postCategories.map((cat, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{post.date}</span>
                <span>{post.minuteToRead} min read</span>
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
