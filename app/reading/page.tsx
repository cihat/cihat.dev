import Container from "@/components/ui/container";
import Image from "next/image";
import ProgressBar from "@/components/progress-bar";
import booksData from "@/lib/books.json";

type bookType = {
  title: string;
  alt: string;
  readedPage: number;
  page: number;
  bookCover: string;
  link: string;
}

const getProgress = (readedPage: number, page: number) => +Number((readedPage / page) * 100).toFixed();

export default function Home() {
  const books = booksData.books;

  const inProgressBooks = books.filter((book: bookType) =>
    getProgress(book.readedPage, book.page) < 100 && book.readedPage !== 0)
    .sort((a: bookType, b: bookType) => getProgress(b.readedPage, b.page) - getProgress(a.readedPage, a.page));
  const completedBooks = books.filter((book: bookType) => getProgress(book.readedPage, book.page) === 100);
  const willReadBooks = books.filter((book: bookType) => book.readedPage === 0);

  return (
    <>
      <BooksGrid books={inProgressBooks} title="I&apos;m currently reading these books: " />
      <BooksGrid books={willReadBooks} title="I will read these books in the future." />
      <BooksGrid books={completedBooks} title="Books I've Read Recently" />
    </>
  )
}

function BooksGrid({ books, title }) {
  return (
    <>
      <Container className="px-2 max-w-screen-2xl md:px-4 left-animation">
        <h1 className="py-8">
          <span className="text-xl font-bold">{title}</span>
        </h1>
        <section className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
          {
            books &&
            books?.map((book: bookType) => (
              <a key={book.title} target="_blank" href={book.link} className="col-span-1 flex flex-col justify-end !cursor-pointer mb-2">
                <Image src={book?.bookCover} alt={book.alt} width={300} height={300} placeholder="blur" blurDataURL={book?.bookCover} className="min-w-full grow object-fill" loading="lazy" />
                <ProgressBar completed={getProgress(book.readedPage, book.page)} bgColor="#00ce8b" borderRadius="8" isLabelVisible={false} className="mt-1" />
              </a>
            ))
          }
        </section>
      </Container>
    </>
  )
}
