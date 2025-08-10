import { Suspense } from 'react'
import BookmarkLayout from '@/components/bookmark/bookmark-layout'
import Container from '@/components/ui/container'
import { Metadata } from 'next'
import { META_DATA } from '@/lib/meta'

export const metadata: Metadata = {
  title: 'Bookmarks - Curated Resources | Cihat Salik',
  description: 'Discover curated bookmarks and valuable resources handpicked by Cihat Salik. Find useful tools, articles, and websites for software development, productivity, and learning.',
  openGraph: {
    title: 'Bookmarks - Curated Resources for Developers',
    description: 'Explore a carefully curated collection of bookmarks covering software development, programming tools, productivity resources, and educational content.',
    url: `${META_DATA.url}/bookmarks`,
    images: [
      {
        url: `${META_DATA.url}/og/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Bookmarks - Curated Resources',
      }
    ],
  },
  alternates: {
    canonical: `${META_DATA.url}/bookmarks`,
  },
}

export default function Bookmarks() {
  return (
    <Container className="flex flex-col py-2 overscroll-none">
      <Suspense fallback={<div>Loading bookmarks...</div>}>
        <BookmarkLayout />
      </Suspense>
    </Container>
  )
}
