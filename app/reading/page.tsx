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

export default function Home() {
  const getProgress = (readedPage: number, page: number) => +Number((readedPage / page) * 100).toFixed();
  const getPageNumber = (readedPage: number, page: number) => `${readedPage}/${page}`;

  // sorted books by progress
  booksData.books.sort((a: bookType, b: bookType) => getProgress(b.readedPage, b.page) - getProgress(a.readedPage, a.page));

  return (
    <>
      <Container className="px-2 min-h-[80vh] max-w-screen-2xl md:px-4 left-animation">
        <h1 className="py-8">
          <span className="text-xl font-bold">I&apos;m currently reading these books: </span>
        </h1>
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {
            booksData &&
            booksData.books?.map((book: bookType) => (
              <a key={book.title} target="_blank" href={book.link} className="col-span-1 flex flex-col justify-end !cursor-pointer mb-2">
                <Image src={book?.bookCover} alt={book.alt} width={300} height={400} placeholder="blur" blurDataURL={book?.bookCover} className="min-w-full grow" priority />
                <ProgressBar completed={getProgress(book.readedPage, book.page)} borderRadius="0" bgColor="#00ce8b" labelAlignment="left" height="15px" labelColor="black" labelClassName="text-xs ml-2 text-black" />
                <h4 className="text-sm text-center my-2">{getPageNumber(book.readedPage, book.page)}</h4>
              </a>
            ))
          }
        </section>
      </Container>
    </>
  )
}