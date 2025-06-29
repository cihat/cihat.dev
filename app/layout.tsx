import "./globals.css"

import { Inter } from "next/font/google"
import { Metadata } from "next"
import { META_DATA } from "@/lib/meta"

import Header from "@/components/ui/header"
import { themeEffect } from "@/lib/theme-effect"
import Footer from "@/components/ui/footer"
import { VercelAnalytics } from "./vercel-analytics"

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  style: "normal",
  subsets: ["latin-ext"],
})

const { title, description, url, keywords, name, jobTitle, location, social } = META_DATA

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${name}`,
  },
  description,
  category: "technology",
  creator: name,
  publisher: name,
  keywords: keywords.join(", "),
  authors: [{ name, url }],
  openGraph: {
    title,
    description,
    url,
    siteName: title,
    locale: "en-US",
    type: "website",
    images: [
      {
        url: "https://cihat.dev/og/og-image.png",
        width: 1200,
        height: 630,
        alt: title,
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@chtslk",
    creator: "@chtslk",
    title,
    description,
    images: ["https://cihat.dev/og/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(url),
  manifest: "/manifest.json",
  alternates: {
    canonical: url,
    types: {
      "application/rss+xml": [{ url: "/rss", title: `${name} RSS Feed` }],
    },
  },
}

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${url}#person`,
      name,
      jobTitle,
      description,
      url,
      image: `${url}/og/me.jpeg`,
      sameAs: [
        social.github,
        social.twitter,
        social.instagram,
        "https://www.linkedin.com/in/cihatsalik/",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
        addressCountry: "Turkey",
      },
      email: "mailto:cihatsalik1@gmail.com",
      knowsAbout: [
        "Software Development",
        "JavaScript",
        "React",
        "TypeScript",
        "Next.js",
        "Web Development",
        "Programming",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${url}#website`,
      url,
      name: title,
      description,
      publisher: {
        "@id": `${url}#person`,
      },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${url}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Blog",
      "@id": `${url}#blog`,
      url: `${url}/#posts`,
      name: `${name}'s Blog`,
      description: "Blog posts about software development, programming, and productivity",
      publisher: {
        "@id": `${url}#person`,
      },
      inLanguage: ["en-US", "tr-TR"],
    }
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
        
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="no-scrollbar min-h-screen vsc-initialized">
        <div className="bg-gradient-to-b from-neutral-100 dark:from-neutral-950 to-transparent w-full h-32 fixed top-0 left-0 right-0 z-10 pointer-events-none" />
        <Header />
        <main className="sm:mt-4 mt-2 grow">{children}</main>
        <Footer />
        <div className="bg-gradient-to-t from-neutral-100 dark:from-neutral-950 to-transparent w-full h-32 fixed bottom-0 left-0 right-0 z-10 pointer-events-none" />
        <VercelAnalytics />
      </body>
    </html>
  )
}
