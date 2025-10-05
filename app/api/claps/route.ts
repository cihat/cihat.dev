import postsData from "@/lib/posts.json";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import commaNumber from "comma-number"
import { executeRedisCommand } from "@/lib/redis"

// Disable caching for claps (dynamic data)
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_CLAPS = {
  clapCount: 0,
  userScore: 0,
  totalScore: 0,
  totalUsers: 0,
  maxClaps: 30,
  clapCountFormatted: "0",
};

// Rate limiting map (in-memory, simple implementation)
// In production, use Redis or a proper rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
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
  const postId = url.searchParams.get("id") ?? null;
  const scoreParam = url.searchParams.get("score");
  
  // Input validation: clamp score between 1 and 5
  const score = scoreParam ? Math.max(1, Math.min(5, Number(scoreParam) || 1)) : 1;

  if (postId === null) {
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

  const post = postsData.posts.find(post => post.id === postId);

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

  // Rate limiting for increment operations
  if (scoreParam != null) {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `clap:${clientIp}:${postId}`;
    
    if (!checkRateLimit(rateLimitKey, 10, 60000)) {
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
    // Increment clap count if score parameter is provided
    if (scoreParam != null) {
      const clapCount = await executeRedisCommand(
        (redis) => redis.hincrby("claps", postId, score),
        0,
        2000
      );
      
      return NextResponse.json({
        clapCount,
        userScore: clapCount,
        totalScore: clapCount,
        totalUsers: clapCount > 0 ? 1 : 0,
        maxClaps: 30,
        clapCountFormatted: commaNumber(clapCount),
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        }
      });
    } else {
      // Get current clap count
      const clapCount = await executeRedisCommand(
        (redis) => redis.hget<number>("claps", postId),
        0,
        2000
      );
      
      return NextResponse.json({
        clapCount: clapCount ?? 0,
        userScore: clapCount ?? 0,
        totalScore: clapCount ?? 0,
        totalUsers: clapCount && clapCount > 0 ? 1 : 0,
        maxClaps: 30,
        clapCountFormatted: commaNumber(Number(clapCount ?? 0)),
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        }
      });
    }
  } catch (error) {
    console.error('⚠️  Error in claps API:', error);
    return NextResponse.json(DEFAULT_CLAPS);
  }
}
