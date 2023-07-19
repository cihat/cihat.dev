import './globals.css'

import { Inter } from 'next/font/google'
import { themeEffect } from '@/lib/theme-effect'
import { Metadata } from 'next'
import { META_DATA } from "@/lib/meta"

import Header from "@/components/ui/header"
import Footer from "@/components/ui/footer"
import { VercelAnalytics } from "./vercel-analytics";

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  style: "normal",
  subsets: ["latin-ext"],
});

const { title, description, url, } = META_DATA

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s - ${title}`
  },
  description,
  category: "technology",
  creator: title,
  publisher: title,
  openGraph: {
    title,
    description,
    url,
    siteName: title,
    locale: 'en-US',
    type: 'website',
    images: "https://cihat.dev/img/me.jpeg"
  },
  twitter: {
    card: "summary_large_image",
    site: "@chtslk",
    creator: "@chtslk",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  metadataBase: new URL(url),
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased`}
      suppressHydrationWarning={true}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();`,
          }}
        />
      </head>
      <body className={"no-scrollbar"}>
        <Header />
        <main className="mt-10 grow sm:mt-10">{children}</main>
        <Footer />
        <VercelAnalytics />
      </body>
    </html>
  )
}
