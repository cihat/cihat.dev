"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Container from "@/components/ui/container";
import RelatedPosts from "@/components/related-posts";
import Comment from "@/components/comment";
import ReadingProgressIndicator from "@/components/reading-progress-indicator";
import { BackButton } from "@/components/ui/back-button";

/**
 * Client wrapper for post layout
 * Each post now contains its own title and metadata in MDX
 */
export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <ReadingProgressIndicator />
      <Container 
        as="article" 
        className="flex flex-col mb-10 py-6 min-h-screen text-gray-800 dark:text-gray-300 left-animation"
      >
        <BackButton />
        {children}
        <Comment />
        <RelatedPosts />
      </Container>
    </>
  );
}

