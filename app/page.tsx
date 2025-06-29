import { Suspense } from "react";
import { Posts } from "./posts/posts";
import { getPostsWithViewData } from "@/lib/get-posts";
import { RandomQuote } from '@/components/ui/quote'
import Container from "@/components/ui/container";
import { Metadata } from "next";
import { META_DATA } from "@/lib/meta";

export const metadata: Metadata = {
  title: "Home - Software Developer & Tech Blog",
  description: "Welcome to Cihat Salik's blog. Discover insights on software development, programming tutorials, productivity tips, and career advice for developers. Stay updated with the latest in JavaScript, React, and web development.",
  openGraph: {
    title: "Cihat Salik - Software Developer Portfolio & Blog",
    description: "Explore programming tutorials, career advice, and insights from a full-stack developer in Istanbul. Join me on my journey through software development and continuous learning.",
    url: META_DATA.url,
    images: [
      {
        url: "https://cihat.dev/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cihat Salik - Software Developer Portfolio",
      }
    ],
  },
  alternates: {
    canonical: META_DATA.url,
  },
};

export default async function Home() {
  const posts = await getPostsWithViewData();

  return (
    <Container className="flex flex-col sm:py-6 py-3 h-[calc(100vh-140px)]" as="main">
      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts posts={posts}/>
      </Suspense>
      <RandomQuote />
    </Container>
  )
}
