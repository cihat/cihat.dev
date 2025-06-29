// @ts-nocheck

import { Header } from "./header";
import { getPostsWithViewData } from "@/lib/get-posts";
import Container from "@/components/ui/container";
import Pagination from "@/components/pagination";
import Comment from "@/components/comment";
import Claps from "@/components/claps/claps";
import ReadingProgressIndicator from "@/components/reading-progress-indicator";
import SocialShare from "@/components/social-share";
import postsData from "@/lib/posts.json";
import { META_DATA } from "@/lib/meta";

export const dynamic = 'force-dynamic'
export const revalidate = 60;

export function generateMetadata({ params }: { params: { slug: string } }) {
  const pageConfig = postsData.posts.find((post) => post.slug === params.slug);

  if (!pageConfig) {
    return {
      title: 'Page Not Found | Cihat Salik',
      description: 'The page you are looking for does not exist.',
    };
  }

  const postUrl = pageConfig.link;
  const ogImage = `${META_DATA.url}/og/og-image.png`;

  return {
    title: `${pageConfig.title} | ${META_DATA.name}`,
    description: pageConfig.description,
    keywords: [
      pageConfig.category.toLowerCase(),
      pageConfig.language,
      'programming',
      'software development',
      'tech blog',
      ...META_DATA.keywords
    ].join(', '),
    authors: [{ name: META_DATA.name, url: META_DATA.url }],
    openGraph: {
      title: pageConfig.title,
      description: pageConfig.description,
      url: postUrl,
      siteName: META_DATA.title,
      locale: pageConfig.language,
      type: 'article',
      publishedTime: new Date(pageConfig.date).toISOString(),
      authors: [META_DATA.name],
      section: pageConfig.category,
      tags: [pageConfig.category, 'programming', 'software development'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageConfig.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@chtslk',
      creator: '@chtslk',
      title: pageConfig.title,
      description: pageConfig.description,
      images: [ogImage],
    },
    alternates: {
      canonical: postUrl,
    },
    other: {
      'article:author': META_DATA.name,
      'article:section': pageConfig.category,
      'article:published_time': new Date(pageConfig.date).toISOString(),
      'article:modified_time': new Date(pageConfig.date).toISOString(),
      'article:tag': pageConfig.category,
    },
  };
}

export default async function Layout({ children, params }) {
  const posts = await getPostsWithViewData();
  const pageConfig = postsData.posts.find((post) => post.slug === params.slug);

  // Structured data for the article
  const structuredData = pageConfig ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": pageConfig.title,
    "description": pageConfig.description,
    "image": `${META_DATA.url}/og/og-image.png`,
    "author": {
      "@type": "Person",
      "name": META_DATA.name,
      "url": META_DATA.url,
      "sameAs": [
        META_DATA.social.github,
        META_DATA.social.twitter,
        META_DATA.social.instagram,
      ]
    },
    "publisher": {
      "@type": "Person",
      "name": META_DATA.name,
      "url": META_DATA.url,
    },
    "datePublished": new Date(pageConfig.date).toISOString(),
    "dateModified": new Date(pageConfig.date).toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageConfig.link,
    },
    "url": pageConfig.link,
    "inLanguage": pageConfig.language,
    "genre": pageConfig.category,
    "keywords": [pageConfig.category, 'programming', 'software development'],
    "wordCount": pageConfig.minuteToRead * 200, // Estimate based on reading time
    "timeRequired": `PT${pageConfig.minuteToRead}M`,
  } : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      <ReadingProgressIndicator />
      <Container as="article" className="flex flex-col mb-10 py-6 min-h-screen text-gray-800 dark:text-gray-300 left-animation">
        <Header posts={posts} />
        {children}
        {pageConfig && (
          <SocialShare 
            url={pageConfig.link}
            title={pageConfig.title}
            description={pageConfig.description}
          />
        )}
        {<Comment />}
        <Pagination />
        <Claps />
      </Container>
    </>
  );
}
