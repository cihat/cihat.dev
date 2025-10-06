import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import postsData from "@/lib/posts.json";

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  
  // Add pathname header for all requests
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', req.nextUrl.pathname);
  
  // Handle claps endpoint
  if (url.pathname.startsWith('/claps')) {
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
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
