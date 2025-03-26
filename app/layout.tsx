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

const { title, description, url } = META_DATA

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s - ${title}`,
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
    locale: "en-US",
    type: "website",
    images: "https://cihat.dev/img/og-image.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "@chtslk",
    creator: "@chtslk",
  },
  metadataBase: new URL(url),
  manifest: "/manifest.json",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();`,
          }}
        />
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
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
