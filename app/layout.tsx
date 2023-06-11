import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import clsx from 'clsx'
import { Metadata } from 'next'
import Head from 'next/head'
import { META_DATA, githubImage } from "@/lib/meta"

import { Header, Footer, Container } from "@/components"
import Providers from "./Providers"


const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  style: "normal",
  subsets: ["latin-ext"],
});

const { title, description, url, locale, } = META_DATA


export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  openGraph: {
    title,
    description,
    url,
    siteName: title,
    locale,
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
    site: `@chtslk`,
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#ffffff",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: `${url}/manifest.json`,
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Head>
          <link rel="favicon" href="/img/me.jpeg" />
          <title>Cihat Salik</title>
          <meta name="description" content="Cihat Salik's Personel website." />
        </Head>
        <Providers>
          <Container className="flex min-h-screen flex-col pb-14 pt-10">
            <Header />
            <main className="mt-10 grow sm:mt-20">{children}</main>
            <Footer />
          </Container>
        </Providers>

        <Analytics />
      </body>
    </html>
  )
}
