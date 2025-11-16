import { NextResponse } from 'next/server'
import Literal from '@/lib/literal'
import booksData from '@/lib/books.json'

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

// Fallback to local books data
function getLocalBooks() {
  const books = booksData.books
  
  const getProgress = (currentPage: number, totalPages: number) => 
    Number((currentPage / totalPages) * 100).toFixed(0)
  
  const reading = books.filter(book => {
    const progress = Number(getProgress(book.currentPage, book.page))
    return progress > 0 && progress < 100
  })
  
  const finished = books.filter(book => {
    const progress = Number(getProgress(book.currentPage, book.page))
    return progress === 100
  })
  
  const wantsToRead = books.filter(book => {
    return book.currentPage === 0
  })

  return { reading, finished, wantsToRead }
}

export async function GET(request: Request) {
  try {
    const literal = new Literal()
    
    // Try to get profile first
    const profile = await literal.getProfileByHandle('cihat')
    
    if (!profile || !profile.id) {
      console.warn('⚠️  Could not fetch Literal profile, falling back to local books')
      const localBooks = getLocalBooks()
      return NextResponse.json(localBooks, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      })
    }

    // Fetch books from Literal API
    const { reading, finished, wantsToRead } = await literal.getAllBooksForProfile(profile.id)

    // Transform Literal books to expected format with reading status
    const transformedReading = reading.map(book => transformLiteralBook(book, 'IS_READING'))
    const transformedFinished = finished.map(book => transformLiteralBook(book, 'FINISHED'))
    const transformedWantsToRead = wantsToRead.map(book => transformLiteralBook(book, 'WANTS_TO_READ'))

    return NextResponse.json({
      reading: transformedReading,
      finished: transformedFinished,
      wantsToRead: transformedWantsToRead
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Error in books API:', error)
    
    // Fallback to local books on error
    try {
      const localBooks = getLocalBooks()
      return NextResponse.json(localBooks, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      })
    } catch (fallbackError) {
      console.error('Error in fallback:', fallbackError)
      return NextResponse.json(
        { error: 'Failed to fetch books' },
        { status: 500 }
      )
    }
  }
}
