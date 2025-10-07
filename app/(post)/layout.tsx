import Container from "@/components/ui/container";
import Pagination from "@/components/pagination";
import Comment from "@/components/comment";
import ReadingProgressIndicator from "@/components/reading-progress-indicator";
import postsData from "@/lib/posts.json";
import { META_DATA } from "@/lib/meta";
import { headers } from 'next/headers';

// Force dynamic rendering for metadata (since it depends on pathname)
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  if (!pathname || pathname === '/') {
    return {
      title: 'Blog Post | Cihat Salik',
      description: 'Read my latest blog post about software development and technology.',
    };
  }
  
  // Find post by pathname
  const post = postsData.posts.find((p) => {
    const url = new URL(p.link);
    return url.pathname === pathname;
  });

  if (!post) {
    return {
      title: 'Page Not Found | Cihat Salik',
      description: 'The page you are looking for does not exist.',
    };
  }

  const ogImage = `${META_DATA.url}/og/og-image.png`;

  return {
    title: `${post.title} | ${META_DATA.name}`,
    description: post.description,
    keywords: [
      post.category.toLowerCase(),
      post.language,
      'programming',
      'software development',
      'tech blog',
      ...META_DATA.keywords
    ],
    authors: [{ name: META_DATA.name, url: META_DATA.url }],
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.link,
      siteName: META_DATA.title,
      locale: post.language,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: [META_DATA.name],
      section: post.category,
      tags: [post.category, 'programming', 'software development'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@chtslk',
      creator: '@chtslk',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    alternates: {
      canonical: post.link,
    },
    other: {
      'article:author': META_DATA.name,
      'article:section': post.category,
      'article:published_time': new Date(post.date).toISOString(),
      'article:modified_time': new Date(post.date).toISOString(),
      'article:tag': post.category,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReadingProgressIndicator />
      <Container as="article" className="flex flex-col mb-10 py-6 min-h-screen text-gray-800 dark:text-gray-300 left-animation">
        {children}
        <Comment />
        <Pagination />
      </Container>
    </>
  );
}
