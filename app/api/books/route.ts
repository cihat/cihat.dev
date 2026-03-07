import { NextResponse } from 'next/server'
import Literal from '@/lib/literal'

// Cache books response 5 min, revalidate in background up to 10 min
export const revalidate = 300

const emptyResponse = { reading: [] as any[], finished: [] as any[], wantsToRead: [] as any[] }

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600, max-age=300',
}

// Transform Literal book to the format expected by the frontend
function transformLiteralBook(literalBook: any, readingStatus: string) {
  const pageCount = literalBook.pageCount || 0

  // Calculate currentPage based on reading status
  let currentPage = 0
  if (readingStatus === 'FINISHED' && pageCount > 0) {
    currentPage = pageCount // 100% complete
  } else if (readingStatus === 'IS_READING' && pageCount > 0) {
    // Estimate 50% progress for books being read
    currentPage = Math.floor(pageCount * 0.5)
  }
  // WANTS_TO_READ stays at 0

  return {
    title: literalBook.title,
    alt: literalBook.title,
    currentPage,
    page: pageCount,
    bookCover: literalBook.cover || '',
    link: `https://literal.club/book/${literalBook.slug}`,
    authors: literalBook.authors?.map((a: any) => a.name).join(', ') || '',
    isbn13: literalBook.isbn13,
    publishedDate: literalBook.publishedDate,
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const debug = url.searchParams.get('debug') === '1'

  try {
    const literal = new Literal()
    const handle = (process.env.LITERAL_HANDLE ?? 'cihat').trim()
    const tokenSet = !!process.env.LITERAL_API_TOKEN?.trim()

    if (debug) {
      const profile = await literal.getProfileByHandle(handle)
      const states = tokenSet ? await literal.getMyReadingStates() : []
      const books = await literal.getAllBooks(handle)
      return NextResponse.json({
        debug: {
          tokenSet,
          handle,
          profileFound: !!profile,
          profileId: profile?.id ?? null,
          profileHandle: profile?.handle ?? null,
          myReadingStatesCount: states.length,
          booksSource: books ? 'literal' : 'none',
          readingCount: books?.reading?.length ?? 0,
          finishedCount: books?.finished?.length ?? 0,
          wantsToReadCount: books?.wantsToRead?.length ?? 0,
        },
        reading: [],
        finished: [],
        wantsToRead: [],
      }, { headers: CACHE_HEADERS })
    }

    // Token varsa myReadingStates (kendi kütüphanen), yoksa public profil (handle) kullanılır
    const books = await literal.getAllBooks(handle)

    if (!books) {
      console.warn(
        '⚠️  Literal: profil bulunamadı veya veri yok. Handle:',
        handle,
        'Token:',
        tokenSet ? 'set' : 'missing',
        '— .env LITERAL_HANDLE ve LITERAL_API_TOKEN kontrol et. /api/books?debug=1 ile test et.'
      )
      return NextResponse.json(emptyResponse, { headers: CACHE_HEADERS })
    }

    const { reading, finished, wantsToRead } = books

    const transformedReading = reading.map(book => transformLiteralBook(book, 'IS_READING'))
    const transformedFinished = finished.map(book => transformLiteralBook(book, 'FINISHED'))
    const transformedWantsToRead = wantsToRead.map(book => transformLiteralBook(book, 'WANTS_TO_READ'))

    return NextResponse.json({
      reading: transformedReading,
      finished: transformedFinished,
      wantsToRead: transformedWantsToRead
    }, { headers: CACHE_HEADERS })
  } catch (error) {
    console.error('Error in books API:', error)
    if (debug) {
      return NextResponse.json({
        debug: { error: error instanceof Error ? error.message : String(error) },
        reading: [],
        finished: [],
        wantsToRead: [],
      }, { headers: CACHE_HEADERS })
    }
    return NextResponse.json(emptyResponse, { headers: CACHE_HEADERS })
  }
}
