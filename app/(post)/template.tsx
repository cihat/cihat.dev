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

  if (DEBUG) console.log("🔍 [Template] Pathname from header:", pathname);

  let pageConfig: typeof postsData.posts[0] | undefined = undefined;

  if (pathname && pathname !== "/") {
    pageConfig = postsData.posts.find((post) => {
      const url = new URL(post.link);
      const matches = url.pathname === pathname;
      if (matches && DEBUG) console.log("✅ [Template] Match found:", post.title);
      return matches;
    });

    if (!pageConfig && DEBUG) console.log("❌ [Template] No post found for pathname:", pathname);
  }

  const pageConfigWithViews = pageConfig
    ? {
        ...pageConfig,
        views: 0,
        viewsFormatted: "0",
      }
    : undefined;

  if (DEBUG) {
    console.log(
      "📋 [Template] PageConfig:",
      pageConfig ? `Found: ${pageConfig.title}` : "Not found"
    );
  }

  // Structured data for the article (must update on navigation)
  const structuredData = pageConfig
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: pageConfig.title,
        description: pageConfig.description,
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
        datePublished: new Date(pageConfig.date).toISOString(),
        dateModified: new Date(pageConfig.date).toISOString(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageConfig.link,
        },
        url: pageConfig.link,
        inLanguage: pageConfig.language,
        genre: pageConfig.category,
        keywords: [pageConfig.category, "programming", "software development"],
        wordCount: pageConfig.minuteToRead * 200,
        timeRequired: `PT${pageConfig.minuteToRead}M`,
      }
    : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Render post header per navigation */}
      <Header key={pageConfigWithViews?.id || "no-post"} initialPost={pageConfigWithViews} />

      {children}

      {/* Post-specific share actions */}
      {pageConfig && (
        <SocialShare
          url={pageConfig.link}
          title={pageConfig.title}
          description={pageConfig.description}
        />
      )}
    </>
  );
}


