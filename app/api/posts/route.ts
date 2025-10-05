import { NextResponse } from "next/server";
import { getPostsWithViewData } from "@/lib/get-posts";

// Enable caching with revalidation
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    const posts = await getPostsWithViewData();
    
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
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
