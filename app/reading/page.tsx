import { Metadata } from 'next'
import { META_DATA } from '@/lib/meta'
import ReadingClient from './reading-client'

export const metadata: Metadata = {
  title: 'Reading List - Books & Articles | Cihat Salik',
  description: 'Explore my reading list featuring books on software development, philosophy, productivity, and personal growth. Discover recommendations and insights from my literary journey.',
  openGraph: {
    title: 'Reading List - Books & Learning Resources',
    description: 'Browse through my curated reading list of books covering programming, stoic philosophy, productivity, and continuous learning for developers and tech enthusiasts.',
    url: `${META_DATA.url}/reading`,
    images: [
      {
        url: `${META_DATA.url}/og/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Reading List - Books & Articles',
      }
    ],
  },
  alternates: {
    canonical: `${META_DATA.url}/reading`,
  },
}

export default function ReadingPage() {
  return <ReadingClient />
}
