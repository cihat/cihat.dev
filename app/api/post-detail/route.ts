import postsData from "@/lib/posts.json";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import commaNumber from "comma-number"
import { executeRedisCommand } from "@/lib/redis"

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === '1';

// Disable caching for view counts (dynamic data)
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Rate limiting for view increments
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

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

  // Rate limiting for view increments
  if (shouldIncrement) {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `view:${clientIp}:${id}`;
    
    if (!checkRateLimit(rateLimitKey, 5, 60000)) {
      return NextResponse.json(
        {
          error: {
            message: "Too many requests. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
          },
        },
        { status: 429 }
      );
    }
  }

  try {
    let views: number | null;
    
    if (shouldIncrement) {
      // Increment view count with longer timeout for write operations
      if (DEBUG) console.log('📊 Incrementing view count for:', id);
      views = await executeRedisCommand(
        (redis) => redis.hincrby("views", id, 1),
        0,
        5000 // 5 second timeout for write operations
      );
      if (DEBUG) console.log('✅ View count after increment:', views);
      
      return NextResponse.json({
        ...post,
        views: views ?? 0,
        viewsFormatted: commaNumber(views ?? 0),
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        }
      });
    } else {
      // Get current view count
      if (DEBUG) console.log('📊 Fetching view count for:', id);
      views = await executeRedisCommand(
        (redis) => redis.hget<number|null>("views", id),
        0,
        3000 // 3 second timeout for read operations
      );
      if (DEBUG) console.log('✅ Current view count:', views);
      
      return NextResponse.json({
        ...post,
        views: views ?? 0,
        viewsFormatted: commaNumber(Number(views ?? 0)),
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
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
