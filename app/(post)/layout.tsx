import { LayoutWrapper } from "./LayoutWrapper";
import postsData from "@/lib/posts.json";
import { META_DATA } from "@/lib/meta";
import { headers } from 'next/headers';

// Force dynamic rendering for metadata (since it depends on pathname)
export const dynamic = 'force-dynamic';

/**
 * Finds a post from posts.json by matching pathname components
 * Uses a deterministic approach: extracts year and slug from pathname
 * and matches against post.path and post.link
 */
function findPostByPathname(pathname: string) {
  // Extract year and slug from pathname (e.g., /2023/initial-blog-post)
  const pathMatch = pathname.match(/^\/(\d{4})\/([^\/]+)/);
  
  return postsData.posts.find((p) => {
    if (pathMatch) {
      // Match by year and path - this is more reliable for OpenNext
      const [, year, slug] = pathMatch;
      return p.path === slug && p.link.includes(`/${year}/`);
    }
    // Fallback to full pathname match
    try {
      const url = new URL(p.link);
      return url.pathname === pathname;
    } catch {
      return false;
    }
  });
}

export async function generateMetadata() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  if (!pathname || pathname === '/') {
    return {
      title: 'Blog Post | Cihat Salik',
      description: 'Read my latest blog post about software development and technology.',
    };
  }
  
  const post = findPostByPathname(pathname);

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
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
