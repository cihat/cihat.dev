import type { MetadataRoute } from "next";

import { websiteDomain } from "@/lib/meta";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '*.json',
          '/burden/*', // Disallow AI content from indexing if preferred
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      }
    ],
    sitemap: `${websiteDomain}/sitemap.xml`,
    host: websiteDomain,
  }
}
