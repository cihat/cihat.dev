import postsData from "@/lib/posts.json";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import commaNumber from "comma-number"
import { executeRedisCommand } from "@/lib/redis"

// Disable caching for view counts (dynamic data)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? null;
  const shouldIncrement = url.searchParams.get("incr") != null;

  if (id === null) {
    return NextResponse.json(
      {
        error: {
          message: 'Missing "id" query',
          code: "MISSING_ID",
        },
      },
      { status: 400 }
    );
  }

  const post = postsData.posts.find(post => post.id === id);

  if (post == null) {
    return NextResponse.json(
      {
        error: {
          message: "Unknown post",
          code: "UNKNOWN_POST",
        },
      },
      { status: 400 }
    );
  }

  try {
    let views: number;
    
    if (shouldIncrement) {
      // Increment view count
      views = await executeRedisCommand(
        (redis) => redis.hincrby("views", id, 1),
        0,
        2000
      );
      
      return NextResponse.json({
        ...post,
        views,
        viewsFormatted: commaNumber(views),
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        }
      });
    } else {
      // Get current view count
      views = await executeRedisCommand(
        (redis) => redis.hget<number>("views", id),
        0,
        2000
      );
      
      return NextResponse.json({
        ...post,
        views: views ?? 0,
        viewsFormatted: commaNumber(Number(views ?? 0)),
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        }
      });
    }
  } catch (error) {
    console.error('⚠️  Error in post-detail API:', error);
    return NextResponse.json({
      ...post,
      views: 0,
      viewsFormatted: "0",
    });
  }
}
