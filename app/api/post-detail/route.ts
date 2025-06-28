export const runtime = "edge";

import postsData from "@/lib/posts.json";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import commaNumber from "comma-number"
import getRedisClient from "@/lib/redis"

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? null;

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

  // Redis bağlantısı yoksa default değerlerle döndür
  const redis = getRedisClient()
  if (!redis) {
    console.warn('⚠️  Redis not available, returning default view count');
    return NextResponse.json({
      ...post,
      views: 0,
      viewsFormatted: "0",
    });
  }

  try {
    if (url.searchParams.get("incr") != null) {
      const views = await redis.hincrby("views", id, 1);
      return NextResponse.json({
        ...post,
        views,
        viewsFormatted: commaNumber(views),
      });
    } else {
      const views = (await redis.hget("views", id)) ?? 0;
      return NextResponse.json({
        ...post,
        views,
        viewsFormatted: commaNumber(Number(views)),
      });
    }
  } catch (error) {
    console.error('⚠️  Redis error in post-detail API:', error);
    return NextResponse.json({
      ...post,
      views: 0,
      viewsFormatted: "0",
    });
  }
}
