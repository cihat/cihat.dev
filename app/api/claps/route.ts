export const runtime = "edge";

import postsData from "@/lib/posts.json";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import commaNumber from "comma-number"
import redis from "@/lib/redis"

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("id") ?? null;
  const score = Number(url.searchParams.get("score")) ?? 1;

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

  if (url.searchParams.get("score") != null) {
    const clapCount = await redis.hincrby("claps", postId, score);
    return NextResponse.json({
      clapCount,
      userScore: clapCount,
      totalScore: clapCount,
      maxClaps: 30,
      clapCountFormatted: commaNumber(clapCount),
    });
  } else {
    const clapCount = (await redis.hget("claps", postId)) ?? 0;
    return NextResponse.json({
      clapCount,
      userScore: clapCount,
      totalScore: clapCount,
      maxClaps: 30,
      clapCountFormatted: commaNumber(Number(clapCount)),
    });
  }
}
