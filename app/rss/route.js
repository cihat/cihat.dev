import { NextResponse } from 'next/server';
import RSS from 'rss';
import postsData from "@/lib/posts.json";

export async function GET() {
  const feed = new RSS({
    title: "Cihat Salik",
    description: "Personal blog of Cihat Salik",
    id: "https://cihat.dev",
    link: "https://cihat.dev",
    url: "https://cihat.dev",
    language: "en",
    image_url: "https://avatars.githubusercontent.com/u/57585087",
    managingEditor: "Cihat Salik",
    webMaster: "Cihat Salik",
    categories: ["Technology", "Programming", "Web Development", "Software Engineering", "Live", "Sport"],
    pubDate: new Date(),
    ttl: 60,
    hub: "https://pubsubhubbub.appspot.com/",
    custom_elements: [
      { 'atom:link': { _attr: { href: "https://cihat.dev/rss", rel: 'self', type: 'application/rss+xml' } } },
    ],
    favicon: "https://cihat.dev/favicon.ico",
    copyright: "All rights reserved 2024, Cihat SALIK",
    updated: new Date(),
    generator: "Next.js",
    feed_url: "https://cihat.dev/rss",
    site_url: "https://cihat.dev",
    feedLinks: {
      rss: "https://cihat.dev/rss.xml",
    },
  });

  postsData.posts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.description,
      url: post.link,
      date: post.date,
      categories: [post.category],
      author: "Cihat Salik",
      ...post
    });
  });

  const xml = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
