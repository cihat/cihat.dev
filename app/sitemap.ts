import { format } from 'date-fns'
import type { MetadataRoute } from 'next'

import { websiteDomain } from "@/lib/meta"
import { getPosts } from "@/lib/get-posts"

// Force static rendering and static data fetching of a layout or page
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts()
  
  // Static pages
  const staticPages = [
    {
      url: websiteDomain,
      lastModified: format(new Date(), 'yyyy-MM-dd'),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${websiteDomain}/about`,
      lastModified: format(new Date(), 'yyyy-MM-dd'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${websiteDomain}/bookmarks`,
      lastModified: format(new Date(), 'yyyy-MM-dd'),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${websiteDomain}/reading`,
      lastModified: format(new Date(), 'yyyy-MM-dd'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${websiteDomain}/burden`,
      lastModified: format(new Date(), 'yyyy-MM-dd'),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Blog posts
  const blogPosts = posts.map((post) => {
    // Parse the date string and create a proper date
    const postDate = new Date(post.date)
    const formattedDate = format(postDate, 'yyyy-MM-dd')
    
    return {
      url: post.link,
      lastModified: formattedDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  return [
    ...staticPages,
    ...blogPosts,
  ]
}
