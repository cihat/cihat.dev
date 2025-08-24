import { NextResponse } from "next/server";
import { getPostsWithViewData } from "@/lib/get-posts";

export const dynamic = "force-dynamic";

// Cache için headers ekle - çok daha uzun cache
export async function GET() {
  const posts = await getPostsWithViewData();
  
  return NextResponse.json(posts, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
