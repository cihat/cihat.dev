import { LayoutWrapper } from "./LayoutWrapper";
import { getPosts } from "@/lib/get-posts";
import { META_DATA } from "@/lib/meta";
import { headers } from 'next/headers';

// Optimize for Cloudflare Workers - use static generation where possible
export const dynamic = 'auto';

/**
 * Finds a post by matching pathname components
 * Uses a deterministic approach: extracts year and slug from pathname
 * and matches against post.path and post.link
 */
function findPostByPathname(pathname: string) {
  const posts = getPosts();
  
  // Extract year and slug from pathname (e.g., /2023/initial-blog-post)
  const pathMatch = pathname.match(/^\/(\d{4})\/(.+)/);
  
  return posts.find((p) => {
    if (pathMatch) {
      // Match by year and path - this is more reliable for OpenNext
      const [, year, slug] = pathMatch;
      // Handle nested paths (e.g., /2024/sport/agirlik-antrenmanlarina-baslangic)
      const normalizedSlug = slug.replace(/\/$/, ''); // Remove trailing slash
      return (p.path === normalizedSlug || p.path === slug) && p.link.includes(`/${year}/`);
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
  // Optimize for Cloudflare Workers - reduce CPU usage
  try {
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

    // Simplified metadata to reduce CPU usage
    return {
      title: `${post.title} | ${META_DATA.name}`,
      description: post.description,
      alternates: {
        canonical: post.link,
      },
      openGraph: {
        title: post.title,
        description: post.description,
        url: post.link,
        siteName: META_DATA.title,
        type: 'article',
        images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: [ogImage],
      },
    };
  } catch (error) {
    // Fallback metadata to prevent CPU timeout
    return {
      title: 'Blog Post | Cihat Salik',
      description: 'Read my latest blog post about software development and technology.',
    };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
