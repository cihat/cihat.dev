import { NextResponse } from 'next/server';
import RSS from 'rss';
import { getPosts } from "@/lib/get-posts";

// Use Node.js runtime to support fs and path modules
export const runtime = 'nodejs';

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

  const posts = getPosts();
  posts.forEach(post => {
    // Handle both string and array categories
    const categories = Array.isArray(post.category) ? post.category : [post.category];
    
    // Parse date string to Date object for RSS
    let pubDate;
    try {
      pubDate = new Date(post.date);
      // If date is invalid, use current date
      if (isNaN(pubDate.getTime())) {
        pubDate = new Date();
      }
    } catch (e) {
      pubDate = new Date();
    }
    
    // Ensure link is absolute URL
    const link = post.link.startsWith('http') 
      ? post.link 
      : `https://cihat.dev${post.link.startsWith('/') ? post.link : '/' + post.link}`;
    
    feed.item({
      title: post.title,
      description: post.description || '',
      link: link,
      guid: link, // Use link as guid for uniqueness
      date: pubDate,
      categories: categories,
      author: "Cihat Salik",
    });
  });

  const xml = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
