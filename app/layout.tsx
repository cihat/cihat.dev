import './globals.css'
import { Inter } from 'next/font/google'
import { themeEffect } from '@/lib/theme-effect'
import { Analytics } from "./analytics";
import { Metadata } from 'next'
import Head from 'next/head'
import { META_DATA, githubImage } from "@/lib/meta"

import Container from "@/components/ui/container"
import Header from "@/components/ui/header"
import Footer from "@/components/ui/footer"

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  style: "normal",
  subsets: ["latin-ext"],
});


const { title, description, url, } = META_DATA


export const metadata: Metadata = {
  title,
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
  themeColor: "transparent",
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
      <body>
        <Head>
          <link rel="favicon" href="/img/me.jpeg" />
          <title>Cihat Salik</title>
          <meta name="description" content="Cihat Salik's Personel website." />
        </Head>
        <Container className="flex min-h-screen flex-col py-6" as="main">
          <Header />
          <main className="mt-10 grow sm:mt-10">{children}</main>
          <Footer />
        </Container>

        <Analytics />
      </body>
    </html>
  )
}
