import { NextResponse } from "next/server";
import { getPosts } from "@/lib/get-posts";

// Static API route - no revalidation needed
export const dynamic = 'force-static';

export async function GET() {
  try {
    const posts = getPosts();
    
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('⚠️  Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
