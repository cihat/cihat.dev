import { format } from 'date-fns'
import type { MetadataRoute } from 'next'

import { websiteDomain } from '@/app/content'

// Force static rendering and static data fetching of a layout or page
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['home', 'about'].map((page) => ({
    url: `${websiteDomain}/${page}`,
    lastModified: format(new Date(), 'yyyy-MM-dd'),
  }))

  return [
    { url: websiteDomain, lastModified: format(new Date(), 'yyyy-MM-dd') },
    ...staticPages,
  ]
}