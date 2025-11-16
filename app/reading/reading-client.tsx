"use client";

import Container from "@/components/ui/container"
import Image from "next/image"
import ProgressBar from "@/components/progress-bar"
import { useState, useEffect } from "react"

type BookType = {
  title: string
  alt: string
  currentPage: number
  page: number
  bookCover: string
  link: string
}

const getProgress = (currentPage: number, page: number) => {
  if (!page || page === 0) return 0
  return +Number((currentPage / page) * 100).toFixed()
}

// Generate random progress between 10% and 90% for currently reading books
// Returns both currentPage and page (in case page is 0, we set a default)
const generateRandomProgress = (page: number): { currentPage: number; page: number } => {
  const minProgress = 0.1 // 10%
  const maxProgress = 0.9 // 90%
  const randomProgress = Math.random() * (maxProgress - minProgress) + minProgress
  
  if (!page || page === 0) {
    // If no page count, assume average book has 300 pages
    const assumedPages = 300
    return {
      currentPage: Math.floor(assumedPages * randomProgress),
      page: assumedPages
    }
  }
  
  return {
    currentPage: Math.floor(page * randomProgress),
    page: page
  }
}

export default function ReadingClient() {
  const [inProgressBooks, setInProgressBooks] = useState<BookType[]>([])
  const [completedBooks, setCompletedBooks] = useState<BookType[]>([])
  const [willReadBooks, setWillReadBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books')
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        const data = await response.json()
        
        // Generate random progress for currently reading books
        const readingBooks = (data.reading || []).map((book: BookType) => {
          const { currentPage, page } = generateRandomProgress(book.page)
          return {
            ...book,
            currentPage,
            page, // Update page in case it was 0
          }
        })
        
        // Set books from API response
        setInProgressBooks(readingBooks)
        setCompletedBooks(data.finished || [])
        setWillReadBooks(data.wantsToRead || [])
      } catch (error) {
        console.error('Error fetching books:', error)
        // Keep empty arrays on error, UI will show empty state
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (loading) {
    return (
      <Container className="px-2 max-w-screen-2xl md:px-4 left-animation">
        <div className="py-8">
          <p className="text-lg">Loading books...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="px-2 max-w-screen-2xl md:px-4 left-animation">
      <div className="py-4 md:py-6 space-y-12 md:space-y-16">
        {inProgressBooks.length > 0 && (
          <BooksGrid books={inProgressBooks} title="I'm currently reading these books: " isCurrentlyReading={true} />
        )}
        {willReadBooks.length > 0 && (
          <BooksGrid books={willReadBooks} title="I will read these books in the future." isCurrentlyReading={false} />
        )}
        {completedBooks.length > 0 && (
          <BooksGrid books={completedBooks} title="Books I've Read Recently" isCurrentlyReading={false} />
        )}
        {!loading && inProgressBooks.length === 0 && willReadBooks.length === 0 && completedBooks.length === 0 && (
          <div className="py-8">
            <p className="text-lg">No books found.</p>
          </div>
        )}
      </div>
    </Container>
  )
}

function BooksGrid({ books, title, isCurrentlyReading = false }: { books: BookType[]; title: string; isCurrentlyReading?: boolean }) {
  if (!books || books.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-foreground">
        {title}
      </h2>
      <section className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-5">
        {books.map((book: BookType) => {
          const progress = getProgress(book.currentPage, book.page)
          const hasCover = book?.bookCover && book.bookCover.trim() !== ''
          const showTitle = !hasCover // Show title if no cover image
          
          return (
            <a 
              key={book.title} 
              target="_blank" 
              rel="noopener noreferrer"
              href={book.link} 
              className="col-span-1 flex flex-col justify-end !cursor-pointer group transition-transform hover:scale-105"
              title={`${book.title}${progress > 0 ? ` - ${progress}% completed` : ''}`}
            >
              <div className="relative overflow-hidden rounded-md shadow-sm group-hover:shadow-md transition-shadow">
                <Image
                  src={hasCover ? book.bookCover : '/placeholder-image.png'}
                  alt={book.alt || book.title}
                  title={`${book.title} - Book cover`}
                  width={300}
                  height={300}
                  placeholder={hasCover ? "blur" : "empty"}
                  blurDataURL={hasCover ? book.bookCover : undefined}
                  className="min-w-full grow object-fill rounded-md"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-image.png'
                  }}
                />
              </div>
              {showTitle && (
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2 text-center leading-tight">
                  {book.title}
                </p>
              )}
              {isCurrentlyReading && (
                <div className="mt-2">
                  <ProgressBar 
                    completed={progress} 
                    bgColor="#00ce8b" 
                    borderRadius="3px" 
                    height="8px" 
                    isLabelVisible={false} 
                  />
                </div>
              )}
              {!isCurrentlyReading && progress > 0 && (
                <div className="mt-2">
                  <ProgressBar 
                    completed={progress} 
                    bgColor="#00ce8b" 
                    borderRadius="3px" 
                    height="8px" 
                    isLabelVisible={false} 
                  />
                </div>
              )}
            </a>
          )
        })}
      </section>
    </div>
  )
} 

