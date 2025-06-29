"use client";

import Container from "@/components/ui/container"
import Image from "next/image"
import ProgressBar from "@/components/progress-bar"
import booksData from "@/lib/books.json"
import { useState } from "react"
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

type BookType = {
  title: string
  alt: string
  currentPage: number
  page: number
  bookCover: string
  link: string
}

const getProgress = (currentPage: number, page: number) => +Number((currentPage / page) * 100).toFixed()

export default function ReadingClient() {
  const books = booksData.books
  const [seeMore, setSeeMore] = useState(false)

  const inProgressBooks = books
    .filter((book: BookType) => getProgress(book.currentPage, book.page) < 100 && book.currentPage !== 0)
    .sort((a: BookType, b: BookType) => getProgress(b.currentPage, b.page) - getProgress(a.currentPage, a.page))
  const completedBooks = books.filter((book: BookType) => getProgress(book.currentPage, book.page) === 100)
  const willReadBooks = books.filter((book: BookType) => book.currentPage === 0)

  return (
    <Container className="px-2 max-w-screen-2xl md:px-4 left-animation">
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
