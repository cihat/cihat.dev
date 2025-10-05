"use client";

import Container from "@/components/ui/container"
import Image from "next/image"
import ProgressBar from "@/components/progress-bar"
import booksData from "@/lib/books.json"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";

type BookType = {
  title: string
  alt: string
  currentPage: number
  page: number
  bookCover: string
  link: string
}

type LiteralBook = {
  id: string
  title: string
  subtitle?: string
  cover?: string
  authors: Array<{ name: string }>
  readingProgress?: number
  totalPages?: number
}

type LiteralBooksData = {
  reading: LiteralBook[]
  wantsToRead: LiteralBook[]
  finished: LiteralBook[]
}

const getProgress = (currentPage: number, page: number) => +Number((currentPage / page) * 100).toFixed()

export default function ReadingClient() {
  const localBooks = booksData.books
  const [seeMore, setSeeMore] = useState(false)
  const [literalBooks, setLiteralBooks] = useState<LiteralBooksData | null>(null)
  const [loading, setLoading] = useState(true)
  const [useLiteralData, setUseLiteralData] = useState(false)

  // Fetch books from Literal API
  useEffect(() => {
    fetchLiteralBooks()
  }, [])

  const fetchLiteralBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/books')
      if (response.ok) {
        const data = await response.json()
        setLiteralBooks(data)
        setUseLiteralData(true)
      }
    } catch (error) {
      console.error('Failed to fetch Literal books:', error)
      setUseLiteralData(false)
    } finally {
      setLoading(false)
    }
  }

  // Convert Literal books to local book format for display
  const convertLiteralToLocal = (book: LiteralBook): BookType => ({
    title: book.title,
    alt: book.title,
    currentPage: book.readingProgress || 0,
    page: book.totalPages || 100,
    bookCover: book.cover || '/placeholder-image.png',
    link: `https://literal.club/book/${book.id}`,
  })

  let inProgressBooks: BookType[]
  let completedBooks: BookType[]
  let willReadBooks: BookType[]

  if (useLiteralData && literalBooks) {
    // Use Literal API data
    inProgressBooks = literalBooks.reading.map(convertLiteralToLocal)
    completedBooks = literalBooks.finished.map(convertLiteralToLocal)
    willReadBooks = literalBooks.wantsToRead.map(convertLiteralToLocal)
  } else {
    // Fallback to local data
    inProgressBooks = localBooks
      .filter((book: BookType) => getProgress(book.currentPage, book.page) < 100 && book.currentPage !== 0)
      .sort((a: BookType, b: BookType) => getProgress(b.currentPage, b.page) - getProgress(a.currentPage, a.page))
    completedBooks = localBooks.filter((book: BookType) => getProgress(book.currentPage, book.page) === 100)
    willReadBooks = localBooks.filter((book: BookType) => book.currentPage === 0)
  }

  return (
    <Container className="px-2 max-w-screen-2xl md:px-4 left-animation">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
          {useLiteralData && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              📚 Synced with Literal.club
            </span>
          )}
          {!useLiteralData && !loading && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              📖 Using local data
            </span>
          )}
        </div>
        {!loading && (
          <Button 
            onClick={fetchLiteralBooks} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        )}
      </div>

      <BooksGrid books={inProgressBooks} title="I'm currently reading these books: " />
      <Button onClick={() => setSeeMore(!seeMore)} className="mt-4">
        {seeMore ?
          <>
            <ArrowUp className="mr-2" />
            <span>See less</span>
          </>
          :
          <>
            <ArrowDown className="mr-2" />
            <span>See more</span>
          </>
        }
      </Button>
      {
        seeMore && (
          <>
            <BooksGrid books={willReadBooks} title="I will read these books in the future." />
            <BooksGrid books={completedBooks} title="Books I've Read Recently" />
          </>
        )
      }
    </Container>
  )
}

function BooksGrid({ books, title }) {
  return (
    <>
      <h1 className="py-8">
        <span className="text-xl font-bold">{title}</span>
      </h1>
      <section className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
        {books &&
          books?.map((book: BookType) => (
            <a 
              key={book.title} 
              target="_blank" 
              href={book.link} 
              className="col-span-1 flex flex-col justify-end !cursor-pointer mb-2"
              title={`Read ${book.title} - ${getProgress(book.currentPage, book.page)}% completed`}
            >
              <Image
                src={book?.bookCover}
                alt={book.alt}
                title={`${book.title} - Book cover`}
                width={300}
                height={300}
                placeholder="blur"
                blurDataURL={book?.bookCover}
                className="min-w-full grow object-fill rounded-md"
                loading="lazy"
              />
              <ProgressBar completed={getProgress(book.currentPage, book.page)} bgColor="#00ce8b" borderRadius="3px" height="8px" isLabelVisible={false} />
            </a>
          ))}
      </section>
    </>
  )
} 
