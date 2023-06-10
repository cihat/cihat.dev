import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import clsx from 'clsx'
import { Metadata } from 'next'
import { META_DATA } from "@/lib/meta"

import { Header, Footer } from "@/components/ui/layout";

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
    icon: "/icons/icon-android-chrome-192x192.png",
    apple: "/icons/icon-apple-touch-icon.png",
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
        <div className="flex min-h-screen flex-col pb-14 pt-10">
          <Header />
          <main className="mt-10 grow sm:mt-20">{children}</main>
          <Footer />
        </div>

        <Analytics />
      </body>
    </html>
  )
}
