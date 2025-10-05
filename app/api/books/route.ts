import { NextResponse } from 'next/server'
import { getLiteralBooksByStatus } from '@/lib/literal'

export async function GET(request: Request) {
  try {
    // Get token from environment variable or request header
    const token = process.env.LITERAL_API_TOKEN
    
    if (!token) {
      return NextResponse.json(
        { error: 'LITERAL_API_TOKEN not configured' },
        { status: 500 }
      )
    }

    const books = await getLiteralBooksByStatus(token)

    return NextResponse.json(books, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Error in books API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books from Literal' },
      { status: 500 }
    )
  }
}
