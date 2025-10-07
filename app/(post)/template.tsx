import React from "react";
import { headers } from "next/headers";
import postsData from "@/lib/posts.json";
import { META_DATA } from "@/lib/meta";
import { Header } from "./header";
import SocialShare from "@/components/social-share";

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === '1';

export default async function Template({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  if (DEBUG) console.log("🔍 [Template] Pathname:", pathname);

  // Find the post by matching pathname
  const post = postsData.posts.find((p) => {
    const url = new URL(p.link);
    return url.pathname === pathname;
  });

  if (!post) {
    if (DEBUG) console.log("❌ [Template] No post found for:", pathname);
    return <>{children}</>;
  }

  // Add default views (will be updated client-side)
  const postWithViews = {
    ...post,
    views: 0,
    viewsFormatted: "0",
  };

  if (DEBUG) console.log("✅ [Template] Post found:", post.title);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${META_DATA.url}/og/og-image.png`,
    author: {
      "@type": "Person",
      name: META_DATA.name,
      url: META_DATA.url,
      sameAs: [
        META_DATA.social.github,
        META_DATA.social.twitter,
        META_DATA.social.instagram,
      ],
    },
    publisher: {
      "@type": "Person",
      name: META_DATA.name,
      url: META_DATA.url,
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.link,
    },
    url: post.link,
    inLanguage: post.language,
    genre: post.category,
    keywords: [post.category, "programming", "software development"],
    wordCount: post.minuteToRead * 200,
    timeRequired: `PT${post.minuteToRead}M`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header post={postWithViews} />
      {children}
      <SocialShare
        url={post.link}
        title={post.title}
        description={post.description}
      />
    </>
  );
}


