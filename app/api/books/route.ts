import { NextResponse } from 'next/server'
import booksData from '@/lib/books.json'

export async function GET(request: Request) {
  try {
    // Return local books data
    // Filter books by reading status
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

    return NextResponse.json({
      reading,
      finished,
      wantsToRead
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Error in books API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}
