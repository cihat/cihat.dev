import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import postsData from "@/lib/posts.json";

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? null;
  const post = postsData.posts.find(post => post.id === id);

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
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/claps/:path*',
}